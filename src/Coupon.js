import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Coupon.css";

import {
  FaTicketAlt,
  FaStore,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaShoppingBag,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCopy,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api/coupons";
const SERVER_URL = "http://localhost:5000";

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD COUPONS
  // =====================================================

  const loadCoupons = async () => {
    try {
      setLoading(true);

      // Coupons from database
      const response = await fetch(API_URL);
      const data = await response.json();

      const databaseCoupons = Array.isArray(data) ? data : [];

      // Customer generated coupons
      const customerCoupons =
        JSON.parse(localStorage.getItem("customerCoupons")) || [];

      // Latest generated coupon
      const latestCoupon =
        JSON.parse(localStorage.getItem("latestCoupon")) || null;

      let allCoupons = [...databaseCoupons, ...customerCoupons];

      // Add latest generated coupon if it is not already present
      if (latestCoupon) {
        const alreadyExists = allCoupons.some(
          (coupon) =>
            (coupon.code || coupon.couponCode) ===
            (latestCoupon.code || latestCoupon.couponCode)
        );

        if (!alreadyExists) {
          allCoupons.push(latestCoupon);
        }
      }

      // Remove duplicate coupons
      const uniqueCoupons = allCoupons.filter((coupon, index, array) => {
        const couponId =
          coupon.code ||
          coupon.couponCode ||
          coupon._id ||
          coupon.id;

        return (
          index ===
          array.findIndex((item) => {
            const itemId =
              item.code ||
              item.couponCode ||
              item._id ||
              item.id;

            return itemId === couponId;
          })
        );
      });

      setCoupons(uniqueCoupons);
    } catch (error) {
      console.error("Error loading coupons:", error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // TODAY
  // =====================================================

  const getToday = () => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return today;
  };

  // =====================================================
  // COUPON STATUS
  // =====================================================

  const getCouponStatus = (coupon) => {
    if (!coupon.validFrom && !coupon.validUntil) {
      return "Valid";
    }

    const today = getToday();

    let startDate = coupon.validFrom
      ? new Date(coupon.validFrom)
      : null;

    let endDate = coupon.validUntil
      ? new Date(coupon.validUntil)
      : null;

    if (startDate) {
      startDate.setHours(0, 0, 0, 0);
    }

    if (endDate) {
      endDate.setHours(23, 59, 59, 999);
    }

    if (startDate && today < startDate) {
      return "Upcoming";
    }

    if (endDate && today > endDate) {
      return "Expired";
    }

    return "Valid";
  };

  // =====================================================
  // DISCOUNT NUMBER
  // =====================================================

  const getDiscountNumber = (coupon) => {
    if (coupon.discount !== undefined && coupon.discount !== null) {
      return coupon.discount;
    }

    if (coupon.offer) {
      const match = String(coupon.offer).match(/\d+/);

      if (match) {
        return match[0];
      }
    }

    return "—";
  };

  // =====================================================
  // DISCOUNT TEXT
  // =====================================================

  const getDiscountText = (coupon) => {
    if (coupon.offer) {
      return coupon.offer;
    }

    if (coupon.discount !== undefined && coupon.discount !== null) {
      return `${coupon.discount}% OFF`;
    }

    return "SPECIAL OFFER";
  };

  // =====================================================
  // STORE
  // =====================================================

  const getStore = (coupon) => {
    return (
      coupon.store ||
      coupon.validAt ||
      coupon.restaurant ||
      "All Restaurants"
    );
  };

  // =====================================================
  // COUPON CODE
  // =====================================================

  const getCouponCode = (coupon) => {
    return coupon.code || coupon.couponCode || "N/A";
  };

  // =====================================================
  // MINIMUM ORDER
  // =====================================================

  const getMinimumOrder = (coupon) => {
    return coupon.minOrderAmount || coupon.minAmount || 0;
  };

  // =====================================================
  // COUPON IMAGE
  // =====================================================

  const getCouponImage = (coupon) => {
    const image =
      coupon.image ||
      coupon.imageUrl ||
      coupon.foodImage ||
      coupon.restaurantImage;

    if (!image) {
      return null;
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${SERVER_URL}/${image.replace(/^\/+/, "")}`;
  };

  // =====================================================
  // FOOD EMOJI
  // =====================================================

  const getFoodEmoji = (coupon) => {
    const text = `
      ${coupon.title || ""}
      ${coupon.name || ""}
      ${coupon.description || ""}
      ${getStore(coupon)}
    `.toLowerCase();

    if (text.includes("pizza")) return "🍕";
    if (text.includes("burger")) return "🍔";
    if (text.includes("pasta")) return "🍝";
    if (text.includes("noodle")) return "🍜";
    if (text.includes("soup")) return "🍲";
    if (text.includes("dumpling")) return "🥟";
    if (text.includes("drink")) return "🥤";
    if (text.includes("dessert")) return "🍰";

    return "🍽️";
  };

  // =====================================================
  // COPY COUPON
  // =====================================================

  const copyCouponCode = async (coupon) => {
    const code = getCouponCode(coupon);

    try {
      await navigator.clipboard.writeText(code);

      alert(`Coupon code ${code} copied!`);
    } catch (error) {
      alert(`Coupon Code: ${code}`);
    }
  };

  // =====================================================
  // APPLY COUPON
  // =====================================================

  const applyCoupon = (coupon) => {
    const status = getCouponStatus(coupon);

    if (status !== "Valid") {
      return;
    }

    localStorage.setItem(
      "selectedCoupon",
      JSON.stringify(coupon)
    );

    alert(
      `Coupon ${getCouponCode(coupon)} applied successfully!`
    );
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    if (status === "Valid") {
      return <FaCheckCircle />;
    }

    if (status === "Upcoming") {
      return <FaClock />;
    }

    return <FaTimesCircle />;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="coupon-page">
        <Navbar />

        <div className="coupon-loading">
          <div className="coupon-loader"></div>

          <h3>Finding Best Deals...</h3>

          <p>
            Please wait while we load the latest coupons.
          </p>
        </div>

        <Footer />
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="coupon-page">
      <Navbar />

      {/* =================================================
          HERO
      ================================================= */}

      <section className="coupon-page-header">
        <div className="coupon-hero-content">

          <div className="coupon-hero-icon">
            <FaTicketAlt />
          </div>

          <div>
            <div className="coupon-hero-label">
              FOOD COUPONS
            </div>

            <h1>Save More. Eat More.</h1>

            <p>
              Discover the best food deals and exclusive
              restaurant coupons.
            </p>
          </div>

        </div>
      </section>

      {/* =================================================
          COUPONS
      ================================================= */}

      <section className="coupon-section">

        <div className="coupon-section-heading">

          <div className="coupon-section-label">
            EXCLUSIVE DEALS
          </div>

          <h2>Today's Best Coupons</h2>

          <p>
            Grab your favourite food at a better price.
          </p>

          <div className="coupon-count">
            {coupons.length} Coupons Available
          </div>

        </div>

        {/* =================================================
            NO COUPONS
        ================================================= */}

        {coupons.length === 0 ? (
          <div className="no-coupons">

            <div className="no-coupon-icon">
              <FaTicketAlt />
            </div>

            <h3>No Coupons Available</h3>

            <p>
              There are currently no coupons available.
              Please check again later.
            </p>

          </div>
        ) : (

          /* =================================================
             COUPON GRID
          ================================================= */

          <div className="coupon-grid">

            {coupons.map((coupon, index) => {

              const status = getCouponStatus(coupon);
              const discountNumber =
                getDiscountNumber(coupon);

              const discountText =
                getDiscountText(coupon);

              const store = getStore(coupon);
              const code = getCouponCode(coupon);

              const minimumOrder =
                getMinimumOrder(coupon);

              const image = getCouponImage(coupon);

              const emoji = getFoodEmoji(coupon);

              return (
                <div
                  className={`food-ticket ticket-${index % 5} ${status.toLowerCase()}`}
                  key={
                    coupon._id ||
                    coupon.id ||
                    coupon.code ||
                    coupon.couponCode ||
                    index
                  }
                >

                  {/* =========================================
                      DISCOUNT
                  ========================================= */}

                  <div className="ticket-discount">

                    <div>
                      <strong>
                        {discountNumber}
                      </strong>

                      <span>
                        {coupon.discount
                          ? "% OFF"
                          : "DEAL"}
                      </span>
                    </div>

                    <code>
                      {code}
                    </code>

                  </div>


                  {/* =========================================
                      PERFORATION
                  ========================================= */}

                  <div className="ticket-perforation"></div>


                  {/* =========================================
                      CONTENT
                  ========================================= */}

                  <div className="ticket-content">

                    <div className="ticket-status-row">

                      <div
                        className={`ticket-status ${status.toLowerCase()}`}
                      >
                        {getStatusIcon(status)}

                        <span>
                          {status}
                        </span>
                      </div>

                    </div>


                    <h3>
                      {discountText}
                    </h3>


                    <div className="ticket-store">
                      <FaStore />

                      <span>
                        {store}
                      </span>
                    </div>


                    <p className="ticket-description">
                      {coupon.description ||
                        "Enjoy this exclusive food coupon and save on your order."}
                    </p>


                    {/* =========================================
                        INFO
                    ========================================= */}

                    <div className="ticket-info-row">

                      <div className="ticket-info">

                        <small>
                          <FaMapMarkerAlt /> VALID AT
                        </small>

                        <span>
                          {store}
                        </span>

                      </div>


                      <div className="ticket-info">

                        <small>
                          <FaShoppingBag /> MIN ORDER
                        </small>

                        <span>
                          ₹{minimumOrder}
                        </span>

                      </div>

                    </div>


                    {/* =========================================
                        VALIDITY
                    ========================================= */}

                    <div className="ticket-validity">

                      <div>

                        <small>
                          <FaCalendarAlt /> START DATE
                        </small>

                        <span>
                          {formatDate(
                            coupon.validFrom
                          )}
                        </span>

                      </div>


                      <div>

                        <small>
                          <FaCalendarAlt /> END DATE
                        </small>

                        <span>
                          {formatDate(
                            coupon.validUntil
                          )}
                        </span>

                      </div>

                    </div>


                    {/* =========================================
                        CODE
                    ========================================= */}

                    <div className="ticket-code-row">

                      <div className="ticket-code-box">
                        {code}
                      </div>

                      <button
                        className="ticket-copy"
                        onClick={() =>
                          copyCouponCode(coupon)
                        }
                        title="Copy Coupon Code"
                      >
                        <FaCopy />
                      </button>

                    </div>

                  </div>


                  {/* =========================================
                      FOOD / IMAGE
                  ========================================= */}

                  <div className="ticket-food">

                    <div className="ticket-food-image">

                      {image ? (
                        <img
                          src={image}
                          alt={store}
                        />
                      ) : (
                        <span className="ticket-food-emoji">
                          {emoji}
                        </span>
                      )}

                    </div>

                    <div className="ticket-food-text">

                      <small>
                        SPECIAL OFFER
                      </small>

                      <strong>
                        {discountText}
                      </strong>

                    </div>

                  </div>


                  {/* =========================================
                      APPLY
                  ========================================= */}

                  <div className="ticket-action">

                    <button
                      onClick={() =>
                        applyCoupon(coupon)
                      }
                      disabled={status !== "Valid"}
                    >
                      {status === "Valid"
                        ? "Apply Coupon"
                        : status === "Upcoming"
                        ? "Coming Soon"
                        : "Coupon Expired"}
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>

      <Footer />
    </div>
  );
}