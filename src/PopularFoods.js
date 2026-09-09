import React from "react";
import "./PopularFoods.css";

import {
  FaShoppingCart,
  FaTag,
  FaStar,
  FaStarHalfAlt
} from "react-icons/fa";

import pizza1 from "./Images/Pizza1.jpg";
import burger1 from "./Images/burger1.jpg";
import pasta1 from "./Images/Pasta1.jpg";
import sandwich1 from "./Images/sandwich1.jpg";
import drink1 from "./Images/drink1.jpg";
import dessert1 from "./Images/dessert1.jpg";

export default function PopularFoods() {

  const foods = [
    {
      id: 1,
      name: "Burger",
      price: 99,
      category: "Burger",
      image: burger1,
      rating: 4.5
    },
    {
      id: 2,
      name: "Pizza",
      price: 199,
      category: "Pizza",
      image: pizza1,
      rating: 4.8
    },
    {
      id: 3,
      name: "Pasta",
      price: 149,
      category: "Pasta",
      image: pasta1,
      rating: 4.4
    },
    {
      id: 4,
      name: "Sandwich",
      price: 89,
      category: "Sandwich",
      image: sandwich1,
      rating: 4.3
    },
    {
      id: 5,
      name: "Cake",
      price: 129,
      category: "Dessert",
      image: dessert1,
      rating: 4.7
    },
    {
      id: 6,
      name: "Mango Shake",
      price: 79,
      category: "Drink",
      image: drink1,
      rating: 4.6
    }
  ];

  /* =========================================
     ADD TO CART
  ========================================= */

  const addToCart = (food) => {

    const savedCart = localStorage.getItem("foodCart");

    let cart = savedCart
      ? JSON.parse(savedCart)
      : [];

    const existingItem = cart.find(
      (item) => item.id === food.id
    );

    if (existingItem) {

      const updatedCart = cart.map((item) =>
        item.id === food.id
          ? {
              ...item,
              quantity: Number(item.quantity || 1) + 1
            }
          : item
      );

      localStorage.setItem(
        "foodCart",
        JSON.stringify(updatedCart)
      );

    } else {

      const newItem = {
        ...food,
        quantity: 1
      };

      const updatedCart = [
        ...cart,
        newItem
      ];

      localStorage.setItem(
        "foodCart",
        JSON.stringify(updatedCart)
      );
    }

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    alert(`${food.name} added to cart!`);
  };

  /* =========================================
     RATING STARS
  ========================================= */

  const renderStars = (rating) => {

    const stars = [];

    for (let i = 1; i <= 5; i++) {

      if (rating >= i) {

        stars.push(
          <FaStar
            key={i}
            className="rating-star filled"
          />
        );

      } else if (rating >= i - 0.5) {

        stars.push(
          <FaStarHalfAlt
            key={i}
            className="rating-star filled"
          />
        );

      } else {

        stars.push(
          <FaStar
            key={i}
            className="rating-star empty"
          />
        );
      }
    }

    return stars;
  };

  return (
    <div className="foodcontainer">

      {foods.map((food) => (

        <div
          className="foodcard"
          key={food.id}
        >

          {/* =================================
              FOOD IMAGE
          ================================= */}

          <div className="food-image-wrapper">

            <img
              src={food.image}
              alt={food.name}
            />

            <span className="food-tag">
              <FaTag />
              Popular
            </span>

          </div>

          {/* =================================
              FOOD CONTENT
          ================================= */}

          <div className="food-content">

            <span className="food-category">
              {food.category}
            </span>

            <h3>
              {food.name}
            </h3>

            {/* =================================
                FOOD RATING
            ================================= */}

            <div className="food-rating">

              <div className="rating-stars">
                {renderStars(food.rating)}
              </div>

              <span className="rating-number">
                {food.rating}
              </span>

            </div>

            <div className="food-bottom">

              <div className="food-price">

                <small>
                  Coupon from
                </small>

                <strong>
                  ₹{food.price}
                </strong>

              </div>

              <button
                onClick={() => addToCart(food)}
                className="buy-food-btn"
              >
                <FaShoppingCart />
                Buy Coupon
              </button>

            </div>

          </div>

        </div>

      ))}

    </div>
  );
}