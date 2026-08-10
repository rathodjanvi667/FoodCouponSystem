import React from "react";
import "./Admindashboard.css";

export default function Admindashboard() {

  return (
    <div className="admin-dashboard">

      <div className="admin-sidebar">

        <h2>Food Coupon</h2>

        <p>Admin Panel</p>

        <nav>
          <a href="/Admindashboard">Dashboard</a>
          <a href="/Admindashboard/food">Manage Food</a>
          <a href="/Admindashboard/coupon">Coupons</a>
          <a href="/Admindashboard/orders">Orders</a>
        </nav>

        <button className="logout-btn">
          Logout
        </button>

      </div>


      {/* Main Content */}

      <div className="admin-content">

        <h1>Admin Dashboard</h1>

        <p className="welcome">
          Welcome, Admin
        </p>


        {/* Dashboard Cards */}

        <div className="admin-cards">

          <div className="admin-card">
            <h3>Total Food</h3>
            <h2>36</h2>
          </div>

          <div className="admin-card">
            <h3>Total Orders</h3>
            <h2>25</h2>
          </div>

          <div className="admin-card">
            <h3>Total Coupons</h3>
            <h2>10</h2>
          </div>

        </div>


        {/* Quick Actions */}

        <div className="admin-section">

          <h2>Quick Actions</h2>

          <div className="admin-buttons">

            <a href="/admin/food">
              Manage Food
            </a>

            <a href="/admin/coupon">
              Manage Coupons
            </a>

            <a href="/admin/orders">
              View Orders
            </a>

          </div>

        </div>


        {/* Recent Orders */}

        <div className="admin-section">

          <h2>Recent Orders</h2>

          <table>

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Food</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>101</td>
                <td>Rahul</td>
                <td>Veg Pizza</td>
                <td>₹299</td>
              </tr>

              <tr>
                <td>102</td>
                <td>Priya</td>
                <td>Veg Burger</td>
                <td>₹189</td>
              </tr>

              <tr>
                <td>103</td>
                <td>Amit</td>
                <td>Pasta</td>
                <td>₹249</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
