"use client";

import { useState } from "react";
import { Bot, Send, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const dummyMessages = [
  {
    id: 1,
    role: "user",
    content: "What can I make with chicken and broccoli?",
  },
  {
    id: 2,
    role: "assistant",
    content: "How about a Chicken and Broccoli Stir-Fry?",
  },
  {
    id: 3,
    role: "user",
    content: "Give me a vegetarian pasta recipe",
  },
  {
    id: 4,
    role: "assistant",
    content: "How about a Mushroom and Spinach Pasta?",
  },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState(dummyMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  // TODO: AI agent call
  const handleSubmit = (event) => {
    event.preventDefault();
    if (input.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setMessages([...messages, { id: messages.length + 1, role: "user", content: input }]);

        // Simulate assistant response
        setTimeout(() => {
          setMessages([
            ...messages,
            { id: messages.length + 1, role: "assistant", content: "A delicious recipe is on its way!" },
          ]);
          setIsLoading(false);
        }, 1000);
      }, 1000);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recipe Assistant</CardTitle>
      </CardHeader>
      <CardContent>
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
              <div className="w-full max-w-xs space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInput("What can I make with chicken and broccoli?")}
                >
                  What can I make with chicken and broccoli?
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInput("Give me a vegetarian pasta recipe")}
                >
                  Give me a vegetarian pasta recipe
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInput("How do I make a perfect risotto?")}
                >
                  How do I make a perfect risotto?
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
              {isLoading && (
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
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            placeholder="Ask about recipes, ingredients, or cooking techniques..."
            value={input}
            onChange={handleInputChange}
            className={`flex-1 ring-2 ring-orange-500`}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}