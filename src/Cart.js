import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Cart.css";

export default function Cart() {

  // PRICE FORMAT FIX 
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

  // GET FOOD ID
  // Supports both MongoDB _id and old id
  const getItemId = (item) => item._id || item.id;

  // LOAD CART FROM LOCAL STORAGE
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
        localStorage.setItem("foodCart", JSON.stringify(fixedCart));
        return fixedCart;
      } catch (error) {
        console.error("Error loading cart:", error);
        localStorage.removeItem("foodCart");
        return [];
      }
    }

    return [];
  });

  
  // SAVE CART
  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("foodCart", JSON.stringify(updatedCart));

    // Notify Navbar about cart changes
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // INCREASE QUANTITY
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

  // DECREASE QUANTITY
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

  // REMOVE ITEM
  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => getItemId(item) !== id
    );

    saveCart(updatedCart);
  };

  // CLEAR CART
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("foodCart");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // TOTAL ITEMS
  const totalItems = cart.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  // TOTAL AMOUNT
  const totalAmount = cart.reduce((total, item) => {
    const price = cleanPrice(item.price);
    const quantity = Number(item.quantity) || 1;

    return total + price * quantity;
  }, 0);

  
  return (
    <div className="cart-page">
      <Navbar></Navbar>

      {/* CART HEADER */}
      <div className="cart-header">
        <h1>My Cart 🛒</h1>
        <p>Review your food items before placing your order.</p>
      </div>

      {/* EMPTY CART */}
      {cart.length === 0 ? (
        <div className="empty-cart">
          <h2>Your Cart is Empty 🛒</h2>
          <p>Add some delicious food from the menu.</p>
        </div>
      ) : (
        <div className="cart-container">
          {/* CART ITEMS */}
          <div className="cart-items">
            <h2>Cart Items</h2>

            {cart.map((food) => {
              const foodId = getItemId(food);

              return (
                <div className="cart-item" key={foodId}>
                  {/* FOOD IMAGE */}
                  <img
                    src={food.image}
                    alt={food.name}
                  />

                  {/* FOOD DETAILS */}
                  <div className="cart-details">
                    <h3>{food.name}</h3>
                    <p>{food.category}</p>
                    <h4>₹{cleanPrice(food.price)}</h4>
                  </div>

                  {/* QUANTITY */}
                  <div className="quantity-box">
                    <button
                      onClick={() => decreaseQuantity(foodId)}
                    >
                      -
                    </button>

                    <span>{food.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(foodId)}
                    >
                      +
                    </button>
                  </div>

                  {/* ITEM TOTAL */}
                  <div className="item-total">
                    ₹{cleanPrice(food.price) * Number(food.quantity || 1)}
                  </div>

                  {/* REMOVE */}
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(foodId)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          {/* ORDER SUMMARY */}
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

            {/* CHECKOUT */}
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

      <Footer></Footer>
    </div>
  );
}