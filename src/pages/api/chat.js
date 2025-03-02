export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    // Create a system message to guide the AI's responses
    const systemMessage = {
      role: "system",
      content: `You are a helpful AI chef assistant that specializes in recipes, cooking techniques, and food knowledge.

      When users ask for recipe ideas:
      1. Suggest complete recipes with ingredients list and step-by-step instructions
      2. Offer variations or substitutions for dietary restrictions when appropriate
      3. Include cooking times, serving sizes, and difficulty levels
      4. Provide tips for preparation and presentation

      Be enthusiastic, creative, and supportive. Use culinary terminology appropriately but explain complex techniques.
      Format your responses with clear sections and bullet points when listing ingredients or steps.`,
    };

    // Add the system message to the beginning of the messages array
    const augmentedMessages = [systemMessage, ...messages];

    // Placeholder response
    const response = {
      role: "assistant",
      content: "Here's a simple recipe for Spaghetti Carbonara:\n\n**Ingredients**\n- 1 pound spaghetti\n- 2 large eggs\n- 1/2 cup grated Pecorino Romano cheese\n- 1/2 cup grated Parmesan cheese\n- 2 cloves garlic, minced\n- 3 strips pancetta or guanciale, diced\n- Salt and freshly ground black pepper\n- Fresh parsley, chopped (optional)\n\n**Instructions**\n1. Bring a large pot of salted water to a boil. Add spaghetti and cook until al dente.\n2. While the pasta is cooking, in a separate bowl, beat the eggs and mix in the grated cheeses, garlic, and a pinch of salt and pepper.\n3. Once the pasta is cooked, drain it and reserve 1 cup of the cooking water.\n4. In a large skillet, cook the pancetta or guanciale over medium heat until crispy. Add the drained pasta and toss with the egg and cheese mixture. If the sauce is too thick, add reserved pasta water to thin it out.\n5. Garnish with chopped parsley and serve immediately."
    };

    // Return the response as JSON
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in chat API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}