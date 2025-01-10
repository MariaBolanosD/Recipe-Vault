import React from "react";

function FetchRecipesButton({ onFetchComplete }) {
  const fetchRecipes = async () => {
    try {
      const response = await fetch("http://localhost:3000/recipes/fetch", {
        method: "POST",
      });
      const data = await response.json();
      alert(data.message || "Recipes fetched successfully!");

      // Trigger a callback to refresh the recipe list
      if (onFetchComplete) {
        onFetchComplete();
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      alert("Failed to fetch recipes.");
    }
  };

  return <button onClick={fetchRecipes}>Fetch Recipes</button>;
}

export default FetchRecipesButton;
