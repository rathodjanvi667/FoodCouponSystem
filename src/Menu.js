import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Menu.css";


// =====================================
// BACKEND URL
// =====================================

const API_URL = "http://localhost:5000/api/foods";
const SERVER_URL = "http://localhost:5000";


export default function Menu() {

  // =====================================
  // STATES
  // =====================================

  const [foods, setFoods] = useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);


  // =====================================
  // LOAD FOODS FROM MONGODB
  // =====================================

  useEffect(() => {

    const loadFoods = async () => {

      try {

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

        console.log(
          "Error loading foods:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    loadFoods();

  }, []);


  // =====================================
  // IMAGE URL
  // =====================================

  const getImageUrl = (image) => {

    if (!image) {

      return "";

    }


    // Full image URL

    if (image.startsWith("http")) {

      return image;

    }


    // Backend uploaded image

    return SERVER_URL + image;

  };


  // =====================================
  // FILTER FOOD
  // =====================================

  const filteredFoods =
    foods.filter((food) => {

      const categoryMatch =
        selectedCategory === "All" ||
        food.category === selectedCategory;


      const searchMatch =
        food.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );


      return (
        categoryMatch &&
        searchMatch
      );

    });


  // =====================================
  // ADD TO CART
  // =====================================

  const addToCart = (food) => {

    const existingCart =
      JSON.parse(
        localStorage.getItem("foodCart")
      ) || [];


    const existingItem =
      existingCart.find(
        (item) =>
          item._id === food._id
      );


    let updatedCart;


    if (existingItem) {

      updatedCart =
        existingCart.map(
          (item) => {

            if (
              item._id === food._id
            ) {

              return {

                ...item,

                quantity:
                  (item.quantity || 1) + 1

              };

            }

            return item;

          }
        );

    } else {

      updatedCart = [

        ...existingCart,

        {

          ...food,

          quantity: 1

        }

      ];

    }


    localStorage.setItem(
      "foodCart",
      JSON.stringify(updatedCart)
    );


    // Notify Navbar / Cart

    window.dispatchEvent(
      new Event("cartUpdated")
    );


    alert(
      `${food.name} added to cart!`
    );

  };


  // =====================================
  // CATEGORIES
  // =====================================

  const categories = [

    "All",
    "Pizza",
    "Burger",
    "Pasta",
    "Sandwich",
    "Drinks",
    "Desserts"

  ];


  // =====================================
  // JSX
  // =====================================

  return (

    <div className="menupage">

      <Navbar />


      {/* =================================
          SEARCH
      ================================== */}

        <br></br>

      <div className="searchbox">

        <input
          type="text"
          placeholder="Search your favourite food.."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>
      
      <br></br>


      {/* =================================
          CATEGORIES
      ================================== */}

      <div className="category-buttons">

        {categories.map(
          (category) => (

            <button
              key={category}
              onClick={() =>
                setSelectedCategory(
                  category
                )
              }
              className={
                selectedCategory === category
                  ? "active"
                  : ""
              }
            >

              {category}

            </button>

          )
        )}

      </div>


      {/* =================================
          FOOD SECTION
      ================================== */}

      <section className="popular-foods">

        <h1>
          Popular Foods
        </h1>


        {/* Loading */}

        {loading ? (

          <p>
            Loading foods...
          </p>

        ) : filteredFoods.length === 0 ? (

          <p>
            No food items found.
          </p>

        ) : (

          <div className="food-grid">

            {filteredFoods.map(
              (food) => (

                <div
                  className="food-card"
                  key={food._id}
                >


                  {/* IMAGE */}

                  <img
                    src={getImageUrl(
                      food.image
                    )}
                    alt={food.name}
                    className="food-image"
                  />


                  {/* FOOD NAME */}

                  <h2>
                    {food.name}
                  </h2>


                  {/* CATEGORY */}

                  <p>
                    {food.category}
                  </p>


                  {/* PRICE */}

                  <h3>
                    ₹{food.price}
                  </h3>


                  {/* RATING */}

                  <div className="rating">

                    ⭐ 4.5

                  </div>


                  {/* ADD TO CART */}

                  <button
                    className="add-cart-btn"
                    onClick={() =>
                      addToCart(food)
                    }
                  >

                    Add To Cart

                  </button>


                </div>

              )
            )}

          </div>

        )}

      </section>


      <Footer />

    </div>

  );

}