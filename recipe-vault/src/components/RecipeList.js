import React from "react";

function RecipeList({ recipes, onAddToFavorites, onViewDetails }) {
  return (
    <div>
      <h2>Recipe List</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {recipes.map((recipe) => (
          <li
            key={recipe.spoonacularId}
            style={{
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "10px",
              margin: "10px 0",
              backgroundColor: "#f9f9f9",
            }}
            onClick={() => onViewDetails(recipe.spoonacularId)} // Trigger navigation to details
          >
            <h3>{recipe.name}</h3>
            <p>
              <strong>Category:</strong> {recipe.category || "N/A"}
            </p>
            <img src={recipe.imageUrl} alt={recipe.name} style={{ width: "100%" }} />

            {/* Add to Favorites Button */}
            <button
              onClick={(event) => {
                event.stopPropagation(); // Prevent the click from bubbling up
                onAddToFavorites(recipe.spoonacularId); // Call the addToFavorites function
              }}
            >
              Add to Favorites
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeList;
