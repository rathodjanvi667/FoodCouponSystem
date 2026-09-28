import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const API_URL = "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLogin = localStorage.getItem("foodCouponLogin");

    if (savedLogin) {
      try {
        const loginData = JSON.parse(savedLogin);

        setEmail(loginData.email || "");
        setRole(loginData.role || "customer");
        setRememberMe(true);
      } catch (error) {
        console.error("Login data error:", error);
        localStorage.removeItem("foodCouponLogin");
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter Email and Password");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          role: role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      const user = data.user;

      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      };

      localStorage.setItem(
        "foodCouponUser",
        JSON.stringify(userData)
      );

      if (rememberMe) {
        localStorage.setItem(
          "foodCouponLogin",
          JSON.stringify({
            email: user.email,
            role: user.role
          })
        );
      } else {
        localStorage.removeItem("foodCouponLogin");
      }

      window.dispatchEvent(new Event("userUpdated"));

      if (user.role === "admin") {
        alert("Admin Login Successful!");
        navigate("/Admindashboard");
      } else {
        alert("Customer Login Successful!");
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
      <div className="food-sticker sticker-1">🍕</div>
      <div className="food-sticker sticker-2">🍔</div>
      <div className="food-sticker sticker-3">🥤</div>
      <div className="food-sticker sticker-4">🍰</div>
      <div className="food-sticker sticker-5">🍝</div>

      <div className="login-box">
        <h1>Welcome Back 👋</h1>
        <p>Login to continue your food journey</p>

        <form onSubmit={handleLogin}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

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

            <a href="/" onClick={handleForgotPassword}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="register-link">
          Don't have an account?{" "}
          <Link to="/Register">Register</Link>
        </div>
      </div>
    </div>
  );
}