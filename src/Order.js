import React from 'react'
import "./Order.css"
import Navbar from './Navbar'
import Footer from './Footer'
import pizza1 from "./Images/Pizza1.jpg";
import burger1 from "./Images/burger1.jpg";
import drink1 from "./Images/drink1.jpg";

export default function Order() {
    return (
        <div className='orderpage'>
            <Navbar></Navbar>
            <section className='orderhero'>
                <h1>Complete Your Order</h1>
                <p>Review your order, enter your delivery details,and confirm your purchase.</p>
            </section>

            <section className='ordercontainer'>
                <div className='ordersummery'>
                    <h2>Order Summary</h2>

                    <div className='ordercard'>
                        <img src={pizza1} alt="Pizza" />
                        <div className='fooddetails'>
                            <h3>Margherita Pizza</h3>
                            <p>Quantity : 2</p>
                        </div>
                        <h3>₹598</h3>
                    </div>

                    <div className='ordercard'>
                        <img src={burger1} alt="Burger" />
                        <div className='fooddetails'>
                            <h3>Veg Burger</h3>
                            <p>Quantity : 1</p>
                        </div>
                        <h3>₹199</h3>
                    </div>

                    <div className='ordercard'>
                        <img src={drink1} alt="Drink" />
                        <div className='fooddetails'>
                            <h3>Coke</h3>
                            <p>Quantity : 1</p>
                        </div>
                        <h3>₹60</h3>
                    </div>
                </div>

                <div className='deliverydetails'>
                    <h2>Delivery Details</h2>

                    <form>
                        <input type='text' placeholder='Enter Full Name'></input>
                        <input type='text' placeholder='Enter Mobile No'></input>
                        <textarea placeholder='Enter Delivery Address'></textarea>
                        <input type='text' placeholder='Enter Your City'></input>
                        <input type='text' placeholder='Enter Your State'></input>
                        <input type='text' placeholder='Enter Pincode '></input>
                    </form>
                </div>
            </section>


            <section className='paymentsection'>
                <h2>Payment Method</h2>
                <div className='paymentoption'>
                    <label>
                        <input type="radio" name="payment"></input>
                        Cash on Delivery
                    </label>

                    <label>
                        <input type="radio" name="payment"></input>
                        UPI
                    </label>

                    <label>
                        <input type="radio" name="payment"></input>
                        Credit / Debit Card
                    </label>
                </div>
            </section>


            <section className='billsection'>
                <h2>Bill Details</h2>
                <div className='billbox'>
                    <div>
                        <span>Subtotal</span>
                        <span>₹857</span>
                    </div>

                    <div>
                        <span>Delivery Fee</span>
                        <span>₹40</span>
                    </div>

                    <div>
                        <span>GST</span>
                        <span>₹43</span>
                    </div>

                    <div>
                        <span>Discount</span>
                        <span>-₹100</span>
                    </div>
                    <hr></hr>
                    <div className='total'>
                        <span>Total</span>
                        <span>₹800</span>
                    </div>
                </div>
                <button className='placeorderbtn'>Order</button>
            </section>
            <Footer></Footer>
        </div>
    )
}
