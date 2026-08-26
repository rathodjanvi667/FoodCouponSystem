import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Admindashboard.css";

export default function Admindashboard() {

  const navigate = useNavigate();


  // =====================================
  // DASHBOARD COUNTS
  // =====================================

  const [foodCount, setFoodCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [couponCount, setCouponCount] = useState(0);


  // =====================================
  // LOAD DATA FROM LOCAL STORAGE
  // =====================================

  const loadDashboardData = () => {

    // Food
    const foods =
      JSON.parse(
        localStorage.getItem("foods")
      ) || [];

    // Orders
    const orders =
      JSON.parse(
        localStorage.getItem("orders")
      ) || [];

    // Coupons
    const coupons =
      JSON.parse(
        localStorage.getItem("myCoupons")
      ) || [];


    setFoodCount(foods.length);
    setOrderCount(orders.length);
    setCouponCount(coupons.length);
  };


  // =====================================
  // LOAD WHEN DASHBOARD OPENS
  // =====================================

  useEffect(() => {

    loadDashboardData();

  }, []);


  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {

    localStorage.removeItem(
      "foodCouponUser"
    );

    alert("Logout Successful!");

    navigate("/Login");
  };


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

          <a href="/Admindashboard">
            Dashboard
          </a>

          <a href="/Admindashboard/Managefood">
            Manage Food
          </a>

          <a href="/Admindashboard/Managecoupon">
            Coupons
          </a>

          <a href="/Admindashboard/Manageorder">
            Orders
          </a>

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

            <a href="/Admindashboard/Managefood">
              Manage Food
            </a>

            <a href="/Admindashboard/Managecoupon">
              Manage Coupons
            </a>

            <a href="/Admindashboard/Manageorder">
              View Orders
            </a>

          </div>

        </div>


        {/* =================================
            RECENT ORDERS
        ================================== */}

        <div className="admin-section">

          <h2>
            Recent Orders
          </h2>


          {(() => {

            const orders =
              JSON.parse(
                localStorage.getItem("orders")
              ) || [];


            if (orders.length === 0) {

              return (

                <p>
                  No orders available.
                </p>

              );

            }


            // Last 3 orders

            const recentOrders =
              orders.slice(-3).reverse();


            return (

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

                    <tr key={order.id}>

                      <td>
                        #{order.id}
                      </td>

                      <td>
                        {order.customer}
                      </td>

                      <td>

                        {order.items.map((item) => (

                          <div key={item.id}>

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

            );

          })()}

        </div>


      </div>

    </div>

  );
}