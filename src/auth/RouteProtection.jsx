import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ allowedRole }) => {
  const session = JSON.parse(localStorage.getItem("sb-session"));

  // Si no hay sesión, redirige al login
  if (!session || !session.access_token) {
    return <Navigate to="/login-users" replace />;
  }

  const user = JSON.parse(sessionStorage.getItem("user"));
  if (allowedRole && user?.role && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
