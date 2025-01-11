import React from "react";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <img src={recipe.imageUrl} alt={recipe.name} className="recipe-image" />
      <h3>{recipe.name}</h3>
      <p>Category: {recipe.category}</p>
      <button>View Details</button>
    </div>
  );
};

export default RecipeCard;
