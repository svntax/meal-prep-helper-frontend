import Head from "next/head"
import Link from "next/link"
import { Clock, Edit, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RecipesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>My Recipes - Meal Prep Helper</title>
        <meta name="description" content="Manage your saved recipes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Recipes</h1>
            <p className="text-muted-foreground">Manage your saved recipes</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Recipe
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input placeholder="Search recipes..." className="md:w-[300px]" />
          <Select defaultValue="all">
            <SelectTrigger className="md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="main">Main Dishes</SelectItem>
              <SelectItem value="side">Side Dishes</SelectItem>
              <SelectItem value="dessert">Desserts</SelectItem>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="snack">Snacks</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="newest">
            <SelectTrigger className="md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Sample recipe cards */}
          <RecipeCard
            title="Creamy Garlic Parmesan Risotto"
            description="A rich and creamy Italian rice dish with garlic and parmesan cheese"
            category="Main Dish"
            prepTime="10 mins"
            cookTime="25 mins"
            image="assets/images/dish_example_1.png"
          />
          <RecipeCard
            title="Spicy Thai Basil Chicken"
            description="A quick and flavorful Thai stir-fry with chicken, basil, and chili"
            category="Main Dish"
            prepTime="15 mins"
            cookTime="10 mins"
            image="assets/images/dish_example_1.png"
          />
          <RecipeCard
            title="Chocolate Lava Cake"
            description="Decadent chocolate dessert with a molten center"
            category="Dessert"
            prepTime="15 mins"
            cookTime="12 mins"
            image="assets/images/dish_example_1.png"
          />
          <RecipeCard
            title="Mediterranean Quinoa Salad"
            description="Healthy salad with quinoa, vegetables, and feta cheese"
            category="Side Dish"
            prepTime="20 mins"
            cookTime="15 mins"
            image="assets/images/dish_example_1.png"
          />
          <RecipeCard
            title="Avocado Toast with Poached Egg"
            description="Simple and nutritious breakfast with creamy avocado and perfect poached egg"
            category="Breakfast"
            prepTime="5 mins"
            cookTime="5 mins"
            image="assets/images/dish_example_1.png"
          />
          <RecipeCard
            title="Homemade Pizza Dough"
            description="Classic pizza dough recipe for the perfect homemade pizza base"
            category="Base"
            prepTime="20 mins"
            cookTime="0 mins"
            image="assets/images/dish_example_1.png"
          />
        </div>
      </main>
    </div>
  )
}

/* interface RecipeCardProps {
  title: string
  description: string
  category: string
  prepTime: string
  cookTime: string
  image: string
} */

function RecipeCard({ title, description, category, prepTime, cookTime, image }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img src={image || ""} alt={title} className="h-full w-full object-cover" />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">{category}</span>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {prepTime} prep · {cookTime} cook
          </div>
        </div>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={''/*`/recipes/${title.toLowerCase().replace(/\s+/g, "-")}`*/}>View</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

