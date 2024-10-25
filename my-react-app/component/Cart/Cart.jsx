import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import axios from "axios";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [itemsPerPage] = useState(5); // Jumlah item per halaman
  const navigate = useNavigate();

  const mergeCartItems = (items) => {
    const mergedCart = [];
    items.forEach((item) => {
      const existingItem = mergedCart.find(
        (mergedItem) => mergedItem.product === item.product
      );
      if (existingItem) {
        existingItem.qty += item.qty;
      } else {
        mergedCart.push({ ...item });
      }
    });
    return mergedCart;
  };

  const fetchCartFromBackend = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login kembali.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/api/carts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.error) {
        if (response.data.message === "Tidak ada item di cart.") {
          setCart([]);
        } else {
          localStorage.removeItem("token");
          alert("Sesi Anda telah berakhir. Silakan login kembali.");
          navigate("/login");
        }
      } else {
        if (Array.isArray(response.data)) {
          const mergedCart = mergeCartItems(response.data);
          setCart(mergedCart);
        } else {
          setCart([]);
          alert("Data dari API tidak valid.");
        }
      }
    } catch (error) {
      console.error("Error fetching cart from backend:", error);
      setError("Tidak dapat mengakses cart.");
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (itemId, qty) => {
    if (qty < 1) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/carts/${itemId}`,
        { qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart((prevCart) =>
        prevCart.map((item) => (item._id === itemId ? { ...item, qty } : item))
      );
    } catch (error) {
      alert("Gagal memperbarui kuantitas item.");
    }
  };


  // DELETE 
  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/carts/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
    } catch (error) {
      alert(`Gagal menghapus item dari cart. ${error.response?.data?.message || error.message}`);
    }
    
  };

  useEffect(() => {
    fetchCartFromBackend();
  }, []);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cart.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cart.length / itemsPerPage);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleCheckout = () => {
    navigate("/deliveryAddress");
  };

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <div className="cart-items">
          <div className="cart-title">
            <p>Items</p>
            <p>Quantity</p>
            <p>Price</p>
            <p>Remove</p>
          </div>
          <hr />
          {error && <p className="error-message">{error}</p>}
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="cart-item-list">
              {currentItems.map((cartItem) => (
                <div key={cartItem._id} className="cart-item">
                  {cartItem.image_url && (
                    <img
                      src={`http://localhost:8080/images/products/${cartItem.image_url}`}
                      alt={cartItem.name}
                    />
                  )}
                  <div className="quantity-control">
                    <button
                      onClick={() => {
                        if (cartItem.qty > 1) {
                          updateItemQuantity(cartItem._id, cartItem.qty - 1);
                        }
                      }}
                      className="quantity-button"
                    >
                      -
                    </button>
                    <p className="quantity">{cartItem.qty}</p>
                    <button
                      onClick={() =>
                        updateItemQuantity(cartItem._id, cartItem.qty + 1)
                      }
                      className="quantity-button"
                    >
                      +
                    </button>
                  </div>
                  <p className="price">
                    Rp {cartItem.price.toLocaleString("id-ID")}
                  </p>
                  <button
                    onClick={() => removeFromCart(cartItem._id)}
                    className="remove-button"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="cart-total">
          <h2>Total: Rp {totalPrice.toLocaleString("id-ID")}</h2>
        </div>
        
        <button onClick={handleCheckout} className="checkout-button">
          Checkout
        </button>

        {/* TOMBOL PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt; Prev
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next &gt;
            </button>
          </div>
        )}
        {/* TOMBOL PAGINATION END */}

        <hr />
      </div>
      <Footer />
    </>
  );
};

export default Cart;
