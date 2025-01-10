const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type: [String], required: true },
  steps: { type: [String], required: true },
  category: { type: String, default: "General" },
  imageUrl: { type: String },
  spoonacularId: { type: String, unique: true }, // Ensure spoonacularId is unique
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
