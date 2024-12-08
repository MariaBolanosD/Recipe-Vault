import React from "react";

function Header() {
  return (
    <header className="bg-dark text-white p-3">
      <h1>Recipe Vault</h1>
      <nav className="nav">
        <a className="nav-link text-white" href="/">Home</a>
        <a className="nav-link text-white" href="/search">Search Recipes</a>
        <a className="nav-link text-white" href="/favorites">Favorites</a>
        <a className="nav-link text-white" href="/login">Login</a>
      </nav>
    </header>
  );
}

export default Header;
