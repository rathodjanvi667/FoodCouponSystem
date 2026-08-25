<<<<<<< HEAD
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const savedUser = localStorage.getItem("foodCouponUser");

  if (!savedUser) {
    return <Navigate to="/Login" replace />;
  }

  const user = JSON.parse(savedUser);

  // Role check
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
=======
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
>>>>>>> d7d75d0c97c1411ad7577eb2a6a19c4a9078d035
}