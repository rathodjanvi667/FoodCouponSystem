import React from 'react'
import { Link } from "react-router-dom";
import { FaUtensils } from "react-icons/fa"; 
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube
} from "react-icons/fa";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "./Footer.css"


export default function Footer() {
  return (
    <footer className='footer'>
        <div className='footercontainer'>
           <div className='footerbox'>
                 <h2><FaUtensils></FaUtensils>Food Coupon</h2>
                 <p>Smart Food Coupon System helps Students Buy Food Coupons quickly ,Securely and conveniently.</p>
           </div>

           <div className='footerbox'> 
                   <h3>Quick Links</h3>
                   <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/Menu">Menu</Link></li>
                    <li><Link to="/Coupon">Coupons</Link></li>
                    <li><Link to="/Order">Orders</Link></li>
                    <li><Link to="/About">About</Link></li>
                    <li><Link to="/Contact">Contact</Link></li>
                   </ul>
           </div>

           <div className='footerbox'>
                 <h3>Contact Us</h3>
                 <p><FaMapMarkerAlt></FaMapMarkerAlt>Surat,Gujrat</p>
                 <p><FaPhoneAlt></FaPhoneAlt>+10101010101</p>
                 <p><FaEnvelope></FaEnvelope>foodcoupon@gmail.com</p>
           </div>

           <div className='footerbox'>
             <h3>Follow Us</h3>
             <div className='social'>
                   <span><FaFacebookF></FaFacebookF></span>
                   <span><FaInstagram></FaInstagram></span>
                   <span><FaLinkedinIn></FaLinkedinIn></span>
                   <span><FaYoutube></FaYoutube></span>
             </div>
           </div>
        </div>

        <hr></hr>

        <div className='copyright'>
              © 2026 Food Coupon. All Rights Reserved.
        </div>
    </footer>
  );
}
