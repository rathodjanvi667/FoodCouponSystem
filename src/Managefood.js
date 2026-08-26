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
}