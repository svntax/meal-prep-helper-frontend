import Head from "next/head"
import Link from "next/link"
import axios from 'axios';
import { useRouter } from 'next/router';
import { ChefHat, PlusCircle, Search } from "lucide-react"

import { NearContext } from '@/wallets/near';
import { RECIPIENT, SIGN_MESSAGE, SIGN_IN_AUTH_KEY, SIGN_IN_NONCE_KEY } from '@/utils/openai';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatInterface from "@/components/chat-interface"
import RecipeCarousel from "@/components/recipes/recipes-carousel"
import { useState, useContext, useEffect } from 'react';
import { getRecipesListFromData } from "@/utils/recipeparser";

const CALLBACK_URL = process.env.NEXT_PUBLIC_CALLBACK_URL || "http://localhost:3000";

export default function Home() {
  const router = useRouter();
  
  const [isFetchingRecipes, setIsFetchingRecipes] = useState(false);
  const [recipesList, setRecipesList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState('');

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
        else{
          setUserAuthenticated(false);
        }
      }
    } else {
      console.log("User is not signed in");
      setUserAuthenticated(false);
    }
  }, [signedAccountId, wallet]);

  // TODO: A new thread is created every time, need to manage different threads and load them
  const sendMessage = async (authToken) => {
    console.log("sendMessage");
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
              //console.log(getRecipesListFromData(contentData));
              setRecipesList(getRecipesListFromData(contentData));
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
      setIsFetchingRecipes(false);
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

  const handleSubmit = async () => {
    //e.preventDefault();
    
    if (!inputValue.trim()) return;

    if(!signedAccountId){
      alert("You are not signed in.");
      return;
    }

    setIsLoading(true);
    setIsFetchingRecipes(true);

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

  
  const saveRecipe = async (recipe) => {
    console.log(recipe);
    /* try {
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save recipe');
      }
  
      console.log('Recipe saved successfully');
    } catch (error) {
      console.error('Error saving recipe:', error);
    } */
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Meal Prep Helper - Get Recipe Ideas</title>
        <meta
          name="description"
          content="Ask our AI assistant for recipe ideas, cooking tips, or meal plans."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 items-center">
            <ChefHat className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-bold">Meal Prep Helper</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search recipes..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px] !pl-8"
                />
              </div>
            </div>
            <nav className="flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link href="/recipes">My Recipes</Link>
              </Button>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Recipe
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-12 lg:py-24 bg-gradient-to-b from-amber-50 to-white">
          <div className="container flex items-center justify-center px-4 md:px-6">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Create Delicious Recipes with AI
                  </h1>
                  <p className="max-w-[600px] text-center text-muted-foreground md:text-xl">
                    Search and discover recipes with our AI chef. Browse through curated collections, save your favorites for later, or find inspiration to create your own.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700" onClick={(e) => e.preventDefault()} onMouseUp={() => window.scrollTo({ top: document.getElementById('ask-ai').offsetTop, behavior: 'smooth' })}>
                      Get Started
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-none">
                    <Link href="/recipes">
                      Browse Recipes
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="ask-ai" className="container px-4 py-12 md:px-6">
          <div className="mx-auto max-w-3xl space-y-4">
            <h2 className="text-center text-3xl font-bold">Ask Our AI Assistant</h2>
            <p className="text-center text-muted-foreground">
              Get personalized recipe ideas, cooking tips, and more with our AI-powered assistant.
            </p>
            <ChatInterface sendMessage={() => { handleSubmit() } } updateUserInput={setInputValue}  promptLogin={wallet.signIn} promptSignMessage={promptSignMessage}
            fetchingInProgress={isLoading} userIsAuthenticated={userAuthenticated} userIsSignedIn={signedAccountId}
            />
          </div>
          <RecipeCarousel className={"mx-auto max-w-3xl space-y-4"}
            isLoading={isFetchingRecipes}
            recipes={recipesList}
            onSave={(recipe) => saveRecipe(recipe)}
          />
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Meal Prep Helper. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Terms
            </Button>
            <Button variant="ghost" size="sm">
              Privacy
            </Button>
            <Button variant="ghost" size="sm">
              Contact
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}