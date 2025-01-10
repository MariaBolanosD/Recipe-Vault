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

  return (
    <div>
      <h2>Your Favorite Recipes</h2>
      <ul>
        {favorites.map((recipe, index) => (
          <li
            key={recipe.spoonacularId}
            style={{
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "10px",
              margin: "10px 0",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3>{recipe.name}</h3>
            <p>
              <strong>Category:</strong> {recipe.category || "N/A"}
            </p>
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              style={{ width: "100%" }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Favorites;
