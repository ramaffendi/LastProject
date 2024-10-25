import React from "react";
import "./Footer.css";
import { assets } from "../../src/assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus
            officia incidunt voluptas vel, repudiandae obcaecati deserunt?
            Repudiandae autem cum maiores? Nam illo at rerum vitae quidem
            voluptates, facilis cupiditate provident!
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h3>COMPANY</h3>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Delivey</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h3>GET IN TOUCH</h3>
          <ul>
            <li>+62-898-2234-1233</li>
            <li>contact@gmail.com</li>
          </ul>
        </div>
      </div>
      <p className="footer-copyright">
        Copyright 2024 &copy; Created By: Ramadhanefeendi98@gmail.com - All
        Right Reserved
      </p>
    </div>
  );
};

export default Footer;
