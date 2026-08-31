import React, { useEffect, useState } from "react";
import "./Manageorder.css";

const API_URL = "http://localhost:5000";

export default function Manageorder() {

  // =====================================
  // ORDERS
  // =====================================

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);


  // =====================================
  // GET ORDERS FROM MONGODB
  // =====================================

  const fetchOrders = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(
          `${API_URL}/api/orders`
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to fetch orders"
        );

      }


      setOrders(data);

    } catch (error) {

      console.error(
        "FETCH ORDERS ERROR:",
        error
      );

      alert(
        "Failed to load orders."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================
  // LOAD ORDERS
  // =====================================

  useEffect(() => {

    fetchOrders();

  }, []);


  // =====================================
  // UPDATE STATUS
  // =====================================

  const updateStatus = async (
    id,
    newStatus
  ) => {

    try {

      const response =
        await fetch(
          `${API_URL}/api/orders/${id}/status`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              status:
                newStatus

            })

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to update status"
        );

      }


      // Update UI immediately

      setOrders((prevOrders) =>
        prevOrders.map(
          (order) =>
            order._id === id
              ? {
                  ...order,
                  status:
                    newStatus
                }
              : order
        )
      );


    } catch (error) {

      console.error(
        "UPDATE STATUS ERROR:",
        error
      );

      alert(
        "Failed to update order status."
      );

    }

  };


  // =====================================
  // DELETE ORDER
  // =====================================

  const deleteOrder = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this order?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      const response =
        await fetch(
          `${API_URL}/api/orders/${id}`,
          {
            method: "DELETE"
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to delete order"
        );

      }


      setOrders((prevOrders) =>
        prevOrders.filter(
          (order) =>
            order._id !== id
        )
      );


    } catch (error) {

      console.error(
        "DELETE ORDER ERROR:",
        error
      );

      alert(
        "Failed to delete order."
      );

    }

  };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="orders-page">

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


        <div className="orders-box">

          <div className="no-orders">

            <h3>
              Loading Orders...
            </h3>

            <p>
              Please wait while orders are loading.
            </p>

          </div>

        </div>

      </div>

    );

  }


  // =====================================
  // UI
  // =====================================

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

          <div className="orders-table-wrapper">

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

                {orders.map(
                  (order) => (

                    <tr
                      key={
                        order._id
                      }
                    >

                      {/* ORDER ID */}

                      <td>

                        <strong>
                          #
                          {
                            order.orderNumber
                          }
                        </strong>

                      </td>


                      {/* CUSTOMER */}

                      <td>

                        <strong>
                          {
                            order.customer
                          }
                        </strong>

                        <br />

                        <small>
                          {
                            order.mobile
                          }
                        </small>

                        <br />

                        <small>
                          {
                            order.city
                          },{" "}
                          {
                            order.state
                          }
                        </small>

                      </td>


                      {/* ITEMS */}

                      <td>

                        {order.items &&
                        order.items.length > 0 ? (

                          order.items.map(
                            (item, index) => (

                              <div
                                key={
                                  index
                                }
                              >

                                {item.name}
                                {" x "}
                                {
                                  item.quantity
                                }

                              </div>

                            )
                          )

                        ) : (

                          <span>
                            No items
                          </span>

                        )}

                      </td>


                      {/* AMOUNT */}

                      <td>

                        <strong>
                          ₹
                          {
                            Number(
                              order.total || 0
                            )
                          }
                        </strong>

                      </td>


                      {/* PAYMENT */}

                      <td>

                        {
                          order.paymentMethod
                        }

                      </td>


                      {/* STATUS */}

                      <td>

                        <select
                          value={
                            order.status ||
                            "Pending"
                          }

                          onChange={(e) =>
                            updateStatus(
                              order._id,
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
                            deleteOrder(
                              order._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}
