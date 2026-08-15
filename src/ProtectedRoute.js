import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const savedUser = localStorage.getItem("foodCouponUser");

  // User login નથી
  if (!savedUser) {
    return <Navigate to="/Login" replace />;
  }

  const user = JSON.parse(savedUser);

  // Role check
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}