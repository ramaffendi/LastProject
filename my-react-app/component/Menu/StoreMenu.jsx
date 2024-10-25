import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StoreMenu.css";

const ProductMenu = ({ setCart, setTotalPrice, selectedCategory, skip, setSkip }) => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 8;
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Fetch products function
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/products`, {
        params: { skip, limit, category: selectedCategory },
      });
      setProducts(response.data.data);
      setTotalProducts(response.data.count);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart items function
  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8080/api/carts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data); 
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCartItems(); // Fetch cart items when component mounts
  }, [skip, selectedCategory]); // Menambahkan selectedCategory ke dependensi

  const addToCart = async (product) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("_id");

    if (!userId || !token) {
      console.log("User belum login, tidak bisa menambahkan produk ke cart");
      return;
    }

    // Instantly disable the product button by updating cartItems
    setCartItems((prevItems) => [...prevItems, { product }]);

    const payload = {
      name: product.name,
      qty: 1, 
      product: product._id,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/carts", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update cart state and total price
      setCart((prevCart) => [...prevCart, response.data]);
      setTotalPrice((prevPrice) => prevPrice + product.price);
      
      // Update cart items to ensure button disable works correctly
      setCartItems((prevItems) => [...prevItems, response.data]);
    } catch (err) {
      console.log("Error saat menambahkan ke cart:", err.response?.data || err.message);
    }
  };

  return (
    <div className="box-product">
      <h1>Product List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="list-product">
          <ul>
            {products.map((product) => {
              // Check if the product is already in the cart
              const isInCart = cartItems.some(item => item.product?._id === product._id);
              return (
                <li key={product._id}>
                  <h2>{product.name}</h2>
                  {product.image_url && (
                    <img
                      src={`http://localhost:8080/images/products/${product.image_url}`}
                      alt={product.name}
                      width="200"
                    />
                  )}
                  <div className="product-info">
                    <p className="price">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                    <button
                      onClick={() => addToCart(product)}
                      className="add-button"
                      disabled={isInCart} // Disable button if product is already in cart
                    >
                      {isInCart ? "Added" : "BUY"} {/* Show 'Added' if already in cart */}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="pagination">
            {skip > 0 && (
              <button onClick={() => setSkip(skip - limit)}>Previous</button>
            )}
            {skip + limit < totalProducts && (
              <button onClick={() => setSkip(skip + limit)}>Next</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMenu;
