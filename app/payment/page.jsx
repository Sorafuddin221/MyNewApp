'use client';

import React, { useState } from 'react';
import '@/CartStyles/Payment.css';
import PageTitle from '@/components/PageTitle';
import CheckoutPath from '@/Cart/CheckoutPath';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createOrder } from '@/features/order/orderSlice';
import { clearCart } from '@/features/cart/cartSlice';

function PaymentPage() {
    const orderData = typeof window !== 'undefined' && sessionStorage.getItem('orderData') ? JSON.parse(sessionStorage.getItem('orderData')) : null;
    const { user } = useSelector(state => state.user);
    const router = useRouter();
    const dispatch = useDispatch();
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const completePayment = async () => {
        if (!orderData) {
            toast.error('No order data found. Please confirm your order again.', { position: 'top-center', autoClose: 3000 });
            router.push('/order/confirm'); // Redirect back to confirm page
            return;
        }

        if (paymentMethod === 'cod') {
            try {
                const resultAction = await dispatch(createOrder(orderData));
                if (createOrder.fulfilled.match(resultAction)) {
                    toast.success('Order Confirmed (COD)!', { position: 'top-center', autoClose: 3000 });
                    dispatch(clearCart());
                    sessionStorage.removeItem('orderData'); // Clear orderData after successful creation
                    sessionStorage.setItem('orderItem', JSON.stringify(resultAction.payload.order)); // Store created order
                    router.push('/paymentSuccess?method=cod');
                } else {
                    toast.error(resultAction.payload?.message || 'Order creation failed (COD)', {
                        position: 'top-center',
                        autoClose: 3000,
                    });
                    sessionStorage.removeItem('orderData'); // Clear orderData even on failure
                }
            } catch (error) {
                console.error("Failed to create order (COD):", error);
                toast.error('Something went wrong during COD order creation', {
                    position: 'top-center',
                    autoClose: 3000,
                });
            }
        } else {
            // For any other payment methods, this would be where integration with a payment gateway happens.
            // For now, it will indicate that only COD is supported.
            toast.info('Only Cash on Delivery is supported at the moment.', { position: 'top-center', autoClose: 3000 });
        }
    };

    // If orderData is not available, redirect or show an error
    if (!orderData) {
        // This scenario should ideally not happen if navigation is controlled.
        // You might want a more robust error handling or redirection.
        return (
            <>
                <PageTitle title="Payment Error" />
                <div className="payment-container">
                    <p>No order data found. Please go back to confirm your order.</p>
                    <Link href="/order/confirm" className='payment-go-back'>Go Back to Order Confirmation</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <PageTitle title="Payment Processing " />
            <CheckoutPath activePath={2} />
            <div className="payment-container">
                <div className="payment-methods">
                    <h3>Select Payment Method</h3>
                    <div>
                        <input
                            type="radio"
                            id="cod"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                        />
                        <label htmlFor="cod">Cash on Delivery</label>
                    </div>
                </div>
            </div>
            <div className="payment-container">
                <Link href={"/order/confirm"} className='payment-go-back'>Go Back</Link>

                <button className="payment-btn" onClick={completePayment}>
                    Confirm Order
                </button>
            </div>
        </>
    );
}

export default PaymentPage;
