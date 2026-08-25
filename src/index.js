import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import Home from './Home';
import Menu from './Menu';
import Coupon from './Coupon';
import Order from './Order';
import About from './About';
import Contact from './Contact';
import Login from './Login';
import Admindashboard from './Admindashboard';
import ManageFood from './Managefood';
import Managecoupon from './Managecoupon';
import Manageorder from './Manageorder';
import ProtectedRoute from './ProtectedRoute';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cart from './Cart';
import Checkout from './Checkout';
import Register from './Register';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>

      <Routes>

        {/* Customer Pages */}

        <Route path="/"element={<Home />}/>
        <Route path="/Menu"element={<Menu />}/>
        <Route path="/Coupon" element={<Coupon />}/>
        <Route path="/Order" element={<Order />}/>
        <Route path="/About" element={<About />}/>
        <Route path="/Contact" element={<Contact />}/>
         <Route path="/Cart" element={<Cart></Cart>}/>
         <Route path="/Checkout" element={<Checkout></Checkout>}/>

        {/* Login */}
        <Route path="/Login"element={<Login />}/>

        {/* Register */}
         <Route path="/Register"element={<Register></Register>}/>

        {/* Admin Dashboard */}
        <Route
          path="/Admindashboard"
          element={
            <ProtectedRoute role="admin">
              <Admindashboard />
            </ProtectedRoute>
          }/>

        {/* Manage Food */}
        <Route
          path="/Admindashboard/Managefood"
          element={
            <ProtectedRoute role="admin">
              <ManageFood />
            </ProtectedRoute>
          }
        />

        {/* Manage Coupon */}
        <Route
          path="/Admindashboard/Managecoupon"
          element={
            <ProtectedRoute role="admin">
              <Managecoupon />
            </ProtectedRoute>
          }
        />

        {/* Manage Order */}
        <Route
          path="/Admindashboard/Manageorder"
          element={
            <ProtectedRoute role="admin">
              <Manageorder />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
