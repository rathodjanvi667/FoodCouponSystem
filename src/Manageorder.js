import React, { useState } from "react";
import "./Manageorder.css";

export default function Orders() {

  const [orders, setOrders] = useState([
    {
      id: 101,
      customer: "Rahul",
      food: "Veg Pizza",
      amount: 299,
      status: "Pending"
    },
    {
      id: 102,
      customer: "Priya",
      food: "Veg Burger",
      amount: 189,
      status: "Preparing"
    },
    {
      id: 103,
      customer: "Amit",
      food: "Pasta",
      amount: 249,
      status: "Delivered"
    }
  ]);


  const updateStatus = (id, newStatus) => {

    const updatedOrders = orders.map((order) =>
      order.id === id
        ? { ...order, status: newStatus }
        : order
    );

    setOrders(updatedOrders);
  };


  return (
    <div className="orders-page">

      {/* Header */}

      <div className="orders-header">

        <div>
          <h1>Orders</h1>

          <p>
            View and manage customer orders
          </p>
        </div>

        <a href="/Admindashboard">
          Back to Dashboard
        </a>

      </div>


      {/* Orders List */}

      <div className="orders-box">

        <h2>Order List</h2>

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

            {orders.map((order) => (

              <tr key={order.id}>

                <td>
                  #{order.id}
                </td>

                <td>
                  {order.customer}
                </td>

                <td>
                  {order.food}
                </td>

                <td>
                  ₹{order.amount}
                </td>

                <td>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(
                        order.id,
                        e.target.value
                      )
                    }
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Preparing">
                      Preparing
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>

                  </select>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
