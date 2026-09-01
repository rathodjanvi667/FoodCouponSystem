import React from "react";
import { Link } from "react-router-dom";

import {
  FaUtensils,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowUp,
} from "react-icons/fa";

import "./Footer.css";

export default function Footer() {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">

      {/* =========================================
          MAIN FOOTER
      ========================================= */}

      <div className="footercontainer">

        {/* =========================================
            BRAND
        ========================================= */}

        <div className="footerbox footer-brand">

          <Link to="/" className="footer-logo">
            <FaUtensils />
            <span>CouponBite</span>
          </Link>

          <p>
            Discover delicious food, explore exclusive
            coupons, and enjoy more savings with
            CouponBite.
          </p>

          <div className="footer-badge">
            🍴 Smart Food Coupon System
          </div>

        </div>


        {/* =========================================
            QUICK LINKS
        ========================================= */}

        <div className="footerbox">

          <h3>
            Quick Links
          </h3>

          <ul>

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

        </div>


        {/* =========================================
            CONTACT
        ========================================= */}

        <div className="footerbox">

          <h3>
            Contact Us
          </h3>

          <div className="contact-item">

            <span className="contact-icon">
              <FaMapMarkerAlt />
            </span>

            <p>
              Surat, Gujarat
            </p>

          </div>


          <div className="contact-item">

            <span className="contact-icon">
              <FaPhoneAlt />
            </span>

            <p>
              +91 10101010101
            </p>

          </div>


          <div className="contact-item">

            <span className="contact-icon">
              <FaEnvelope />
            </span>

            <p>
              foodcoupon@gmail.com
            </p>

          </div>

        </div>


        {/* =========================================
            SOCIAL MEDIA
        ========================================= */}

        <div className="footerbox">

          <h3>
            Follow Us
          </h3>

          <p className="social-text">
            Follow us for the latest food deals,
            coupons and offers.
          </p>

          <div className="social">

            <a href="#facebook" aria-label="Facebook">
              <FaFacebookF />
            </a>

            <a href="#instagram" aria-label="Instagram">
              <FaInstagram />
            </a>

            <a href="#linkedin" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>

            <a href="#youtube" aria-label="YouTube">
              <FaYoutube />
            </a>

          </div>

        </div>

      </div>


      {/* =========================================
          FOOTER BOTTOM
      ========================================= */}

      <div className="footerbottom">

        <div className="copyright">
          © 2026 <strong>CouponBite</strong>.
          All Rights Reserved.
        </div>

        <button
          className="scroll-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>

      </div>

    </footer>
  );
}
