import React from "react";
import "./Home.css";

import Navbar from "./Navbar";
import Hero from "./Hero";
import PopularFoods from "./PopularFoods";
import Features from "./Features";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="home">

      {/* ================================
          NAVBAR
      ================================= */}
      <Navbar />

      {/* ================================
          MAIN CONTENT
      ================================= */}
      <main>

        {/* HERO */}
        <Hero />

        {/* ================================
            POPULAR FOODS
        ================================= */}
        <section className="section popular-section">
          <div className="container">

            <div className="section-heading">

              <span className="section-label">
                EXPLORE OUR MENU
              </span>

              <h2 className="section-title">
                Popular Foods
              </h2>

              <p className="section-subtitle">
                Discover delicious food and enjoy exclusive
                coupons on your favorite meals.
              </p>

            </div>

            <PopularFoods />

          </div>
        </section>

        {/* ================================
            WHY CHOOSE US
        ================================= */}
        <section className="features-section">
          <Features />
        </section>

      </main>

      {/* ================================
          FOOTER
      ================================= */}
      <Footer />

    </div>
  );
}
