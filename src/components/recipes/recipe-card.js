import { Clock } from "lucide-react";
import Image from "next/image";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="w-full rounded overflow-hidden shadow-lg">
      <Image
        src="/assets/images/dish_example_1.png"
        alt={recipe.recipe_data.title}
        width={500}
        height={300}
        layout="responsive"
      />
      <div className="px-6 pt-4 pb-3">
        <div className="font-bold text-xl">
          {recipe.recipe_data.title}
        </div>
        <div className="flex items-center ml-1 font-normal text-gray-500">
            <Clock className="mr-1 h-3 w-3" />
            <span>{recipe.recipe_data.prepTime}</span>
        </div>
        <p className="mt-4 text-gray-700 text-base">
          {recipe.recipe_data.description}
        </p>
      </div>
      <div className="flex">
        <div className="w-1/2 px-6">
        <h3 className="font-bold mb-2">Ingredients</h3>
        <ul>
          {recipe.recipe_data.ingredients && recipe.recipe_data.ingredients.map((ingredient, index) => (
            <li key={index}>
              • {ingredient.amount} {ingredient.ingredient}
            </li>
          ))}
        </ul>
      </div>
        <div className="w-1/2 px-6">
        <h3 className="font-bold mb-2">Instructions</h3>
        <ol>
          {recipe.recipe_data.instructions && recipe.recipe_data.instructions.map((instruction, index) => (
            <li key={index}>
              {instruction}
            </li>
          ))}
        </ol>
      </div>
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-base">
          Source: <a href={recipe.source_url} className="text-blue-500">{recipe.source_url}</a>
        </div>
      </div>
    </div>
  )
}

export default RecipeCard;