import React, { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaBell,
  FaTimes
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // =====================================
  // CHECK LOGIN USER
  // =====================================
  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem("foodCouponUser");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Invalid user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    window.addEventListener("userUpdated", checkUser);

    return () => {
      window.removeEventListener("userUpdated", checkUser);
    };
  }, []);

  // =====================================
  // CART COUNT
  // =====================================
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem("foodCart");

      if (!savedCart) {
        setCartCount(0);
        return;
      }

      try {
        const cart = JSON.parse(savedCart);

        if (!Array.isArray(cart)) {
          setCartCount(0);
          return;
        }

        const totalItems = cart.reduce(
          (total, item) =>
            total + Number(item.quantity || 1),
          0
        );

        setCartCount(totalItems);
      } catch (error) {
        console.error("Cart loading error:", error);
        setCartCount(0);
      }
    };

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );
    };
  }, []);

  // =====================================
  // LOAD NOTIFICATIONS
  // =====================================
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/notifications"
        );

        if (!response.ok) {
          throw new Error("Failed to load notifications");
        }

        const data = await response.json();

        setNotifications(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Notification loading error:",
          error
        );
      }
    };

    fetchNotifications();

    const interval = setInterval(
      fetchNotifications,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  // =====================================
  // UNREAD NOTIFICATION COUNT
  // =====================================
  const unreadCount = notifications.filter(
    notification => !notification.isRead
  ).length;

  // =====================================
  // MARK NOTIFICATION AS READ
  // =====================================
  const markAsRead = async id => {
    try {
      await fetch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {
          method: "PUT"
        }
      );

      setNotifications(prev =>
        prev.map(notification =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Notification read error:",
        error
      );
    }
  };

  // =====================================
  // MARK ALL AS READ
  // =====================================
  const markAllAsRead = async () => {
    try {
      await fetch(
        "http://localhost:5000/api/notifications/read-all",
        {
          method: "PUT"
        }
      );

      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          isRead: true
        }))
      );
    } catch (error) {
      console.error(
        "Mark all read error:",
        error
      );
    }
  };

  // =====================================
  // LOGOUT
  // =====================================
  const handleLogout = () => {
    localStorage.removeItem("foodCouponUser");
    localStorage.removeItem("foodCouponLogin");

    setUser(null);

    window.dispatchEvent(
      new Event("userUpdated")
    );

    alert("Logout Successful!");

    navigate("/Login");
  };

  // =====================================
  // RETURN UI
  // =====================================
  return (
    <nav className="navbar">

      {/* LOGO */}
      <Link
        to="/"
        className="logo"
      >
        CouponBite
      </Link>

      {/* NAVIGATION */}
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/Menu">Menu</Link>
        </li>

        <li>
          <Link to="/Coupon">Coupons</Link>
        </li>

        <li>
          <Link to="/Order">Orders</Link>
        </li>

        <li>
          <Link to="/About">About</Link>
        </li>

        <li>
          <Link to="/Contact">Contact</Link>
        </li>
      </ul>

      {/* RIGHT SIDE */}
      <div className="nav-right">

        {/* NOTIFICATION */}
        <div className="notification-wrapper">

          <button
            className="notification-btn"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
          >
            <FaBell />

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 9
                  ? "9+"
                  : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">

              <div className="notification-header">
                <div>
                  <h3>Notifications</h3>
                  <span>
                    {unreadCount} unread
                  </span>
                </div>

                <button
                  className="notification-close"
                  onClick={() =>
                    setShowNotifications(false)
                  }
                >
                  <FaTimes />
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="no-notifications">
                  <FaBell />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <>
                  <div className="notification-list">

                    {notifications.map(
                      notification => (
                        <div
                          key={notification._id}
                          className={`notification-item ${
                            notification.isRead
                              ? "read"
                              : "unread"
                          }`}
                          onClick={() =>
                            markAsRead(
                              notification._id
                            )
                          }
                        >

                          <div
                            className={`notification-icon ${notification.type}`}
                          >
                            {notification.type ===
                              "food" && "🍕"}

                            {notification.type ===
                              "restaurant" && "🏪"}

                            {notification.type ===
                              "coupon" && "🎟️"}
                          </div>

                          <div className="notification-content">
                            <h4>
                              {notification.title}
                            </h4>

                            <p>
                              {notification.message}
                            </p>

                            <small>
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </small>
                          </div>

                          {!notification.isRead && (
                            <span className="unread-dot"></span>
                          )}

                        </div>
                      )
                    )}

                  </div>

                  {unreadCount > 0 && (
                    <button
                      className="mark-all-btn"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* CART */}
        <button
          className="cartbtn"
          onClick={() =>
            navigate("/Cart")
          }
        >
          <FaShoppingCart />

          <span>
            Cart ({cartCount})
          </span>
        </button>

        {/* USER / LOGIN */}
        {user ? (
          <div className="user-section">

            <span className="user-name">
              {user.role === "admin"
                ? "👨‍💼 Admin"
                : "👤 Customer"}
            </span>

            <button
              className="logoutbtn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        ) : (
          <Link to="/Login">
            <button className="loginbtn">
              Login
            </button>
          </Link>
        )}

      </div>
    </nav>
  );
}