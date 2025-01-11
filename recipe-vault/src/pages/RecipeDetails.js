import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function RecipeDetails() {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/recipes/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch recipe details");
        }
        const data = await response.json();
        setRecipe(data); // Update state with fetched recipe
      } catch (error) {
        console.error("Error fetching recipe details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div>
      <h2>{recipe.name}</h2>
      {recipe.imageUrl && (
       <img 
       src={recipe.imageUrl} 
       alt={recipe.name} 
       className="recipe-detail-image" 
   />
   
      )}
      <p>
        <strong>Category:</strong> {recipe.category || "General"}
      </p>
      <p>
        <strong>Ingredients:</strong>
      </p>
      <ul>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))
        ) : (
          <p>No ingredients available.</p>
        )}
      </ul>
      <p>
        <strong>Steps:</strong>
      </p>
      <ol>
        {recipe.steps && recipe.steps.length > 0 ? (
          recipe.steps.map((step, index) => <li key={index}>{step}</li>)
        ) : (
          <p>No steps available.</p>
        )}
      </ol>
    </div>
  );
}

export default RecipeDetails;
