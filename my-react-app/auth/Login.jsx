import React, { useState } from "react";
import "./style/app.css";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  Axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();

    Axios.post(
        "http://localhost:8080/auth/login",
        {
            email,
            password,
        },
        {
            withCredentials: true,
        }
    )
    .then((response) => {
        if (response.data.status) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("_id", response.data.user._id); 
            
            navigate("/");  
        } else {
            console.log(response.data);
            alert("Login gagal, silakan periksa email dan password Anda.");
        }
    })
    .catch((err) => {
        alert(
            "Login gagal: " + (err.response?.data?.message || "Silakan coba lagi.")
        );
    });
};


  return (
    <div className="sign-up-container-login">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Masukkan email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="*********"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login">Login</button>

        <Link to="/forgotPassword">Forgot password?</Link>
        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
