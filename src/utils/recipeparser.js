/*
Recipes from the AI agent have the following format:

Full response data:
{
  "query": "Recipes for tuna and rice",
  "recipes": [
    {
      "source_url": "https://howtomakedinner.com/blog/broccoli-curry/",
      "recipe_data": "JSON string with potentially problematic characters"
    },
  ]
}

Recipe object after cleaning and parsing (to be displayed in components):
{
    "source_url": "https://howtomakedinner.com/blog/broccoli-curry/",
    "recipe_data": {
        "title": "Easy Broccoli Curry with Lentils",
        "description": "",
        "prepTime": "",
        "ingredients": [],
        "instructions": ""
    }
}

recipe_data field in Recipe object:
{
    "title": "Classic Chocolate Cake Recipe",
    "description": "Moist chocolate cake perfect for celebrations.",
    "prepTime": "45 mins",
    "ingredients": [
        {"ingredient": "flour", "amount": "2 cups"},
        {"ingredient": "sugar", "amount": "1 cup"},
        {"ingredient": "cocoa powder", "amount": "1/2 cup"}
    ],
    "instructions": [
        "1. Preheat oven to 350°F",
        "2. Mix dry ingredients",
        "3. Combine wet ingredients",
        "4. Fold mixtures together"
    ]
}
*/

// Removes whitespace and escape characters from agent responses
const cleanDataString = (dataString) => {
    return dataString.replace('\"', '"').replace('\n', '').replace('`', '');
}

const getRecipeDataFromRawString = (rawDataString) => {
    try {
        const jsonString = cleanDataString(rawDataString);
        const recipeData = JSON.parse(jsonString);
        return recipeData;
    } catch (e) {
        console.error(e);
        return {};
    }
    
}

export const getRecipesListFromData = (data) => {
    const recipes = [];
    for(let i = 0; i < data.recipes.length; i++){
        const rawRecipeData = data.recipes[i];
        const recipe = {
            source_url: rawRecipeData.source_url,
            recipe_data: getRecipeDataFromRawString(rawRecipeData.recipe_data)
        };
        recipes.push(recipe);
    }
    return recipes;
}