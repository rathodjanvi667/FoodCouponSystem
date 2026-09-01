import React from "react";
import {
  FaUtensils,
  FaTicketAlt,
  FaShippingFast,
  FaShieldAlt,
} from "react-icons/fa";

import "./Features.css";

export default function Features() {
  return (
    <section className="features">

      {/* =========================================
          SECTION HEADING
      ========================================= */}

      <div className="featureheading">

        <span className="feature-label">
          WHY COUPONBITE
        </span>

        <h2>
          Why Choose Us?
        </h2>

        <p>
          Everything you need to enjoy delicious food
          with better deals and a simpler experience.
        </p>

      </div>


      {/* =========================================
          FEATURE CARDS
      ========================================= */}

      <div className="featurecontainer">

        {/* FEATURE 1 */}

        <div className="featurecard">

          <div className="icon">
            <FaUtensils />
          </div>

          <h3>
            Fresh Food
          </h3>

          <p>
            Enjoy delicious food prepared with
            quality ingredients and great taste.
          </p>

        </div>


        {/* FEATURE 2 */}

        <div className="featurecard">

          <div className="icon">
            <FaTicketAlt />
          </div>

          <h3>
            Easy Coupons
          </h3>

          <p>
            Discover and use food coupons easily
            with just a few simple clicks.
          </p>

        </div>


        {/* FEATURE 3 */}

        <div className="featurecard">

          <div className="icon">
            <FaShippingFast />
          </div>

          <h3>
            Fast Service
          </h3>

          <p>
            Save time and enjoy a quick and
            convenient food experience.
          </p>

        </div>


        {/* FEATURE 4 */}

        <div className="featurecard">

          <div className="icon">
            <FaShieldAlt />
          </div>

          <h3>
            Secure Payment
          </h3>

          <p>
            Your transactions are protected with
            safe and reliable payment methods.
          </p>

        </div>

      </div>

    </section>
  );
}