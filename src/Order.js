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
      return JSON.parse(savedCart);
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
  // SUBTOTAL
  // =============================

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
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

  // Coupon is generated AFTER the order.
  // Therefore no discount is applied
  // to this order.

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

      alert(
        "Please enter all delivery details."
      );

      return;
    }


    // =============================
    // PAYMENT VALIDATION
    // =============================

    if (paymentMethod === "") {

      alert(
        "Please select payment method."
      );

      return;
    }


    // =============================
    // CREATE ORDER OBJECT
    // =============================

    const newOrder = {

      id: Date.now(),

      customer: name,

      mobile: mobile,

      address: address,

      city: city,

      state: state,

      pincode: pincode,

      items: cart,

      subtotal: subtotal,

      deliveryFee: deliveryFee,

      gst: gst,

      discount: discount,

      total: total,

      paymentMethod: paymentMethod,

      status: "Pending",

      createdAt:
        new Date().toISOString()

    };


    // =============================
    // GET OLD ORDERS
    // =============================

    const savedOrders =
      JSON.parse(
        localStorage.getItem("orders")
      ) || [];


    // =============================
    // ADD NEW ORDER
    // =============================

    const updatedOrders = [

      ...savedOrders,

      newOrder

    ];


    // =============================
    // SAVE ORDERS
    // =============================

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );


    // =================================================
    // GENERATE COUPON AFTER SUCCESSFUL ORDER
    // =================================================

    const couponCode =
      generateCouponCode();


    // =============================
    // COUPON VALIDITY
    // =============================

    const validFrom =
      new Date();

    const validUntil =
      new Date(
        Date.now() +
        7 * 24 * 60 * 60 * 1000
      );


    // =============================
    // CREATE COUPON OBJECT
    // =============================

    const newCoupon = {

      id: Date.now() + 1,

      code: couponCode,

      discount: 10,

      discountType: "percentage",

      minOrderAmount: 0,

      validFrom:
        validFrom.toISOString(),

      validUntil:
        validUntil.toISOString(),

      customer: name,

      mobile: mobile,

      orderId: newOrder.id,

      used: false,

      createdAt:
        new Date().toISOString()

    };


    // =============================
    // GET OLD CUSTOMER COUPONS
    // =============================

    const savedCoupons =
      JSON.parse(
        localStorage.getItem(
          "customerCoupons"
        )
      ) || [];


    // =============================
    // ADD NEW COUPON
    // =============================

    const updatedCoupons = [

      ...savedCoupons,

      newCoupon

    ];


    // =============================
    // SAVE CUSTOMER COUPON
    // =============================

    localStorage.setItem(
      "customerCoupons",
      JSON.stringify(updatedCoupons)
    );


    // =============================
    // CLEAR CART
    // =============================

    localStorage.removeItem(
      "foodCart"
    );


    // =============================
    // NAVBAR CART COUNT UPDATE
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
    // GO BACK TO MENU
    // =============================

    window.location.href = "/Menu";

  };


  // =============================
  // RETURN UI
  // =============================

  return (

    <div className="orderpage">

      <Navbar />


      {/* =========================
          HERO
      ========================== */}

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
                key={item.id}
              >


                {/* Food Image */}

                <img
                  src={item.image}
                  alt={item.name}
                />


                {/* Food Details */}

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


                {/* Item Price */}

                <h3>

                  ₹
                  {
                    Number(item.price || 0) *
                    Number(item.quantity || 1)
                  }

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


            <input
              type="text"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />


            <input
              type="text"
              placeholder="Enter Mobile No"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value)
              }
            />


            <textarea
              placeholder="Enter Delivery Address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
            />


            <input
              type="text"
              placeholder="Enter Your City"
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
            />


            <input
              type="text"
              placeholder="Enter Your State"
              value={state}
              onChange={(e) =>
                setState(e.target.value)
              }
            />


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


      {/* =========================
          BILL DETAILS
      ========================== */}

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


      <Footer />

    </div>

  );
}