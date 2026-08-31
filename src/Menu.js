import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Menu.css";

const API_URL = "http://localhost:5000/api/foods";
const SERVER_URL = "http://localhost:5000";

export default function Menu() {
  // =====================================
  // FOOD LIST
  // =====================================

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================
  // SEARCH AND CATEGORY
  // =====================================

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // =====================================
  // LOAD FOODS FROM DATABASE
  // =====================================

  const loadFoods = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load foods");
      }

      const data = await response.json();

      setFoods(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FOOD LOADING ERROR:", error);

      setFoods([]);

      alert("Unable to load food items.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOAD FOODS WHEN PAGE OPENS
  // =====================================

  useEffect(() => {
    loadFoods();
  }, []);

  // =====================================
  // GET IMAGE URL
  // =====================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    // If backend already returns full URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // If image starts with /
    if (image.startsWith("/")) {
      return SERVER_URL + image;
    }

    // If image does not start with /
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
  // ADD FOOD TO CART
  // =====================================

  const addToCart = (food) => {
    try {
      // Get existing cart
      const savedCart =
        JSON.parse(
          localStorage.getItem("foodCart")
        ) || [];

      // Create complete image URL
      const imageUrl = getImageUrl(food.image);

      // Check whether food already exists
      const existingFoodIndex =
        savedCart.findIndex(
          (item) => item.id === food._id
        );

      let updatedCart;

      // =================================
      // FOOD ALREADY EXISTS
      // =================================

      if (existingFoodIndex !== -1) {
        updatedCart = [...savedCart];

        updatedCart[existingFoodIndex] = {
          ...updatedCart[existingFoodIndex],

          // Make sure image is present
          image:
            updatedCart[existingFoodIndex].image ||
            imageUrl,

          quantity:
            Number(
              updatedCart[existingFoodIndex].quantity
            ) + 1
        };
      } else {
        // =================================
        // NEW FOOD
        // =================================

        const newCartItem = {
          id: food._id,

          name: food.name,

          category: food.category,

          price: cleanPrice(food.price),

          // IMPORTANT:
          // Save complete image URL
          image: imageUrl,

          quantity: 1
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
        JSON.stringify(updatedCart)
      );

      // =================================
      // UPDATE NAVBAR CART COUNT
      // =================================

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
  // FILTER FOOD
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

    return (
      matchesSearch &&
      matchesCategory
    );
  });

  // =====================================
  // JSX
  // =====================================

  return (
    <div className="menu-page">

      <Navbar />

      {/* =================================
          PAGE HEADER
      ================================= */}

      <div className="menu-header">

        <h1>
          Our Menu 🍽️
        </h1>

        <p>
          Choose your favourite food and
          add it to your cart.
        </p>

      </div>


      {/* =================================
          SEARCH AND FILTER
      ================================= */}

      <div className="menu-filter">

        {/* Search */}

        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* Category */}

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >

          <option value="All">
            All
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
          LOADING
      ================================= */}

      {loading ? (

        <div className="menu-message">

          <h2>
            Loading food... 🍕
          </h2>

        </div>

      ) : filteredFoods.length === 0 ? (

        /* =================================
           NO FOOD
        ================================= */

        <div className="menu-message">

          <h2>
            No Food Found 😔
          </h2>

          <p>
            Try another food name or category.
          </p>

        </div>

      ) : (

        /* =================================
           FOOD CONTAINER
        ================================= */

        <div className="food-container">

          {filteredFoods.map((food) => (

            <div
              className="food-card"
              key={food._id}
            >

              {/* =================================
                  FOOD IMAGE
              ================================= */}

              <div className="food-image">

                {food.image ? (

                  <img
                    src={getImageUrl(food.image)}
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


              {/* =================================
                  FOOD DETAILS
              ================================= */}

              <div className="food-info">

                <h2>
                  {food.name}
                </h2>

                <p className="food-category">
                  {food.category}
                </p>

                <div className="food-bottom">

                  <h3>
                    ₹{cleanPrice(food.price)}
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

          ))}

        </div>

      )}

      <Footer />

    </div>
  );
}