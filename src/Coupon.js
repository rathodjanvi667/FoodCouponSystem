import React from 'react'
import "./Coupon.css"
import Navbar from './Navbar'
import Footer from './Footer'
import mixfood from "./Images/mixfood.jpg";



export default function Coupon() {
  return (
    <div className='couponpage'>
      <Navbar></Navbar>

      <section className='couponhero'>
        <div className='couponleft'>
          <h1>Save More,<span>Eat More!</span></h1>
          <p>Exclusive Food Coupons & Amazing Discounts.Save money on your favourite meals with exciting offers.</p>

          <div className='couponfeature'>
            <span>🎟 Best Coupons</span>
            <span>⭐ Top Restaurants</span>
            <span>💰 Great Savings</span>
          </div>
        </div>

        <div className='couponright'>
          <img src={mixfood} alt="Food Combo" ></img>

          <div className="badge badge1">20% OFF</div>
          <div className="badge badge2">Flat ₹100 OFF</div>
          <div className="badge badge3">BUY 1 GET 1</div>
        </div>

      </section>

      <section className='couponcategory'>
        <h2>Browse by Category</h2>

        <div className='categorycontainer'>
          <div className='categorycard'>
            🍕
            <h3>Pizza</h3>
          </div>
          <div className='categorycard'>
            🍔
            <h3>Burger</h3>
          </div>
          <div className='categorycard'>
            🍔
            <h3>Pasta</h3>
          </div>
          <div className='categorycard'>
            🍰
            <h3>Dessert</h3>
          </div>
          <div className='categorycard'>
            🥤
            <h3>Drink</h3>
          </div>
        </div>
      </section>

      <section className='couponcards'>
        <h2>Popular Coupons</h2>
        <div className='couponcontainer'>

          <div className='couponcard'>
            <h3>20% OFF</h3>
            <p>On Pizza Orders Above ₹499</p>
            <h4>Code : PIZZA20</h4>
            <button>Copy Code</button>
          </div>

          <div className="couponcard">
            <h3>Flat ₹100 OFF</h3>
            <p>Minimum Order ₹699</p>
            <h4>Code : SAVE100</h4>
            <button>Copy Code</button>
          </div>

          <div className="couponcard">
            <h3>BUY 1 GET 1</h3>
            <p>Applicable on Burgers</p>
            <h4>Code : BOGO</h4>
            <button>Copy Code</button>
          </div>

          <div className="couponcard">
            <h3>FREE DELIVERY</h3>
            <p>On All Orders Above ₹299</p>
            <h4>Code : FREEDEL</h4>
            <button>Copy Code</button>
          </div>
        </div>
      </section>

      <section className='todaydeals'>
        <h2>Today's Special Deal</h2>
        <div className="dealbox">
          <h1>🔥 40% OFF</h1>
          <p>Only for Today</p>
          <button>Claim Offer</button>
        </div>
      </section>

      <section className='howitworks'>
        <h2>How It's Works</h2>
        <div className='workcontainer'>
          <div className='workcard'>
            <h1>1</h1>
            <h3>Select Coupon</h3>
            <p>Browse and choose your favourite coupon.</p>
          </div>

          <div className="workcard">
            <h1>2</h1>
            <h3>Copy Code</h3>
            <p>Click Copy to save the coupon code.</p>
          </div>

          <div className="workcard">
            <h1>3</h1>
            <h3>Enjoy Discount</h3>
            <p>Apply the code during checkout and save money.</p>
          </div>
        </div>
      </section>

      <section className="benefits">
        <h2>Why Choose Our Coupons?</h2>
        <div className="benefitcontainer">

          <div className="benefitcard">
            💰
            <h3>Save Money</h3>
            <p>Get exciting discounts every day.</p>
          </div>

          <div className="benefitcard">
            🍴
            <h3>Top Restaurants</h3>
            <p>Offers from your favourite restaurants.</p>
          </div>

          <div className="benefitcard">
            ⚡
            <h3>Instant Discounts</h3>
            <p>Copy the code and use it instantly.</p>
          </div>
        </div>
      </section>

      <Footer></Footer>
    </div>
  )
}
