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

  // =====================================
  // REGISTER USER
  // =====================================
  const handleRegister = (e) => {
    e.preventDefault();

    // =====================================
    // CLEAN INPUT VALUES
    // =====================================
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // =====================================
    // EMPTY FIELD VALIDATION
    // =====================================
    if (
      cleanName === "" ||
      cleanEmail === "" ||
      cleanPhone === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    // =====================================
    // NAME VALIDATION
    // =====================================
    if (cleanName.length < 2) {
      alert("Please enter a valid name");
      return;
    }

    // =====================================
    // EMAIL VALIDATION
    // =====================================
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      alert("Please enter a valid email");
      return;
    }

    // =====================================
    // PHONE VALIDATION
    // =====================================
    if (!/^\d{10}$/.test(cleanPhone)) {
      alert(
        "Please enter a valid 10 digit phone number"
      );
      return;
    }

    // =====================================
    // PASSWORD VALIDATION
    // =====================================
    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters"
      );
      return;
    }

    // =====================================
    // CONFIRM PASSWORD
    // =====================================
    if (password !== confirmPassword) {
      alert(
        "Password and Confirm Password do not match"
      );
      return;
    }

    // =====================================
    // GET EXISTING CUSTOMERS
    // =====================================
    let existingUsers = [];

    try {
      existingUsers =
        JSON.parse(
          localStorage.getItem(
            "foodCouponUsers"
          )
        ) || [];

      if (!Array.isArray(existingUsers)) {
        existingUsers = [];
      }
    } catch (error) {
      console.error(
        "User data error:",
        error
      );

      existingUsers = [];
    }

    // =====================================
    // CHECK EMAIL ALREADY REGISTERED
    // =====================================
    const userExists = existingUsers.some(
      (user) =>
        user.email &&
        user.email.toLowerCase() ===
          cleanEmail
    );

    if (userExists) {
      alert(
        "Email is already registered"
      );
      return;
    }

    // =====================================
    // CREATE NEW CUSTOMER
    // =====================================
    const newUser = {
      id: Date.now(),
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: password,
      role: "customer"
    };

    // =====================================
    // SAVE CUSTOMER
    // =====================================
    existingUsers.push(newUser);

    localStorage.setItem(
      "foodCouponUsers",
      JSON.stringify(existingUsers)
    );

    // =====================================
    // SUCCESS MESSAGE
    // =====================================
    alert(
      "Registration Successful!"
    );

    // =====================================
    // GO TO LOGIN
    // =====================================
    navigate("/Login");
  };

  // =====================================
  // RETURN UI
  // =====================================
  return (
    <div className="register-container">

      {/* =================================
          REGISTER BOX
      ================================= */}
      <div className="register-box">

        <h1>
          Create Account 🎉
        </h1>

        <p>
          Register to start using Smart Food Coupon
        </p>

        <form onSubmit={handleRegister}>

          {/* NAME */}
          <input
            type="text"
            placeholder="Enter Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {/* PHONE */}
          <input
            type="tel"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
          />

          {/* REGISTER BUTTON */}
          <button type="submit">
            Register
          </button>

        </form>

        {/* LOGIN LINK */}
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