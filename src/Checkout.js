import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Checkout.css";

export default function Checkout() {
  // =====================================
  // CUSTOMER DETAILS
  // =====================================
  const [name, setName] = useState("");
  const [validUntil, setValidUntil] = useState("");

  // =====================================
  // LOAD CART
  // =====================================
  const cart =
    JSON.parse(localStorage.getItem("foodCart")) || [];

  // =====================================
  // VALID RESTAURANTS
  // =====================================
  const validAt =
    "Domino's, Lapino'z, Burger King, Pizza Hut, Subway, McDonald's & KFC";

  // =====================================
  // CLEAN PRICE
  // =====================================
  // Converts:
  // 259
  // "259"
  // "₹259"
  // "₹1,299"
  // into a number
  const cleanPrice = (price) => {
    if (typeof price === "number") {
      return price;
    }

    if (!price) {
      return 0;
    }

    const cleanedPrice = String(price)
      .replace(/₹/g, "")
      .replace(/,/g, "")
      .trim();

    const numberPrice = Number(cleanedPrice);

    return isNaN(numberPrice) ? 0 : numberPrice;
  };

  // =====================================
  // GET FOOD ID
  // =====================================
  // Supports both MongoDB _id and old id
  const getItemId = (item) => {
    return item._id || item.id;
  };

  // =====================================
  // TOTAL AMOUNT
  // =====================================
  const totalAmount = cart.reduce(
    (total, item) => {
      const price = cleanPrice(item.price);
      const quantity = Number(item.quantity) || 1;

      return total + price * quantity;
    },
    0
  );

  // =====================================
  // GENERATE COUPON CODE
  // =====================================
  const generateCouponCode = () => {
    const randomCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    return "SFC-" + randomCode;
  };

  // =====================================
  // GENERATE COUPON
  // =====================================
  const generateCoupon = (e) => {
    e.preventDefault();

    // Check customer name
    if (name.trim() === "") {
      alert("Please enter your name");
      return;
    }

    // Check coupon validity date
    if (validUntil === "") {
      alert("Please select coupon validity date");
      return;
    }

    // Check cart
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Generate unique coupon code
    const couponCode = generateCouponCode();

    // =====================================
    // PREPARE FOOD ITEMS
    // =====================================
    // Keep the food information in a clean format
    // so Order page can use the same data.
    const foodItems = cart.map((item) => ({
      id: getItemId(item),
      _id: item._id || item.id,
      name: item.name,
      category: item.category,
      price: cleanPrice(item.price),
      quantity: Number(item.quantity) || 1,
      image: item.image || ""
    }));

    // =====================================
    // CREATE COUPON OBJECT
    // =====================================
    const newCoupon = {
      id: Date.now(),
      couponCode: couponCode,
      customerName: name.trim(),
      foodItems: foodItems,
      offer: "20% OFF",
      validAt: validAt,
      validUntil: validUntil,
      totalAmount: totalAmount,
      status: "VALID",
      createdAt: new Date().toISOString()
    };

    // =====================================
    // GET EXISTING COUPONS
    // =====================================
    const savedCoupons =
      JSON.parse(
        localStorage.getItem("myCoupons")
      ) || [];

    // =====================================
    // SAVE NEW COUPON
    // =====================================
    const updatedCoupons = [
      ...savedCoupons,
      newCoupon
    ];

    localStorage.setItem(
      "myCoupons",
      JSON.stringify(updatedCoupons)
    );

    // =====================================
    // SAVE CURRENT COUPON
    // =====================================
    // This makes it easy for Order page
    // to display the latest generated coupon.
    localStorage.setItem(
      "latestCoupon",
      JSON.stringify(newCoupon)
    );

    // =====================================
    // SUCCESS MESSAGE
    // =====================================
    alert(
      "Coupon Generated Successfully! 🎉\n\n" +
      "Coupon Code: " +
      couponCode
    );

    // =====================================
    // GO TO ORDER PAGE
    // =====================================
    window.location.href = "/Order";
  };

  // =====================================
  // TODAY'S DATE
  // =====================================
  const today = new Date()
    .toISOString()
    .split("T")[0];

  // =====================================
  // JSX
  // =====================================
  return (
    <div className="checkout-page">
      <Navbar></Navbar>
        

      <div className="checkout-header">
        <h1>
          Generate Food Coupon 🎟️
        </h1>

        <p>
          Complete your details and generate your coupon.
        </p>
      </div>

      <div className="checkout-container">

        {/* =================================
            CUSTOMER DETAILS
        ================================== */}
        <div className="checkout-form">
          <h2>
            Coupon Details
          </h2>

          <form onSubmit={generateCoupon}>

            {/* FULL NAME */}
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

            {/* VALID UNTIL */}
            <label>
              Valid Until
            </label>

            <input
              type="date"
              value={validUntil}
              min={today}
              onChange={(e) =>
                setValidUntil(e.target.value)
              }
            />

            {/* OFFER */}
            <label>
              Offer
            </label>

            <input
              type="text"
              value="20% OFF"
              readOnly
            />

            {/* GENERATE COUPON */}
            <button type="submit">
              Generate Coupon 🎟️
            </button>

          </form>
        </div>

        {/* =================================
            COUPON SUMMARY
        ================================== */}
        <div className="checkout-summary">
          <h2>
            Coupon Summary
          </h2>

          {cart.map((item) => (
            <div
              className="checkout-item"
              key={getItemId(item)}
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
                {cleanPrice(item.price) *
                  Number(item.quantity || 1)}
              </span>
            </div>
          ))}

          <hr />

          {/* TOTAL */}
          <div className="checkout-total">
            <span>
              Total
            </span>

            <span>
              ₹{totalAmount}
            </span>
          </div>

          {/* =================================
              VALID RESTAURANT NOTE
          ================================== */}
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

      <Footer></Footer>
    </div>
  );
}