import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Checkout.css";

export default function Checkout() {

  const [name, setName] = useState("");
  const [validUntil, setValidUntil] = useState("");

  const cart =
    JSON.parse(localStorage.getItem("foodCart")) || [];

  // Valid At - Fixed Restaurant List
  const validAt =
    "Domino's, Lapino'z, Burger King, Pizza Hut, Subway, McDonald's & KFC";


  // -----------------------------
  // TOTAL AMOUNT
  // -----------------------------

  const totalAmount = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
      Number(item.quantity || 1),
    0
  );


  // -----------------------------
  // GENERATE COUPON CODE
  // -----------------------------

  const generateCouponCode = () => {

    const randomCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    return "SFC-" + randomCode;
  };


  // -----------------------------
  // GENERATE COUPON
  // -----------------------------

  const generateCoupon = (e) => {

    e.preventDefault();

    if (name.trim() === "") {
      alert("Please enter your name");
      return;
    }

    if (validUntil === "") {
      alert("Please select coupon validity date");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const couponCode = generateCouponCode();


    // Coupon Object

    const newCoupon = {

      id: Date.now(),

      couponCode: couponCode,

      customerName: name,

      foodItems: cart,

      offer: "20% OFF",

      validAt: validAt,

      validUntil: validUntil,

      totalAmount: totalAmount,

      status: "VALID",

      createdAt: new Date().toISOString()

    };


    // Get Existing Coupons

    const savedCoupons =
      JSON.parse(
        localStorage.getItem("myCoupons")
      ) || [];


    // Save New Coupon

    const updatedCoupons = [
      ...savedCoupons,
      newCoupon
    ];

    localStorage.setItem(
      "myCoupons",
      JSON.stringify(updatedCoupons)
    );


    alert(
      "Coupon Generated Successfully! 🎉\n\n" +
      "Coupon Code: " +
      couponCode
    );


    // Go to My Coupons

    window.location.href = "/Order";
  };


  return (

    <div className="checkout-page">

      <Navbar />


      {/* Header */}

      <div className="checkout-header">

        <h1>
          Generate Food Coupon 🎟️
        </h1>

        <p>
          Complete your details and generate your coupon.
        </p>

      </div>


      <div className="checkout-container">


        {/* =========================
            CUSTOMER DETAILS
        ========================== */}

        <div className="checkout-form">

          <h2>
            Coupon Details
          </h2>


          <form onSubmit={generateCoupon}>


            {/* Name */}

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />


            {/* Valid Until */}

            <label>
              Valid Until
            </label>

            <input
              type="date"
              value={validUntil}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              onChange={(e) =>
                setValidUntil(e.target.value)
              }
            />


            {/* Offer */}

            <label>
              Offer
            </label>

            <input
              type="text"
              value="20% OFF"
              readOnly
            />


            <button type="submit">
              Generate Coupon 🎟️
            </button>

          </form>

        </div>


        {/* =========================
            COUPON SUMMARY
        ========================== */}

        <div className="checkout-summary">

          <h2>
            Coupon Summary
          </h2>


          {cart.map((item) => (

            <div
              className="checkout-item"
              key={item.id}
            >

              <div>

                <h3>
                  {item.name}
                </h3>

                <p>
                  Quantity: {item.quantity}
                </p>

              </div>

              <span>
                ₹
                {
                  Number(item.price || 0) *
                  Number(item.quantity || 1)
                }
              </span>

            </div>

          ))}


          <hr />


          <div className="checkout-total">

            <span>
              Total
            </span>

            <span>
              ₹{totalAmount}
            </span>

          </div>


          {/* =========================
              NOTE
          ========================== */}

          <div
            className="coupon-note"
            style={{
              marginTop: "25px",
              padding: "15px",
              background: "#fff7ed",
              borderRadius: "8px",
              fontSize: "14px",
              lineHeight: "1.6"
            }}
          >

            <strong>
              📌 Note:
            </strong>

            <p style={{ margin: "6px 0 0" }}>
              This coupon is valid at:
            </p>

            <p style={{ margin: "5px 0" }}>
              <strong>
                {validAt}
              </strong>
            </p>

          </div>

        </div>

      </div>


      <Footer />

    </div>
  );
}