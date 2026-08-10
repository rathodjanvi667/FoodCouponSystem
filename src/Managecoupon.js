import React, { useState } from "react";
import "./Managecoupon.css";

export default function Managecoupon() {

  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: "FOOD20",
      discount: 20,
      expiry: "20-08-2026"
    },
    {
      id: 2,
      code: "SAVE10",
      discount: 10,
      expiry: "30-08-2026"
    }
  ]);

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiry, setExpiry] = useState("");


  const addCoupon = (e) => {

    e.preventDefault();

    if (code === "" || discount === "" || expiry === "") {
      alert("Please enter all coupon details");
      return;
    }

    const newCoupon = {
      id: coupons.length + 1,
      code: code.toUpperCase(),
      discount: discount,
      expiry: expiry
    };

    setCoupons([...coupons, newCoupon]);

    setCode("");
    setDiscount("");
    setExpiry("");

    alert("Coupon Added Successfully!");
  };


  const deleteCoupon = (id) => {

    const updatedCoupons = coupons.filter(
      (coupon) => coupon.id !== id
    );

    setCoupons(updatedCoupons);
  };


  return (
    <div className="manage-coupon">

      {/* Header */}

      <div className="coupon-header">

        <div>
          <h1>Manage Coupons</h1>

          <p>
            Add and manage your food coupons
          </p>
        </div>

        <a href="/Admindashboard">
          Back to Dashboard
        </a>

      </div>


      {/* Add Coupon */}

      <div className="coupon-form-box">

        <h2>Add New Coupon</h2>

        <form onSubmit={addCoupon}>

          <input
            type="text"
            placeholder="Coupon Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />


          <input
            type="number"
            placeholder="Discount (%)"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />


          <input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />


          <button type="submit">
            Add Coupon
          </button>

        </form>

      </div>


      {/* Coupon List */}

      <div className="coupon-list-box">

        <h2>Coupon List</h2>

        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Coupon Code</th>
              <th>Discount</th>
              <th>Expiry Date</th>
              <th>Action</th>
            </tr>

          </thead>


          <tbody>

            {coupons.map((coupon) => (

              <tr key={coupon.id}>

                <td>
                  {coupon.id}
                </td>

                <td>
                  {coupon.code}
                </td>

                <td>
                  {coupon.discount}%
                </td>

                <td>
                  {coupon.expiry}
                </td>

                <td>

                  <button
                    className="coupon-delete-btn"
                    onClick={() => deleteCoupon(coupon.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
