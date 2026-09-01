import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Menu.css";

import {
  FaSearch,
  FaUtensils,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaStore,
  FaFilter,
} from "react-icons/fa";

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

  const [selectedRestaurant, setSelectedRestaurant] =
    useState("All");

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

      const response = await fetch(RESTAURANT_API);

      if (!response.ok) {
        throw new Error("Failed to load restaurants");
      }

      const data = await response.json();

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
  // LOAD FOODS
  // =====================================

  const loadFoods = async () => {

    try {

      setLoadingFoods(true);

      const response = await fetch(FOOD_API);

      if (!response.ok) {
        throw new Error("Failed to load foods");
      }

      const data = await response.json();

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

      alert("Unable to load food items.");

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

    const cleanedPrice = String(price)
      .replace(/₹/g, "")
      .replace(/,/g, "")
      .trim();

    const numberPrice = Number(cleanedPrice);

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


      // EXISTING FOOD

      if (existingFoodIndex !== -1) {

        updatedCart = [...savedCart];

        updatedCart[existingFoodIndex] = {

          ...updatedCart[existingFoodIndex],

          image:
            updatedCart[existingFoodIndex].image ||
            imageUrl,

          quantity:
            Number(
              updatedCart[existingFoodIndex].quantity
            ) + 1

        };

      }


      // NEW FOOD

      else {

        const newCartItem = {

          id: food._id,

          name: food.name,

          category: food.category,

          price: cleanPrice(food.price),

          image: imageUrl,

          restaurantId:
            food.restaurantId || "",

          quantity: 1

        };

        updatedCart = [
          ...savedCart,
          newCartItem
        ];

      }


      // SAVE CART

      localStorage.setItem(
        "foodCart",
        JSON.stringify(updatedCart)
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

  const filteredFoods = foods.filter((food) => {

    const matchesSearch =
      food.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchesCategory =
      category === "All" ||
      food.category === category;

    const matchesRestaurant =
      selectedRestaurant === "All" ||
      String(food.restaurantId) ===
        String(selectedRestaurant);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesRestaurant
    );

  });


  // =====================================
  // SELECTED RESTAURANT
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


      {/* =====================================
          MENU HERO
      ===================================== */}

      <section className="menu-hero">

        <div className="menu-hero-content">

          <span className="menu-label">
            <FaUtensils />
            COUPONBITE MENU
          </span>

          <h1>
            Explore Delicious
            <span> Food & Deals</span>
          </h1>

          <p>
            Choose your favorite restaurant, discover
            delicious food and add your favorites to
            your cart.
          </p>

        </div>

      </section>


      {/* =====================================
          RESTAURANTS
      ===================================== */}

      <section className="restaurant-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              <FaStore />
              RESTAURANTS
            </span>

            <h2>
              Choose Restaurant
            </h2>

            <p>
              Select a restaurant to explore
              its available food.
            </p>

          </div>

        </div>


        <div className="restaurant-list">

          {/* ALL */}

          <button
            type="button"
            className={
              selectedRestaurant === "All"
                ? "restaurant-btn active"
                : "restaurant-btn"
            }
            onClick={() =>
              setSelectedRestaurant("All")
            }
          >

            <span className="restaurant-icon">
              <FaUtensils />
            </span>

            <span className="restaurant-name">
              All Restaurants
            </span>

          </button>


          {/* RESTAURANTS */}

          {loadingRestaurants ? (

            <div className="restaurant-loading">
              Loading restaurants...
            </div>

          ) : (

            restaurants.map((restaurant) => (

              <button
                type="button"
                key={restaurant._id}
                className={
                  String(selectedRestaurant) ===
                  String(restaurant._id)
                    ? "restaurant-btn active"
                    : "restaurant-btn"
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
                      alt={restaurant.name}
                    />

                  ) : (

                    <FaStore />

                  )}

                </span>

                <span className="restaurant-name">
                  {restaurant.name}
                </span>

              </button>

            ))

          )}

        </div>

      </section>


      {/* =====================================
          SELECTED RESTAURANT
      ===================================== */}

      {selectedRestaurantData && (

        <div className="selected-restaurant">

          <div className="selected-icon">
            <FaStore />
          </div>

          <div>

            <span>
              CURRENT RESTAURANT
            </span>

            <h2>
              {selectedRestaurantData.name}
            </h2>

            <p>
              <FaMapMarkerAlt />
              {selectedRestaurantData.location}
            </p>

          </div>

        </div>

      )}


      {/* =====================================
          FILTER SECTION
      ===================================== */}

      <section className="menu-content">

        <div className="menu-filter">

          {/* SEARCH */}

          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Search your favorite food..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* CATEGORY */}

          <div className="category-box">

            <FaFilter />

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
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

        </div>


        {/* =====================================
            RESULT INFO
        ===================================== */}

        {!loadingFoods &&
          filteredFoods.length > 0 && (

            <div className="food-result-info">

              <div>

                <h2>
                  Popular Food
                </h2>

                <p>
                  {filteredFoods.length} items available
                </p>

              </div>

              {(search || category !== "All") && (

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                >
                  Clear Filters
                </button>

              )}

            </div>

          )}


        {/* =====================================
            LOADING
        ===================================== */}

        {loadingFoods ? (

          <div className="menu-message">

            <div className="loading-icon">
              <FaUtensils />
            </div>

            <h2>
              Loading delicious food...
            </h2>

            <p>
              Please wait while we prepare the menu.
            </p>

          </div>

        ) : filteredFoods.length === 0 ? (

          <div className="menu-message">

            <div className="empty-icon">
              🍽️
            </div>

            <h2>
              No Food Found
            </h2>

            <p>

              {selectedRestaurant !== "All"
                ? "This restaurant has no food available for the selected filter."
                : "Try another food name or category."}

            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setSelectedRestaurant("All");
              }}
            >
              View All Food
            </button>

          </div>

        ) : (

          /* =====================================
             FOOD CARDS
          ===================================== */

          <div className="food-container">

            {filteredFoods.map((food) => (

              <div
                className="food-card"
                key={food._id}
              >

                {/* IMAGE */}

                <div className="food-image">

                  {food.image ? (

                    <img
                      src={getImageUrl(food.image)}
                      alt={food.name}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />

                  ) : (

                    <div className="no-image">
                      <FaUtensils />
                    </div>

                  )}

                  <span className="food-badge">
                    {food.category}
                  </span>

                </div>


                {/* DETAILS */}

                <div className="food-info">

                  <span className="food-category">
                    {food.category}
                  </span>

                  <h2>
                    {food.name}
                  </h2>


                  <div className="food-bottom">

                    <div className="food-price">

                      <small>
                        Coupon Price
                      </small>

                      <strong>
                        ₹{cleanPrice(food.price)}
                      </strong>

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        addToCart(food)
                      }
                    >
                      <FaShoppingCart />
                      Add to Cart
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      <Footer />

    </div>

  );

}