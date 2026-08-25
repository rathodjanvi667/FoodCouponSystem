<<<<<<< HEAD
import React, { useState } from "react";
import "./Manageorder.css";

export default function Manageorder() {

  // --------------------------------
  // LOCAL STORAGE MATHI ORDERS
  // --------------------------------

  const [orders, setOrders] = useState(() => {

    const savedOrders =
      localStorage.getItem("orders");

    if (savedOrders) {
      return JSON.parse(savedOrders);
    }

    return [];
  });


  // --------------------------------
  // UPDATE ORDER STATUS
  // --------------------------------

  const updateStatus = (id, newStatus) => {

    const updatedOrders = orders.map((order) => {

      if (order.id === id) {

        return {
          ...order,
          status: newStatus
        };

      }

      return order;

    });


    setOrders(updatedOrders);


    // LocalStorage update

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

  };


  // --------------------------------
  // DELETE ORDER
  // --------------------------------

  const deleteOrder = (id) => {

    const updatedOrders = orders.filter(
      (order) => order.id !== id
    );


    setOrders(updatedOrders);


    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

  };


  return (

    <div className="orders-page">


      {/* HEADER */}

      <div className="orders-header">

        <div>

          <h1>
            Orders
          </h1>

          <p>
            View and manage customer orders
          </p>

        </div>


        <a href="/Admindashboard">
          Back to Dashboard
        </a>

      </div>


      {/* ORDERS BOX */}

      <div className="orders-box">

        <h2>
          Order List
        </h2>


        {/* NO ORDERS */}

        {orders.length === 0 ? (

          <div className="no-orders">

            <h3>
              No Orders Found
            </h3>

            <p>
              Customer orders will appear here.
            </p>

          </div>

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
                  Payment
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {orders.map((order) => (

                <tr key={order.id}>


                  {/* ORDER ID */}

                  <td>
                    #{order.id}
                  </td>


                  {/* CUSTOMER */}

                  <td>
                    {order.customer}
                  </td>


                  {/* ITEMS */}

                  <td>

                    {order.items.map((item) => (

                      <div key={item.id}>

                        {item.name}
                        {" x "}
                        {item.quantity}

                      </div>

                    ))}

                  </td>


                  {/* AMOUNT */}

                  <td>

                    ₹{order.total}

                  </td>


                  {/* PAYMENT */}

                  <td>

                    {order.paymentMethod}

                  </td>


                  {/* STATUS */}

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


                  {/* DELETE */}

                  <td>

                    <button
                      className="delete-order-btn"
                      onClick={() =>
                        deleteOrder(order.id)
                      }
                    >
                      Delete
                    </button>

                  </td>


                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>

  );
}
=======
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
>>>>>>> d7d75d0c97c1411ad7577eb2a6a19c4a9078d035
