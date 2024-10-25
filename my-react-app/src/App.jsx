import React from "react";
import { Route, Routes , Navigate} from "react-router-dom";
import Login from "../auth/Login";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import Signup from "../auth/Signup.jsx";
import Home from "../component/Home.jsx";
import Cart from "../component/Cart/Cart.jsx";
import NotFound from "../component/NotFound/NotFound.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/not-found" />} />
        <Route path="/carts" element={<Cart />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </>
  );
};

export default App;
