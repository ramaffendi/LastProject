import React, { useState } from "react";
import CategoryMenu from "./Categories/Categories";
import ProductMenu from "./Menu/StoreMenu";
import AppDownload from "./AppDownload/AppDownload";
import Footer from "./Footer/Footer";
import Navbar from "./Navbar/Navbar";
import "./Style/App.css";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [skip, setSkip] = useState(0); // State untuk skip

  console.log("Selected Category:", selectedCategory);

  const handleSelectCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setSkip(0); // Reset skip saat kategori berubah
  };

  const handleShowAllProducts = () => {
    setSelectedCategory(null);
    setSkip(0);
  };

  return (
    <div className="home">
      <Navbar
        totalItems={cart.length}
        setSelectedCategory={handleShowAllProducts}
      />

      <div className="content-container">
        <CategoryMenu onSelectCategory={handleSelectCategory} />

        <ProductMenu
          selectedCategory={selectedCategory}
          cart={cart}
          setCart={setCart}
          totalPrice={totalPrice}
          setTotalPrice={setTotalPrice}
          skip={skip} // Lewati state skip ke ProductMenu
          setSkip={setSkip} // Lewati fungsi setSkip ke ProductMenu
        />
      </div>

      <AppDownload />
      <Footer />
    </div>
  );
};

export default Home;
