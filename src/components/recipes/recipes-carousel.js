import { useState } from "react";
import RecipeCard from "./recipe-card";
import LoadingIndicatorGrid from "../loading-indicators/loading-grid";

const RecipeCarousel = ({ recipes, onSave, isLoading = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + recipes.length) % recipes.length);
  }

  const handleSave = () => {
    const currentRecipe = recipes[currentIndex];
    onSave(currentRecipe);
  }

  const handleDiscard = () => {
    const currentRecipe = recipes[currentIndex];
    // Delete the recipe from the list
    recipes.splice(currentIndex, 1);
    // Update the current index
    setCurrentIndex((prevIndex) => (prevIndex - 1 + recipes.length) % recipes.length);
  }

  if (!recipes || recipes.length === 0) {
    if (isLoading) {
      return (
        <div className="mt-4 d-flex flex-column justify-content-center align-items-center">
          <h3>Loading recipes...</h3>
          <LoadingIndicatorGrid />
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  return (
    <div className="mt-4 mx-auto max-w-3xl space-y-4">
      <div className="flex justify-between mt-4">
        <div>
          <button onClick={handlePrev} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded transform hover:scale-110">
            Prev
          </button>
        </div>
        <div>
          <button onClick={handleNext} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded transform hover:scale-110">
            Next
          </button>
        </div>
      </div>
      <div className="flex w-100">
        <RecipeCard className={"max-w-100"} recipe={recipes[currentIndex]} />
      </div>
      <div className="flex items-center mt-4 gap-2">
        <button onClick={handleDiscard} className="bg-red-500 text-white px-4 py-2 rounded">Discard</button>
        <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
      </div>
    </div>
  );
}

export default RecipeCarousel;