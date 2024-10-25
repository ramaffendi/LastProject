import React, { useState } from "react";
import "./style/app.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:8080/auth/forgot-password", {
      email,
    })
      .then((response) => {
        if (response.data.status === "success") {
          alert("check your email");
          navigate("/login");
        } else {
          alert(response.data.message || "Email tidak ditemukan");
          console.log("error disini");
        }
      })
      .catch((err) => {
        
        if (err.response) {
          alert(err.response.data.message || "Email tidak ditemukan");
        } else {
          alert("Terjadi kesalahan pada server. Silakan coba lagi.");
        }
        console.log(err);
      });
  };

  return (
    <div className="sign-up-container-forgot">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Forgot password</h2>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="forgot">send</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
