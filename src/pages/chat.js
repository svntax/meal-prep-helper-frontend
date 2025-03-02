import { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import { NearContext } from '@/wallets/near';
import { useRouter } from 'next/router';
import { RECIPIENT, SIGN_MESSAGE, SIGN_IN_AUTH_KEY, SIGN_IN_NONCE_KEY } from '@/utils/openai';
import { getRecipesListFromData } from '@/utils/recipeparser';

const CALLBACK_URL = "http://localhost:3000/chat";

export default function ChatPage() {
  const router = useRouter();
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState('');
  //const [currentThread, setCurrentThread] = useState(null);

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
        const authJson = {
          accountId: signedAccountId,
          publicKey: params.get("publicKey"),
          signature: params.get("signature"),
          callbackUrl: CALLBACK_URL,
          nonce: localStorage.getItem(SIGN_IN_NONCE_KEY)
        };
        localStorage.setItem(SIGN_IN_AUTH_KEY, JSON.stringify(authJson));
        router.replace(router.pathname);
        //createOpenAiInstance(createAuthToken(authJson));
        setUserAuthenticated(true);
      }
      else{
        if(localStorage.getItem(SIGN_IN_AUTH_KEY)){
          setUserAuthenticated(true);
        }
      }
    } else {
      console.log("User is not signed in");
      setUserAuthenticated(false);
    }
  }, [signedAccountId, wallet]);

  // TODO: A new thread is created every time, need to manage different threads and load them
  const sendMessage = async (authToken) => {
    try {
      // Add user message
      setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
      
      // Get AI response (direct method)
      const response = await axios.post('/api/openai', {
        input: inputValue,
        auth: authToken,
        threadId: '' //currentThreadId
      });

      if(response.status === 200){
        const threadId = response.data.data;
        //setCurrentThreadId(threadId); // Keep commented out until threads handling is figured out
        console.log("Thread ID:", threadId);
        // Add AI response
        const messagesResponse = await axios.post('/api/threads/' + threadId, {
          auth: authToken
        });

        const messagesInThread = messagesResponse.data.data.data;
        // TODO: display recipes to user, each with button to Save, Edit(?), or Discard
        const recipes_data_responses = [];
        for(let i = 0; i < messagesInThread.length; i++){
          const message = messagesInThread[i];
          const contentString = message.content[0].text.value;
          try {
            const contentData = JSON.parse(contentString);
            if(Object.hasOwn(contentData, "query")){
              // This is the main response with all the recipes data
              console.log(contentData);
              setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "Here are some recipes I found for you:\n" + contentString
              }]);
              console.log(getRecipesListFromData(contentData));
              break;
            }
          } catch (e) {
            if(message.role === "assistant"){
              // Assume it's likely a normal message
              console.log(contentString);
              setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: contentString
              }]);
              continue;
            }
            else if(message.role === "user"){
              continue;
            }
            else {
              console.log(e);
            }
          }
        }
      }
      
      setInputValue('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const promptSignMessage = async () => {
    // Prompt the user to sign a message in order to authenticate
    const challenge = Date.now().toString().padStart(32, '0');
    const buf = Buffer.from(challenge);
    localStorage.setItem(SIGN_IN_NONCE_KEY, challenge);
    const messageParams = {
      message: SIGN_MESSAGE,
      recipient: RECIPIENT,
      nonce: buf,
      callbackUrl: CALLBACK_URL
    }
    wallet.signMessage(messageParams).then(signedMessage => {
      // Save the user auth token
      const authJson = {
        accountId: signedMessage.accountId,
        publicKey: signedMessage.publicKey,
        signature: signedMessage.signature,
        callbackUrl: CALLBACK_URL,
        nonce: localStorage.getItem(SIGN_IN_NONCE_KEY)
      };
      localStorage.setItem(SIGN_IN_AUTH_KEY, JSON.stringify(authJson));
      //createOpenAiInstance(createAuthToken(authJson));
      setUserAuthenticated(true);
    }).catch((error) => { console.error(error); });
  
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

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
        promptSignMessage();
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
        {(signedAccountId && userAuthenticated) ? (
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
        ) : (
          <div className="flex justify-center p-4">
            <button
              onClick={() => {
                if(signedAccountId){
                  promptSignMessage();
                }
                else{
                  alert("Log in with your wallet first.");
                }
              }}
              className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign Message to Chat
            </button>
          </div>
        )}
      </div>
    </div>
  )
}