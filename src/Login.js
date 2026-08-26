import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // =====================================
  // LOAD REMEMBER ME DATA
  // =====================================
  useEffect(() => {
    const savedLogin =
      localStorage.getItem("foodCouponLogin");

    if (savedLogin) {
      try {
        const loginData =
          JSON.parse(savedLogin);

        setEmail(loginData.email || "");
        setRole(loginData.role || "customer");
        setRememberMe(true);
      } catch (error) {
        console.error(
          "Login data error:",
          error
        );

        localStorage.removeItem(
          "foodCouponLogin"
        );
      }
    }
  }, []);

  // =====================================
  // LOGIN
  // =====================================
  const handleLogin = (e) => {
    e.preventDefault();

    // Empty field validation
    if (
      email.trim() === "" ||
      password.trim() === ""
    ) {
      alert(
        "Please enter Email and Password"
      );
      return;
    }

    // Email validation
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      alert(
        "Please enter a valid email address"
      );
      return;
    }

    // Password validation
    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters"
      );
      return;
    }

    setLoading(true);

    // =====================================
    // FRONTEND DEMO LOGIN
    // =====================================
    setTimeout(() => {
      const userData = {
        email: email.trim(),
        role: role
      };

      // =====================================
      // SAVE LOGGED-IN USER
      // =====================================
      localStorage.setItem(
        "foodCouponUser",
        JSON.stringify(userData)
      );

      // =====================================
      // REMEMBER ME
      // =====================================
      if (rememberMe) {
        localStorage.setItem(
          "foodCouponLogin",
          JSON.stringify({
            email: email.trim(),
            role: role
          })
        );
      } else {
        localStorage.removeItem(
          "foodCouponLogin"
        );
      }

      // =====================================
      // UPDATE NAVBAR
      // =====================================
      window.dispatchEvent(
        new Event("userUpdated")
      );

      setLoading(false);

      // =====================================
      // ROLE BASED REDIRECT
      // =====================================
      if (role === "admin") {
        alert(
          "Admin Login Successful!"
        );

        navigate("/Admindashboard");
      } else {
        alert(
          "Customer Login Successful!"
        );

        navigate("/");
      }
    }, 800);
  };

  // =====================================
  // FORGOT PASSWORD
  // =====================================
  const handleForgotPassword = (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      alert(
        "Please enter your email first."
      );
      return;
    }

    alert(
      "Password reset functionality will be connected with backend later."
    );
  };

  // =====================================
  // RETURN UI
  // =====================================
  return (
    <div className="login-container">

      {/* =================================
          FOOD STICKERS
      ================================= */}
      <div className="food-sticker sticker-1">
        🍕
      </div>

      <div className="food-sticker sticker-2">
        🍔
      </div>

      <div className="food-sticker sticker-3">
        🥤
      </div>

      <div className="food-sticker sticker-4">
        🍰
      </div>

      <div className="food-sticker sticker-5">
        🍝
      </div>

      {/* =================================
          LOGIN BOX
      ================================= */}
      <div className="login-box">

        <h1>
          Welcome Back 👋
        </h1>

        <p>
          Login to continue your food journey
        </p>

        <form onSubmit={handleLogin}>

          {/* ROLE */}
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
          >
            <option value="customer">
              Customer
            </option>

            <option value="admin">
              Admin
            </option>
          </select>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {/* LOGIN OPTIONS */}
          <div className="login-options">

            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(
                    e.target.checked
                  )
                }
              />

              Remember Me
            </label>

            <a
              href="/"
              onClick={
                handleForgotPassword
              }
            >
              Forgot Password?
            </a>

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* REGISTER */}
        <div className="register-link">
          Don't have an account?{" "}

          <Link to="/Register">
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}