import React from "react";
import "./Hero.css";
import mixfood from "./Images/mixfood.jpg";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">

      {/* =========================================
          LEFT CONTENT
      ========================================= */}
      <div className="heroleft">

        <span className="hero-badge">
          🍴 SMART FOOD COUPONS
        </span>

        <h1>
          Save More on
          <br />
          Every Food Order
        </h1>

        <p>
          Discover delicious food, grab exclusive coupons,
          and enjoy your favorite meals at better prices.
        </p>

        {/* =========================================
            HERO BUTTONS
        ========================================= */}
        <div className="herobtn">

          <Link to="/Coupon" className="buycoupon">
            Explore Coupons
          </Link>

          <Link to="/Menu" className="menubtn">
            View Menu
          </Link>

        </div>

        {/* =========================================
            TRUST / BENEFITS
        ========================================= */}
        <div className="hero-benefits">

          <div className="hero-benefit">
            <span className="benefit-icon">✓</span>

            <div>
              <strong>Best Deals</strong>
              <small>Save more</small>
            </div>
          </div>

          <div className="hero-benefit">
            <span className="benefit-icon">✓</span>

            <div>
              <strong>Easy to Use</strong>
              <small>Simple coupons</small>
            </div>
          </div>

          <div className="hero-benefit">
            <span className="benefit-icon">✓</span>

            <div>
              <strong>More Choices</strong>
              <small>Favorite foods</small>
            </div>
          </div>

        </div>

      </div>


      {/* =========================================
          RIGHT FOOD IMAGE
      ========================================= */}
      <div className="heroright">

        <div className="hero-image-wrapper">

          <img
            src={mixfood}
            alt="Delicious food"
          />

        </div>

        {/* Floating discount card */}
        <div className="hero-discount-card">

          <span className="discount-icon">
            %
          </span>

          <div>
            <strong>20% OFF</strong>
            <small>Exclusive Food Deals</small>
          </div>

        </div>

      </div>

    </section>
  );
}