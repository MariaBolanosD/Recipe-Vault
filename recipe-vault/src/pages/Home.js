import React, { useState, useEffect } from "react";
import FetchRecipesButton from "../components/FetchRecipes";
import RecipeList from "../components/RecipeList";
import { useNavigate } from "react-router-dom";
import Recommendations from "./Recommendations";
import RecipeCard from "../components/RecipeCard"; // Assuming you have this component

function Home() {
  const [recipes, setRecipes] = useState([]); // State to hold recipe data
  const [loading, setLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate(); // Add this for navigation
  const [recommendations, setRecommendations] = useState([]);

  // Function to fetch recipes
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/recipes");
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
        const response = await fetch("http://localhost:5000/recommendations", {
            credentials: "include",
        });
        if (!response.ok) {
            console.error("Error fetching recommendations:", await response.text());
            return;
        }
        const data = await response.json();
        console.log("Recommendations:", data); // Debugging
        setRecommendations(data);
    } catch (error) {
        console.error("Error fetching recommendations:", error);
    }
};


  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Function to add a recipe to favorites
  const addToFavorites = async (spoonacularId) => {
    try {
      const response = await fetch("http://localhost:5000/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ spoonacularId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData.error);
        alert(errorData.error || "Failed to add to favorites.");
        return;
      }

      alert("Recipe added to favorites!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      alert("An error occurred while adding to favorites.");
    }
  };
  

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div>
      <div className="home">
      <h1>Welcome to Recipe Vault!</h1>
      <p>Find and save your favorite recipes.</p>
      <Recommendations recommendations={recommendations} />
    </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <RecipeList
          recipes={recipes}
          onAddToFavorites={addToFavorites}
          onViewDetails={(id) => navigate(`/recipe/${id}`)} // Navigate to the details page
        />
      )}
      <FetchRecipesButton onFetchComplete={fetchRecipes} />
    </div>
  );
}

export default Home;
