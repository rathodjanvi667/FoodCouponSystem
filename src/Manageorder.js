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

