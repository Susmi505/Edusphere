import React from 'react';
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element,allowedRoles  }) => {
  const isAuthenticated = localStorage.getItem("token"); 
  const role = localStorage.getItem("role");

  if (!isAuthenticated) {
    // Not logged in
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Logged in, but role is not allowed
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
