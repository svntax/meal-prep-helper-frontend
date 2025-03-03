import Head from "next/head"
import Link from "next/link"
import { ChefHat, PlusCircle, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatInterface from "@/components/chat-interface"
import RecipeCarousel from "@/components/recipes/recipes-carousel"

export default function Home() {
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
            <ChatInterface />
          </div>
          <RecipeCarousel className={"mx-auto max-w-3xl space-y-4"}
            recipes={[
              {
                recipe_data: {
                  title: "Grilled Salmon with Asparagus",
                  prepTime: "25 minutes",
                  description: "A delicious and healthy meal that is sure to please.",
                  ingredients: [
                    { amount: "2", ingredient: "salmon fillets" },
                    { amount: "1 bunch", ingredient: "asparagus" },
                    { amount: "2 tbsp", ingredient: "olive oil" },
                    { amount: "1 tsp", ingredient: "lemon juice" },
                    { amount: "1 tsp", ingredient: "dill" },
                  ],
                  instructions: [
                    "Preheat the grill or grill pan to medium-high heat.",
                    "Trim the asparagus and toss with olive oil, lemon juice, and dill.",
                    "Grill the salmon for 5-7 minutes per side, or until cooked through.",
                    "Grill the asparagus for 3-4 minutes until tender.",
                    "Serve the salmon with the asparagus on the side.",
                  ],
                },
                source_url: "https://www.foodnetwork.com/grilled-salmon-with-asparagus",
              },
              {
                recipe_data: {
                  title: "Spaghetti Carbonara",
                  prepTime: "20 minutes",
                  description: "A classic Italian dish that is sure to satisfy.",
                  ingredients: [
                    { amount: "1 pound", ingredient: "spaghetti" },
                    { amount: "4 slices", ingredient: "bacon, diced" },
                    { amount: "4 cloves", ingredient: "garlic, minced" },
                    { amount: "1/2 cup", ingredient: "parmesan cheese, grated" },
                    { amount: "1/4 cup", ingredient: "heavy cream" },
                  ],
                  instructions: [
                    "Cook the spaghetti according to package instructions.",
                    "In a large skillet, cook the bacon until crispy. Remove the bacon and set it aside.",
                    "In the same skillet, cook the garlic until fragrant.",
                    "Add the cooked spaghetti to the skillet, and toss with the bacon and garlic.",
                    "Stir in the grated parmesan cheese and heavy cream until the mixture is smooth and creamy.",
                    "Serve the spaghetti carbonara hot.",
                  ],
                },
                source_url: "https://www.foodnetwork.com/spaghetti-carbonara",
              },
              {
                recipe_data: {
                  title: "Avocado Toast",
                  prepTime: "5 minutes",
                  description: "A healthy and delicious breakfast or brunch option.",
                  ingredients: [
                    { amount: "2 slices", ingredient: "whole grain toast" },
                    { amount: "1/2 avocado", ingredient: "peeled and diced" },
                    { amount: "1 tsp", ingredient: "olive oil" },
                    { amount: "1 slice", ingredient: "crumbled feta cheese" },
                  ],
                  instructions: [
                    "Toast the bread to your desired level of crispness.",
                    "In a small bowl, mix the diced avocado, olive oil, and feta cheese.",
                    "Spread the avocado mixture on one slice of the toast, and sprinkle with the remaining feta cheese.",
                    "Enjoy your delicious avocado toast.",
                  ],
                },
                source_url: "https://www.foodnetwork.com/avocado-toast",
              },
            ]}
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