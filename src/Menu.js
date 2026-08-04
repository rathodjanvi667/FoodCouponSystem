import React from 'react'
import { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import "./Menu.css"

// Pizza
import pizza1 from "./Images/Pizza1.jpg";
import pizza2 from "./Images/Pizza2.jpg";
import pizza3 from "./Images/Pizza3.jpg";
import pizza4 from "./Images/Pizza4.jpg";
import pizza5 from "./Images/Pizza5.jpg";
import pizza6 from "./Images/Pizza6.jpg";

// Burger
import burger1 from "./Images/burger1.jpg";
import burger2 from "./Images/burger2.jpg";
import burger3 from "./Images/burger3.jpg";
import burger4 from "./Images/burger4.jpg";
import burger5 from "./Images/burger5.jpg";
import burger6 from "./Images/burger6.jpg";

// Pasta
import pasta1 from "./Images/Pasta1.jpg";
import pasta2 from "./Images/Pasta2.jpg";
import pasta3 from "./Images/pasta3.jpg";
import pasta4 from "./Images/pasta4.jpg";
import pasta5 from "./Images/pasta5.jpg";
import pasta6 from "./Images/pasta6.jpg";

//sandwich
import sandwich1 from "./Images/sandwich1.jpg";
import sandwich2 from "./Images/sandwich2.jpg";
import sandwich3 from "./Images/sandwich3.jpg";
import sandwich4 from "./Images/sandwich4.jpg";
import sandwich5 from "./Images/sandwich5.jpg";
import sandwich6 from "./Images/sandwich6.jpg";


// Drinks
import drink1 from "./Images/drink1.jpg";
import drink2 from "./Images/drink2.jpg";
import drink3 from "./Images/drink3.jpg";
import drink4 from "./Images/drink4.jpg";
import drink5 from "./Images/drink5.jpg";
import drink6 from "./Images/drink6.jpg";

// Desserts
import dessert1 from "./Images/dessert1.jpg";
import dessert2 from "./Images/dessert2.jpg";
import dessert3 from "./Images/dessert3.jpg";
import dessert4 from "./Images/dessert4.jpg";
import dessert5 from "./Images/dessert5.jpg";
import dessert6 from "./Images/dessert6.jpg";


export default function Menu() {
   const foods = [
  // Pizza
  {
    "id": 1,
    "name": "Margherita Pizza",
    "category": "Pizza",
    "price": "₹199",
    "image": pizza1
  },
  {
    "id": 2,
    "name": "Farmhouse Pizza",
    "category": "Pizza",
    "price": "₹249",
    "image": pizza2
  },
  {
    "id": 3,
    "name": "Cheese Burst Pizza",
    "category": "Pizza",
    "price": "₹299",
    "image": pizza3
  },
  {
    "id": 4,
    "name": "Paneer Tikka Pizza",
    "category": "Pizza",
    "price": "₹279",
    "image": pizza4
  },
  {
    "id": 5,
    "name": "Veggie Supreme Pizza",
    "category": "Pizza",
    "price": "₹259",
    "image": pizza5
  },
  {
    "id": 6,
    "name": "Mexican Green Wave Pizza",
    "category": "Pizza",
    "price": "₹289",
    "image": pizza6
  },

  // Burger
  {
    "id": 7,
    "name": "Veg Burger",
    "category": "Burger",
    "price": "₹129",
    "image": burger1
  },
  {
    "id": 8,
    "name": "Cheese Burger",
    "category": "Burger",
    "price": "₹149",
    "image": burger2
  },
  {
    "id": 9,
    "name": "Paneer Burger",
    "category": "Burger",
    "price": "₹159",
    "image": burger3
  },
  {
    "id": 10,
    "name": "Crispy Burger",
    "category": "Burger",
    "price": "₹169",
    "image": burger4
  },
  {
    "id": 11,
    "name": "Aloo Tikki Burger",
    "category": "Burger",
    "price": "₹119",
    "image": burger5
  },
  {
    "id": 12,
    "name": "Double Cheese Burger",
    "category": "Burger",
    "price": "₹189",
    "image": burger6
  },

  // Pasta
  {
    "id": 13,
    "name": "White Sauce Pasta",
    "category": "Pasta",
    "price": "₹179",
    "image": pasta1
  },
  {
    "id": 14,
    "name": "Red Sauce Pasta",
    "category": "Pasta",
    "price": "₹169",
    "image": pasta2
  },
  {
    "id": 15,
    "name": "Pink Sauce Pasta",
    "category": "Pasta",
    "price": "₹189",
    "image": pasta3
  },
  {
    "id": 16,
    "name": "Alfredo Pasta",
    "category": "Pasta",
    "price": "₹199",
    "image": pasta4
  },
  {
    "id": 17,
    "name": "Cheese Pasta",
    "category": "Pasta",
    "price": "₹209",
    "image": pasta5
  },
  {
    "id": 18,
    "name": "Spicy Veg Pasta",
    "category": "Pasta",
    "price": "₹189",
    "image": pasta6
  },
  // Sandwich
  {
    "id": 19,
    "name": "Veg Sandwich",
    "category": "Sandwich",
    "price": "₹129",
    "image": sandwich1
  },
  {
    "id": 20,
    "name": "Cheese Sandwich",
    "category": "Sandwich",
    "price": "₹149",
    "image": sandwich2
  },
  {
    "id": 21,
    "name": "Grilled Sandwich",
    "category": "Sandwich",
    "price": "₹169",
    "image": sandwich3
  },
  {
    "id": 22,
    "name": "Paneer Sandwich",
    "category": "Sandwich",
    "price": "₹179",
    "image": sandwich4
  },
  {
    "id": 23,
    "name": "Club Sandwich",
    "category": "Sandwich",
    "price": "₹199",
    "image": sandwich5
  },
  {
    "id": 24,
    "name": "Corn Cheese Sandwich",
    "category": "Sandwich",
    "price": "₹159",
    "image": sandwich6
  },

  // Drinks
  {
    "id": 25,
    "name": "Cold Coffee",
    "category": "Drinks",
    "price": "₹99",
    "image": drink1
  },
  {
    "id": 26,
    "name": "Chocolate Shake",
    "category": "Drinks",
    "price": "₹129",
    "image": drink2
  },
  {
    "id": 27,
    "name": "Mango Shake",
    "category": "Drinks",
    "price": "₹119",
    "image": drink3
  },
  {
    "id": 28,
    "name": "Oreo Shake",
    "category": "Drinks",
    "price": "₹139",
    "image": drink4
  },
  {
    "id": 29,
    "name": "Fresh Lime Soda",
    "category": "Drinks",
    "price": "₹89",
    "image": drink5
  },
  {
    "id": 30,
    "name": "Virgin Mojito",
    "category": "Drinks",
    "price": "₹109",
    "image": drink6
  },

  // Desserts
  {
    "id": 31,
    "name": "Chocolate Cake",
    "category": "Desserts",
    "price": "₹159",
    "image": dessert1
  },
  {
    "id": 32,
    "name": "Brownie",
    "category": "Desserts",
    "price": "₹129",
    "image": dessert2
  },
  {
    "id": 33,
    "name": "Vanilla Ice Cream",
    "category": "Desserts",
    "price": "₹99",
    "image": dessert3
  },
  {
    "id": 34,
    "name": "Gulab Jamun",
    "category": "Desserts",
    "price": "₹89",
    "image": dessert4
  },
  {
    "id": 35,
    "name": "Black Forest Pastry",
    "category": "Desserts",
    "price": "₹119",
    "image": dessert5
  },
  {
    "id": 36,
    "name": "Chocolate Donut",
    "category": "Desserts",
    "price": "₹109",
    "image": dessert6
  }
];

const [selectedCategory, setSelectedCategory] = useState("All");
const [search,setSearch] = useState("");

const filteredFoods=foods.filter((food)=>{
  const matchcategory = selectedCategory === "All" || food.category === selectedCategory;

  const matchsearch = food.name.toLowerCase().includes(search.toLowerCase());

  return matchcategory && matchsearch;
})

  const addtocart = (food) => {
    alert (food.name +" added to cart");
  };

  return (
    <div className='menupagem'>
        <Navbar></Navbar>

        <div className='menubannerm'>
              <h1>Our Delicious Menu</h1>
              <p>Choose your favourite food and buy a food coupon instantly.</p>
        </div>

        <div className='searchsectionm'>
               <input type='text'  value={search} onChange={(e)=>setSearch(e.target.value)} placeholder='Search your favourite food..'></input>
        </div>

        <div className='categorysectionm'>
          <button onClick={()=>{setSelectedCategory("All")}}>All</button>
             <button onClick={()=>{setSelectedCategory("Pizza")}}>Pizza</button>
             <button onClick={()=>{setSelectedCategory("Burger")}}>Burger</button>
             <button onClick={()=>{setSelectedCategory("Pasta")}}>Pasta</button>
             <button onClick={()=>{setSelectedCategory("Sandwich")}}>Sandwich</button>
             <button onClick={()=>{setSelectedCategory("Drinks")}}>Drinks</button>
             <button onClick={() => setSelectedCategory("Desserts")}>Desserts</button>
        </div>

        <div className='foodcontainerm'>
              <h2>Popular Foods</h2>
              <div className='cardsm'>
                  {
                    filteredFoods.map((food)=>(
                      <div className='foodcardm' key={food.id}>
                        <img src={food.image} alt={food.name}></img>
                        <h3>{food.name}</h3>
                        <p className='categorym'>{food.category}</p>
                        <p className='pricem'>{food.price}</p>
                        <p className='ratingm'>  ⭐ 4.5</p>
                        <button onClick={()=>addtocart(food)}>Add To Cart</button>
                      </div>
                    ))
                  }
              </div>
        </div>
        <Footer></Footer>
    </div>
  )
}
