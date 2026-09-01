import React, { useEffect, useState } from "react";
import "./ManageRestaurant.css";

const API_URL = "http://localhost:5000/api/restaurants";
const SERVER_URL = "http://localhost:5000";

export default function ManageRestaurant() {

  // ============================================================
  // FORM STATE
  // ============================================================

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    description: "",
    status: "Active"
  });

  const [image, setImage] = useState(null);


  // ============================================================
  // RESTAURANTS
  // ============================================================

  const [restaurants, setRestaurants] = useState([]);


  // ============================================================
  // EDIT STATE
  // ============================================================

  const [editId, setEditId] = useState(null);


  // ============================================================
  // LOADING STATES
  // ============================================================

  const [loadingRestaurants, setLoadingRestaurants] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);


  // ============================================================
  // FETCH RESTAURANTS
  // ============================================================

  const fetchRestaurants = async () => {

    try {

      setLoadingRestaurants(true);

      const response = await fetch(API_URL);


      if (!response.ok) {

        throw new Error(
          `Failed to load restaurants (${response.status})`
        );

      }


      const data = await response.json();


      setRestaurants(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (error) {

      console.error(
        "FETCH RESTAURANTS ERROR:",
        error
      );

      alert(
        "Failed to load restaurants. Please check the backend server."
      );

    } finally {

      setLoadingRestaurants(false);

    }

  };


  // ============================================================
  // LOAD RESTAURANTS WHEN PAGE OPENS
  // ============================================================

  useEffect(() => {

    fetchRestaurants();

  }, []);


  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFormData((previous) => ({

      ...previous,

      [name]: value

    }));

  };


  // ============================================================
  // HANDLE IMAGE
  // ============================================================

  const handleImageChange = (e) => {

    const selectedFile =
      e.target.files?.[0];


    if (selectedFile) {

      setImage(selectedFile);

    } else {

      setImage(null);

    }

  };


  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = () => {

    setFormData({

      name: "",
      location: "",
      category: "",
      description: "",
      status: "Active"

    });


    setImage(null);

    setEditId(null);


    const fileInput =
      document.getElementById(
        "restaurant-image"
      );


    if (fileInput) {

      fileInput.value = "";

    }

  };


  // ============================================================
  // ADD / UPDATE RESTAURANT
  // ============================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // ========================================================
    // PREVENT DOUBLE CLICK
    // ========================================================

    if (saving) {

      return;

    }


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!formData.name.trim()) {

      alert(
        "Please enter restaurant name"
      );

      return;

    }


    if (!formData.location.trim()) {

      alert(
        "Please enter restaurant location"
      );

      return;

    }


    if (!formData.category.trim()) {

      alert(
        "Please select restaurant category"
      );

      return;

    }


    // Image required only while adding

    if (!editId && !image) {

      alert(
        "Please select restaurant image"
      );

      return;

    }


    // ========================================================
    // CREATE FORM DATA
    // ========================================================

    const data = new FormData();


    data.append(
      "name",
      formData.name.trim()
    );


    data.append(
      "location",
      formData.location.trim()
    );


    data.append(
      "category",
      formData.category.trim()
    );


    data.append(
      "description",
      formData.description.trim()
    );


    data.append(
      "status",
      formData.status
    );


    if (image) {

      data.append(
        "image",
        image
      );

    }


    // ========================================================
    // SAVE
    // ========================================================

    try {

      setSaving(true);


      let response;


      // ======================================================
      // UPDATE RESTAURANT
      // ======================================================

      if (editId) {

        response =
          await fetch(
            `${API_URL}/${editId}`,
            {
              method: "PUT",
              body: data
            }
          );

      }


      // ======================================================
      // ADD RESTAURANT
      // ======================================================

      else {

        response =
          await fetch(
            API_URL,
            {
              method: "POST",
              body: data
            }
          );

      }


      // ======================================================
      // READ RESPONSE
      // ======================================================

      const contentType =
        response.headers.get(
          "content-type"
        );


      let result;


      if (
        contentType &&
        contentType.includes(
          "application/json"
        )
      ) {

        result =
          await response.json();

      } else {

        const text =
          await response.text();

        result = {
          message:
            text ||
            "Unexpected server response"
        };

      }


      // ======================================================
      // CHECK RESPONSE
      // ======================================================

      if (!response.ok) {

        throw new Error(
          result.message ||
          (
            editId
              ? "Failed to update restaurant"
              : "Failed to add restaurant"
          )
        );

      }


      // ======================================================
      // SUCCESS
      // ======================================================

      alert(
        editId
          ? "Restaurant updated successfully"
          : "Restaurant added successfully"
      );


      // Reset form

      resetForm();


      // Reload restaurant list

      await fetchRestaurants();


    } catch (error) {

      console.error(
        "RESTAURANT SAVE ERROR:",
        error
      );


      alert(
        error.message ||
        "Something went wrong while saving restaurant"
      );


    } finally {

      setSaving(false);

    }

  };


  // ============================================================
  // EDIT RESTAURANT
  // ============================================================

  const handleEdit = (restaurant) => {

    setEditId(
      restaurant._id
    );


    setFormData({

      name:
        restaurant.name || "",

      location:
        restaurant.location || "",

      category:
        restaurant.category || "",

      description:
        restaurant.description || "",

      status:
        restaurant.status || "Active"

    });


    // Existing image is kept by backend.
    // New image is optional during edit.

    setImage(null);


    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  };


  // ============================================================
  // DELETE RESTAURANT
  // ============================================================

  const handleDelete = async (id) => {

    if (deleting) {

      return;

    }


    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this restaurant?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      setDeleting(true);


      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE"
          }
        );


      const contentType =
        response.headers.get(
          "content-type"
        );


      let result;


      if (
        contentType &&
        contentType.includes(
          "application/json"
        )
      ) {

        result =
          await response.json();

      } else {

        result = {
          message:
            await response.text()
        };

      }


      if (!response.ok) {

        throw new Error(
          result.message ||
          "Failed to delete restaurant"
        );

      }


      alert(
        "Restaurant deleted successfully"
      );


      await fetchRestaurants();


    } catch (error) {

      console.error(
        "DELETE RESTAURANT ERROR:",
        error
      );


      alert(
        error.message ||
        "Failed to delete restaurant"
      );


    } finally {

      setDeleting(false);

    }

  };


  // ============================================================
  // IMAGE URL
  // ============================================================

  const getImageUrl = (image) => {

    if (!image) {

      return "";

    }


    if (
      image.startsWith(
        "http://"
      ) ||
      image.startsWith(
        "https://"
      )
    ) {

      return image;

    }


    if (
      image.startsWith("/")
    ) {

      return (
        SERVER_URL +
        image
      );

    }


    return (
      SERVER_URL +
      "/" +
      image
    );

  };


  // ============================================================
  // JSX
  // ============================================================

  return (

    <div className="manage-restaurant">


      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="restaurant-header">

        <div>

          <h1>
            Manage Restaurants
          </h1>

          <p>
            Add and manage restaurants available
            in your Smart Food Coupon system.
          </p>

        </div>


        <div className="restaurant-count">

          <span>
            {restaurants.length}
          </span>

          <small>
            Restaurants
          </small>

        </div>

      </div>


      {/* ======================================================
          ADD / EDIT FORM
      ====================================================== */}

      <div className="restaurant-form-card">

        <div className="form-title">

          <h2>

            {editId
              ? "Edit Restaurant"
              : "Add Restaurant"}

          </h2>


          <p>

            {editId
              ? "Update restaurant information"
              : "Enter restaurant details below"}

          </p>

        </div>


        <form
          onSubmit={handleSubmit}
        >

          <div className="form-grid">


            {/* ==================================================
                RESTAURANT NAME
            ================================================== */}

            <div className="form-group">

              <label>
                Restaurant Name
              </label>


              <input
                type="text"
                name="name"
                placeholder="e.g. La Pino'z"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
              />

            </div>


            {/* ==================================================
                LOCATION
            ================================================== */}

            <div className="form-group">

              <label>
                Location
              </label>


              <input
                type="text"
                name="location"
                placeholder="e.g. Ahmedabad"
                value={
                  formData.location
                }
                onChange={
                  handleChange
                }
              />

            </div>


            {/* ==================================================
                CATEGORY
            ================================================== */}

            <div className="form-group">

              <label>
                Restaurant Category
              </label>


              <select
                name="category"
                value={
                  formData.category
                }
                onChange={
                  handleChange
                }
              >

                <option value="">
                  Select Category
                </option>

                <option value="Pizza">
                  Pizza
                </option>

                <option value="Burger">
                  Burger
                </option>

                <option value="Fast Food">
                  Fast Food
                </option>

                <option value="Indian">
                  Indian
                </option>

                <option value="Desserts">
                  Desserts
                </option>

                <option value="Multi Cuisine">
                  Multi Cuisine
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            {/* ==================================================
                STATUS
            ================================================== */}

            <div className="form-group">

              <label>
                Status
              </label>


              <select
                name="status"
                value={
                  formData.status
                }
                onChange={
                  handleChange
                }
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>


            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <div className="form-group full-width">

              <label>
                Description
              </label>


              <textarea
                name="description"
                placeholder="Enter restaurant description..."
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                rows="4"
              />

            </div>


            {/* ==================================================
                IMAGE
            ================================================== */}

            <div className="form-group full-width">

              <label>
                Restaurant Image
              </label>


              <input
                id="restaurant-image"
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
              />


              <small className="image-help">

                {editId
                  ? "Select a new image only if you want to replace the existing image."
                  : "Upload restaurant image"}

              </small>

            </div>

          </div>


          {/* ==================================================
              BUTTONS
          ================================================== */}

          <div className="form-actions">


            <button
              type="submit"
              className="save-restaurant-btn"
              disabled={saving}
            >

              {saving

                ? editId
                  ? "Updating..."
                  : "Saving..."

                : editId
                  ? "Update Restaurant"
                  : "Add Restaurant"}

            </button>


            {editId && (

              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>


      {/* ======================================================
          RESTAURANT LIST
      ====================================================== */}

      <div className="restaurant-list-section">

        <div className="list-header">

          <div>

            <h2>
              All Restaurants
            </h2>

            <p>
              Restaurants added by admin
            </p>

          </div>

        </div>


        {/* ====================================================
            LOADING
        ==================================================== */}

        {loadingRestaurants ? (

          <div className="restaurant-loading">

            Loading restaurants...

          </div>

        ) : restaurants.length === 0 ? (

          /* ==================================================
             EMPTY
          ================================================== */

          <div className="no-restaurants">

            <div className="empty-icon">
              🏪
            </div>


            <h3>
              No Restaurants Added
            </h3>


            <p>
              Add your first restaurant using
              the form above.
            </p>

          </div>

        ) : (

          /* ==================================================
             RESTAURANT GRID
          ================================================== */

          <div className="restaurant-grid">

            {restaurants.map(
              (restaurant) => (

                <div
                  className="restaurant-card"
                  key={
                    restaurant._id
                  }
                >


                  {/* ==========================================
                      IMAGE
                  ========================================== */}

                  <div className="restaurant-image">

                    {restaurant.image ? (

                      <img
                        src={
                          getImageUrl(
                            restaurant.image
                          )
                        }
                        alt={
                          restaurant.name
                        }

                        onError={(
                          e
                        ) => {

                          e.target.style.display =
                            "none";

                        }}
                      />

                    ) : (

                      <div className="no-image">
                        🏪
                      </div>

                    )}


                    {/* STATUS */}

                    <span
                      className={
                        `status-badge ${
                          restaurant.status ===
                          "Active"
                            ? "active"
                            : "inactive"
                        }`
                      }
                    >

                      {
                        restaurant.status
                      }

                    </span>

                  </div>


                  {/* ==========================================
                      DETAILS
                  ========================================== */}

                  <div className="restaurant-info">

                    <h3>
                      {
                        restaurant.name
                      }
                    </h3>


                    <p className="restaurant-location">

                      📍{" "}
                      {
                        restaurant.location
                      }

                    </p>


                    <span className="restaurant-category">

                      {
                        restaurant.category
                      }

                    </span>


                    {restaurant.description && (

                      <p className="restaurant-description">

                        {
                          restaurant.description
                        }

                      </p>

                    )}


                    {/* ========================================
                        ACTIONS
                    ======================================== */}

                    <div className="restaurant-actions">

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(
                            restaurant
                          )
                        }
                        disabled={saving}
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            restaurant._id
                          )
                        }
                        disabled={deleting}
                      >

                        {deleting
                          ? "Deleting..."
                          : "Delete"}

                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

}