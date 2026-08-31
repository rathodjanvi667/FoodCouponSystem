import React, { useState } from "react";
import "./Order.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const API_URL = "http://localhost:5000";

export default function Order() {

  // =====================================
  // CART FROM LOCAL STORAGE
  // =====================================

  const [cart] = useState(() => {

    const savedCart =
      localStorage.getItem("foodCart");

    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error(
          "Error loading cart:",
          error
        );

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
  // PAYMENT
  // =====================================

  const [paymentMethod, setPaymentMethod] =
    useState("");


  // =====================================
  // SUCCESS POPUP
  // =====================================

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [generatedCoupon, setGeneratedCoupon] =
    useState(null);

  const [generatedOrderId, setGeneratedOrderId] =
    useState("");

  const [generatedTotal, setGeneratedTotal] =
    useState(0);

  const [isPlacingOrder, setIsPlacingOrder] =
    useState(false);


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

    const cleanedPrice =
      String(price)
        .replace(/₹/g, "")
        .replace(/,/g, "")
        .trim();

    const numberPrice =
      Number(cleanedPrice);

    return Number.isNaN(numberPrice)
      ? 0
      : numberPrice;
  };


  // =====================================
  // GET FOOD ID
  // =====================================

  const getItemId = (item) => {
    return item._id || item.id;
  };


  // =====================================
  // SUBTOTAL
  // =====================================

  const subtotal = cart.reduce(
    (total, item) => {

      const price =
        cleanPrice(item.price);

      const quantity =
        Number(item.quantity) || 1;

      return total + price * quantity;

    },
    0
  );


  // =====================================
  // DELIVERY FEE
  // =====================================

  const deliveryFee =
    cart.length > 0 ? 40 : 0;


  // =====================================
  // GST
  // =====================================

  const gst =
    Math.round(subtotal * 0.05);


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


    // =====================================
    // PREVENT DOUBLE CLICK
    // =====================================

    if (isPlacingOrder) {
      return;
    }


    // =====================================
    // CART EMPTY
    // =====================================

    if (cart.length === 0) {

      alert(
        "Your cart is empty!"
      );

      return;
    }


    // =====================================
    // CUSTOMER VALIDATION
    // =====================================

    if (
      name.trim() === "" ||
      mobile.trim() === "" ||
      address.trim() === "" ||
      city.trim() === "" ||
      state.trim() === "" ||
      pincode.trim() === ""
    ) {

      alert(
        "Please enter all delivery details."
      );

      return;
    }


    // =====================================
    // MOBILE VALIDATION
    // =====================================

    if (
      !/^[0-9]{10}$/.test(
        mobile.trim()
      )
    ) {

      alert(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }


    // =====================================
    // PINCODE VALIDATION
    // =====================================

    if (
      !/^[0-9]{6}$/.test(
        pincode.trim()
      )
    ) {

      alert(
        "Please enter a valid 6-digit pincode."
      );

      return;
    }


    // =====================================
    // PAYMENT VALIDATION
    // =====================================

    if (paymentMethod === "") {

      alert(
        "Please select payment method."
      );

      return;
    }


    try {

      setIsPlacingOrder(true);


      // =====================================
      // PREPARE ORDER ITEMS
      // =====================================

      const orderItems =
        cart.map((item) => ({

          _id:
            item._id ||
            item.id,

          id:
            item.id ||
            item._id,

          name:
            item.name,

          category:
            item.category || "",

          price:
            cleanPrice(item.price),

          quantity:
            Number(
              item.quantity || 1
            ),

          image:
            item.image || ""

        }));


      // =====================================
      // CREATE ORDER IN MONGODB
      // =====================================

      const orderResponse =
        await fetch(
          `${API_URL}/api/orders`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              customer:
                name.trim(),

              mobile:
                mobile.trim(),

              address:
                address.trim(),

              city:
                city.trim(),

              state:
                state.trim(),

              pincode:
                pincode.trim(),

              items:
                orderItems,

              subtotal:
                subtotal,

              deliveryFee:
                deliveryFee,

              gst:
                gst,

              discount:
                discount,

              total:
                total,

              paymentMethod:
                paymentMethod,

              couponCode:
                ""

            })
          }
        );


      // =====================================
      // READ ORDER RESPONSE
      // =====================================

      const orderData =
        await orderResponse.json();


      // =====================================
      // ORDER API ERROR
      // =====================================

      if (!orderResponse.ok) {

        throw new Error(
          orderData.message ||
          "Failed to place order"
        );

      }


      // =====================================
      // GET SAVED ORDER
      // =====================================

      const savedOrder =
        orderData.order ||
        orderData;


      // =====================================
      // CHECK ORDER ID
      // =====================================

      const orderId =
        savedOrder.orderNumber ||
        savedOrder.id ||
        savedOrder._id;


      // =====================================
      // GENERATE CUSTOMER COUPON
      // =====================================

      const couponResponse =
        await fetch(
          `${API_URL}/api/coupons/generate`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              items:
                orderItems,

              totalAmount:
                total,

              store:
                "Smart Food Coupon",

              customerName:
                name.trim(),

              customerMobile:
                mobile.trim(),

              orderId:
                orderId

            })
          }
        );


      // =====================================
      // READ COUPON RESPONSE
      // =====================================

      const couponData =
        await couponResponse.json();


      // =====================================
      // COUPON API ERROR
      // =====================================

      if (!couponResponse.ok) {

        console.error(
          "Coupon generation failed:",
          couponData
        );


        localStorage.removeItem(
          "foodCart"
        );


        window.dispatchEvent(
          new Event("cartUpdated")
        );


        alert(
          "Order placed successfully, but coupon generation failed."
        );


        window.location.href =
          "/Menu";


        return;
      }


      // =====================================
      // GET GENERATED COUPON
      // =====================================
      // Supports:
      // 1. { coupon: {...} }
      // 2. direct {...}

      const coupon =
        couponData.coupon ||
        couponData;


      // =====================================
      // CHECK COUPON
      // =====================================

      if (
        !coupon ||
        !coupon.code
      ) {

        throw new Error(
          "Coupon was generated but coupon data was not received."
        );

      }


      // =====================================
      // SAVE CUSTOMER COUPON LOCALLY
      // =====================================

      const savedCustomerCoupons =
        JSON.parse(
          localStorage.getItem(
            "customerCoupons"
          )
        ) || [];


      const customerCoupons = [
        ...savedCustomerCoupons,
        coupon
      ];


      localStorage.setItem(
        "customerCoupons",
        JSON.stringify(
          customerCoupons
        )
      );


      // =====================================
      // SAVE LATEST COUPON
      // =====================================

      localStorage.setItem(
        "latestCoupon",
        JSON.stringify(
          coupon
        )
      );


      // =====================================
      // CLEAR CART
      // =====================================

      localStorage.removeItem(
        "foodCart"
      );


      // =====================================
      // UPDATE NAVBAR
      // =====================================

      window.dispatchEvent(
        new Event("cartUpdated")
      );


      // =====================================
      // SUCCESS DATA
      // =====================================

      setGeneratedCoupon(
        coupon
      );


      setGeneratedOrderId(
        orderId
      );


      setGeneratedTotal(
        Number(
          savedOrder.total ||
          total
        )
      );


      // =====================================
      // SHOW SUCCESS POPUP
      // =====================================

      setShowSuccess(true);

    }

    catch (error) {

      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      alert(
        error.message ||
        "Something went wrong while placing your order."
      );

    }

    finally {

      setIsPlacingOrder(false);

    }

  };


  // =====================================
  // CLOSE SUCCESS POPUP
  // =====================================

  const closeSuccessPopup = () => {

    setShowSuccess(false);

    window.location.href =
      "/Menu";

  };


  // =====================================
  // UI
  // =====================================

  return (

    <div className="orderpage">

      <Navbar />


      {/* =====================================
          HERO
      ===================================== */}

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


      {/* =====================================
          ORDER CONTAINER
      ===================================== */}

      <section className="ordercontainer">


        {/* =====================================
            ORDER SUMMARY
        ===================================== */}

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
                Please add some food
                from the menu.
              </p>

            </div>

          ) : (

            cart.map((item) => (

              <div
                className="ordercard"
                key={getItemId(item)}
              >

                {/* FOOD IMAGE */}

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


                {/* FOOD DETAILS */}

                <div className="fooddetails">

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    Category:{" "}
                    {item.category}
                  </p>

                  <p>
                    Quantity:{" "}
                    {item.quantity}
                  </p>

                </div>


                {/* ITEM PRICE */}

                <h3>

                  ₹
                  {cleanPrice(
                    item.price
                  ) *
                    Number(
                      item.quantity || 1
                    )}

                </h3>

              </div>

            ))

          )}

        </div>


        {/* =====================================
            DELIVERY DETAILS
        ===================================== */}

        <div className="deliverydetails">

          <h2>
            Delivery Details
          </h2>


          <form
            onSubmit={placeOrder}
          >

            <input
              type="text"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />


            <input
              type="text"
              placeholder="Enter Mobile No"
              value={mobile}
              onChange={(e) =>
                setMobile(
                  e.target.value
                )
              }
            />


            <textarea
              placeholder="Enter Delivery Address"
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
            />


            <input
              type="text"
              placeholder="Enter Your City"
              value={city}
              onChange={(e) =>
                setCity(
                  e.target.value
                )
              }
            />


            <input
              type="text"
              placeholder="Enter Your State"
              value={state}
              onChange={(e) =>
                setState(
                  e.target.value
                )
              }
            />


            <input
              type="text"
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) =>
                setPincode(
                  e.target.value
                )
              }
            />

          </form>

        </div>

      </section>


      {/* =====================================
          PAYMENT
      ===================================== */}

      <section className="paymentsection">

        <h2>
          Payment Method
        </h2>


        <div className="paymentoption">

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


      {/* =====================================
          BILL DETAILS
      ===================================== */}

      <section className="billsection">

        <h2>
          Bill Details
        </h2>


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

            <span>
              -₹{discount}
            </span>

          </div>


          <hr />


          <div className="total">

            <span>
              Total
            </span>

            <span>
              ₹{total}
            </span>

          </div>

        </div>


        {/* =====================================
            PLACE ORDER
        ===================================== */}

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

      </section>


      {/* =====================================
          SUCCESS POPUP
      ===================================== */}

      {showSuccess &&
        generatedCoupon && (

          <div className="success-overlay">

            <div className="success-popup">


              {/* SUCCESS ICON */}

              <div className="success-icon">
                ✓
              </div>


              {/* SUCCESS TITLE */}

              <h2>
                Order Placed Successfully!
              </h2>


              <p className="success-message">

                Thank you for ordering
                with Smart Food Coupon.

              </p>


              {/* =================================
                  ORDER DETAILS
              ================================= */}

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


              {/* =================================
                  GENERATED COUPON
              ================================= */}

              <div className="generated-coupon">

                <p>
                  🎁 Congratulations!
                </p>


                <h3>

                  You received a{" "}

                  {generatedCoupon.discount || 20}

                  % OFF coupon

                </h3>


                {/* COUPON CODE */}

                <div className="coupon-code-display">

                  <span>
                    {generatedCoupon.code}
                  </span>

                </div>


                {/* VALIDITY */}

                <small>

                  Valid until{" "}

                  {generatedCoupon.validUntil
                    ? new Date(
                        generatedCoupon.validUntil
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "7 days"}

                  {" "}• Use it on your next order

                </small>

              </div>


              {/* =================================
                  CONTINUE SHOPPING
              ================================= */}

              <button
                className="continue-btn"
                onClick={
                  closeSuccessPopup
                }
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