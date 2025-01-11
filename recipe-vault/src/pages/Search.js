import React, { useState } from "react";
import { Link } from "react-router-dom";

function Search() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:4000/recipes?search=${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await response.json();
      setRecipes(data);

      // Fetch existing favorites
      const favoritesResponse = await fetch("http://localhost:5000/favorites", {
        method: "GET",
        credentials: "include",
      });
      if (!favoritesResponse.ok) {
        throw new Error("Failed to fetch favorites");
      }
      const favoritesData = await favoritesResponse.json();

      // Extract spoonacularId from each favorite object
      if (Array.isArray(favoritesData)) {
        setFavorites(favoritesData.map((fav) => fav.spoonacularId));
      } else if (favoritesData.favorites && Array.isArray(favoritesData.favorites)) {
        setFavorites(favoritesData.favorites.map((fav) => fav.spoonacularId));
      } else {
        console.error("Unexpected favorites response format:", favoritesData);
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error fetching recipes or favorites:", error);
    }
  };

  const toggleFavorite = async (spoonacularId) => {
    try {
      if (favorites.includes(spoonacularId)) {
        const response = await fetch(`http://localhost:5000/favorites/${spoonacularId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to remove from favorites");
        }
        setFavorites(favorites.filter((id) => id !== spoonacularId));
      } else {
        const response = await fetch("http://localhost:5000/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ spoonacularId }),
        });
        if (!response.ok) {
          throw new Error("Failed to add to favorites");
        }
        setFavorites([...favorites, spoonacularId]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  

  return (
    <div>
      <h2>Search Recipes</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a recipe name or ingredient..."
        className="form-control mb-3"
      />
      <button onClick={handleSearch} className="btn btn-primary">
        Search
      </button>
      <ul className="mt-4">
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <Link to={`/recipe/${recipe._id}`}>
              <strong>{recipe.name}</strong>
            </Link>
            - {recipe.ingredients.join(", ")}
            <span
              style={{
                fontSize: "1.5rem",
                cursor: "pointer",
                color: favorites.includes(recipe._id) ? "gold" : "gray",
                marginLeft: "10px",
              }}
              onClick={() => toggleFavorite(recipe._id)}
            >
              ★
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default Search;
