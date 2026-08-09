import React from "react";
import "./Admindashboard.css";

export default function Admindashboard() {

  return (
    <div className="admin-dashboard">

      {/* Sidebar */}

      <div className="admin-sidebar">

        <h2>Food Coupon</h2>

        <p className="admin-name">Admin Panel</p>

        <nav>
          <a href="/Admindashboard">Dashboard</a>
          <a href="/admin/food">Manage Food</a>
          <a href="/admin/category">Categories</a>
          <a href="/admin/coupon">Coupons</a>
          <a href="/admin/orders">Orders</a>
          <a href="/admin/users">Users</a>
        </nav>

        <button className="logout-btn">
          Logout
        </button>

      </div>


      {/* Main Content */}

      <div className="admin-content">

        {/* Header */}

        <div className="admin-header">

          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, Admin</p>
          </div>

          <button className="add-food-btn">
            + Add Food
          </button>

        </div>


        {/* Statistics */}

        <div className="stats">

          <div className="stat-box">
            <p>Total Food</p>
            <h2>36</h2>
            <span>Food Items</span>
          </div>

          <div className="stat-box">
            <p>Total Users</p>
            <h2>248</h2>
            <span>Registered Users</span>
          </div>

          <div className="stat-box">
            <p>Total Orders</p>
            <h2>184</h2>
            <span>Orders Received</span>
          </div>

          <div className="stat-box">
            <p>Coupons</p>
            <h2>12</h2>
            <span>Active Coupons</span>
          </div>

        </div>


        {/* Main Sections */}

        <div className="dashboard-sections">

          {/* Recent Orders */}

          <div className="dashboard-box">

            <div className="box-header">
              <h2>Recent Orders</h2>
              <a href="/admin/orders">View All</a>
            </div>

            <table>

              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Food</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>#1001</td>
                  <td>Rahul</td>
                  <td>Veg Pizza</td>
                  <td>₹299</td>
                  <td>
                    <span className="delivered">
                      Delivered
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>#1002</td>
                  <td>Priya</td>
                  <td>Veg Burger</td>
                  <td>₹189</td>
                  <td>
                    <span className="pending">
                      Pending
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>#1003</td>
                  <td>Amit</td>
                  <td>Pasta</td>
                  <td>₹249</td>
                  <td>
                    <span className="preparing">
                      Preparing
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>#1004</td>
                  <td>Neha</td>
                  <td>Cold Coffee</td>
                  <td>₹129</td>
                  <td>
                    <span className="delivered">
                      Delivered
                    </span>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>


          {/* Food Categories */}

          <div className="dashboard-box">

            <div className="box-header">
              <h2>Food Categories</h2>
              <a href="/admin/category">Manage</a>
            </div>

            <div className="categories">

              <div>
                <h3>Pizza</h3>
                <p>8 Items</p>
              </div>

              <div>
                <h3>Burger</h3>
                <p>6 Items</p>
              </div>

              <div>
                <h3>Pasta</h3>
                <p>7 Items</p>
              </div>

              <div>
                <h3>Dessert</h3>
                <p>5 Items</p>
              </div>

              <div>
                <h3>Drinks</h3>
                <p>10 Items</p>
              </div>

              <div>
                <h3>Healthy Food</h3>
                <p>4 Items</p>
              </div>

            </div>

          </div>

        </div>


        {/* Bottom Section */}

        <div className="bottom-section">

          <div className="dashboard-box">

            <h2>Today's Summary</h2>

            <div className="summary">

              <div>
                <span>Today's Orders</span>
                <strong>24</strong>
              </div>

              <div>
                <span>Today's Sales</span>
                <strong>₹6,850</strong>
              </div>

              <div>
                <span>New Users</span>
                <strong>12</strong>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
