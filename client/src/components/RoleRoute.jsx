import React from "react";
import { Navigate } from "react-router-dom";

const RoleRoute = ({ element: Component, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Navigate to="/signin" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return Component;
};

export default RoleRoute;
