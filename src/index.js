import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Home from './Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Menu from './Menu';
import Coupon from './Coupon';
import Order from './Order';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
         <Route path='/Menu' element={<Menu></Menu>}></Route>
         <Route path='/Coupon' element={<Coupon></Coupon>}></Route>
         <Route path='/Order' element={<Order></Order>}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


reportWebVitals();
