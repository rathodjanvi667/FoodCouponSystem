import React, { useState } from "react";
import "./Contact.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================
  // HANDLE FORM SUBMIT
  // =====================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      alert("Please fill all the fields.");
      return;
    }

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="contact-page-wrapper">

      <Navbar />

      <main className="contact">

        {/* =====================================
            CONTACT BANNER
        ====================================== */}

        <section className="contact-banner">

          <div className="contact-banner-content">

            <span className="contact-banner-label">
              SMART FOOD COUPON
            </span>

            <h1>Contact Us</h1>

            <p>
              Have a question? We're here to help!
            </p>

          </div>

        </section>


        {/* =====================================
            CONTACT CONTENT
        ====================================== */}

        <section className="contact-container">

          {/* =====================================
              CONTACT INFORMATION
          ====================================== */}

          <div className="contact-info">

            <span className="contact-label">
              GET IN TOUCH
            </span>

            <h2>
              Let's Talk About
              <span> Food & Savings.</span>
            </h2>

            <p className="contact-intro">
              Have questions about our food coupons, restaurant offers,
              orders, or need assistance? Our support team is always happy
              to help you.
            </p>


            {/* =====================================
                ONLINE PLATFORM
            ====================================== */}

            <div className="info-box">

              <div className="info-icon">
                🌐
              </div>

              <div className="info-content">

                <h3>Online Platform</h3>

                <p>
                  Smart Food Coupon is an online platform
                  available for food lovers everywhere.
                </p>

              </div>

            </div>


            {/* =====================================
                CUSTOMER SUPPORT
            ====================================== */}

            <div className="info-box">

              <div className="info-icon">
                📞
              </div>

              <div className="info-content">

                <h3>Customer Support</h3>

                <p>
                  Get assistance with coupons, orders,
                  food items and other queries.
                </p>

              </div>

            </div>


            {/* =====================================
                EMAIL
            ====================================== */}

            <div className="info-box">

              <div className="info-icon">
                ✉️
              </div>

              <div className="info-content">

                <h3>Email Support</h3>

                <p>
                  support@foodcoupon.com
                </p>

              </div>

            </div>


            {/* =====================================
                WORKING HOURS
            ====================================== */}

            <div className="info-box">

              <div className="info-icon">
                🕒
              </div>

              <div className="info-content">

                <h3>Support Hours</h3>

                <p>
                  Monday - Sunday
                  <br />
                  9:00 AM - 10:00 PM
                </p>

              </div>

            </div>

          </div>


          {/* =====================================
              CONTACT FORM
          ====================================== */}

          <div className="contact-form">

            <div className="form-header">

              <span>
                MESSAGE US
              </span>

              <h2>
                Send Us a Message
              </h2>

              <p>
                Fill out the form below and our team will
                get back to you soon.
              </p>

            </div>


            {/* =====================================
                SUCCESS MESSAGE
            ====================================== */}

            {submitted && (
              <div className="success-message">

                <span>✓</span>

                <div>

                  <strong>
                    Message Sent Successfully!
                  </strong>

                  <p>
                    Thank you for contacting Smart Food Coupon.
                  </p>

                </div>

              </div>
            )}


            {/* =====================================
                FORM
            ====================================== */}

            <form onSubmit={handleSubmit}>

              {/* NAME + EMAIL */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Your Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />

                </div>


                <div className="form-group">

                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />

                </div>

              </div>


              {/* SUBJECT */}

              <div className="form-group">

                <label>
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What can we help you with?"
                />

              </div>


              {/* MESSAGE */}

              <div className="form-group">

                <label>
                  Your Message
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Write your message here..."
                ></textarea>

              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                className="contact-submit-btn"
              >
                Send Message
                <span>→</span>
              </button>

            </form>

          </div>

        </section>


        {/* =====================================
            BOTTOM CTA
        ====================================== */}

        <section className="contact-cta">

          <div className="contact-cta-icon">
            🎟️
          </div>

          <div>

            <h3>
              Need help with a food coupon?
            </h3>

            <p>
              We're here to help you discover better
              deals and save more on your favorite food.
            </p>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}