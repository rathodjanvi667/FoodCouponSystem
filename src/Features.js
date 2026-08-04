import React from 'react'
import {
  FaUtensils,
  FaTicketAlt,
  FaShippingFast,
  FaShieldAlt,
} from "react-icons/fa";
import "./Features.css"

export default function Features() {
  return (
    <section className='features'>
      <h2 className='featurehanding'>Why Choose Us?</h2>

      <div className='featurecontainer'>
        <div className='featurecard'>
          <div className='icon'><FaUtensils /></div>
          <h3>Fresh Food</h3>
          <p>Enjoy fresh and delicious foods prepared with quality ingredients.</p>
        </div>

        <div className='featurecard'>
          <div className='icon'>  <FaTicketAlt /></div>
          <h3>Easy Coupons</h3>
          <p>Purchase food coupons instantly with just a few clicks.</p>
        </div>

        <div className='featurecard'>
          <div className='icon'>  <FaShippingFast /></div>
          <h3>Fast Service</h3>
          <p>Get your food quickly without waiting in long queues.</p>
        </div>

        <div className='featurecard'>
          <div className='icon'> <FaShieldAlt /></div>
          <h3>Secure Payment</h3>
          <p>Safe and Secure payment methods for every tarnsaction.</p>
        </div>

      </div>
    </section>
  )
}
