import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Menu.css";

const FOOD_API = "http://localhost:5000/api/foods";
const RESTAURANT_API = "http://localhost:5000/api/restaurants";
const SERVER_URL = "http://localhost:5000";

export default function Menu() {

  // =====================================
  // FOOD STATE
  // =====================================

  const [foods, setFoods] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(true);

  // =====================================
  // RESTAURANT STATE
  // =====================================

  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);

  const [selectedRestaurant, setSelectedRestaurant] = useState("All");

  // =====================================
  // SEARCH
  // =====================================

  const [search, setSearch] = useState("");

  // =====================================
  // CATEGORY
  // =====================================

  const [category, setCategory] = useState("All");


  // =====================================
  // LOAD RESTAURANTS
  // =====================================

  const loadRestaurants = async () => {

    try {

      setLoadingRestaurants(true);

      const response =
        await fetch(RESTAURANT_API);

      if (!response.ok) {
        throw new Error("Failed to load restaurants");
      }

      const data =
        await response.json();

      setRestaurants(
        Array.isArray(data)
          ? data.filter(
              (restaurant) =>
                restaurant.status !== "Inactive"
            )
          : []
      );

    } catch (error) {

      console.error(
        "RESTAURANT LOADING ERROR:",
        error
      );

      setRestaurants([]);

    } finally {

      setLoadingRestaurants(false);

    }

  };


  // =====================================
  // LOAD ALL FOODS
  // =====================================

  const loadFoods = async () => {

    try {

      setLoadingFoods(true);

      const response =
        await fetch(FOOD_API);

      if (!response.ok) {
        throw new Error("Failed to load foods");
      }

      const data =
        await response.json();

      setFoods(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "FOOD LOADING ERROR:",
        error
      );

      setFoods([]);

      alert(
        "Unable to load food items."
      );

    } finally {

      setLoadingFoods(false);

    }

  };


  // =====================================
  // LOAD DATA
  // =====================================

  useEffect(() => {

    loadRestaurants();
    loadFoods();

  }, []);


  // =====================================
  // IMAGE URL
  // =====================================

  const getImageUrl = (image) => {

    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return SERVER_URL + image;
    }

    return SERVER_URL + "/" + image;

  };


  // =====================================
  // CLEAN PRICE
  // =====================================

  const cleanPrice = (price) => {

    if (typeof price === "number") {
      return price;
    }

    if (!price) {
      return 0;
    }

    const cleanedPrice =
      String(price)
        .replace(/₹/g, "")
        .replace(/,/g, "")
        .trim();

    const numberPrice =
      Number(cleanedPrice);

    return Number.isNaN(numberPrice)
      ? 0
      : numberPrice;

  };


  // =====================================
  // ADD TO CART
  // =====================================

  const addToCart = (food) => {

    try {

      const savedCart =
        JSON.parse(
          localStorage.getItem("foodCart")
        ) || [];

      const imageUrl =
        getImageUrl(food.image);


      const existingFoodIndex =
        savedCart.findIndex(
          (item) =>
            item.id === food._id
        );


      let updatedCart;


      // =================================
      // EXISTING FOOD
      // =================================

      if (
        existingFoodIndex !== -1
      ) {

        updatedCart =
          [...savedCart];

        updatedCart[
          existingFoodIndex
        ] = {

          ...updatedCart[
            existingFoodIndex
          ],

          image:
            updatedCart[
              existingFoodIndex
            ].image ||
            imageUrl,

          quantity:
            Number(
              updatedCart[
                existingFoodIndex
              ].quantity
            ) + 1

        };

      }

      // =================================
      // NEW FOOD
      // =================================

      else {

        const newCartItem = {

          id:
            food._id,

          name:
            food.name,

          category:
            food.category,

          price:
            cleanPrice(
              food.price
            ),

          image:
            imageUrl,

          restaurantId:
            food.restaurantId || "",

          quantity:
            1

        };


        updatedCart = [

          ...savedCart,

          newCartItem

        ];

      }


      // =================================
      // SAVE CART
      // =================================

      localStorage.setItem(
        "foodCart",
        JSON.stringify(
          updatedCart
        )
      );


      window.dispatchEvent(
        new Event("cartUpdated")
      );


      alert(
        `${food.name} added to cart! 🛒`
      );

    } catch (error) {

      console.error(
        "ADD TO CART ERROR:",
        error
      );

      alert(
        "Unable to add food to cart."
      );

    }

  };


  // =====================================
  // FILTER FOODS
  // =====================================

  const filteredFoods =
    foods.filter((food) => {

      // -------------------------------
      // SEARCH
      // -------------------------------

      const matchesSearch =
        food.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );


      // -------------------------------
      // CATEGORY
      // -------------------------------

      const matchesCategory =
        category === "All" ||
        food.category === category;


      // -------------------------------
      // RESTAURANT
      // -------------------------------

      const matchesRestaurant =
        selectedRestaurant === "All" ||
        String(
          food.restaurantId
        ) === String(
          selectedRestaurant
        );


      return (
        matchesSearch &&
        matchesCategory &&
        matchesRestaurant
      );

    });


  // =====================================
  // SELECTED RESTAURANT NAME
  // =====================================

  const selectedRestaurantData =
    restaurants.find(
      (restaurant) =>
        String(restaurant._id) ===
        String(selectedRestaurant)
    );


  return (

    <div className="menu-page">

      <Navbar />


      {/* =================================
          HEADER
      ================================= */}

      <div className="menu-header">

        <h1>
          Our Menu 🍽️
        </h1>

        <p>
          Choose your favourite food,
          select a restaurant and add
          it to your cart.
        </p>

      </div>


      {/* =================================
          RESTAURANT SECTION
      ================================= */}

      <div className="restaurant-menu-section">

        <div className="restaurant-menu-title">

          <h2>
            Choose Restaurant
          </h2>

          <p>
            Select a restaurant to see
            its available food.
          </p>

        </div>


        <div className="restaurant-menu-list">

          {/* ALL RESTAURANTS */}

          <button
            type="button"
            className={
              selectedRestaurant === "All"
                ? "restaurant-menu-btn active"
                : "restaurant-menu-btn"
            }
            onClick={() =>
              setSelectedRestaurant("All")
            }
          >

            <span className="restaurant-icon">
              🍽️
            </span>

            <span>
              All Restaurants
            </span>

          </button>


          {/* RESTAURANTS */}

          {loadingRestaurants ? (

            <div className="restaurant-loading">
              Loading restaurants...
            </div>

          ) : (

            restaurants.map(
              (restaurant) => (

                <button
                  type="button"
                  key={restaurant._id}
                  className={
                    String(
                      selectedRestaurant
                    ) ===
                    String(
                      restaurant._id
                    )
                      ? "restaurant-menu-btn active"
                      : "restaurant-menu-btn"
                  }
                  onClick={() =>
                    setSelectedRestaurant(
                      restaurant._id
                    )
                  }
                >

                  <span className="restaurant-icon">

                    {restaurant.image ? (

                      <img
                        src={getImageUrl(
                          restaurant.image
                        )}
                        alt={
                          restaurant.name
                        }
                      />

                    ) : (

                      "🏪"

                    )}

                  </span>


                  <span>
                    {restaurant.name}
                  </span>

                </button>

              )
            )

          )}

        </div>

      </div>


      {/* =================================
          SELECTED RESTAURANT
      ================================= */}

      {selectedRestaurantData && (

        <div className="selected-restaurant">

          <h2>
            {selectedRestaurantData.name}
          </h2>

          <p>
            📍 {selectedRestaurantData.location}
          </p>

        </div>

      )}


      {/* =================================
          SEARCH + CATEGORY
      ================================= */}

      <div className="menu-filter">

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />


        {/* FOOD CATEGORY */}

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
        >

          <option value="All">
            All Food
          </option>

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


      {/* =================================
          FOOD LOADING
      ================================= */}

      {loadingFoods ? (

        <div className="menu-message">

          <h2>
            Loading food... 🍕
          </h2>

        </div>

      ) : filteredFoods.length === 0 ? (

        <div className="menu-message">

          <h2>
            No Food Found 😔
          </h2>

          <p>

            {selectedRestaurant !== "All"
              ? "This restaurant has no food available for the selected filter."
              : "Try another food name or category."}

          </p>

        </div>

      ) : (

        /* =================================
           FOOD CARDS
        ================================= */

        <div className="food-container">

          {filteredFoods.map(
            (food) => (

              <div
                className="food-card"
                key={food._id}
              >

                {/* IMAGE */}

                <div className="food-image">

                  {food.image ? (

                    <img
                      src={getImageUrl(
                        food.image
                      )}
                      alt={food.name}
                      onError={(e) => {
                        e.target.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div className="no-image">
                      🍽️
                    </div>

                  )}

                </div>


                {/* DETAILS */}

                <div className="food-info">

                  <h2>
                    {food.name}
                  </h2>

                  <p className="food-category">
                    {food.category}
                  </p>


                  <div className="food-bottom">

                    <h3>
                      ₹
                      {cleanPrice(
                        food.price
                      )}
                    </h3>


                    <button
                      type="button"
                      onClick={() =>
                        addToCart(food)
                      }
                    >
                      Add to Cart 🛒
                    </button>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}


      <Footer />

    </div>

  );

}
