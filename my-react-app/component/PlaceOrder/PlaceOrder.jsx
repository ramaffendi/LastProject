import React from "react";
import Footer from "../Footer/Footer";

import "./PlaceOrder.css";
import NavbarComponent from "../Navbar/NavbarComponent";
const PlaceOrder = () => {
  return (
    <>
      <NavbarComponent />
      <form className="place-order">
        <div className="place-order-left">
          <p className="title">Delivery information</p>
          <div className="multi-fields">
            <input type="text" placeholder="first name" />
            <input type="text" placeholder="last name" />
          </div>
          <input type="text" placeholder="Email address" />
          <input type="text" placeholder="street" />

          <div className="multi-fields">
            <input type="text" placeholder="city" />
            <input type="text" placeholder="state" />
          </div>
          <div className="multi-fields">
            <input type="text" placeholder="zip code" />
            <input type="text" placeholder="country" />
          </div>
          <input type="text" placeholder="phone" />
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart total</h2>
            <div>
              <div className="cart-total-detail">
                <p>Sub total</p>
                <p>${}</p>
              </div>
              <hr />
              <div className="cart-total-detail">
                <p>Delivery fee</p>
                <p>${2}</p>
              </div>
              <hr />
              <div className="cart-total-detail">
                <b>Total</b>
                <b>${}</b>
              </div>
            </div>
            <button onClick={() => navigate("/order")}>
              PROCCED TO PAYMMENT
            </button>
          </div>
        </div>
      </form>
      <Footer />
    </>
  );
};

export default PlaceOrder;
