import React, { useEffect, useState } from "react";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true); // Show loading spinner
      try {
        const response = await fetch("http://localhost:5000/favorites", {
          method: "GET",
          credentials: "include", // Include cookies for session
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Favorites:", data.favorites); // Debugging
          setFavorites(data.favorites); // Update state with fetched favorites
        } else {
          console.error("Error fetching favorites:", data.error);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false); // Hide loading spinner
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return <p>Loading favorites...</p>;

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
      {favorites.map((recipe) => (
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
              maxHeight: "70px",
              lineHeight: "1.3",
              overflow: "hidden",
              textOverflow: "ellipsis",
              wordBreak: "break-word",
              display: "-webkit-box",
              WebkitLineClamp: 3,
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
              minHeight: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <strong>Category:</strong> {capitalize(recipe.category) || "N/A"}
          </p>
          <button
            onClick={() => console.log(`View details for ${recipe.spoonacularId}`)}
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
      ))}
    </div>
  );
}

export default Favorites;
