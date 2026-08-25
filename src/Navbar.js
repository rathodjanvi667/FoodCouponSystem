import React, { useEffect, useState } from "react";
import { FaUtensils, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);


  // Login user check
  useEffect(() => {

    const savedUser = localStorage.getItem("foodCouponUser");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

  }, []);


  // Cart count check
  useEffect(() => {

    const updateCartCount = () => {

      const savedCart = localStorage.getItem("foodCart");

      if (savedCart) {

        const cart = JSON.parse(savedCart);

        // Total quantity
        const totalItems = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        setCartCount(totalItems);

      } else {

        setCartCount(0);

      }
    };


    // First time
    updateCartCount();


    // Listen for cart changes
    window.addEventListener("cartUpdated", updateCartCount);


    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };

  }, []);


  // Logout
  const handleLogout = () => {

    localStorage.removeItem("foodCouponUser");
    localStorage.removeItem("foodCouponLogin");

    setUser(null);

    alert("Logout Successful!");

    navigate("/Login");
  };


  return (

    <nav className="navbar">


      {/* Logo */}

      <div className="logo">

        <FaUtensils />

        Food Coupon

      </div>


      {/* Navigation */}

      <ul className="nav-links">

        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/Menu">Menu</Link>
        </li>

        <li>
          <Link to="/Coupon">Coupons</Link>
        </li>

        <li>
          <Link to="/Order">Orders</Link>
        </li>

        <li>
          <Link to="/About">About</Link>
        </li>

        <li>
          <Link to="/Contact">Contact</Link>
        </li>

      </ul>


      {/* Right Side */}

      <div className="nav-right">


        {/* Cart */}

        <button
          className="cartbtn"
          onClick={() => navigate("/Cart")}
        >

          <FaShoppingCart />

          <span>
            Cart ({cartCount})
          </span>

        </button>


        {/* Login / User */}

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