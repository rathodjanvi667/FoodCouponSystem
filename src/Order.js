import React, { useState } from "react";
import "./Order.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Order() {
  // =============================
  // CART LOCAL STORAGE MATHI LO
  // =============================
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

  // =============================
  // CUSTOMER DETAILS
  // =============================
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // =============================
  // PAYMENT METHOD
  // =============================
  const [paymentMethod, setPaymentMethod] = useState("");

  // =============================
  // CLEAN PRICE
  // =============================
  // Handles:
  // 259
  // "259"
  // "₹259"
  // "₹1,299"
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

  // =============================
  // GET FOOD ID
  // =============================
  // Supports MongoDB _id and old id
  const getItemId = (item) => {
    return item._id || item.id;
  };

  // =============================
  // SUBTOTAL
  // =============================
  const subtotal = cart.reduce(
    (total, item) =>
      total +
      cleanPrice(item.price) *
        Number(item.quantity || 1),
    0
  );

  // =============================
  // DELIVERY FEE
  // =============================
  const deliveryFee = cart.length > 0 ? 40 : 0;

  // =============================
  // GST
  // =============================
  const gst = Math.round(subtotal * 0.05);

  // =============================
  // DISCOUNT
  // =============================
  // The coupon is generated AFTER
  // successful order, so no discount
  // is applied to the current order.
  const discount = 0;

  // =============================
  // FINAL TOTAL
  // =============================
  const total =
    subtotal +
    deliveryFee +
    gst -
    discount;

  // =============================
  // GENERATE COUPON CODE
  // =============================
  const generateCouponCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "";

    for (let i = 0; i < 6; i++) {
      code += characters.charAt(
        Math.floor(
          Math.random() * characters.length
        )
      );
    }

    return `SFC-${code}`;
  };

  // =============================
  // PLACE ORDER
  // =============================
  const placeOrder = (e) => {
    e.preventDefault();

    // =============================
    // CART EMPTY CHECK
    // =============================
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // =============================
    // CUSTOMER DETAILS VALIDATION
    // =============================
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

    // =============================
    // MOBILE VALIDATION
    // =============================
    if (!/^[0-9]{10}$/.test(mobile.trim())) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    // =============================
    // PINCODE VALIDATION
    // =============================
    if (!/^[0-9]{6}$/.test(pincode.trim())) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

    // =============================
    // PAYMENT VALIDATION
    // =============================
    if (paymentMethod === "") {
      alert("Please select payment method.");
      return;
    }

    // =============================
    // PREPARE ORDER ITEMS
    // =============================
    // Keep food data consistent.
    const orderItems = cart.map((item) => ({
      id: getItemId(item),
      _id: item._id || item.id,
      name: item.name,
      category: item.category,
      price: cleanPrice(item.price),
      quantity: Number(item.quantity || 1),
      image: item.image || ""
    }));

    // =============================
    // CREATE ORDER OBJECT
    // =============================
    const newOrder = {
      id: Date.now(),
      customer: name.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      items: orderItems,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      gst: gst,
      discount: discount,
      total: total,
      paymentMethod: paymentMethod,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    // =============================
    // GET OLD ORDERS
    // =============================
    const savedOrders =
      JSON.parse(
        localStorage.getItem("orders")
      ) || [];

    // =============================
    // SAVE NEW ORDER
    // =============================
    const updatedOrders = [
      ...savedOrders,
      newOrder
    ];

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

    // =============================
    // GENERATE COUPON
    // =============================
    const couponCode =
      generateCouponCode();

    // =============================
    // COUPON VALIDITY
    // =============================
    const validFrom = new Date();

    const validUntil = new Date(
      Date.now() +
        7 * 24 * 60 * 60 * 1000
    );

    // =============================
    // CREATE COUPON
    // =============================
    const newCoupon = {
      id: Date.now() + 1,
      code: couponCode,
      discount: 10,
      discountType: "percentage",
      minOrderAmount: 0,
      validFrom: validFrom.toISOString(),
      validUntil: validUntil.toISOString(),
      customer: name.trim(),
      mobile: mobile.trim(),
      orderId: newOrder.id,
      used: false,
      createdAt: new Date().toISOString()
    };

    // =============================
    // GET CUSTOMER COUPONS
    // =============================
    const savedCoupons =
      JSON.parse(
        localStorage.getItem(
          "customerCoupons"
        )
      ) || [];

    // =============================
    // SAVE CUSTOMER COUPON
    // =============================
    const updatedCoupons = [
      ...savedCoupons,
      newCoupon
    ];

    localStorage.setItem(
      "customerCoupons",
      JSON.stringify(updatedCoupons)
    );

    // =============================
    // SAVE LATEST COUPON
    // =============================
    // Order/Coupon page can use this
    // to show the newly generated coupon.
    localStorage.setItem(
      "latestCoupon",
      JSON.stringify(newCoupon)
    );

    // =============================
    // CLEAR CART
    // =============================
    localStorage.removeItem("foodCart");

    // =============================
    // UPDATE NAVBAR CART COUNT
    // =============================
    window.dispatchEvent(
      new Event("cartUpdated")
    );

    // =============================
    // SUCCESS MESSAGE
    // =============================
    alert(
      "🎉 ORDER PLACED SUCCESSFULLY! 🎉\n\n" +
      "Order ID: #" +
      newOrder.id +
      "\n\n" +
      "Total Amount: ₹" +
      total +
      "\n\n" +
      "🎁 CONGRATULATIONS! 🎁\n" +
      "You received a 10% OFF coupon!\n\n" +
      "Coupon Code: " +
      couponCode +
      "\n\n" +
      "Valid for 7 days.\n\n" +
      "Use this coupon on your next order!"
    );

    // =============================
    // GO TO MENU
    // =============================
    window.location.href = "/Menu";
  };

  // =============================
  // RETURN UI
  // =============================
  return (
    <div className="orderpage">
      <Navbar></Navbar>

//Hero
      <section className="orderhero">
        <h1>
          Complete Your Order
        </h1>

        <p>
          Review your order, enter your
          delivery details, and confirm
          your purchase.
        </p>
      </section>

      {/* =========================
          ORDER CONTAINER
      ========================== */}
      <section className="ordercontainer">

        {/* =========================
            ORDER SUMMARY
        ========================== */}
        <div className="ordersummery">
          <h2>
            Order Summary
          </h2>

          {cart.length === 0 ? (
            <div>
              <h3>
                Your cart is empty 🛒
              </h3>

              <p>
                Please add some food from
                the menu.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                className="ordercard"
                key={getItemId(item)}
              >
                {/* FOOD IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                />

                {/* FOOD DETAILS */}
                <div className="fooddetails">
                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    Category: {item.category}
                  </p>

                  <p>
                    Quantity: {item.quantity}
                  </p>
                </div>

                {/* ITEM PRICE */}
                <h3>
                  ₹
                  {cleanPrice(item.price) *
                    Number(item.quantity || 1)}
                </h3>
              </div>
            ))
          )}
        </div>

        {/* =========================
            DELIVERY DETAILS
        ========================== */}
        <div className="deliverydetails">
          <h2>
            Delivery Details
          </h2>

          <form onSubmit={placeOrder}>
            {/* FULL NAME */}
            <input
              type="text"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            {/* MOBILE */}
            <input
              type="text"
              placeholder="Enter Mobile No"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value)
              }
            />

            {/* ADDRESS */}
            <textarea
              placeholder="Enter Delivery Address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
            />

            {/* CITY */}
            <input
              type="text"
              placeholder="Enter Your City"
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
            />

            {/* STATE */}
            <input
              type="text"
              placeholder="Enter Your State"
              value={state}
              onChange={(e) =>
                setState(e.target.value)
              }
            />

            {/* PINCODE */}
            <input
              type="text"
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) =>
                setPincode(e.target.value)
              }
            />
          </form>
        </div>
      </section>

      {/* =========================
          PAYMENT
      ========================== */}
      <section className="paymentsection">
        <h2>
          Payment Method
        </h2>

        <div className="paymentoption">
          {/* CASH ON DELIVERY */}
          <label>
            <input
              type="radio"
              name="payment"
              value="Cash on Delivery"
              checked={
                paymentMethod ===
                "Cash on Delivery"
              }
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
            />

            Cash on Delivery
          </label>

          {/* UPI */}
          <label>
            <input
              type="radio"
              name="payment"
              value="UPI"
              checked={
                paymentMethod === "UPI"
              }
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
            />

            UPI
          </label>

          {/* CARD */}
          <label>
            <input
              type="radio"
              name="payment"
              value="Credit / Debit Card"
              checked={
                paymentMethod ===
                "Credit / Debit Card"
              }
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
            />

            Credit / Debit Card
          </label>
        </div>
      </section>

      {/* =========================
          BILL DETAILS
      ========================== */}
      <section className="billsection">
        <h2>
          Bill Details
        </h2>

        <div className="billbox">
          {/* SUBTOTAL */}
          <div>
            <span>
              Subtotal
            </span>

            <span>
              ₹{subtotal}
            </span>
          </div>

          {/* DELIVERY */}
          <div>
            <span>
              Delivery Fee
            </span>

            <span>
              ₹{deliveryFee}
            </span>
          </div>

          {/* GST */}
          <div>
            <span>
              GST
            </span>

            <span>
              ₹{gst}
            </span>
          </div>

          {/* DISCOUNT */}
          <div>
            <span>
              Discount
            </span>

            <span>
              -₹{discount}
            </span>
          </div>

          <hr />

          {/* FINAL TOTAL */}
          <div className="total">
            <span>
              Total
            </span>

            <span>
              ₹{total}
            </span>
          </div>
        </div>

        {/* =========================
            PLACE ORDER BUTTON
        ========================== */}
        <button
          className="placeorderbtn"
          onClick={placeOrder}
        >
          Place Order
        </button>
      </section>

      <Footer></Footer>
    </div>
  );
}