import React from "react";

function RecipeList({ recipes, onAddToFavorites, onViewDetails }) {
  // Helper function to capitalize the first letter
  const capitalize = (str) => {
    if (!str) return ""; // Handle empty or undefined strings
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        padding: "20px",
      }}
    >
      {recipes.map((recipe) => (
        <div
          key={recipe.spoonacularId}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              margin: "10px 0",
              minHeight: "70px",
              maxHeight: "70px", // Increased height for titles
              lineHeight: "1.3", // Adjust line spacing for better readability
              overflow: "hidden", // Hide overflowing text
              textOverflow: "ellipsis", // Add ellipsis for overflowing text
              wordBreak: "break-word",
              display: "-webkit-box", // Required for ellipsis in multi-line text
              WebkitLineClamp: 3, // Show up to 3 lines
              WebkitBoxOrient: "vertical",
            }}
          >
            {recipe.name}
          </h3>
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
          <p
            style={{
              margin: "10px 0",
              textAlign: "center",
              minHeight: "30px", // Uniform category height
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <strong>Category:</strong> {capitalize(recipe.category) || "N/A"}
          </p>
          <div style={{ marginTop: "auto", display: "flex", gap: "10px" }}>
            <button
              onClick={() => onAddToFavorites(recipe.spoonacularId)}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Add to Favorites
            </button>
            <button
              onClick={() => onViewDetails(recipe.spoonacularId)}
              style={{
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipeList;
