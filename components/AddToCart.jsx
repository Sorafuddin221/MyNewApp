"use client";

import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addItemsToCart } from '../features/cart/cartSlice';

const AddToCart = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItemsToCart({ id: product._id, quantity: 1 }));
    toast.success("Added to cart");
  };

  return (
    <button
      className="add-to-cart-btn"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
};

export default AddToCart;
