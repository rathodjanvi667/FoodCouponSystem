<<<<<<< HEAD
import React, { useState } from "react";
import "./Managecoupon.css";

export default function Managecoupon() {

  // -----------------------------
  // COUPON LIST
  // -----------------------------

  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: "PIZZA20",
      discount: 20,
      minAmount: 499,
      validFrom: "2026-08-15",
      validUntil: "2026-08-31",
      store: "La Pino'z",
      description: "Get 20% OFF on pizza orders."
    },
    {
      id: 2,
      code: "SAVE100",
      discount: 100,
      minAmount: 699,
      validFrom: "2026-08-15",
      validUntil: "2026-08-30",
      store: "La Pino'z",
      description: "Get flat ₹100 OFF on orders above ₹699."
    }
  ]);


  // -----------------------------
  // FORM STATES
  // -----------------------------

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [store, setStore] = useState("");
  const [description, setDescription] = useState("");


  // Edit ID

  const [editId, setEditId] = useState(null);


  // Search

  const [search, setSearch] = useState("");


  // -----------------------------
  // ADD / UPDATE COUPON
  // -----------------------------

  const addCoupon = (e) => {

    e.preventDefault();


    // Required validation

    if (
      code.trim() === "" ||
      discount === "" ||
      minAmount === "" ||
      validFrom === "" ||
      validUntil === "" ||
      store === "" ||
      description.trim() === ""
    ) {

      alert("Please enter all coupon details");

      return;
    }


    // Date validation

    if (validUntil < validFrom) {

      alert(
        "Valid Until date cannot be before Valid From date"
      );

      return;
    }


    // Discount validation

    if (
      Number(discount) <= 0 ||
      Number(discount) > 100
    ) {

      alert(
        "Discount must be between 1% and 100%"
      );

      return;
    }


    // Minimum amount validation

    if (Number(minAmount) < 0) {

      alert(
        "Minimum amount cannot be negative"
      );

      return;
    }


    // --------------------------------
    // UPDATE COUPON
    // --------------------------------

    if (editId !== null) {

      const updatedCoupons = coupons.map(
        (coupon) => {

          if (coupon.id === editId) {

            return {
              ...coupon,

              code: code
                .trim()
                .toUpperCase(),

              discount: Number(discount),

              minAmount: Number(minAmount),

              validFrom: validFrom,

              validUntil: validUntil,

              store: store,

              description:
                description.trim()
            };

          }

          return coupon;

        }
      );


      setCoupons(updatedCoupons);


      // Reset form

      setEditId(null);

      setCode("");
      setDiscount("");
      setMinAmount("");
      setValidFrom("");
      setValidUntil("");
      setStore("");
      setDescription("");


      alert(
        "Coupon Updated Successfully!"
      );

      return;
    }


    // --------------------------------
    // ADD NEW COUPON
    // --------------------------------

    const newCoupon = {

      id:
        coupons.length > 0
          ? Math.max(
              ...coupons.map(
                (coupon) => coupon.id
              )
            ) + 1
          : 1,

      code: code
        .trim()
        .toUpperCase(),

      discount: Number(discount),

      minAmount: Number(minAmount),

      validFrom: validFrom,

      validUntil: validUntil,

      store: store,

      description:
        description.trim()

    };


    setCoupons([
      ...coupons,
      newCoupon
    ]);


    // Reset form

    setCode("");
    setDiscount("");
    setMinAmount("");
    setValidFrom("");
    setValidUntil("");
    setStore("");
    setDescription("");


    alert(
      "Coupon Added Successfully!"
    );
  };


  // -----------------------------
  // EDIT COUPON
  // -----------------------------

  const editCoupon = (coupon) => {

    setEditId(coupon.id);

    setCode(coupon.code);

    setDiscount(coupon.discount);

    setMinAmount(coupon.minAmount);

    setValidFrom(coupon.validFrom);

    setValidUntil(coupon.validUntil);

    setStore(coupon.store);

    setDescription(coupon.description);


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // -----------------------------
  // DELETE COUPON
  // -----------------------------

  const deleteCoupon = (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this coupon?"
      );


    if (!confirmDelete) {
      return;
    }


    const updatedCoupons =
      coupons.filter(
        (coupon) => coupon.id !== id
      );


    setCoupons(updatedCoupons);


    // If currently editing deleted coupon

    if (editId === id) {

      cancelEdit();

    }


    alert(
      "Coupon Deleted Successfully!"
    );
  };


  // -----------------------------
  // CANCEL EDIT
  // -----------------------------

  const cancelEdit = () => {

    setEditId(null);

    setCode("");
    setDiscount("");
    setMinAmount("");
    setValidFrom("");
    setValidUntil("");
    setStore("");
    setDescription("");
  };


  // -----------------------------
  // SEARCH COUPON
  // -----------------------------

  const filteredCoupons =
    coupons.filter((coupon) =>

      coupon.code
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );


  // -----------------------------
  // JSX
  // -----------------------------

  return (

    <div className="manage-coupon">


      {/* HEADER */}

      <div className="coupon-header">

        <div>

          <h1>
            Manage Coupons
          </h1>

          <p>
            Create and manage coupons
            for your customers
          </p>

        </div>


        <a href="/Admindashboard">
          Back to Dashboard
        </a>

      </div>



      {/* ADD / EDIT COUPON */}

      <div className="coupon-form-box">

        <h2>

          {editId !== null
            ? "Edit Coupon"
            : "Add New Coupon"}

        </h2>


        <form onSubmit={addCoupon}>


          {/* Coupon Code */}

          <div className="form-group">

            <label>
              Coupon Code
            </label>

            <input
              type="text"
              placeholder="Example: PIZZA20"
              value={code}
              onChange={(e) =>
                setCode(e.target.value)
              }
            />

          </div>



          {/* Discount */}

          <div className="form-group">

            <label>
              Discount (%)
            </label>

            <input
              type="number"
              placeholder="Example: 20"
              min="1"
              max="100"
              value={discount}
              onChange={(e) =>
                setDiscount(e.target.value)
              }
            />

          </div>



          {/* Minimum Amount */}

          <div className="form-group">

            <label>
              Minimum Order Amount (₹)
            </label>

            <input
              type="number"
              placeholder="Example: 499"
              min="0"
              value={minAmount}
              onChange={(e) =>
                setMinAmount(e.target.value)
              }
            />

          </div>



          {/* Valid From */}

          <div className="form-group">

            <label>
              Valid From
            </label>

            <input
              type="date"
              value={validFrom}
              onChange={(e) =>
                setValidFrom(e.target.value)
              }
            />

          </div>



          {/* Valid Until */}

          <div className="form-group">

            <label>
              Valid Until
            </label>

            <input
              type="date"
              value={validUntil}
              onChange={(e) =>
                setValidUntil(e.target.value)
              }
            />

          </div>



          {/* Valid At */}

          <div className="form-group">

            <label>
              Valid At
            </label>

            <select
              value={store}
              onChange={(e) =>
                setStore(e.target.value)
              }
            >

              <option value="">
                Select Store
              </option>

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

              <option value="Subway">
                Subway
              </option>

              <option value="KFC">
                KFC
              </option>

              <option value="Pizza Hut">
                Pizza Hut
              </option>

            </select>

          </div>



          {/* Description */}

          <div className="form-group">

            <label>
              Coupon Description
            </label>

            <textarea
              placeholder="Example: Get 20% OFF on pizza orders above ₹499"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            ></textarea>

          </div>



          {/* BUTTONS */}

          <button
            type="submit"
            className="add-coupon-btn"
          >

            {editId !== null
              ? "Update Coupon"
              : "Add Coupon"}

          </button>


          {editId !== null && (

            <button
              type="button"
              className="cancel-coupon-btn"
              onClick={cancelEdit}
            >
              Cancel
            </button>

          )}

        </form>

      </div>



      {/* COUPON LIST */}

      <div className="coupon-list-box">


        <div
          className="coupon-list-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}
        >

          <h2>
            Coupon List
          </h2>


          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search Coupon Code..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              padding: "10px",
              border:
                "1px solid #ddd",
              borderRadius: "6px",
              outline: "none"
            }}
          />

        </div>


        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>ID</th>

                <th>
                  Coupon Code
                </th>

                <th>
                  Discount
                </th>

                <th>
                  Min. Amount
                </th>

                <th>
                  Valid From
                </th>

                <th>
                  Valid Until
                </th>

                <th>
                  Valid At
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

              {filteredCoupons.length > 0 ? (

                filteredCoupons.map(
                  (coupon) => (

                    <tr
                      key={coupon.id}
                    >

                      <td>
                        {coupon.id}
                      </td>


                      <td>

                        <strong>
                          {coupon.code}
                        </strong>

                      </td>


                      <td>
                        {coupon.discount}%
                      </td>


                      <td>
                        ₹
                        {coupon.minAmount}
                      </td>


                      <td>
                        {coupon.validFrom}
                      </td>


                      <td>
                        {coupon.validUntil}
                      </td>


                      <td>
                        {coupon.store}
                      </td>


                      <td>
                        {coupon.description}
                      </td>


                      <td>

                        <button
                          className="coupon-edit-btn"
                          onClick={() =>
                            editCoupon(
                              coupon
                            )
                          }
                        >
                          Edit
                        </button>


                        <button
                          className="coupon-delete-btn"
                          onClick={() =>
                            deleteCoupon(
                              coupon.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    style={{
                      textAlign:
                        "center"
                    }}
                  >
                    No Coupon Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
=======
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
>>>>>>> d7d75d0c97c1411ad7577eb2a6a19c4a9078d035
