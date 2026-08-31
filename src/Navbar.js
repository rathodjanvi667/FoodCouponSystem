import React, { useEffect, useState } from "react";
import { FaUtensils, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // =====================================
  // CHECK LOGIN USER
  // =====================================
  useEffect(() => {
    const checkUser = () => {
      const savedUser =
        localStorage.getItem("foodCouponUser");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error(
            "Invalid user data:",
            error
          );
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // First time
    checkUser();

    // Listen for login changes
    window.addEventListener(
      "userUpdated",
      checkUser
    );

    return () => {
      window.removeEventListener(
        "userUpdated",
        checkUser
      );
    };
  }, []);

  // =====================================
  // CART COUNT
  // =====================================
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart =
        localStorage.getItem("foodCart");

      if (!savedCart) {
        setCartCount(0);
        return;
      }

      try {
        const cart = JSON.parse(savedCart);

        if (!Array.isArray(cart)) {
          setCartCount(0);
          return;
        }

        // Calculate total quantity
        const totalItems = cart.reduce(
          (total, item) =>
            total +
            Number(item.quantity || 1),
          0
        );

        setCartCount(totalItems);
      } catch (error) {
        console.error(
          "Cart loading error:",
          error
        );

        setCartCount(0);
      }
    };

    // First time
    updateCartCount();

    // Listen for cart changes
    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );
    };
  }, []);

  // =====================================
  // LOGOUT
  // =====================================
  const handleLogout = () => {
    localStorage.removeItem(
      "foodCouponUser"
    );

    localStorage.removeItem(
      "foodCouponLogin"
    );

    setUser(null);

    // Notify other components
    window.dispatchEvent(
      new Event("userUpdated")
    );

    alert("Logout Successful!");

    navigate("/Login");
  };

  // =====================================
  // RETURN UI
  // =====================================
  return (
    <nav className="navbar">

      {/* =================================
          LOGO
      ================================= */}
      <Link
        to="/"
        className="logo"
      >
        <FaUtensils />
         CouponBite
      </Link>

      {/* =================================
          NAVIGATION
      ================================= */}
      <ul className="nav-links">
        <li>
          <Link to="/">
            Home
          </Link>
        </li>

        <li>
          <Link to="/Menu">
            Menu
          </Link>
        </li>

        <li>
          <Link to="/Coupon">
            Coupons
          </Link>
        </li>

        <li>
          <Link to="/Order">
            Orders
          </Link>
        </li>

        <li>
          <Link to="/About">
            About
          </Link>
        </li>

        <li>
          <Link to="/Contact">
            Contact
          </Link>
        </li>
      </ul>

      {/* =================================
          RIGHT SIDE
      ================================= */}
      <div className="nav-right">

        {/* CART */}
        <button
          className="cartbtn"
          onClick={() =>
            navigate("/Cart")
          }
        >
          <FaShoppingCart />

          <span>
            Cart ({cartCount})
          </span>
        </button>

        {/* =================================
            USER / LOGIN
        ================================= */}
        {user ? (
          <div className="user-section">

            <span className="user-name">
              {user.role === "admin"
                ? "👨‍💼 Admin"
                : "👤 Customer"}
            </span>

            <button
              className="logoutbtn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        ) : (
          <Link to="/Login">
            <button className="loginbtn">
              Login
            </button>
          </Link>
        )}

      </div>
    </nav>
  );
}