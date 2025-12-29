'use client';

import React, { useState, useEffect } from 'react'; // Added useEffect for localStorage
import '@/componentStyles/Cart.css';
import PageTitle from '@/components/PageTitle';
import Footer from '@/components/Footer';
import CartItem from '@/Cart/CartItem';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveShippingInfo } from '@/features/cart/cartSlice';
import { toast } from 'react-toastify';

function CartPage() {
    const { cartItems, shippingInfo } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const [shippingMethod, setShippingMethod] = useState(shippingInfo.shippingMethod || null);

    // Load payment settings from localStorage
    const [paymentSettings, setPaymentSettings] = useState({
        taxPercentage: 0,
        insideDhakaShippingCost: 0,
        outsideDhakaShippingCost: 0,
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchPaymentSettings = async () => {
            try {
                const res = await fetch('/api/payment-settings');
                const data = await res.json();
                setPaymentSettings({
                    taxPercentage: data.taxPercentage || 0,
                    insideDhakaShippingCost: data.insideDhakaShippingCost || 0,
                    outsideDhakaShippingCost: data.outsideDhakaShippingCost || 0,
                });
            } catch (error) {
                toast.error("Error fetching payment settings");
            } finally {
                setLoading(false);
            }
        };
        fetchPaymentSettings();
    }, []);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    // Dynamic Tax Calculation
    const tax = subtotal * (paymentSettings.taxPercentage / 100); 

    // Dynamic Shipping Charges Calculation
    const currentShippingCharges = 
        shippingMethod === "inside" 
            ? paymentSettings.insideDhakaShippingCost 
            : shippingMethod === "outside"
                ? paymentSettings.outsideDhakaShippingCost
                : 0;

    const total = subtotal + tax + currentShippingCharges;

    const router = useRouter();
    const checkoutHandler = () => {
        if (!shippingMethod) {
            toast.error("Please select your shipping zone");
            return;
        }
        dispatch(saveShippingInfo({
            address: shippingInfo.address,
            pinCode: shippingInfo.pinCode,
            state: shippingInfo.state,
            city: shippingInfo.city,
            country: shippingInfo.country,
            phoneNumber: shippingInfo.phoneNumber,
            shippingMethod
        }));
        router.push('/shipping'); // Assuming /shipping is the next step
    };

    return (
        <>
            <PageTitle title="Your Cart" />
            {cartItems.length === 0 ? (
                <div className="emply-cart-container">
                    <p className="empty-cart-message">Your cart is Empty</p>
                    <Link href="/products" className='viewproducts'>View Products</Link>
                </div>
            ) : (
                <div className="cart-page">
                    <div className="cart-items">
                        <div className="cart-items-heading">Your Cart</div>
                        <div className="cart-table">
                            <div className="cart-table-header">
                                <div className="header-product">Product</div>
                                <div className="header-quantity">Quantity</div>
                                <div className="header-totalitem-total-heading">Item Total</div>
                                <div className="header-action">Actions</div>
                            </div>
                            {/* cart items*/}
                            {cartItems && cartItems.map((item) => <CartItem item={item} key={item.name} />)}
                        </div>
                    </div>
                    <div className="price-summary">
                        <div className='shipping-page'>
                            <div className=" shipping-summary">
                                <h3 className="price-summary-header">Shipping Zone</h3>
                                {loading ? <p>Loading...</p> : <>
                                    <div className='shipping-item'>
                                        <input
                                            type="checkbox"
                                            id="inside"
                                            name="shippingMethod"
                                            value="inside"
                                            checked={shippingMethod === "inside"}
                                            onChange={() => setShippingMethod("inside")}
                                        />
                                        <label htmlFor="inside">Inside Dhaka (TK {paymentSettings.insideDhakaShippingCost.toFixed(2)})</label>
                                    </div>
                                    <div className='shipping-item'>
                                        <input
                                            type="checkbox"
                                            id="outside"
                                            name="shippingMethod"
                                            value="outside"
                                            checked={shippingMethod === "outside"}
                                            onChange={() => setShippingMethod("outside")}
                                        />
                                        <label htmlFor="outside">Outside Dhaka (TK {paymentSettings.outsideDhakaShippingCost.toFixed(2)})</label>
                                    </div>
                                </>}
                            </div>
                        </div>
                        <h3 className="price-summary-header">Price Summary</h3>
                        {loading ? <p>Loading...</p> : <>
                            <div className="summary-item">
                                <p className="summary-label">Subtotal</p>
                                <p className="summary-label">TK {subtotal.toFixed(2)}</p>
                            </div>
                            <div className="summary-item">
                                <p className="summary-label">Tax ({paymentSettings.taxPercentage}%)</p>
                                <p className="summary-label">TK {tax.toFixed(2)}</p>
                            </div>
                            <div className="summary-item">
                                <p className="summary-label">Shipping</p>
                                <p className="summary-label">TK {currentShippingCharges.toFixed(2)}</p>
                            </div>
                            <div className="summary-total">
                                <p className="total-label">Total Amount</p>
                                <p className="total-value">TK {total.toFixed(2)}</p>
                            </div>
                        </>}
                        <button className="checkout-btn" onClick={checkoutHandler} disabled={loading}>
                            {loading ? 'Loading...' : 'Proceed To CheckOut'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default CartPage;
