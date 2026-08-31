import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Cart.css";

export default function Cart() {

  // =====================================
  // PRICE FORMAT FIX
  // =====================================

  const cleanPrice = (price) => {
    if (typeof price === "number") return price;
    if (!price) return 0;

    const cleanedPrice = String(price)
      .replace(/₹/g, "")
      .replace(/,/g, "")
      .trim();

    const numberPrice = Number(cleanedPrice);
    return isNaN(numberPrice) ? 0 : numberPrice;
  };

  // =====================================
  // GET FOOD ID
  // Supports both MongoDB _id and old id
  // =====================================

  const getItemId = (item) => item._id || item.id;

  // =====================================
  // LOAD CART FROM LOCAL STORAGE
  // =====================================

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("foodCart");

    if (savedCart) {
      try {
        const oldCart = JSON.parse(savedCart);

        // Fix old cart data
        const fixedCart = oldCart.map((item) => ({
          ...item,
          id: item.id || item._id,
          price: cleanPrice(item.price),
          quantity: Number(item.quantity) || 1,
          image: item.image || ""
        }));

        // Save corrected cart
        localStorage.setItem(
          "foodCart",
          JSON.stringify(fixedCart)
        );

        return fixedCart;

      } catch (error) {
        console.error("Error loading cart:", error);
        localStorage.removeItem("foodCart");
        return [];
      }
    }

    return [];
  });

  // =====================================
  // NEW - COUPON STATES
  // =====================================

  const [generatedCoupon, setGeneratedCoupon] = useState(null);
  const [showCouponPopup, setShowCouponPopup] = useState(false);

  // =====================================
  // SAVE CART
  // =====================================

  const saveCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      "foodCart",
      JSON.stringify(updatedCart)
    );

    // Notify Navbar about cart changes
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // =====================================
  // INCREASE QUANTITY
  // =====================================

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) => {
      if (getItemId(item) === id) {
        return {
          ...item,
          id: item.id || item._id,
          price: cleanPrice(item.price),
          quantity: Number(item.quantity || 1) + 1
        };
      }

      return item;
    });

    saveCart(updatedCart);
  };

  // =====================================
  // DECREASE QUANTITY
  // =====================================

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) => {
        if (getItemId(item) === id) {
          return {
            ...item,
            id: item.id || item._id,
            price: cleanPrice(item.price),
            quantity: Number(item.quantity || 1) - 1
          };
        }

        return item;
      })
      .filter((item) => Number(item.quantity) > 0);

    saveCart(updatedCart);
  };

  // =====================================
  // REMOVE ITEM
  // =====================================

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => getItemId(item) !== id
    );

    saveCart(updatedCart);
  };

  // =====================================
  // CLEAR CART
  // =====================================

  const clearCart = () => {
    setCart([]);

    localStorage.removeItem("foodCart");

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // =====================================
  // TOTAL ITEMS
  // =====================================

  const totalItems = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );

  // =====================================
  // TOTAL AMOUNT
  // =====================================

  const totalAmount = cart.reduce((total, item) => {
    const price = cleanPrice(item.price);
    const quantity = Number(item.quantity) || 1;

    return total + price * quantity;
  }, 0);


  // =====================================
  // NEW - GENERATE COUPON
  // =====================================

  const generateCoupon = () => {

    if (cart.length === 0) {
      alert("Please add food items to your cart first.");
      return;
    }

    // Generate random coupon number
    const randomNumber = Math.floor(
      1000 + Math.random() * 9000
    );

    // Get restaurant/store/location from cart
    const restaurantNames = [
      ...new Set(
        cart
          .map(
            (item) =>
              item.restaurant ||
              item.store ||
              item.location
          )
          .filter(Boolean)
      )
    ];

    const restaurant =
      restaurantNames.length > 0
        ? restaurantNames.join(", ")
        : "All Restaurants";

    // Create coupon
    const coupon = {
      code: `FOOD${randomNumber}`,
      discount: 10,
      minOrderAmount: 299,
      restaurant: restaurant,
      validUntil: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString()
    };

    // Save coupon in localStorage
    localStorage.setItem(
      "generatedCoupon",
      JSON.stringify(coupon)
    );

    // Set coupon
    setGeneratedCoupon(coupon);

    // Show popup
    setShowCouponPopup(true);
  };


  // =====================================
  // NEW - COPY COUPON
  // =====================================

  const copyCoupon = () => {

    if (!generatedCoupon) return;

    navigator.clipboard.writeText(
      generatedCoupon.code
    );

    alert("Coupon code copied! 🎉");
  };


  // =====================================
  // NEW - CLOSE COUPON POPUP
  // =====================================

  const closeCouponPopup = () => {
    setShowCouponPopup(false);
  };


  return (
    <div className="cart-page">

      <Navbar></Navbar>

      {/* =====================================
          CART HEADER
      ===================================== */}

      <div className="cart-header">
        <h1>My Cart 🛒</h1>

        <p>
          Review your food items before placing your order.
        </p>
      </div>


      {/* =====================================
          EMPTY CART
      ===================================== */}

      {cart.length === 0 ? (

        <div className="empty-cart">

          <h2>Your Cart is Empty 🛒</h2>

          <p>
            Add some delicious food from the menu.
          </p>

        </div>

      ) : (

        <div className="cart-container">

          {/* =====================================
              CART ITEMS
          ===================================== */}

          <div className="cart-items">

            <h2>Cart Items</h2>

            {cart.map((food) => {

              const foodId = getItemId(food);

              return (

                <div
                  className="cart-item"
                  key={foodId}
                >

                  {/* FOOD IMAGE */}

                  <img
                    src={food.image}
                    alt={food.name}
                  />


                  {/* FOOD DETAILS */}

                  <div className="cart-details">

                    <h3>{food.name}</h3>

                    <p>{food.category}</p>

                    <h4>
                      ₹{cleanPrice(food.price)}
                    </h4>

                  </div>


                  {/* QUANTITY */}

                  <div className="quantity-box">

                    <button
                      onClick={() =>
                        decreaseQuantity(foodId)
                      }
                    >
                      -
                    </button>

                    <span>
                      {food.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(foodId)
                      }
                    >
                      +
                    </button>

                  </div>


                  {/* ITEM TOTAL */}

                  <div className="item-total">

                    ₹
                    {cleanPrice(food.price) *
                      Number(food.quantity || 1)}

                  </div>


                  {/* REMOVE */}

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeItem(foodId)
                    }
                  >
                    Remove
                  </button>

                </div>
              );
            })}

          </div>


          {/* =====================================
              ORDER SUMMARY
          ===================================== */}

          <div className="cart-summary">

            <h2>Order Summary</h2>


            <div className="summary-row">

              <span>Items</span>

              <span>{totalItems}</span>

            </div>


            <div className="summary-row">

              <span>Subtotal</span>

              <span>₹{totalAmount}</span>

            </div>


            <div className="summary-row">

              <span>Delivery</span>

              <span>FREE</span>

            </div>


            <hr />


            {/* FINAL TOTAL */}

            <div className="total-row">

              <span>Total</span>

              <span>₹{totalAmount}</span>

            </div>


            {/* =====================================
                NEW - GENERATE COUPON BUTTON
            ===================================== */}

            <button
              className="generate-coupon-btn"
              onClick={generateCoupon}
            >
              🎟️ Generate Coupon
            </button>


            {/* =====================================
                CHECKOUT
            ===================================== */}

            <button
              className="order-btn"
              onClick={() => {
                window.location.href = "/Checkout";
              }}
            >
              Place Order
            </button>


            {/* CLEAR CART */}

            <button
              className="clear-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>

          </div>

        </div>
      )}


      {/* =====================================
          NEW - COUPON POPUP
      ===================================== */}

      {showCouponPopup && generatedCoupon && (

        <div
          className="coupon-overlay"
          onClick={closeCouponPopup}
        >

          <div
            className="coupon-popup"
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE BUTTON */}

            <button
              className="coupon-close"
              onClick={closeCouponPopup}
            >
              ×
            </button>


            {/* SUCCESS ICON */}

            <div className="coupon-success-icon">
              🎉
            </div>


            <h2>
              Coupon Generated!
            </h2>


            <p className="coupon-subtitle">
              Congratulations! You unlocked a
              special discount.
            </p>


            {/* DISCOUNT */}

            <div className="coupon-discount">

              <strong>
                {generatedCoupon.discount}% OFF
              </strong>

              <span>
                On orders above ₹
                {generatedCoupon.minOrderAmount}
              </span>

            </div>


            {/* COUPON CODE */}

            <div className="coupon-code-box">

              <span>
                {generatedCoupon.code}
              </span>

              <button
                onClick={copyCoupon}
              >
                📋 Copy
              </button>

            </div>


            {/* VALID RESTAURANT */}

            <div className="coupon-info">

              <p>
                📍 <strong>Valid At:</strong>
              </p>

              <span>
                {generatedCoupon.restaurant}
              </span>

            </div>


            {/* VALID DATE */}

            <div className="coupon-info">

              <p>
                ⏰ <strong>Valid Until:</strong>
              </p>

              <span>
                {new Date(
                  generatedCoupon.validUntil
                ).toLocaleDateString("en-IN")}
              </span>

            </div>


            {/* NOTE */}

            <p className="coupon-note">
              Use this coupon during checkout to
              get your discount. 🎁
            </p>


            {/* DONE */}

            <button
              className="coupon-done-btn"
              onClick={closeCouponPopup}
            >
              Continue Shopping
            </button>

          </div>

        </div>

      )}


      <Footer></Footer>

    </div>
  );
}