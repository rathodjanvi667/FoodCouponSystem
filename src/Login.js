import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {

    const navigate = useNavigate();

    const [role, setRole] = useState("customer");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        if (email === "" || password === "") {
            alert("Please enter Email and Password");
            return;
        }

        if (role === "admin") {
            alert("Admin Login Successful!");
            navigate("/admin");
        } else {
            alert("Customer Login Successful!");
            navigate("/");
        }
    };

    return (



        <div className="login-container">

            <div className="food-sticker sticker-1">🍕</div>
            <div className="food-sticker sticker-2">🍔</div>
            <div className="food-sticker sticker-3">🥤</div>
            <div className="food-sticker sticker-4">🍰</div>
            <div className="food-sticker sticker-5">🍝</div>

            <div className="login-box">

                <h1>Welcome Back 👋</h1>

                <p>Login to continue your food journey</p>

                <form onSubmit={handleLogin}>

                    
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>

                    
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    
                    <div className="login-options">

                        <label>
                            <input type="checkbox" />
                            Remember Me
                        </label>

                        <a href="/">Forgot Password?</a>

                    </div>

                    
                    <button type="submit">
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}
