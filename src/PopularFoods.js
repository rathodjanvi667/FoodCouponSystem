import React from "react";
import "./PopularFoods.css";

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
      image: burger1
    },
    {
      id: 2,
      name: "Pizza",
      price: 199,
      category: "Pizza",
      image: pizza1
    },
    {
      id: 3,
      name: "Pasta",
      price: 149,
      category: "Pasta",
      image: pasta1
    },
    {
      id: 4,
      name: "Sandwich",
      price: 89,
      category: "Sandwich",
      image: sandwich1
    },
    {
      id: 5,
      name: "Cake",
      price: 129,
      category: "Dessert",
      image: dessert1
    },
    {
      id: 6,
      name: "Mango Shake",
      price: 79,
      category: "Drink",
      image: drink1
    }
  ];

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
              quantity: item.quantity + 1
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

    // Navbar cart count update
    window.dispatchEvent(
      new Event("cartUpdated")
    );

    alert(`${food.name} added to cart!`);
  };

  return (
    <div className="foodcontainer">

      {foods.map((food) => (

        <div
          className="foodcard"
          key={food.id}
        >

          <img
            src={food.image}
            alt={food.name}
          />

          <h3>{food.name}</h3>

          <p>₹{food.price}</p>

          <button
            onClick={() => addToCart(food)}
          >
            Add to Cart
          </button>

        </div>

      ))}

    </div>
  );
}