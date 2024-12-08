import React, { useState } from "react";

function Favorites() {
  const [favorites, setFavorites] = useState([
    { id: 1, name: "Spaghetti", ingredients: ["Pasta", "Tomato Sauce"] },
    { id: 2, name: "Tacos", ingredients: ["Tortilla", "Beef", "Cheese"] },
  ]);

  return (
    <div>
      <h2>Your Favorite Recipes</h2>
      <ul>
        {favorites.map((recipe) => (
          <li key={recipe.id}>
            <strong>{recipe.name}</strong> - {recipe.ingredients.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Favorites;
