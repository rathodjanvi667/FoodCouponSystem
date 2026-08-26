import React, { useEffect, useState } from "react";
import "./Coupon.css";

const API_URL = "http://localhost:5000/api/coupons";

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================
  // LOAD COUPONS FROM DATABASE
  // =====================================

  const loadCoupons = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load coupons");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setCoupons(data);
      } else {
        setCoupons([]);
      }
    } catch (error) {
      console.error("Coupon loading error:", error);
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
  // GET TODAY'S DATE
  // =====================================

  const getToday = () => {
    return new Date().toISOString().split("T")[0];
  };

  // =====================================
  // CHECK COUPON STATUS
  // =====================================

  const getCouponStatus = (coupon) => {
    const today = getToday();

    if (today < coupon.validFrom) {
      return "Upcoming";
    }

    if (today > coupon.validUntil) {
      return "Expired";
    }

    return "Valid";
  };

  // =====================================
  // APPLY COUPON
  // =====================================

  const applyCoupon = (coupon) => {
    localStorage.setItem(
      "selectedCoupon",
      JSON.stringify(coupon)
    );

    alert(
      `Coupon ${coupon.code} applied successfully! 🎉`
    );
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="coupon-page">
        <div className="coupon-loading">
          <p>Loading coupons...</p>
        </div>
      </div>
    );
  }

  // =====================================
  // JSX
  // =====================================

  return (
    <div className="coupon-page">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <div className="coupon-page-header">

        <h1>Food Coupons</h1>

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

          {coupons.map((coupon) => {

            const status =
              getCouponStatus(coupon);

            const isValid =
              status === "Valid";

            return (

              <div
                className={`coupon-card ${
                  !isValid
                    ? "coupon-expired"
                    : ""
                }`}
                key={coupon._id}
              >

                {/* =================================
                    COUPON TOP
                ================================= */}

                <div className="coupon-top">

                  <div className="coupon-discount">

                    <span>
                      {coupon.discount}%
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
                      {coupon.code}
                    </strong>

                  </div>

                </div>


                {/* =================================
                    COUPON CONTENT
                ================================= */}

                <div className="coupon-content">

                  <h3>
                    {coupon.store}
                  </h3>

                  <p>
                    {coupon.description ||
                      `Get ${coupon.discount}% OFF on your food order.`}
                  </p>


                  {/* =================================
                      MINIMUM ORDER
                  ================================= */}

                  <div className="coupon-info">

                    <span>
                      Minimum Order
                    </span>

                    <strong>
                      ₹{coupon.minOrderAmount || 0}
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
                      {coupon.validFrom}
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
                      {coupon.validUntil}
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
                      {coupon.store}
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

    </div>
  );
}