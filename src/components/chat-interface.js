"use client";

import { useState } from "react";
import { Bot, Send, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isUserAuthenticated } from "@/utils/openai";

export default function ChatInterface({ promptLogin, promptSignMessage, sendMessage, updateUserInput, fetchingInProgress, userIsAuthenticated, userIsSignedIn }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setInput(event.target.value);
    updateUserInput(event.target.value);
  };

  const handleUserAuth = () => {
    if(userIsSignedIn){
      // Prompt sign message
      promptSignMessage();
    }
    else{
      promptLogin();
    }
  };

  // AI agent call only if user is signed in and authenticated
  const handleSubmit = (event) => {
    event.preventDefault();
    if(userIsSignedIn && userIsAuthenticated){
      if (input.trim()) {
        setIsLoading(true);
        const userMessage = { id: messages.length + 1, role: "user", content: input };
        setMessages([...messages, userMessage]);
        setTimeout(() => {
  
          // Simulate assistant response
          setTimeout(() => {
            setMessages((messages) => [ // Update messages using functional update to avoid stale state
              ...messages,
              { id: messages.length + 1, role: "assistant", content: "A delicious recipe is on its way!" },
            ]);
            setIsLoading(false);
            sendMessage();
          }, 1000);
        }, 1000);
      }
    }
    else{
      handleUserAuth();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recipe Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        {(userIsAuthenticated && userIsSignedIn ? 
        <ScrollArea className="h-[400px] pr-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 p-8 text-center">
              <Bot className="h-12 w-12 text-orange-500" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">How can I help you cook today?</h3>
                <p className="text-sm text-muted-foreground">
                  Ask me about recipe ideas, cooking techniques, or ingredient substitutions.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => { setInput("What can I make with chicken and broccoli?"); updateUserInput("What can I make with chicken and broccoli?"); }}
                >
                  What can I make with chicken and broccoli?
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => { setInput("Give me a vegetarian pasta recipe"); updateUserInput("Give me a vegetarian pasta recipe"); }}
                >
                  Give me a vegetarian pasta recipe
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => { setInput("I want a breakfast that I can make in 15 minutes"); updateUserInput("I want a breakfast that I can make in 15 minutes"); }}
                >
                  I want a breakfast that I can make in 15 minutes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex max-w-[80%] items-start gap-2 rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.role !== "user" && <Bot className="mt-1 h-4 w-4 shrink-0" />}
                    <div className="space-y-2">
                      <div className="prose prose-sm">{message.content}</div>
                    </div>
                    {message.role === "user" && <User className="mt-1 h-4 w-4 shrink-0" />}
                  </div>
                </div>
              ))}
              {(isLoading || fetchingInProgress) && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] items-start gap-2 rounded-lg bg-muted px-4 py-2">
                    <Bot className="mt-1 h-4 w-4 shrink-0" />
                    <div className="space-y-2">
                      <div className="prose prose-sm">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        : <div className="flex justify-center p-4">
            <button
              onClick={handleUserAuth}
              className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {userIsSignedIn ? "Sign Message to Chat" : "Login to Chat"}
            </button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            placeholder="Ask about recipes, ingredients, or cooking techniques..."
            value={input}
            onChange={handleInputChange}
            className={`flex-1 ring-2 ring-orange-500`}
            disabled={!userIsAuthenticated || !userIsSignedIn}
          />
          <Button type="submit" size="icon" disabled={isLoading || fetchingInProgress || !input.trim() || (!userIsSignedIn || !userIsAuthenticated)} className={"!ml-1"}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}