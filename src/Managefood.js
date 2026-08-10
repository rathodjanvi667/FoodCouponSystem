import React, { useState } from "react";
import "./Managefood.css";

export default function ManageFood() {

  const [foods, setFoods] = useState([
    {
      id: 1,
      name: "Veg Pizza",
      category: "Pizza",
      price: 299
    },
    {
      id: 2,
      name: "Veg Burger",
      category: "Burger",
      price: 189
    },
    {
      id: 3,
      name: "White Sauce Pasta",
      category: "Pasta",
      price: 249
    }
  ]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Pizza");
  const [price, setPrice] = useState("");

  const addFood = (e) => {

    e.preventDefault();

    if (name === "" || price === "") {
      alert("Please enter Food Name and Price");
      return;
    }

    const newFood = {
      id: foods.length + 1,
      name: name,
      category: category,
      price: price
    };

    setFoods([...foods, newFood]);

    setName("");
    setCategory("Pizza");
    setPrice("");

    alert("Food Added Successfully!");
  };


  const deleteFood = (id) => {

    const updatedFoods = foods.filter(
      (food) => food.id !== id
    );

    setFoods(updatedFoods);
  };


  return (
    <div className="manage-food">

      {/* Header */}

      <div className="manage-header">

        <div>
          <h1>Manage Food</h1>
          <p>Add and manage your food items</p>
        </div>

        <a href="/Admindashboard">
          Back to Dashboard
        </a>

      </div>


      {/* Add Food */}

      <div className="food-form-box">

        <h2>Add New Food</h2>

        <form onSubmit={addFood}>

          <input
            type="text"
            placeholder="Food Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />


          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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

            <option value="Dessert">
              Dessert
            </option>

            <option value="Drinks">
              Drinks
            </option>

          </select>


          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />


          <button type="submit">
            Add Food
          </button>

        </form>

      </div>


      {/* Food List */}

      <div className="food-list-box">

        <h2>Food List</h2>

        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Food Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>

          </thead>


          <tbody>

            {foods.map((food) => (

              <tr key={food.id}>

                <td>{food.id}</td>

                <td>{food.name}</td>

                <td>{food.category}</td>

                <td>₹{food.price}</td>

                <td>

                  <button
                    className="delete-btn"
                    onClick={() => deleteFood(food.id)}
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