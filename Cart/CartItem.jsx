'use client';

import React, { useEffect, useState } from 'react';
import { removeErrors, removeItemFromCart, removeMessage, addItemsToCart } from '@/features/cart/cartSlice'; // Added addItemsToCart
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

function CartItem({item}) {
    const {success,loading,error,message}=useSelector(state=>state.cart); // Removed cartItem from destructuring
    const dispatch=useDispatch();
    const [quantity,setQuantity]=useState(item.quantity);
    
  const decreaseQuantity=()=>{
          if(quantity<=1){
            toast.error('Quantity cannot be less than 1',{position:'top-center',autoClose:3000});
            dispatch(removeErrors());
            return;
          }
          setQuantity(qty=>qty-1);
        };
        const increaseQuantity=()=>{
          if(item.stock<=quantity){
            toast.error('Cannot exceed available Stock!',{position:'top-center',autoClose:3000});
            dispatch(removeErrors());
            return;
          }
          setQuantity(qty=>qty+1);
        };
        const handleUpdate=()=>{
            if(loading) return;
            if (quantity!==item.quantity){
                dispatch(addItemsToCart({id:item.product,quantity}));
            }
        };
useEffect(()=>{
        if(error){
            toast.error(error.message,
                {position:'top-center',autoClose:3000});
            dispatch(removeErrors());
                }
            },[dispatch,error]);
useEffect(()=>{
          if(success){
            toast.success(message,
            {position:'top-center',
                autoClose:3000,
                toastId:'cart-update'});
            dispatch(removeMessage());
          }
          
        },[dispatch,success,message]);

        const handleRemove = () =>{
            if(loading) return;
            dispatch(removeItemFromCart(item.product));
            toast.success("Item removed from cart successfully",
            {position:'top-center',
                autoClose:3000,
                toastId:'cart-update'});
        };
  return (
    <div className="cart-item">
                    <div className="item-info">
                        <img src={item.image} alt={item.name} className="item-image" />
                        <div className="item-details">
                            <h3 className="item-name">{item.name}</h3>
                            <p className="item-price"><strong>Price :</strong>{item.price.toFixed(1)}/-</p>
                            <p className="item-quantity"><strong>Quantity :</strong>{item.quantity}</p>
                        </div>
                    </div>
                    <div className="quantity-controls">
                        <button className="quantity-button-decrease-btn" onClick={decreaseQuantity} disabled={loading}>-</button>
                        <input type="number" readOnly min='1' value={quantity} className="quantity-input" />
                        <button className="quantity-button-increase-btn" onClick={increaseQuantity} disabled={loading}>+</button>
                    </div>
                    <div className="item-total">
                        <span className="item-total-price">{(item.price*item.quantity).toFixed(1)}/-</span>
                    </div> 
                    <div className="item-actions">
                        
                        <button disabled={loading || quantity===item.quantity} className="update-item-btn" onClick={handleUpdate}>{loading?'Updating':'Update'}</button>
                        <button className="remove-item-btn" onClick={handleRemove} disabled={loading}>Remove</button>
                    
                    </div>
                </div>
  );
}

export default CartItem;