import React, { useState, useEffect } from "react";
import FetchRecipesButton from "../components/FetchRecipes";
import RecipeList from "../components/RecipeList";

function Home() {
  const [recipes, setRecipes] = useState([]); // State to hold recipe data
  const [loading, setLoading] = useState(false); // State for loading spinner

  // Function to fetch recipes
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/recipes");
      const data = await response.json();
      setRecipes(data); // Update state with fetched recipes
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a recipe to favorites
  const addToFavorites = async (spoonacularId) => {
    try {
      const response = await fetch("http://localhost:5000/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session
        body: JSON.stringify({ spoonacularId }), // Send spoonacular ID
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData.error);
        alert(errorData.error || "Failed to add to favorites.");
        return;
      }
  
      const data = await response.json();
      alert("Recipe added to favorites!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      alert("An error occurred while adding to favorites.");
    }
  };
  

  // Fetch recipes on component mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div>
      <h2>Welcome to Recipe Vault!</h2>
      <p>Find and save your favorite recipes.</p>
      {/* Render the Recipe List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <RecipeList
          recipes={recipes}
          onAddToFavorites={addToFavorites} // Pass the addToFavorites function here
          onViewDetails={(id) => console.log("View details for recipe:", id)} // Placeholder for navigation
        />
      )}
      {/* Render the Fetch Recipes Button at the bottom */}
      <FetchRecipesButton onFetchComplete={fetchRecipes} />
    </div>
  );
}

export default Home;
