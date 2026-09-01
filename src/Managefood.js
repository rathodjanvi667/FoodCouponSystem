import React, { useEffect, useState } from "react";
import "./Managefood.css";

const API_URL = "http://localhost:5000/api/foods";
const RESTAURANT_API_URL = "http://localhost:5000/api/restaurants";
const SERVER_URL = "http://localhost:5000";

export default function ManageFood() {

  // =====================================
  // FOOD LIST
  // =====================================

  const [foods, setFoods] = useState([]);

  const [loading, setLoading] = useState(true);


  // =====================================
  // RESTAURANT LIST
  // =====================================

  const [restaurants, setRestaurants] = useState([]);

  const [restaurantLoading, setRestaurantLoading] =
    useState(true);


  // =====================================
  // FORM DATA
  // =====================================

  const [name, setName] = useState("");

  const [category, setCategory] =
    useState("Pizza");

  const [price, setPrice] = useState("");

  const [restaurantId, setRestaurantId] =
    useState("");

  // Selected image
  const [image, setImage] = useState(null);


  // =====================================
  // LOAD FOODS
  // =====================================

  const loadFoods = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(API_URL);

      if (!response.ok) {

        throw new Error(
          "Failed to load foods"
        );

      }

      const data =
        await response.json();

      setFoods(data);

    } catch (error) {

      console.log(error);

      alert(
        "Unable to load foods from database"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================
  // LOAD RESTAURANTS
  // =====================================

  const loadRestaurants = async () => {

    try {

      setRestaurantLoading(true);

      const response =
        await fetch(
          RESTAURANT_API_URL
        );

      if (!response.ok) {

        throw new Error(
          "Failed to load restaurants"
        );

      }

      const data =
        await response.json();

      setRestaurants(data);

    } catch (error) {

      console.log(
        "RESTAURANT LOAD ERROR:",
        error
      );

      alert(
        "Unable to load restaurants from database"
      );

    } finally {

      setRestaurantLoading(false);

    }

  };


  // =====================================
  // PAGE LOAD
  // =====================================

  useEffect(() => {

    loadFoods();

    loadRestaurants();

  }, []);


  // =====================================
  // ADD FOOD
  // =====================================

  const addFood = async (e) => {

    e.preventDefault();


    // =====================================
    // VALIDATION
    // =====================================

    if (
      name.trim() === "" ||
      price === "" ||
      !image
    ) {

      alert(
        "Please enter Food Name, Price and select an Image"
      );

      return;

    }


    // Restaurant validation

    if (!restaurantId) {

      alert(
        "Please select a restaurant"
      );

      return;

    }


    try {

      // =================================
      // FORM DATA
      // =================================

      const formData =
        new FormData();

      formData.append(
        "name",
        name.trim()
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "price",
        price
      );

      formData.append(
        "restaurantId",
        restaurantId
      );

      formData.append(
        "image",
        image
      );


      // =================================
      // SEND TO BACKEND
      // =================================

      const response =
        await fetch(
          API_URL,
          {
            method: "POST",
            body: formData
          }
        );


      if (!response.ok) {

        const errorData =
          await response.json();

        throw new Error(
          errorData.message ||
          "Failed to add food"
        );

      }


      const savedFood =
        await response.json();


      // =================================
      // UPDATE FOOD LIST
      // =================================

      setFoods(
        (previousFoods) => [
          savedFood,
          ...previousFoods
        ]
      );


      // =================================
      // CLEAR FORM
      // =================================

      setName("");

      setCategory("Pizza");

      setPrice("");

      setRestaurantId("");

      setImage(null);


      // Clear file input

      e.target.reset();


      alert(
        "Food Added Successfully! 🎉"
      );


    } catch (error) {

      console.log(
        "ADD FOOD ERROR:",
        error
      );

      alert(
        error.message ||
        "Failed to add food"
      );

    }

  };


  // =====================================
  // DELETE FOOD
  // =====================================

  const deleteFood = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this food?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE"
          }
        );


      if (!response.ok) {

        const errorData =
          await response.json();

        throw new Error(
          errorData.message ||
          "Failed to delete food"
        );

      }


      setFoods(
        (previousFoods) =>
          previousFoods.filter(
            (food) =>
              food._id !== id
          )
      );


      alert(
        "Food Deleted Successfully!"
      );


    } catch (error) {

      console.log(
        "DELETE FOOD ERROR:",
        error
      );

      alert(
        error.message ||
        "Failed to delete food"
      );

    }

  };


  // =====================================
  // IMAGE URL
  // =====================================

  const getImageUrl = (image) => {

    if (!image) {

      return "";

    }


    if (
      image.startsWith("http")
    ) {

      return image;

    }


    return SERVER_URL + image;

  };


  // =====================================
  // GET RESTAURANT NAME
  // =====================================

  const getRestaurantName = (id) => {

    if (!id) {

      return "Not Assigned";

    }


    const restaurant =
      restaurants.find(
        (item) =>
          item._id === id ||
          item._id === String(id)
      );


    return restaurant
      ? restaurant.name
      : "Restaurant Not Found";

  };


  // =====================================
  // JSX
  // =====================================

  return (

    <div className="manage-food">


      {/* =================================
          HEADER
      ================================== */}

      <div className="manage-header">

        <div>

          <h1>
            Manage Food
          </h1>

          <p>
            Add and manage food items by restaurant
          </p>

        </div>


        <a href="/Admindashboard">
          Back to Dashboard
        </a>

      </div>


      {/* =================================
          ADD FOOD
      ================================== */}

      <div className="food-form-box">

        <h2>
          Add New Food
        </h2>


        <form onSubmit={addFood}>


          {/* Food Name */}

          <div className="food-form-field">

            <label>
              Food Name
            </label>

            <input
              type="text"
              placeholder="e.g. Margherita Pizza"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* Restaurant */}

          <div className="food-form-field">

            <label>
              Restaurant
            </label>

            <select
              value={restaurantId}
              onChange={(e) =>
                setRestaurantId(
                  e.target.value
                )
              }
              disabled={restaurantLoading}
            >

              <option value="">
                {restaurantLoading
                  ? "Loading Restaurants..."
                  : "Select Restaurant"}
              </option>


              {restaurants
                .filter(
                  (restaurant) =>
                    restaurant.status !==
                    "Inactive"
                )
                .map(
                  (restaurant) => (

                    <option
                      key={restaurant._id}
                      value={restaurant._id}
                    >
                      {restaurant.name}
                    </option>

                  )
                )}

            </select>

          </div>


          {/* Category */}

          <div className="food-form-field">

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            >

              <option value="Pizza">
                Pizza
              </option>

              <option value="Burger">
                Burger
              </option>

              <option value="Pasta">
                Pasta
              </option>

              <option value="Sandwich">
                Sandwich
              </option>

              <option value="Dessert">
                Dessert
              </option>

              <option value="Drinks">
                Drinks
              </option>

            </select>

          </div>


          {/* Price */}

          <div className="food-form-field">

            <label>
              Price
            </label>

            <input
              type="number"
              min="1"
              placeholder="Price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
            />

          </div>


          {/* Image */}

          <div className="food-form-field image-field">

            <label>
              Food Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(
                  e.target.files[0]
                )
              }
            />

          </div>


          {/* Add Button */}

          <button
            type="submit"
            className="add-food-btn"
          >
            Add Food
          </button>

        </form>

      </div>


      {/* =================================
          FOOD LIST
      ================================== */}

      <div className="food-list-box">

        <div className="food-list-header">

          <div>

            <h2>
              Food List
            </h2>

            <p>
              Food items assigned to restaurants
            </p>

          </div>

          <span className="food-count">
            {foods.length} Foods
          </span>

        </div>


        {loading ? (

          <div className="food-loading">
            Loading foods...
          </div>

        ) : foods.length === 0 ? (

          <div className="no-foods">
            No food items available.
          </div>

        ) : (

          <div className="food-table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Image
                  </th>

                  <th>
                    Food Name
                  </th>

                  <th>
                    Restaurant
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {foods.map(
                  (food) => (

                    <tr
                      key={food._id}
                    >

                      {/* IMAGE */}

                      <td>

                        {food.image ? (

                          <img
                            src={getImageUrl(
                              food.image
                            )}
                            alt={
                              food.name
                            }
                            className="food-image"
                          />

                        ) : (

                          <div className="no-food-image">
                            🍽️
                          </div>

                        )}

                      </td>


                      {/* FOOD NAME */}

                      <td>

                        <strong>
                          {food.name}
                        </strong>

                      </td>


                      {/* RESTAURANT */}

                      <td>

                        <span className="restaurant-name">

                          {getRestaurantName(
                            food.restaurantId
                          )}

                        </span>

                      </td>


                      {/* CATEGORY */}

                      <td>

                        <span className="category-badge">

                          {food.category}

                        </span>

                      </td>


                      {/* PRICE */}

                      <td>

                        <strong className="food-price">
                          ₹{food.price}
                        </strong>

                      </td>


                      {/* DELETE */}

                      <td>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteFood(
                              food._id
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