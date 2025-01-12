const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://mongo:27017/recipe_vault", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

const corsOptions = {
  origin: "http://localhost:3001", // Allow only the frontend origin
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions));

// Your routes
app.get("/recommendations", (req, res) => {
  res.json({ message: "Recommendations retrieved successfully" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

const Recipe = require("./models/Recipe"); // Adjust the path if needed

// Fetch recipes from Spoonacular
app.post("/recipes/fetch", async (req, res) => {
  try {
    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));

    const apiKey = "faa53c6a4b0641ef92d2b834e3a20e08";
    const url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=10`;

    const response = await fetch(url);
    const data = await response.json();

    // Map Spoonacular data to the desired format
    const recipes = data.recipes.map((recipe) => ({
      name: recipe.title,
      ingredients: recipe.extendedIngredients.map((i) => i.name),
      steps: recipe.analyzedInstructions[0]?.steps.map((s) => s.step) || [],
      category: recipe.dishTypes[0] || "General",
      imageUrl: recipe.image,
      spoonacularId: recipe.id, // Save Spoonacular's unique ID
    }));

    // Save recipes to MongoDB
    await Recipe.insertMany(recipes, { ordered: false });
    res.status(201).json({ message: "Recipes fetched and stored successfully!" });
  } catch (error) {
    console.error("Error fetching recipes:", error.message);
    res.status(500).json({ error: "Failed to fetch and store recipes" });
  }
});

// GET all recipes
app.get("/recipes", async (req, res) => {
  const { search } = req.query;
  let recipes;
  try {
    if (search) {
      recipes = await Recipe.find({
        $or: [
          { name: { $regex: search, $options: "i" } }, // Match recipe name
          { ingredients: { $regex: search, $options: "i" } }, // Match ingredients
        ],
      });
    } else {
      recipes = await Recipe.find();
    }
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipes", error });
  }
});

// POST a new recipe
app.post("/recipes", async (req, res) => {
  const { name, ingredients, steps, category, imageUrl } = req.body;
  const newRecipe = new Recipe({ name, ingredients, steps, category, imageUrl });
  try {
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ message: "Failed to save recipe", error });
  }
});

app.get("/recipes/:id", async (req, res) => {
  const { id } = req.params; // Extract recipe ID from the URL
  console.log("Recipe ID received:", id); // Log the received ID

  try {
    const recipe = await Recipe.findOne({ spoonacularId: id }); // Find recipe by spoonacularId
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe); // Send the recipe as the response
  } catch (error) {
    console.error("Error fetching recipe:", error.message);
    res.status(500).json({ message: "Failed to fetch recipe details" });
  }
});

app.post("/fetch-recipes-by-ids", async (req, res) => {
  try {
    const { spoonacularIds } = req.body; // Receive an array of spoonacularIds
    if (!Array.isArray(spoonacularIds)) {
      return res.status(400).json({ error: "Invalid input. Expecting an array of IDs." });
    }

    // Fetch recipes from MongoDB
    const recipes = await Recipe.find({ spoonacularId: { $in: spoonacularIds } });
    res.status(200).json({ recipes });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes from MongoDB." });
  }
});

// Start the server
app.listen(3000, () => console.log("Recipe service running on port 3000"));
