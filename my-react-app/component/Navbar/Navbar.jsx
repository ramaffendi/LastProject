import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../../src/assets/logo.png";
import cart_icon from "../../src/assets/cart_icon.png";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ totalItems }) => {
  const [menu, setMenu] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <p>happy food</p>
      </div>
      <ul className="nav-menu">
        <li>
          <Link style={{ textDecoration: "none" }} to="/">
            Menu
          </Link>
          {menu === "menu" ? <hr /> : null}
        </li>
        <li
          onClick={() => {
            setMenu("contact us");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="#footer">
            Contact Us
          </Link>
          {menu === "contact us" ? <hr /> : null}
        </li>
      </ul>
      <div className="nav-login-cart">
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
        <Link to="/carts">
          <img src={cart_icon} alt="Cart Icon" />
        </Link>
        <div className="nav-cart-count">{totalItems}</div> {/* Total items */}
      </div>
    </div>
  );
};

export default Navbar;
