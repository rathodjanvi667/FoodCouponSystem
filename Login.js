import React, { useState } from "react";
import "./Login.css";


export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        if (email === "" || password === "") {
            alert("Please enter Email and Password");
            return;
        }

        alert("Login Successful!");

        // Later we will redirect to Cart page
        // navigate("/cart");
    };

    return (
        <div className="login-container">

            <div className="login-left">
                <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900"
                    alt="Food"
                />
            </div>

            <div className="login-right">

                <h1>Welcome Back 👋</h1>

                <p>Login to continue your food journey.</p>

                <form onSubmit={handleLogin}>

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
