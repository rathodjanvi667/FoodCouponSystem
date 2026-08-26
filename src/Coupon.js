import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Coupon.css";

const API_URL = "http://localhost:5000/api/coupons";

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================
  // LOAD COUPONS FROM DATABASE + LOCAL STORAGE
  // =====================================
  const loadCoupons = async () => {
    try {
      setLoading(true);

      let databaseCoupons = [];

      // Load admin coupons from backend
      try {
        const response = await fetch(API_URL);

        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data)) {
            databaseCoupons = data;
          }
        }
      } catch (error) {
        console.error(
          "Database coupon loading error:",
          error
        );
      }

      // =====================================
      // LOAD CUSTOMER COUPONS
      // =====================================
      const savedCustomerCoupons =
        JSON.parse(
          localStorage.getItem("customerCoupons")
        ) || [];

      // =====================================
      // LOAD LATEST GENERATED COUPON
      // =====================================
      const latestCoupon =
        JSON.parse(
          localStorage.getItem("latestCoupon")
        );

      // Add latest coupon if it is not
      // already available in customerCoupons
      let customerCoupons = [
        ...savedCustomerCoupons
      ];

      if (
        latestCoupon &&
        !customerCoupons.some(
          (coupon) =>
            coupon.code === latestCoupon.code
        )
      ) {
        customerCoupons.push(latestCoupon);
      }

      // =====================================
      // COMBINE ALL COUPONS
      // =====================================
      const allCoupons = [
        ...databaseCoupons,
        ...customerCoupons
      ];

      setCoupons(allCoupons);
    } catch (error) {
      console.error(
        "Coupon loading error:",
        error
      );

      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOAD COUPONS WHEN PAGE OPENS
  // =====================================
  useEffect(() => {
    loadCoupons();
  }, []);

  // =====================================
  // GET DATE
  // =====================================
  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    );
  };

  // =====================================
  // GET TODAY'S DATE
  // =====================================
  const getToday = () => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return today;
  };

  // =====================================
  // CHECK COUPON STATUS
  // =====================================
  const getCouponStatus = (coupon) => {
    const today = getToday();

    if (!coupon.validFrom || !coupon.validUntil) {
      return "Valid";
    }

    const validFrom = new Date(
      coupon.validFrom
    );

    const validUntil = new Date(
      coupon.validUntil
    );

    validFrom.setHours(0, 0, 0, 0);
    validUntil.setHours(23, 59, 59, 999);

    if (today < validFrom) {
      return "Upcoming";
    }

    if (today > validUntil) {
      return "Expired";
    }

    return "Valid";
  };

  // =====================================
  // APPLY COUPON
  // =====================================
  const applyCoupon = (coupon) => {
    const status =
      getCouponStatus(coupon);

    if (status !== "Valid") {
      alert(
        "This coupon cannot be applied."
      );

      return;
    }

    localStorage.setItem(
      "selectedCoupon",
      JSON.stringify(coupon)
    );

    alert(
      `Coupon ${coupon.code} applied successfully! 🎉`
    );
  };

  // LOADING
  if (loading) {
    return (
      <div className="coupon-page">
        <Navbar />

        <div className="coupon-loading">
          <p>
            Loading coupons...
          </p>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="coupon-page">
      <Navbar></Navbar>

      {/* =================================
          PAGE HEADER
      ================================= */}
      <div className="coupon-page-header">
        <h1>
          Food Coupons 🎟️
        </h1>

        <p>
          Get exciting discounts on your favourite food
        </p>
      </div>

      {/* =================================
          NO COUPONS
      ================================= */}
      {coupons.length === 0 ? (
        <div className="no-coupons">
          <div className="no-coupon-icon">
            🎟️
          </div>

          <h2>
            No Coupons Available
          </h2>

          <p>
            New food coupons will appear here soon.
          </p>
        </div>
      ) : (
        /* =================================
           COUPON CONTAINER
        ================================= */
        <div className="coupon-container">
          {coupons.map((coupon, index) => {
            const status =
              getCouponStatus(coupon);

            const isValid =
              status === "Valid";

            // Support both:
            // discount and offer
            const discount =
              coupon.discount ||
              (
                coupon.offer
                  ? String(coupon.offer)
                      .replace("% OFF", "")
                  : 0
              );

            // Support different store fields
            const store =
              coupon.store ||
              coupon.validAt ||
              "Smart Food Coupon";

            // Support different coupon code fields
            const couponCode =
              coupon.code ||
              coupon.couponCode ||
              "N/A";

            return (
              <div
                className={`coupon-card ${
                  !isValid
                    ? "coupon-expired"
                    : ""
                }`}
                key={
                  coupon._id ||
                  coupon.id ||
                  couponCode ||
                  index
                }
              >
                {/* =================================
                    COUPON TOP
                ================================= */}
                <div className="coupon-top">
                  <div className="coupon-discount">
                    <span>
                      {discount}%
                    </span>

                    <small>
                      OFF
                    </small>
                  </div>

                  <div className="coupon-code">
                    <span>
                      CODE
                    </span>

                    <strong>
                      {couponCode}
                    </strong>
                  </div>
                </div>

                {/* =================================
                    COUPON CONTENT
                ================================= */}
                <div className="coupon-content">
                  <h3>
                    {store}
                  </h3>

                  <p>
                    {coupon.description ||
                      `Get ${discount}% OFF on your food order.`}
                  </p>

                  {/* =================================
                      MINIMUM ORDER
                  ================================= */}
                  <div className="coupon-info">
                    <span>
                      Minimum Order
                    </span>

                    <strong>
                      ₹
                      {coupon.minOrderAmount || 0}
                    </strong>
                  </div>

                  {/* =================================
                      VALID FROM
                  ================================= */}
                  <div className="coupon-info">
                    <span>
                      Valid From
                    </span>

                    <strong>
                      {formatDate(
                        coupon.validFrom
                      )}
                    </strong>
                  </div>

                  {/* =================================
                      VALID UNTIL
                  ================================= */}
                  <div className="coupon-info">
                    <span>
                      Valid Until
                    </span>

                    <strong>
                      {formatDate(
                        coupon.validUntil
                      )}
                    </strong>
                  </div>

                  {/* =================================
                      LOCATION
                  ================================= */}
                  <div className="coupon-location">
                    <span>
                      📍
                    </span>

                    <span>
                      Valid at
                    </span>

                    <strong>
                      {store}
                    </strong>
                  </div>

                  {/* =================================
                      STATUS
                  ================================= */}
                  <div className="coupon-status">
                    {status}
                  </div>

                  {/* =================================
                      APPLY BUTTON
                  ================================= */}
                  {isValid ? (
                    <button
                      type="button"
                      className="apply-coupon-btn"
                      onClick={() =>
                        applyCoupon(coupon)
                      }
                    >
                      Apply Coupon
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="apply-coupon-btn disabled"
                      disabled
                    >
                      {status === "Upcoming"
                        ? "Coming Soon"
                        : "Coupon Expired"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Footer></Footer>
    </div>
  );
}