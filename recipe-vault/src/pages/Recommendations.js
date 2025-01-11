import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Recommendations.css"; // Optional for additional styling

const Recommendations = ({ recommendations }) => {
  // Limit recommendations to a maximum of 10
  const limitedRecommendations = recommendations.slice(0, 10);

  // Slick slider settings
  const settings = {
    dots: true, // Add navigation dots
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Number of items visible at once
    slidesToScroll: 1, // Number of items to scroll at once
    responsive: [
      {
        breakpoint: 1024, // Screen width for responsiveness
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="recommendations-carousel">
      <h2>Recommended Recipes</h2>
      <Slider {...settings}>
        {limitedRecommendations.map((recipe) => (
          <div key={recipe.spoonacularId} className="carousel-card">
            <img src={recipe.imageUrl} alt={recipe.name} className="carousel-image" />
            <h3>{recipe.name}</h3>
            <p>Category: {recipe.category}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Recommendations;
