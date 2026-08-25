import React from 'react'
import "./Hero.css"
import mixfood from "./Images/mixfood.jpg"
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className='hero'>
          <div className='heroleft'>
               <h1>Delicious Food <br></br>At Your Fingertips</h1>
               <p>Buy The Food Coupons Online,Save time,and enjoy your favorite food at affordable prices.</p>

               <div className='herobtn'>
                     <button className='buycoupon'><Link to='Coupon'>Buy Coupon</Link></button>
                     <button className='menubtn' ><Link to='Menu'>View Menu</Link></button>
               </div>
          </div>

          <div className='heroright'>
               <img src={mixfood} alt='Food'></img>
          </div>
    </section>
  )
}
