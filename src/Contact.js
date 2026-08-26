import React from "react";
import "./Contact.css";
import Navbar from "./Navbar";
import Footer from "./Footer";



export default function Contact() {
  return (
    <div>
        <Navbar></Navbar>
    <div className="contact">

      <div className="contact-banner">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you!</p>
      </div>

      <div className="contact-container">

        <div className="contact-info">

          <h2>Get In Touch</h2>

          <p>
            Have questions about our food coupons or need any assistance?
            Feel free to contact us anytime.
          </p>

          <div className="info-box">
            <h3>📍 Address</h3>
            <p>123 Food Street, Surat, Gujarat</p>
          </div>

          <div className="info-box">
            <h3>📞 Phone</h3>
            <p>+91 98765 43210</p>
          </div>

          <div className="info-box">
            <h3>📧 Email</h3>
            <p>support@foodcoupon.com</p>
          </div>

          <div className="info-box">
            <h3>🕒 Working Hours</h3>
            <p>Monday - Sunday</p>
            <p>9:00 AM - 10:00 PM</p>
          </div>

        </div>

        <div className="contact-form">

          <h2>Send Message</h2>

          <form>

            <input
              type="text"
              placeholder="Enter Your Name"
            />

            <input
              type="email"
              placeholder="Enter Your Email"
            />

            <input
              type="text"
              placeholder="Subject"
            />

            <textarea
              rows="6"
              placeholder="Write Your Message"
            ></textarea>

            <button type="submit">
              Send Message
            </button>

          </form>

        </div>

      </div>

    </div>
    <Footer></Footer>
    </div>
  );
}
