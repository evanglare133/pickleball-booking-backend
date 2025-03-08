import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://pickleball-booking-backend.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Used for redirecting

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });

      // Store token and user ID in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_id", res.data.user_id);

      setMessage("✅ Login Successful!");
      
      // Redirect to the booking page after login
      setTimeout(() => navigate("/booking"), 1000);
    } catch (err) {
      setMessage("❌ Login Failed: Invalid credentials.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
