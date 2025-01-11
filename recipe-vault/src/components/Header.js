import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  // Check localStorage for user_id whenever the component renders
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    setLoggedIn(!!userId); // Update loggedIn to true if user_id exists
  }, []); // Only runs on component mount

  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:5000/logout', { method: 'POST', credentials: 'include' });
      // Clear any local storage or state
      localStorage.removeItem("user_id");
      setLoggedIn(false);
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="bg-dark text-white p-3">
      <h1>Recipe Vault</h1>
      <nav className="nav">
        <a className="nav-link text-white" href="/">Home</a>
        <a className="nav-link text-white" href="/search">Search Recipes</a>
        <a className="nav-link text-white" href="/favorites">Favorites</a>
        <a className="nav-link text-white" href="/register">Register</a>
        {loggedIn ? (
          <button
            onClick={handleLogout}
            className="btn btn-danger ms-3"
            style={{ cursor: "pointer" }}
          >
            Logout
          </button>
        ) : (
          <a className="nav-link text-white" href="/login">Login</a>
        )}
      </nav>
    </header>
  );
}

export default Header;
