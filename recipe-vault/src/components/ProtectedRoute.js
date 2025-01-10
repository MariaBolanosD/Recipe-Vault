import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
