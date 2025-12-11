'use client';

import React, { useEffect, use } from 'react';
import '@/OrderStyles/OrderDetails.css';
import PageTitle from '@/components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, removeErrors } from '@/features/order/orderSlice';
import Loader from '@/components/Loader';
import { toast } from 'react-toastify';
import MuiRating from '@mui/material/Rating'; // Importing MUI Rating for consistency

function OrderDetailsPage({ params }) {
    const resolvedParams = use(params);
    const { orderId } = resolvedParams;
    const { order, loading, error } = useSelector(state => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        dispatch(getOrderDetails(orderId));
    }, [dispatch, error, orderId]);

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(getOrderDetails(orderId));
        }, 5000); // Poll every 5 seconds

        return () => {
            clearInterval(interval);
        };
    }, [dispatch, orderId]);

    const {
        shippingInfo = {},
        orderItems = [],
        paymentInfo = {},
        orderStatus,
        totalPrice,
        taxPrice,
        shippingPrice,
        itemPrice,
        paidAt
    } = order;

    const orderStatusClass = orderStatus === 'delivered' ? 'status-tag delivered' : `status-tag ${orderStatus?.toLowerCase()}`;
    const paymentStatusClass = `pay-tag ${paymentInfo?.status === 'succeeded' ? 'paid' : 'not-paid'}`;

    return (

        <>
            <PageTitle title={orderId} />
            {loading ? (<Loader />) : (<div className="order-box">
                <div className="table-block">
                    <h2 className="table-title">Order Items</h2>
                    <div className="table-responsive">
                        <table className='table-main'>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>name</th>
                                    <th>Quantity</th>
                                    <th>Price (TK)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.map((item) => (
                                    <tr className='table-row' key={item.product}>
                                        <td className="table-cell">
                                            <img src={item.Image} alt={item.name} className="item-img" />
                                        </td>
                                        <td className="table-cell">{item.name}</td>
                                        <td className="table-cell">{item.quantity}</td>
                                        <td className="table-cell">{item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="table-block">
                    <h2 className="table-title">Shipping Info</h2>
                    <div className="table-responsive">
                        <table className="table-main">
                            <tbody>
                                <tr className="table-row">
                                    <th className="table-cell">Address :-</th>
                                    <td className="table-cell">{shippingInfo.address},{shippingInfo.city},{shippingInfo.state},{shippingInfo.pinCode}</td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Phone :-</th>
                                    <td className="table-cell">{shippingInfo.phoneNo}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="table-block">
                    <h2 className="table-title">Order Summary</h2>
                    <div className="table-responsive">
                        <table className="table-main">
                            <tbody>
                                <tr className="table-row">
                                    <th className="table-cell">Order Status :-</th>
                                    <td className='table-cell'>
                                        <span className={orderStatusClass}>
                                            {orderStatus}
                                        </span>
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Payment Status :-</th>
                                    <td className='table-cell'>
                                        <span className={paymentStatusClass}>
                                            {paymentInfo?.status}
                                        </span>
                                    </td>
                                </tr>
                                {paidAt && <tr className="table-row">
                                    <th className="table-cell">Paind At :-</th>
                                    <td className='table-cell'>
                                        {new Date(paidAt).toLocaleString()}
                                    </td>
                                </tr>}
                                <tr className="table-row">
                                    <th className="table-cell">Items Price :-</th>
                                    <td className='table-cell'>
                                        TK {itemPrice}
                                    </td>                            </tr>
                                <tr className="table-row">
                                    <th className="table-cell">tax Price :-</th>
                                    <td className='table-cell'>
                                        TK {taxPrice}
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Shipping price :-</th>
                                    <td className='table-cell'>
                                        TK {shippingPrice}
                                    </td>                            
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Total price :-</th>
                                    <td className='table-cell'>
                                        TK {totalPrice}
                                    </td>                           
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>)}
        </>
    );
}

export default OrderDetailsPage;
