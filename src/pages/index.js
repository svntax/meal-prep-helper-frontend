import Head from "next/head"
import Link from "next/link"
import { ChefHat, PlusCircle, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatInterface from "@/components/chat-interface"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Meal Prep Helper - Get Recipe Ideas</title>
        <meta
          name="description"
          content="Ask our AI assisstant for recipe ideas, cooking tips, or meal plans."
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
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                    <Link href="/chat">
                      Get Started
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline">
                  <Link href="/recipes">Browse Recipes</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container px-4 py-12 md:px-6">
          <div className="mx-auto max-w-3xl space-y-4">
            <h2 className="text-center text-3xl font-bold">Ask Our AI Assistant</h2>
            <p className="text-center text-muted-foreground">
              Get personalized recipe ideas, cooking tips, and more with our AI-powered assistant.
            </p>
            <ChatInterface />
          </div>
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