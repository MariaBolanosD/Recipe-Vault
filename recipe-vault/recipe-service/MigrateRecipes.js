const mongoose = require("mongoose");
const Recipe = require("./models/Recipe"); // Replace with the path to your Recipe model

mongoose.connect("mongodb://localhost:27017/recipe_vault", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const migrateRecipes = async () => {
  try {
    // Find all recipes missing spoonacularId
    const recipesWithoutId = await Recipe.find({ spoonacularId: { $exists: false } });

    for (const recipe of recipesWithoutId) {
      // Generate a default spoonacularId (e.g., based on MongoDB _id)
      recipe.spoonacularId = recipe._id.toString(); // You can also generate random IDs or use UUIDs
      await recipe.save(); // Save the updated recipe
    }

    console.log("Migration complete! All recipes now have spoonacularId.");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error during migration:", error.message);
    mongoose.connection.close();
  }
};

migrateRecipes();
