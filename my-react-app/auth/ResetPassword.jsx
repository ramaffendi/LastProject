import React, { useState } from "react";
import "./style/app.css";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password) {
      alert(" password harus diisi");
      return;
    }

    Axios.post(`http://localhost:8080/auth/reset-password/${token}`, {
      password: password,
    })
      .then((response) => {
        console.log("Response berhasil");
        if (response.data && response.data.status) {
          navigate("/login");
        }
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="sign-up-container-reset">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h3>reset password</h3>
        <label htmlFor="password">new password:</label>
        <input
          type="password"
          placeholder="*********"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="reset">
          reset password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
