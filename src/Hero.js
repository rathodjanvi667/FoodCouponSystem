import React from 'react'
import "./Hero.css"
import mixfood from "./Images/mixfood.jpg"
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className='hero'>
          <div className='heroleft'>
               <h1>Delicious Food <br></br>At Your Fingertips</h1>
               <p>Buy Food Coupons Online,Save time,and enjoy your favorite food at affordable prices.</p>

               <div className='herobtn'>
                     <button className='buycoupon'><Link href='Coupon.js'>Buy Coupon</Link></button>
                     <button className='menubtn' ><Link href='Menu.js'>View Menu</Link></button>
               </div>
          </div>

          <div className='heroright'>
               <img src={mixfood} alt='Food'></img>
          </div>
    </section>
  )
}
