import React from 'react'
import { FaUtensils } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import "./Navbar.css"
import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <nav className='navbar'>
            <div className='logo'>
                <FaUtensils></FaUtensils>Food Coupon
            </div>

            <ul className='nav-links'>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/Menu">Menu</Link></li>
                <li><Link to="/Coupon">Coupons</Link></li>
                <li><Link to="/Order">Orders</Link></li>
                <li><Link to="/About">About</Link></li>
                <li><Link to="/Contact">Contact</Link></li>
            </ul>

            <div className='nav-right'>
                {/* <input type='text' placeholder='Search Your Food' className='searchbox'></input> */}

                <button className='cartbtn'>
                    <FaShoppingCart />
                    <span>Cart (0)</span>
                </button>

                <button className='loginbtn'>Login</button>
            </div>
        </nav>
    )
}
