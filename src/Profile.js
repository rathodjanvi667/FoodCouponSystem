import React, { useEffect, useState } from "react";
import "./Profile.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const API_URL = "http://localhost:5000";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const savedUser =
        JSON.parse(
          localStorage.getItem("foodCouponUser")
        ) || null;

      if (!savedUser || !savedUser.email) {
        setLoading(false);
        return;
      }

      setUser(savedUser);

      const email = encodeURIComponent(
        savedUser.email
      );

      const [ordersResponse, couponsResponse] =
        await Promise.all([
          fetch(
            `${API_URL}/api/orders/customer/${email}`
          ),
          fetch(
            `${API_URL}/api/coupons/customer/${email}`
          )
        ]);

      const ordersData =
        await ordersResponse.json();

      const couponsData =
        await couponsResponse.json();

      if (ordersResponse.ok) {
        setOrders(
          Array.isArray(ordersData)
            ? ordersData
            : []
        );
      }

      if (couponsResponse.ok) {
        setCoupons(
          Array.isArray(couponsData)
            ? couponsData
            : []
        );
      }
    } catch (error) {
      console.error(
        "PROFILE DATA ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />

        <div className="profile-loading">
          <div className="profile-spinner"></div>
          <p>Loading profile...</p>
        </div>

        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <Navbar />

        <div className="profile-login-message">
          <div className="profile-login-icon">
            👤
          </div>

          <h2>Please Login</h2>

          <p>
            Login to view your profile,
            orders and coupons.
          </p>

          <a href="/Login">
            Login Now
          </a>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />

      {/* Profile Header */}
      <section className="profile-hero">
        <div className="profile-hero-content">
          <span>MY ACCOUNT</span>

          <h1>
            Welcome, {user.name || "Customer"}!
          </h1>

          <p>
            Manage your profile, orders and
            coupons from one place.
          </p>
        </div>
      </section>

      <main className="profile-container">

        {/* User Details */}
        <section className="profile-card user-details-card">
          <div className="profile-section-title">
            <span>ACCOUNT</span>
            <h2>Personal Details</h2>
          </div>

          <div className="user-profile-content">
            <div className="profile-avatar">
              {user.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div className="user-info">
              <div className="info-item">
                <span>Name</span>
                <strong>
                  {user.name || "Not available"}
                </strong>
              </div>

              <div className="info-item">
                <span>Email</span>
                <strong>
                  {user.email}
                </strong>
              </div>

              <div className="info-item">
                <span>Phone</span>
                <strong>
                  {user.phone ||
                    "Not available"}
                </strong>
              </div>

              <div className="info-item">
                <span>Account Type</span>
                <strong>
                  {user.role === "admin"
                    ? "Admin"
                    : "Customer"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">
              📦
            </div>

            <div>
              <strong>{orders.length}</strong>
              <span>Total Orders</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              🎟️
            </div>

            <div>
              <strong>{coupons.length}</strong>
              <span>My Coupons</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              💰
            </div>

            <div>
              <strong>
                ₹
                {orders.reduce(
                  (sum, order) =>
                    sum +
                    Number(
                      order.total || 0
                    ),
                  0
                )}
              </strong>

              <span>Total Spent</span>
            </div>
          </div>
        </section>

        {/* Orders */}
        <section className="profile-card">
          <div className="profile-section-title">
            <span>ORDERS</span>
            <h2>My Orders</h2>
          </div>

          {orders.length === 0 ? (
            <div className="empty-profile">
              <div>📦</div>

              <h3>No Orders Yet</h3>

              <p>
                Your placed orders will appear
                here.
              </p>

              <a href="/Menu">
                Explore Menu
              </a>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div
                  className="profile-order"
                  key={
                    order._id ||
                    order.orderNumber
                  }
                >
                  <div className="order-top">
                    <div>
                      <span>
                        Order ID
                      </span>

                      <strong>
                        #
                        {order.orderNumber}
                      </strong>
                    </div>

                    <span
                      className={`order-status ${String(
                        order.status || ""
                      ).toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="order-middle">
                    <div>
                      <span>Date</span>

                      <strong>
                        {formatDate(
                          order.createdAt
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Items</span>

                      <strong>
                        {order.items?.length ||
                          0}
                      </strong>
                    </div>

                    <div>
                      <span>Total</span>

                      <strong>
                        ₹
                        {Number(
                          order.total || 0
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="order-items-preview">
                    {order.items
                      ?.slice(0, 3)
                      .map(
                        (item, index) => (
                          <span
                            key={index}
                          >
                            {item.name}
                            {item.quantity
                              ? ` × ${item.quantity}`
                              : ""}
                          </span>
                        )
                      )}

                    {order.items?.length >
                      3 && (
                      <span>
                        +
                        {order.items.length -
                          3}{" "}
                        more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Coupons */}
        <section className="profile-card">
          <div className="profile-section-title">
            <span>REWARDS</span>
            <h2>My Coupons</h2>
          </div>

          {coupons.length === 0 ? (
            <div className="empty-profile">
              <div>🎟️</div>

              <h3>No Coupons Yet</h3>

              <p>
                Place an order to receive
                your special coupon.
              </p>

              <a href="/Menu">
                Order Now
              </a>
            </div>
          ) : (
            <div className="coupons-list">
              {coupons.map((coupon) => (
                <div
                  className="profile-coupon"
                  key={
                    coupon._id ||
                    coupon.code
                  }
                >
                  <div className="coupon-left">
                    <div className="coupon-discount">
                      {coupon.discount}%
                    </div>

                    <div>
                      <span>
                        DISCOUNT
                      </span>

                      <h3>
                        {coupon.code}
                      </h3>
                    </div>
                  </div>

                  <div className="coupon-right">
                    <strong>
                      {coupon.status ||
                        "generated"}
                    </strong>

                    <span>
                      Valid until{" "}
                      {formatDate(
                        coupon.validUntil
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}