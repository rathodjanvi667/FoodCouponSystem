import React, { useState } from "react";
import "./Order.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const API_URL = "http://localhost:5000";

export default function Order() {
  // =====================================
  // CART
  // =====================================

  const [cart] = useState(() => {
    const savedCart = localStorage.getItem("foodCart");

    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error("Error loading cart:", error);
        return [];
      }
    }

    return [];
  });

  // =====================================
  // CUSTOMER DETAILS
  // =====================================

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  

  // =====================================
  // SUCCESS POPUP
  // =====================================

  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedCoupon, setGeneratedCoupon] = useState(null);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [generatedTotal, setGeneratedTotal] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // =====================================
  // CLEAN PRICE
  // =====================================

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

    return Number.isNaN(numberPrice) ? 0 : numberPrice;
  };

  // =====================================
  // GET ITEM ID
  // =====================================

  const getItemId = (item) => {
    return item._id || item.id;
  };

  // =====================================
  // SUBTOTAL
  // =====================================

  const subtotal = cart.reduce((total, item) => {
    const price = cleanPrice(item.price);
    const quantity = Number(item.quantity) || 1;

    return total + price * quantity;
  }, 0);

  // =====================================
  // DELIVERY FEE
  // =====================================

  const deliveryFee = cart.length > 0 ? 40 : 0;

  // =====================================
  // GST
  // =====================================

  const gst = Math.round(subtotal * 0.05);

  // =====================================
  // DISCOUNT
  // =====================================

  const discount = 0;

  // =====================================
  // FINAL TOTAL
  // =====================================

  const total =
    subtotal +
    deliveryFee +
    gst -
    discount;

  // =====================================
  // PLACE ORDER
  // =====================================

  const placeOrder = async (e) => {
    if (e) {
      e.preventDefault();
    }

    // Prevent double click
    if (isPlacingOrder) {
      return;
    }

    // Cart empty
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Customer validation
    if (
      name.trim() === "" ||
      mobile.trim() === "" ||
      address.trim() === "" ||
      city.trim() === "" ||
      state.trim() === "" ||
      pincode.trim() === ""
    ) {
      alert("Please enter all delivery details.");
      return;
    }

    // Mobile validation
    if (!/^[0-9]{10}$/.test(mobile.trim())) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Pincode validation
    if (!/^[0-9]{6}$/.test(pincode.trim())) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

    try {
      setIsPlacingOrder(true);

      // =====================================
      // ORDER ITEMS
      // =====================================

      const orderItems = cart.map((item) => ({
        _id: item._id || item.id,
        id: item.id || item._id,
        name: item.name,
        category: item.category || "",
        price: cleanPrice(item.price),
        quantity: Number(item.quantity || 1),
        image: item.image || "",
      }));

      // =====================================
      // CREATE ORDER
      // =====================================

      const orderResponse = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customer: name.trim(),
            mobile: mobile.trim(),
            address: address.trim(),
            city: city.trim(),
            state: state.trim(),
            pincode: pincode.trim(),

            items: orderItems,

            subtotal,
            deliveryFee,
            gst,
            discount,
            total,

            paymentMethod: "Cash on Delivery",

            couponCode: "",
          }),
        }
      );

      // =====================================
      // ORDER RESPONSE
      // =====================================

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(
          orderData.message ||
            "Failed to place order"
        );
      }

      // =====================================
      // SAVED ORDER
      // =====================================

      const savedOrder =
        orderData.order || orderData;

      const orderId =
        savedOrder.orderNumber ||
        savedOrder.id ||
        savedOrder._id;

      // =====================================
      // GENERATE COUPON
      // =====================================

      const couponResponse = await fetch(
        `${API_URL}/api/coupons/generate`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            items: orderItems,

            totalAmount: total,

            store: "Smart Food Coupon",

            customerName: name.trim(),

            customerMobile: mobile.trim(),

            orderId: orderId,
          }),
        }
      );

      // =====================================
      // COUPON RESPONSE
      // =====================================

      const couponData =
        await couponResponse.json();

      // =====================================
      // COUPON ERROR
      // =====================================

      if (!couponResponse.ok) {
        console.error(
          "Coupon generation failed:",
          couponData
        );

        localStorage.removeItem("foodCart");

        window.dispatchEvent(
          new Event("cartUpdated")
        );

        alert(
          "Order placed successfully, but coupon generation failed."
        );

        window.location.href = "/Menu";

        return;
      }

      // =====================================
      // GET COUPON
      // =====================================

      const coupon =
        couponData.coupon || couponData;

      if (!coupon || !coupon.code) {
        throw new Error(
          "Coupon was generated but coupon data was not received."
        );
      }

      // =====================================
      // SAVE CUSTOMER COUPON
      // =====================================

      const savedCustomerCoupons =
        JSON.parse(
          localStorage.getItem(
            "customerCoupons"
          )
        ) || [];

      const customerCoupons = [
        ...savedCustomerCoupons,
        coupon,
      ];

      localStorage.setItem(
        "customerCoupons",
        JSON.stringify(customerCoupons)
      );

      // =====================================
      // SAVE LATEST COUPON
      // =====================================

      localStorage.setItem(
        "latestCoupon",
        JSON.stringify(coupon)
      );

      // =====================================
      // CLEAR CART
      // =====================================

      localStorage.removeItem("foodCart");

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      // =====================================
      // SUCCESS DATA
      // =====================================

      setGeneratedCoupon(coupon);

      setGeneratedOrderId(orderId);

      setGeneratedTotal(
        Number(savedOrder.total || total)
      );

      // =====================================
      // SHOW SUCCESS
      // =====================================

      setShowSuccess(true);
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      alert(
        error.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // =====================================
  // CLOSE POPUP
  // =====================================

  const closeSuccessPopup = () => {
    setShowSuccess(false);

    window.location.href = "/Menu";
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="orderpage">
      <Navbar />

      {/* HERO */}

      <section className="orderhero">
        <div className="orderhero-content">
          <span className="orderhero-label">
            FOOD COUPON
          </span>

          <h1>
            Complete Your Order
          </h1>

          <p>
            Enter your details and place your
            order to receive your exclusive
            coupon.
          </p>
        </div>
      </section>

      {/* MAIN */}

      <section className="ordercontainer">

        {/* ORDER SUMMARY */}

        <div className="ordersummery">
          <div className="section-title">
            <span>YOUR CART</span>

            <h2>
              Order Summary
            </h2>
          </div>

          {cart.length === 0 ? (
            <div className="empty-order">
              <div className="empty-icon">
                🛒
              </div>

              <h3>
                Your cart is empty
              </h3>

              <p>
                Please add some food from
                the menu.
              </p>
            </div>
          ) : (
            <div className="order-items">
              {cart.map((item) => (
                <div
                  className="ordercard"
                  key={getItemId(item)}
                >
                  <div className="order-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/90x90?text=Food";
                        }}
                      />
                    ) : (
                      <div className="order-no-image">
                        🍽️
                      </div>
                    )}
                  </div>

                  <div className="fooddetails">
                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      {item.category ||
                        "Food Item"}
                    </p>

                    <span>
                      Qty:{" "}
                      {item.quantity || 1}
                    </span>
                  </div>

                  <strong className="item-price">
                    ₹
                    {cleanPrice(
                      item.price
                    ) *
                      Number(
                        item.quantity || 1
                      )}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DELIVERY DETAILS */}

        <div className="deliverydetails">
          <div className="section-title">
            <span>DELIVERY</span>

            <h2>
              Delivery Details
            </h2>
          </div>

          <form onSubmit={placeOrder}>
            <div className="form-group">
              <label>
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>
                Mobile Number
              </label>

              <input
                type="text"
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value)
                }
                maxLength="10"
              />
            </div>

            <div className="form-group">
              <label>
                Delivery Address
              </label>

              <textarea
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  City
                </label>

                <input
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  State
                </label>

                <input
                  type="text"
                  placeholder="Enter state"
                  value={state}
                  onChange={(e) =>
                    setState(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Pincode
              </label>

              <input
                type="text"
                placeholder="Enter 6-digit pincode"
                value={pincode}
                onChange={(e) =>
                  setPincode(e.target.value)
                }
                maxLength="6"
              />
            </div>
          </form>
        </div>
      </section>

      {/* PAYMENT */}

      <section className="paymentsection">
        <div className="section-title">
          <span>PAYMENT</span>

          <h2>
            Payment Method
          </h2>
        </div>

        <div className="paymentoption">
          <div className="cash-payment">
            <div className="cash-icon">
              ₹
            </div>

            <div>
              <strong>
                Cash on Delivery
              </strong>

              <p>
                Pay when your order is received.
              </p>
            </div>

            <div className="cash-selected">
              ✓
            </div>
          </div>
        </div>
      </section>

      {/* BILL */}

      <section className="billsection">
        <div className="section-title">
          <span>PAYMENT SUMMARY</span>

          <h2>
            Bill Details
          </h2>
        </div>

        <div className="billbox">
          <div>
            <span>
              Subtotal
            </span>

            <span>
              ₹{subtotal}
            </span>
          </div>

          <div>
            <span>
              Delivery Fee
            </span>

            <span>
              ₹{deliveryFee}
            </span>
          </div>

          <div>
            <span>
              GST
            </span>

            <span>
              ₹{gst}
            </span>
          </div>

          <div>
            <span>
              Discount
            </span>

            <span className="discount-price">
              -₹{discount}
            </span>
          </div>

          <hr />

          <div className="total">
            <span>
              Total Amount
            </span>

            <strong>
              ₹{total}
            </strong>
          </div>
        </div>

        <button
          type="button"
          className="placeorderbtn"
          onClick={placeOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder
            ? "Placing Order..."
            : "Place Order"}
        </button>

        <p className="order-note">
          🎁 After placing your order,
          you'll receive a special coupon.
        </p>
      </section>

      {/* SUCCESS POPUP */}

      {showSuccess &&
        generatedCoupon && (
          <div className="success-overlay">
            <div className="success-popup">

              <button
                className="success-close"
                onClick={closeSuccessPopup}
              >
                ×
              </button>

              <div className="success-icon">
                ✓
              </div>

              <h2>
                Order Placed!
              </h2>

              <p className="success-message">
                Your order has been placed
                successfully.
              </p>

              <div className="order-success-details">
                <div>
                  <span>
                    Order ID
                  </span>

                  <strong>
                    #{generatedOrderId}
                  </strong>
                </div>

                <div>
                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹{generatedTotal}
                  </strong>
                </div>
              </div>

              {/* GENERATED COUPON */}

              <div className="generated-coupon">
                <p>
                  🎁 Congratulations!
                </p>

                <h3>
                  You received a{" "}
                  {generatedCoupon.discount ||
                    20}
                  % OFF coupon
                </h3>

                <div className="coupon-code-display">
                  <span>
                    {generatedCoupon.code}
                  </span>
                </div>

                <small>
                  Valid until{" "}
                  {generatedCoupon.validUntil
                    ? new Date(
                        generatedCoupon.validUntil
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "7 days"}
                  {" "}• Use it on your
                  next order
                </small>
              </div>

              <button
                className="continue-btn"
                onClick={closeSuccessPopup}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      <Footer />
    </div>
  );
}