import React from 'react'
import "./PopularFoods.css"
import pizza1 from "./Images/Pizza1.jpg";
import burger1 from "./Images/burger1.jpg";
import pasta1 from "./Images/Pasta1.jpg";
import sandwich1 from "./Images/sandwich1.jpg";
import drink1 from "./Images/drink1.jpg";
import dessert1 from "./Images/dessert1.jpg";

export default function PopularFoods() {
  const foods=[
    {
      id:1,
      name:"Burger",
      Price:"₹99",
      image:burger1
    },
    {
      id:2,
      name:"Pizaa",
      Price:"₹149",
      image:pizza1
    },
    {
      id:3,
      name:"Pasta",
      Price:"₹130",
      image:pasta1
    },
    {
      id:4,
      name:"Sandwich",
      Price:"₹80",
      image:sandwich1
    },
    {
      id:5,
      name:"Cake",
      Price:"₹90",
      image:dessert1
    },
    {
      id:6,
      name:"Mango Shake",
      Price:"₹200",
      image:drink1
    }
  ];
  return (
    <div className='foodcontainer'>
        {
          foods.map((food)=>(
            <div className='foodcard' key={food.id}>
              <img src={food.image} alt={food.name}></img>
              <h3>{food.name}</h3>
              <p>{food.Price}</p>
              <button>Buy Coupon</button>
            </div>
          ))
        }
    </div>
  );
}

