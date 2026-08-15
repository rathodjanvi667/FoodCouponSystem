import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Remember Me data load
  useEffect(() => {
    const savedLogin = localStorage.getItem("foodCouponLogin");

    if (savedLogin) {
      const loginData = JSON.parse(savedLogin);

      setEmail(loginData.email || "");
      setRole(loginData.role || "customer");
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    // Empty field validation
    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter Email and Password");
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Password validation
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    // Frontend demo login
    setTimeout(() => {
      const userData = {
        email: email,
        role: role,
      };

      // Save login information
      localStorage.setItem(
        "foodCouponUser",
        JSON.stringify(userData)
      );

      // Remember Me
      if (rememberMe) {
        localStorage.setItem(
          "foodCouponLogin",
          JSON.stringify({
            email: email,
            role: role,
          })
        );
      } else {
        localStorage.removeItem("foodCouponLogin");
      }

      setLoading(false);

      if (role === "admin") {
        alert("Admin Login Successful!");
        navigate("/Admindashboard");
      } else {
        alert("Customer Login Successful!");
        navigate("/");
      }
    }, 800);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      alert("Please enter your email first.");
      return;
    }

    alert(
      "Password reset functionality will be connected with backend later."
    );
  };

  return (
    <div className="login-container">

      {/* Food Stickers */}
      <div className="food-sticker sticker-1">🍕</div>
      <div className="food-sticker sticker-2">🍔</div>
      <div className="food-sticker sticker-3">🥤</div>
      <div className="food-sticker sticker-4">🍰</div>
      <div className="food-sticker sticker-5">🍝</div>

      <div className="login-box">

        <h1>Welcome Back 👋</h1>

        <p>
          Login to continue your food journey
        </p>

        <form onSubmit={handleLogin}>

          {/* Role */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          {/* Email */}
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login Options */}
          <div className="login-options">

            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
              />

              Remember Me
            </label>

            <a
              href="/"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </a>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}