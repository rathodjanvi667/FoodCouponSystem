<<<<<<< HEAD
import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Cart.css";

export default function Cart() {

  // --------------------------------
  // PRICE FORMAT FIX
  // --------------------------------

  const cleanPrice = (price) => {

    if (typeof price === "number") {
      return price;
    }

    if (!price) {
      return 0;
    }

    // ₹259, "₹259", "259", "₹1,299" badha handle karse
    const cleanedPrice = String(price)
      .replace(/₹/g, "")
      .replace(/,/g, "")
      .trim();

    const numberPrice = Number(cleanedPrice);

    return isNaN(numberPrice) ? 0 : numberPrice;
  };


  // --------------------------------
  // LOAD CART
  // --------------------------------

  const [cart, setCart] = useState(() => {

    const savedCart = localStorage.getItem("foodCart");

    if (savedCart) {

      const oldCart = JSON.parse(savedCart);

      // Old cart na price ne number ma convert karo
      const fixedCart = oldCart.map((item) => ({
        ...item,
        price: cleanPrice(item.price),
        quantity: Number(item.quantity) || 1
      }));

      // Fixed cart fari localStorage ma save karo
      localStorage.setItem(
        "foodCart",
        JSON.stringify(fixedCart)
      );

      return fixedCart;
    }

    return [];
  });


  // --------------------------------
  // SAVE CART
  // --------------------------------

  const saveCart = (updatedCart) => {

    setCart(updatedCart);

    localStorage.setItem(
      "foodCart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };


  // --------------------------------
  // INCREASE QUANTITY
  // --------------------------------

  const increaseQuantity = (id) => {

    const updatedCart = cart.map((item) => {

      if (item.id === id) {

        return {
          ...item,
          price: cleanPrice(item.price),
          quantity: Number(item.quantity) + 1
        };

      }

      return item;
    });

    saveCart(updatedCart);
  };


  // --------------------------------
  // DECREASE QUANTITY
  // --------------------------------

  const decreaseQuantity = (id) => {

    const updatedCart = cart
      .map((item) => {

        if (item.id === id) {

          return {
            ...item,
            price: cleanPrice(item.price),
            quantity: Number(item.quantity) - 1
          };

        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  };


  // --------------------------------
  // REMOVE ITEM
  // --------------------------------

  const removeItem = (id) => {

    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    saveCart(updatedCart);
  };


  // --------------------------------
  // CLEAR CART
  // --------------------------------

  const clearCart = () => {

    setCart([]);

    localStorage.removeItem("foodCart");

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };


  // --------------------------------
  // TOTAL ITEMS
  // --------------------------------

  const totalItems = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );


  // --------------------------------
  // TOTAL AMOUNT
  // --------------------------------

  const totalAmount = cart.reduce(
    (total, item) => {

      const price = cleanPrice(item.price);
      const quantity = Number(item.quantity) || 1;

      return total + price * quantity;
    },

    0
  );


  return (

    <div className="cart-page">

      <Navbar />


      {/* Header */}

      <div className="cart-header">

        <h1>My Cart 🛒</h1>

        <p>
          Review your food items before placing your order.
        </p>

      </div>


      {/* Empty Cart */}

      {cart.length === 0 ? (

        <div className="empty-cart">

          <h2>
            Your Cart is Empty 🛒
          </h2>

          <p>
            Add some delicious food from the menu.
          </p>

        </div>

      ) : (

        <div className="cart-container">


          {/* CART ITEMS */}

          <div className="cart-items">

            <h2>
              Cart Items
            </h2>


            {cart.map((food) => (

              <div
                className="cart-item"
                key={food.id}
              >

                {/* Food Image */}

                <img
                  src={food.image}
                  alt={food.name}
                />


                {/* Food Details */}

                <div className="cart-details">

                  <h3>
                    {food.name}
                  </h3>

                  <p>
                    {food.category}
                  </p>

                  <h4>
                    ₹{cleanPrice(food.price)}
                  </h4>

                </div>


                {/* Quantity */}

                <div className="quantity-box">

                  <button
                    onClick={() =>
                      decreaseQuantity(food.id)
                    }
                  >
                    -
                  </button>


                  <span>
                    {food.quantity}
                  </span>


                  <button
                    onClick={() =>
                      increaseQuantity(food.id)
                    }
                  >
                    +
                  </button>

                </div>


                {/* Item Total */}

                <div className="item-total">

                  ₹
                  {
                    cleanPrice(food.price) *
                    Number(food.quantity || 1)
                  }

                </div>


                {/* Remove */}

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeItem(food.id)
                  }
                >
                  Remove
                </button>

              </div>

            ))}

          </div>


          {/* ORDER SUMMARY */}

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>


            <div className="summary-row">

              <span>
                Items
              </span>

              <span>
                {totalItems}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹{totalAmount}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span>
                FREE
              </span>

            </div>


            <hr />


            <div className="total-row">

              <span>
                Total
              </span>

              <span>
                ₹{totalAmount}
              </span>

            </div>


            {/* Place Order */}

            <button
              className="order-btn"
              onClick={() => {
                window.location.href = "/Checkout";
              }}
            >
              Place Order
            </button>


            {/* Clear Cart */}

            <button
              className="clear-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>

          </div>

        </div>

      )}


      <Footer />

    </div>
  );
=======
import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Cart.css";

export default function Cart() {

  // --------------------------------
  // PRICE FORMAT FIX
  // --------------------------------

  const cleanPrice = (price) => {

    if (typeof price === "number") {
      return price;
    }

    if (!price) {
      return 0;
    }

    // ₹259, "₹259", "259", "₹1,299" badha handle karse
    const cleanedPrice = String(price)
      .replace(/₹/g, "")
      .replace(/,/g, "")
      .trim();

    const numberPrice = Number(cleanedPrice);

    return isNaN(numberPrice) ? 0 : numberPrice;
  };


  // --------------------------------
  // LOAD CART
  // --------------------------------

  const [cart, setCart] = useState(() => {

    const savedCart = localStorage.getItem("foodCart");

    if (savedCart) {

      const oldCart = JSON.parse(savedCart);

      // Old cart na price ne number ma convert karo
      const fixedCart = oldCart.map((item) => ({
        ...item,
        price: cleanPrice(item.price),
        quantity: Number(item.quantity) || 1
      }));

      // Fixed cart fari localStorage ma save karo
      localStorage.setItem(
        "foodCart",
        JSON.stringify(fixedCart)
      );

      return fixedCart;
    }

    return [];
  });


  // --------------------------------
  // SAVE CART
  // --------------------------------

  const saveCart = (updatedCart) => {

    setCart(updatedCart);

    localStorage.setItem(
      "foodCart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };


  // --------------------------------
  // INCREASE QUANTITY
  // --------------------------------

  const increaseQuantity = (id) => {

    const updatedCart = cart.map((item) => {

      if (item.id === id) {

        return {
          ...item,
          price: cleanPrice(item.price),
          quantity: Number(item.quantity) + 1
        };

      }

      return item;
    });

    saveCart(updatedCart);
  };


  // --------------------------------
  // DECREASE QUANTITY
  // --------------------------------

  const decreaseQuantity = (id) => {

    const updatedCart = cart
      .map((item) => {

        if (item.id === id) {

          return {
            ...item,
            price: cleanPrice(item.price),
            quantity: Number(item.quantity) - 1
          };

        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  };


  // --------------------------------
  // REMOVE ITEM
  // --------------------------------

  const removeItem = (id) => {

    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    saveCart(updatedCart);
  };


  // --------------------------------
  // CLEAR CART
  // --------------------------------

  const clearCart = () => {

    setCart([]);

    localStorage.removeItem("foodCart");

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };


  // --------------------------------
  // TOTAL ITEMS
  // --------------------------------

  const totalItems = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );


  // --------------------------------
  // TOTAL AMOUNT
  // --------------------------------

  const totalAmount = cart.reduce(
    (total, item) => {

      const price = cleanPrice(item.price);
      const quantity = Number(item.quantity) || 1;

      return total + price * quantity;
    },

    0
  );


  return (

    <div className="cart-page">

      <Navbar />


      {/* Header */}

      <div className="cart-header">

        <h1>My Cart 🛒</h1>

        <p>
          Review your food items before placing your order.
        </p>

      </div>


      {/* Empty Cart */}

      {cart.length === 0 ? (

        <div className="empty-cart">

          <h2>
            Your Cart is Empty 🛒
          </h2>

          <p>
            Add some delicious food from the menu.
          </p>

        </div>

      ) : (

        <div className="cart-container">


          {/* CART ITEMS */}

          <div className="cart-items">

            <h2>
              Cart Items
            </h2>


            {cart.map((food) => (

              <div
                className="cart-item"
                key={food.id}
              >

                {/* Food Image */}

                <img
                  src={food.image}
                  alt={food.name}
                />


                {/* Food Details */}

                <div className="cart-details">

                  <h3>
                    {food.name}
                  </h3>

                  <p>
                    {food.category}
                  </p>

                  <h4>
                    ₹{cleanPrice(food.price)}
                  </h4>

                </div>


                {/* Quantity */}

                <div className="quantity-box">

                  <button
                    onClick={() =>
                      decreaseQuantity(food.id)
                    }
                  >
                    -
                  </button>


                  <span>
                    {food.quantity}
                  </span>


                  <button
                    onClick={() =>
                      increaseQuantity(food.id)
                    }
                  >
                    +
                  </button>

                </div>


                {/* Item Total */}

                <div className="item-total">

                  ₹
                  {
                    cleanPrice(food.price) *
                    Number(food.quantity || 1)
                  }

                </div>


                {/* Remove */}

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeItem(food.id)
                  }
                >
                  Remove
                </button>

              </div>

            ))}

          </div>


          {/* ORDER SUMMARY */}

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>


            <div className="summary-row">

              <span>
                Items
              </span>

              <span>
                {totalItems}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹{totalAmount}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span>
                FREE
              </span>

            </div>


            <hr />


            <div className="total-row">

              <span>
                Total
              </span>

              <span>
                ₹{totalAmount}
              </span>

            </div>


            {/* Place Order */}

            <button
              className="order-btn"
              onClick={() => {
                window.location.href = "/Checkout";
              }}
            >
              Place Order
            </button>


            {/* Clear Cart */}

            <button
              className="clear-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>

          </div>

        </div>

      )}


      <Footer />

    </div>
  );
>>>>>>> d7d75d0c97c1411ad7577eb2a6a19c4a9078d035
}