import React from "react";

function FavoriteRecipes({ favorites }) {
  return (
    <div>
      <h2>Your Favorite Recipes</h2>
      <ul>
        {favorites.map((recipe) => (
          <li key={recipe.id}>{recipe.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default FavoriteRecipes;
