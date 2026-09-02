import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function About() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      <div className="about">

        {/* =========================
            ABOUT BANNER
        ========================== */}
        <div className="about-banner">
          <div className="about-banner-content">
            <span>SMART FOOD COUPON</span>
            <h1>About Food Coupon</h1>
            <p>Save More, Eat More!</p>
          </div>
        </div>


        {/* =========================
            ABOUT CONTENT
        ========================== */}
        <div className="about-container">

          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1000&q=85"
              alt="Delicious food and dining"
            />

            <div className="about-image-badge">
              <strong>₹</strong>
              <span>Smart Savings</span>
            </div>
          </div>


          <div className="about-content">

            <span className="about-label">ABOUT OUR PLATFORM</span>

            <h2>
              Delicious Food,
              <span> Smarter Savings.</span>
            </h2>

            <p>
              Smart Food Coupon is a modern food platform designed to help
              food lovers discover delicious meals and enjoy exciting
              restaurant offers at better prices.
            </p>

            <p>
              Our platform connects customers with special food coupons,
              restaurant deals and attractive discounts, making every food
              order more rewarding.
            </p>

            <p>
              Simply explore the menu, add your favorite food to the cart,
              discover available coupons and enjoy more value from every
              order.
            </p>

            <button
              className="about-btn"
              onClick={() => navigate("/Menu")}
            >
              Explore Menu
              <span>→</span>
            </button>

          </div>

        </div>


        {/* =========================
            STATS
        ========================== */}
        <div className="features">

          <div className="box">
            <div className="box-icon">🍔</div>
            <h3>100+</h3>
            <p>Food Items</p>
          </div>

          <div className="box">
            <div className="box-icon">🎟️</div>
            <h3>Daily</h3>
            <p>New Coupons</p>
          </div>

          <div className="box">
            <div className="box-icon">😊</div>
            <h3>5000+</h3>
            <p>Happy Customers</p>
          </div>

          <div className="box">
            <div className="box-icon">⭐</div>
            <h3>4.9</h3>
            <p>Customer Rating</p>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}