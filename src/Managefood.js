<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import "./Managefood.css";

const API_URL = "http://localhost:5000/api/foods";
const SERVER_URL = "http://localhost:5000";

export default function ManageFood() {

  // =====================================
  // FOOD LIST
  // =====================================

  const [foods, setFoods] = useState([]);

  const [loading, setLoading] = useState(true);


  // =====================================
  // FORM DATA
  // =====================================

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Pizza");
  const [price, setPrice] = useState("");

  // Selected image file
  const [image, setImage] = useState(null);


  // =====================================
  // LOAD FOODS
  // =====================================

  const loadFoods = async () => {

    try {

      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load foods");
      }

      const data = await response.json();

      setFoods(data);

    } catch (error) {

      console.log(error);

      alert("Unable to load foods from database");

    } finally {

      setLoading(false);

    }

  };


  // =====================================
  // PAGE LOAD
  // =====================================

  useEffect(() => {

    loadFoods();

  }, []);


  // =====================================
  // ADD FOOD
  // =====================================

  const addFood = async (e) => {

    e.preventDefault();


    // Validation

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


    try {

      // =================================
      // FORM DATA
      // =================================

      const formData = new FormData();

      formData.append("name", name);

      formData.append("category", category);

      formData.append("price", price);

      formData.append("image", image);


      // =================================
      // SEND TO BACKEND
      // =================================

      const response = await fetch(
        API_URL,
        {
          method: "POST",
          body: formData
        }
      );


      if (!response.ok) {

        throw new Error(
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
          ...previousFoods,
          savedFood
        ]
      );


      // =================================
      // CLEAR FORM
      // =================================

      setName("");

      setCategory("Pizza");

      setPrice("");

      setImage(null);


      // Clear file input

      e.target.reset();


      alert(
        "Food Added Successfully! 🎉"
      );


    } catch (error) {

      console.log(error);

      alert(
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

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE"
        }
      );


      if (!response.ok) {

        throw new Error(
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

      console.log(error);

      alert(
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

    // If image already contains full URL
    if (image.startsWith("http")) {
      return image;
    }

    return SERVER_URL + image;

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
            Add and manage your food items
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

          <input
            type="text"
            placeholder="Food Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />


          {/* Category */}

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
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


          {/* Price */}

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
          />


          {/* Image */}

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(
                e.target.files[0]
              )
            }
          />


          {/* Add Button */}

          <button type="submit">

            Add Food

          </button>

        </form>

      </div>


      {/* =================================
          FOOD LIST
      ================================== */}

      <div className="food-list-box">

        <h2>
          Food List
        </h2>


        {loading ? (

          <p>
            Loading foods...
          </p>

        ) : foods.length === 0 ? (

          <p>
            No food items available.
          </p>

        ) : (

          <table>

            <thead>

              <tr>

                <th>
                  ID
                </th>

                <th>
                  Image
                </th>

                <th>
                  Food Name
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

              {foods.map((food) => (

                <tr
                  key={food._id}
                >

                  <td>
                    {food._id}
                  </td>


                  <td>

                    {food.image && (

                      <img
                        src={getImageUrl(
                          food.image
                        )}
                        alt={food.name}
                        width="60"
                        height="50"
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                      />

                    )}

                  </td>


                  <td>
                    {food.name}
                  </td>


                  <td>
                    {food.category}
                  </td>


                  <td>
                    ₹{food.price}
                  </td>


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

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>

  );

=======
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
>>>>>>> d7d75d0c97c1411ad7577eb2a6a19c4a9078d035
}