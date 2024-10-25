import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Categories.css";

const CategoryMenu = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      console.log("Fetched categories:", response.data);

      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error("Expected an array but got:", response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (categories.length === 0) {
    return <p>No categories available.</p>;
  }

  return (
    <div className="box-category">
      <h2>Categories</h2>
      <div className="all-product">
        <button className="btn-all" onClick={() => onSelectCategory(null)}>All Products</button>
      </div>
      <ul>
        {categories.map((category) => (
          <li
            key={category._id}
            onClick={() => onSelectCategory(category.name)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryMenu;
