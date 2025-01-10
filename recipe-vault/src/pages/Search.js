import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Search() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/recipes?search=${query}`);
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };
  

  const fetchRecipes = async () => {
    const response = await axios.get("http://localhost:4000/recipes", {
      params: { search: query }, // Fixed here
    });
    setRecipes(response.data);
  };

  const addToFavorites = async (id) => {
    try {
      await axios.post("http://localhost:4000/favorites", { id });
      alert("Recipe added to favorites!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  return (
    <div>
      <h2>Search Recipes</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter an recipe name or ingredient..."
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
            <button onClick={() => addToFavorites(recipe._id)} className="btn btn-secondary">
              Add to Favorites
            </button>
          </li>

        ))}
      </ul>
    </div>
  );
}

export default Search;
