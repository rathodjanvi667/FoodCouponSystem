import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    // Empty field validation
    if (
      name.trim() === "" ||
      email.trim() === "" ||
      phone.trim() === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email");
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10 digit phone number");
      return;
    }

    // Password validation
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }

    // Existing customers
    const existingUsers =
      JSON.parse(localStorage.getItem("foodCouponUsers")) || [];

    // Check email already registered
    const userExists = existingUsers.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
      alert("Email is already registered");
      return;
    }

    // New customer
    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone,
      password: password,
      role: "customer",
    };

    // Save customer
    existingUsers.push(newUser);

    localStorage.setItem(
      "foodCouponUsers",
      JSON.stringify(existingUsers)
    );

    alert("Registration Successful!");

    navigate("/Login");
  };

  return (
    <div className="register-container">

      <div className="register-box">

        <h1>Create Account 🎉</h1>

        <p>
          Register to start using Smart Food Coupon
        </p>

        <form onSubmit={handleRegister}>

          {/* Name */}
          <input
            type="text"
            placeholder="Enter Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          <button type="submit">
            Register
          </button>

        </form>

        <div className="login-link">
          Already have an account?{" "}
          <Link to="/Login">
            Login
          </Link>
        </div>

      </div>

    </div>
  );
}