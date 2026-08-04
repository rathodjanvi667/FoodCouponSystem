import React from 'react'
import "./Home.css"
import Navbar from './Navbar'
import Hero from './Hero'
import PopularFoods from './PopularFoods'
import Features from './Features'
import Footer from './Footer'


export default function Home() {
  return (
    <div className='home'>
        <Navbar></Navbar>
        <Hero></Hero> 
        <section className='section'>  
              <div className='container'>
                <h2 className='section-title'>Popular Foods</h2>
                <p className='section-subtitle'>Buy Food Coupons Quickly and enjoy delicious food.</p>
                <PopularFoods></PopularFoods>
              </div>
        </section>

        <Features></Features>
       

       <section className='offer'>
         <div className='offercontent'>
            <h2>Today's Special Offer</h2>
            <p>Get <strong>20% OFF</strong> On Your First Food Coupon Purchase.</p>
            <button className='offerbtn'>Buy Coupon</button>
         </div>
       </section>

       <Footer></Footer>
    </div>
  )
}
