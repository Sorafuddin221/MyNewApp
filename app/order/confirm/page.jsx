'use client';

import React, { useState, useEffect } from 'react'; // Added useState, useEffect for localStorage
import '@/CartStyles/OrderConfirm.css';
import PageTitle from '@/components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutPath from '@/Cart/CheckoutPath';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { createOrder } from '@/features/order/orderSlice';
import { clearCart } from '@/features/cart/cartSlice';


function OrderConfirmPage() {
    const { shippingInfo, cartItems } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.user);

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
    const shippingCharges = 
        shippingInfo.shippingMethod === 'inside' 
            ? paymentSettings.insideDhakaShippingCost 
            : paymentSettings.outsideDhakaShippingCost;

    const total = subtotal + tax + shippingCharges;

    const router = useRouter();
    const dispatch = useDispatch();

    const proceedToPayment = async () => {
        const orderData = {
            shippingInfo: {
                ...shippingInfo,
                Country: shippingInfo.country,
                phoneNo: shippingInfo.phoneNumber,
                shippingMethod: shippingInfo.shippingMethod,
            },
            orderItems: cartItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                Image: item.image,
                product: item.product,
                color: item.color, // Add color here
            })),
            itemPrice: subtotal,
            taxPrice: tax,
            shippingPrice: shippingCharges,
            totalPrice: total,
        };

        sessionStorage.setItem('orderData', JSON.stringify(orderData));
        router.push('/payment');
    };

    return (
        <>
            <PageTitle title="Order Confirm" />
            <CheckoutPath activePath={1} />
            <div className="confirm-container">
                <h2 className="confirm-header">Order Confirm</h2>
                <div className="confirm-table-container">
                    <table className="confirm-table">
                        <caption>Shipping Details</caption>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>{user?.name}</td><td>{shippingInfo.phoneNumber}</td><td>{shippingInfo.address},{shippingInfo.city},{shippingInfo.state}{shippingInfo.country},{shippingInfo.pinCode}</td></tr>
                        </tbody>
                    </table>
                    <table className="confirm-table cart-table">
                        <caption>Cart Item</caption>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Color</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.product}><td><img src={item.image} alt={item.name} className='item-image' /></td><td>{item.name}</td><td>{item.price}</td><td>{item.color || 'N/A'}</td><td>{item.quantity}</td><td>TK {(item.quantity * item.price).toFixed(2)}</td></tr>
                            ))}
                        </tbody>

                    </table>
                    <table className="confirm-table">
                        <caption>Order Summary</caption>
                        <thead>
                            <tr>
                                <th>Subtotal</th>
                                <th>Shipping Charge</th>
                                <th>Tax</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4">Loading...</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td>TK {subtotal.toFixed(2)}</td>
                                    <td>TK {shippingCharges.toFixed(2)}</td>
                                    <td>TK {tax.toFixed(2)}</td>
                                    <td>TK {total.toFixed(2)}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <button className="proceed-button" onClick={proceedToPayment} disabled={loading}>
                    {loading ? 'Loading...' : 'Proceed to Payment'}
                </button>
            </div>
        </>
    );
}

export default OrderConfirmPage;