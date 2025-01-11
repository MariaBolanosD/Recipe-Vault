import React from "react";
import "../styles/RecipeList.css"; // Adjusted path for your CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const RecipeCard = ({ recipe, onToggleFavorite, isFavorite }) => {
  return (
    <div className="recipe-card">
      <h3 className="recipe-title">{recipe.name}</h3>
      <img className="recipe-image" src={recipe.imageUrl} alt={recipe.name} />
      <p className="recipe-category">
        <strong>Category:</strong> {recipe.category}
      </p>
      <div className="favorite-icon">
        <FontAwesomeIcon
          icon={faStar}
          className={isFavorite ? "star-favorite" : "star-not-favorite"}
          onClick={() => onToggleFavorite(recipe)}
        />
      </div>
      <button className="view-details-btn" onClick={() => console.log("View Details")}>
        View Details
      </button>
    </div>
  );
};

export default RecipeCard;
