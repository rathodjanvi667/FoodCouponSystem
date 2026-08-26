import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Managecoupon.css";

const API_URL = "http://localhost:5000/api/coupons";

export default function ManageCoupon() {
  // =====================================
  // COUPON LIST
  // =====================================
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // =====================================
  // FORM DATA
  // =====================================
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [store, setStore] = useState("La Pino'z");
  const [description, setDescription] = useState("");

  // =====================================
  // LOAD COUPONS
  // =====================================
  const loadCoupons = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load coupons");
      }

      const data = await response.json();

      setCoupons(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "LOAD COUPON ERROR:",
        error
      );

      alert(
        "Unable to load coupons from database."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // PAGE LOAD
  // =====================================
  useEffect(() => {
    loadCoupons();
  }, []);

  // =====================================
  // ADD COUPON
  // =====================================
  const addCoupon = async (e) => {
    e.preventDefault();

    // =================================
    // CLEAN VALUES
    // =================================
    const couponCode =
      code.trim().toUpperCase();

    const couponDescription =
      description.trim();

    // =================================
    // BASIC VALIDATION
    // =================================
    if (
      couponCode === "" ||
      discount === "" ||
      minOrderAmount === "" ||
      validFrom === "" ||
      validUntil === "" ||
      store.trim() === "" ||
      couponDescription === ""
    ) {
      alert(
        "Please fill all coupon fields."
      );
      return;
    }

    // =================================
    // DISCOUNT VALIDATION
    // =================================
    const discountNumber =
      Number(discount);

    if (
      Number.isNaN(discountNumber) ||
      discountNumber < 1 ||
      discountNumber > 100
    ) {
      alert(
        "Discount must be between 1% and 100%."
      );
      return;
    }

    // =================================
    // MINIMUM ORDER VALIDATION
    // =================================
    const minOrderNumber =
      Number(minOrderAmount);

    if (
      Number.isNaN(minOrderNumber) ||
      minOrderNumber < 0
    ) {
      alert(
        "Minimum Order Amount must be a valid number."
      );
      return;
    }

    // =================================
    // DATE VALIDATION
    // =================================
    if (validUntil < validFrom) {
      alert(
        "Valid Until date cannot be before Valid From date."
      );
      return;
    }

    // =================================
    // CHECK DUPLICATE CODE
    // =================================
    const duplicateCoupon =
      coupons.some(
        (coupon) =>
          coupon.code &&
          coupon.code.toUpperCase() ===
            couponCode
      );

    if (duplicateCoupon) {
      alert(
        "This coupon code already exists."
      );
      return;
    }

    try {
      setSaving(true);

      // =================================
      // DATA SENT TO BACKEND
      // =================================
      const couponData = {
        code: couponCode,
        discount: discountNumber,
        minOrderAmount: minOrderNumber,
        validFrom: validFrom,
        validUntil: validUntil,
        store: store.trim(),
        description: couponDescription
      };

      console.log(
        "COUPON DATA:",
        couponData
      );

      // =================================
      // POST REQUEST
      // =================================
      const response = await fetch(
        API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify(
            couponData
          )
        }
      );

      // =================================
      // READ RESPONSE SAFELY
      // =================================
      let data = {};

      try {
        data = await response.json();
      } catch (error) {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add coupon"
        );
      }

      // =================================
      // ADD NEW COUPON TO LIST
      // =================================
      setCoupons(
        (previousCoupons) => [
          data,
          ...previousCoupons
        ]
      );

      // =================================
      // CLEAR FORM
      // =================================
      setCode("");
      setDiscount("");
      setMinOrderAmount("");
      setValidFrom("");
      setValidUntil("");
      setStore("La Pino'z");
      setDescription("");

      alert(
        "Coupon Added Successfully! 🎉"
      );
    } catch (error) {
      console.error(
        "ADD COUPON ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to add coupon"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // DELETE COUPON
  // =====================================
  const deleteCoupon = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this coupon?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE"
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch (error) {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete coupon"
        );
      }

      // =================================
      // REMOVE FROM UI
      // =================================
      setCoupons(
        (previousCoupons) =>
          previousCoupons.filter(
            (coupon) =>
              coupon._id !== id
          )
      );

      alert(
        "Coupon Deleted Successfully!"
      );
    } catch (error) {
      console.error(
        "DELETE COUPON ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to delete coupon"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================
  // FORMAT DATE
  // =====================================
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const newDate =
      new Date(date);

    if (
      Number.isNaN(
        newDate.getTime()
      )
    ) {
      return date;
    }

    return newDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    );
  };

  // =====================================
  // RETURN UI
  // =====================================
  return (
    <div className="manage-coupon">

      {/* =================================
          HEADER
      ================================= */}
      <div className="manage-header">
        <div>
          <h1>
            Manage Coupons
          </h1>

          <p>
            Add and manage discount coupons
          </p>
        </div>

        <Link to="/Admindashboard">
          Back to Dashboard
        </Link>
      </div>

      {/* =================================
          ADD COUPON FORM
      ================================= */}
      <div className="coupon-form-box">
        <h2>
          Add New Coupon
        </h2>

        <form onSubmit={addCoupon}>

          {/* COUPON CODE */}
          <div className="form-group">
            <label>
              Coupon Code
            </label>

            <input
              type="text"
              placeholder="Example: DRK10"
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value.toUpperCase()
                )
              }
            />
          </div>

          {/* DISCOUNT */}
          <div className="form-group">
            <label>
              Discount (%)
            </label>

            <input
              type="number"
              min="1"
              max="100"
              placeholder="Example: 10"
              value={discount}
              onChange={(e) =>
                setDiscount(
                  e.target.value
                )
              }
            />
          </div>

          {/* MINIMUM ORDER */}
          <div className="form-group">
            <label>
              Minimum Order Amount (₹)
            </label>

            <input
              type="number"
              min="0"
              placeholder="Example: 250"
              value={minOrderAmount}
              onChange={(e) =>
                setMinOrderAmount(
                  e.target.value
                )
              }
            />
          </div>

          {/* VALID FROM */}
          <div className="form-group">
            <label>
              Valid From
            </label>

            <input
              type="date"
              value={validFrom}
              onChange={(e) =>
                setValidFrom(
                  e.target.value
                )
              }
            />
          </div>

          {/* VALID UNTIL */}
          <div className="form-group">
            <label>
              Valid Until
            </label>

            <input
              type="date"
              min={validFrom || undefined}
              value={validUntil}
              onChange={(e) =>
                setValidUntil(
                  e.target.value
                )
              }
            />
          </div>

          {/* STORE */}
          <div className="form-group">
            <label>
              Store
            </label>

            <select
              value={store}
              onChange={(e) =>
                setStore(
                  e.target.value
                )
              }
            >
              <option value="La Pino'z">
                La Pino'z
              </option>

              <option value="McDonald's">
                McDonald's
              </option>

              <option value="Burger King">
                Burger King
              </option>

              <option value="Domino's">
                Domino's
              </option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className="form-group full-width">
            <label>
              Coupon Description
            </label>

            <textarea
              placeholder="Example: Get 10% OFF on orders above ₹250"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="add-coupon-btn"
            disabled={saving}
          >
            {saving
              ? "Adding Coupon..."
              : "Add Coupon"}
          </button>

        </form>
      </div>

      {/* =================================
          COUPON LIST
      ================================= */}
      <div className="coupon-list-box">
        <h2>
          Coupon List
        </h2>

        {loading ? (
          <p className="empty-message">
            Loading coupons...
          </p>
        ) : coupons.length === 0 ? (
          <p className="empty-message">
            No coupons available.
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>
                    Coupon Code
                  </th>

                  <th>
                    Discount
                  </th>

                  <th>
                    Min. Order
                  </th>

                  <th>
                    Valid From
                  </th>

                  <th>
                    Valid Until
                  </th>

                  <th>
                    Store
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {coupons.map(
                  (coupon) => (
                    <tr
                      key={coupon._id}
                    >
                      {/* CODE */}
                      <td>
                        <span className="coupon-code">
                          {coupon.code}
                        </span>
                      </td>

                      {/* DISCOUNT */}
                      <td>
                        {coupon.discount}%
                      </td>

                      {/* MINIMUM ORDER */}
                      <td>
                        ₹
                        {coupon.minOrderAmount}
                      </td>

                      {/* VALID FROM */}
                      <td>
                        {formatDate(
                          coupon.validFrom
                        )}
                      </td>

                      {/* VALID UNTIL */}
                      <td>
                        {formatDate(
                          coupon.validUntil
                        )}
                      </td>

                      {/* STORE */}
                      <td>
                        {coupon.store}
                      </td>

                      {/* DESCRIPTION */}
                      <td>
                        {coupon.description}
                      </td>

                      {/* DELETE */}
                      <td>
                        <button
                          type="button"
                          className="delete-coupon-btn"
                          disabled={
                            deletingId ===
                            coupon._id
                          }
                          onClick={() =>
                            deleteCoupon(
                              coupon._id
                            )
                          }
                        >
                          {deletingId ===
                          coupon._id
                            ? "Deleting..."
                            : "Delete"}
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