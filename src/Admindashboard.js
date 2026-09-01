import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Admindashboard.css";

const FOOD_API = "http://localhost:5000/api/foods";
const COUPON_API = "http://localhost:5000/api/coupons";

export default function Admindashboard() {
  const navigate = useNavigate();

  // =====================================
  // DASHBOARD COUNTS
  // =====================================

  const [foodCount, setFoodCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [couponCount, setCouponCount] = useState(0);

  // =====================================
  // LOAD DASHBOARD DATA
  // =====================================

  const loadDashboardData = async () => {
    try {
      // =================================
      // LOAD FOOD COUNT FROM DATABASE
      // =================================

      const foodResponse = await fetch(FOOD_API);

      if (foodResponse.ok) {
        const foods = await foodResponse.json();

        setFoodCount(
          Array.isArray(foods) ? foods.length : 0
        );
      }

      // =================================
      // LOAD COUPON COUNT FROM DATABASE
      // =================================

      const couponResponse = await fetch(COUPON_API);

      if (couponResponse.ok) {
        const coupons = await couponResponse.json();

        setCouponCount(
          Array.isArray(coupons) ? coupons.length : 0
        );
      }

      // =================================
      // LOAD ORDERS FROM LOCAL STORAGE
      // =================================

      const savedOrders =
        JSON.parse(
          localStorage.getItem("orders")
        ) || [];

      setOrderCount(savedOrders.length);

    } catch (error) {
      console.error(
        "DASHBOARD LOAD ERROR:",
        error
      );

      // Orders can still be loaded even
      // if backend is unavailable

      const savedOrders =
        JSON.parse(
          localStorage.getItem("orders")
        ) || [];

      setOrderCount(savedOrders.length);
    }
  };

  // =====================================
  // LOAD DATA WHEN PAGE OPENS
  // =====================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("foodCouponUser");
    localStorage.removeItem("foodCouponLogin");

    alert("Logout Successful!");

    navigate("/Login");
  };

  // =====================================
  // GET RECENT ORDERS
  // =====================================

  const getRecentOrders = () => {
    const orders =
      JSON.parse(
        localStorage.getItem("orders")
      ) || [];

    return orders.slice(-3).reverse();
  };

  const recentOrders = getRecentOrders();

  // =====================================
  // RETURN UI
  // =====================================

  return (
    <div className="admin-dashboard">

      {/* =================================
          SIDEBAR
      ================================== */}

      <div className="admin-sidebar">

        <h2>
          Food Coupon
        </h2>

        <p>
          Admin Panel
        </p>

        <nav>

          <Link to="/Admindashboard">
            Dashboard
          </Link>

          <Link to="/Admindashboard/Managefood">
            Manage Food
          </Link>

          <Link to="/Admindashboard/Managecoupon">
            Coupons
          </Link>

          <Link to="/Admindashboard/Manageorder">
            Orders
          </Link>

          <Link to="/ManageRestaurant">
            Restaurants
          </Link>

        </nav>

        {/* Logout */}

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>


      {/* =================================
          MAIN CONTENT
      ================================== */}

      <div className="admin-content">

        <h1>
          Admin Dashboard
        </h1>

        <p className="welcome">
          Welcome, Admin
        </p>


        {/* =================================
            DASHBOARD CARDS
        ================================== */}

        <div className="admin-cards">

          {/* Total Food */}

          <div className="admin-card">

            <h3>
              Total Food
            </h3>

            <h2>
              {foodCount}
            </h2>

          </div>


          {/* Total Orders */}

          <div className="admin-card">

            <h3>
              Total Orders
            </h3>

            <h2>
              {orderCount}
            </h2>

          </div>


          {/* Total Coupons */}

          <div className="admin-card">

            <h3>
              Total Coupons
            </h3>

            <h2>
              {couponCount}
            </h2>

          </div>

        </div>


        {/* =================================
            QUICK ACTIONS
        ================================== */}

        <div className="admin-section">

          <h2>
            Quick Actions
          </h2>

          <div className="admin-buttons">

            <Link to="/Admindashboard/Managefood">
              Manage Food
            </Link>

            <Link to="/Admindashboard/Managecoupon">
              Manage Coupons
            </Link>

            <Link to="/Admindashboard/Manageorder">
              View Orders
            </Link>

            <Link to="/ManageRestaurant">
              Restaurants
            </Link>

          </div>

        </div>


        {/* =================================
            RECENT ORDERS
        ================================== */}

        <div className="admin-section">

          <h2>
            Recent Orders
          </h2>

          {recentOrders.length === 0 ? (

            <p>
              No orders available.
            </p>

          ) : (

            <table>

              <thead>

                <tr>

                  <th>
                    Order ID
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Items
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentOrders.map((order) => (

                  <tr
                    key={order.id}
                  >

                    <td>
                      #{order.id}
                    </td>

                    <td>
                      {order.customer}
                    </td>

                    <td>

                      {Array.isArray(order.items) &&
                        order.items.map((item) => (

                          <div
                            key={
                              item._id ||
                              item.id ||
                              item.name
                            }
                          >
                            {item.name}
                            {" x "}
                            {item.quantity}
                          </div>

                        ))}

                    </td>

                    <td>
                      ₹{order.total}
                    </td>

                    <td>
                      {order.status}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}