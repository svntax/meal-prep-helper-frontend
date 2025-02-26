import { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import { NearContext } from '@/wallets/near';
import { useRouter } from 'next/router';

const CALLBACK_URL = "http://localhost:3000/chat";
const SIGN_MESSAGE = "Welcome to NEAR AI";
const APP = "ai.near";
const SIGN_IN_AUTH_KEY = "signedMessageAuth"
const SIGN_IN_NONCE_KEY = "signInNonce";

export default function ChatPage() {
  const router = useRouter();
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signedAccountId, wallet } = useContext(NearContext);

  useEffect(() => {
    if (!wallet) return;

    if (signedAccountId) {
      console.log("User is signed in");

      const query = router.asPath;
      const paramsString = query.substring(query.indexOf("#")).replace("#", "");
      const params = new URLSearchParams(paramsString);
      if(params.has("accountId") && params.has("signature") && params.has("publicKey")){
        // Web wallets like MyNearWallet redirect you back to the app, so this is how we check for the auth info
        console.log("User was redirected after signing a message.");
        const authToken = {
          accountId: signedAccountId,
          publicKey: params.get("publicKey"),
          signature: params.get("signature"),
          callbackUrl: CALLBACK_URL,
          nonce: localStorage.getItem(SIGN_IN_NONCE_KEY)
        };
        localStorage.setItem(SIGN_IN_AUTH_KEY, JSON.stringify(authToken));
        router.replace(router.pathname);
      }
    } else {
      console.log("User is not signed in");
    }
  }, [signedAccountId, wallet]);

  // TODO: A new thread is created every time, need to manage different threads and load them
  const sendMessage = async (authToken) => {
    try {
      // Add user message
      setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
      
      // Get AI response
      const response = await axios.post('/api/openai', {
        input: inputValue,
        auth: authToken
      })

      if(response.status === 200){
        const threadId = response.data.data;
        console.log("Thread ID:", threadId);
        // Add AI response
        const messagesResponse = await axios.post('/api/threads/' + threadId, {
          auth: authToken
        });

        const messagesInThread = messagesResponse.data.data.data;
        const assistantMessage = messagesInThread[1]; // Skip the first one because it's a system log
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: assistantMessage.content[0].text.value
        }]);
      }
      
      setInputValue('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return

    if(!signedAccountId){
      alert("You are not signed in.");
      return;
    }

    setIsLoading(true);

    try{
      const auth = localStorage.getItem(SIGN_IN_AUTH_KEY);
      if(auth){
        // User already authenticated
        sendMessage(JSON.parse(auth));
      }
      else{
        // Prompt the user to sign a message in order to authenticate
        const challenge = Date.now().toString().padStart(32, '0');
        const buf = Buffer.from(challenge);
        localStorage.setItem(SIGN_IN_NONCE_KEY, challenge);
        const messageParams = {
          message: SIGN_MESSAGE,
          recipient: APP,
          nonce: buf,
          callbackUrl: CALLBACK_URL
        }
        const signedMessage = await wallet.signMessage(messageParams);
      
        // Save the user auth token
        const authJson = {
          accountId: signedMessage.accountId,
          publicKey: signedMessage.publicKey,
          signature: signedMessage.signature,
          callbackUrl: CALLBACK_URL,
          nonce: localStorage.getItem(SIGN_IN_NONCE_KEY)
        };
        localStorage.setItem(SIGN_IN_AUTH_KEY, JSON.stringify(authJson));

        sendMessage(authJson);
      }
      

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1>Chat</h1>
      {/* Chat Container */}
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col h-[400px] overflow-y-auto space-y-4 p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 my-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-black'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-white ${
                isLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}