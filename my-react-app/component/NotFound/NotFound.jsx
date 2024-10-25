import React from "react";
import "./NotFound.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className="not-found">
        <h3>404</h3>
        <p>Page Not Found</p>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
