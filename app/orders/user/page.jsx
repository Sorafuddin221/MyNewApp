'use client';

import React, { useEffect } from 'react';
import '@/OrderStyles/MyOrders.css';
import PageTitle from '@/components/PageTitle';
import Link from 'next/link';
import { LaunchOutlined, Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMyOrder, getAllMyOrders, removeIsDeleted } from '@/features/order/orderSlice';
import { toast } from 'react-toastify';
import { removeErrors } from '@/features/order/orderSlice';
import Loader from '@/components/Loader';


function MyOrdersPage() {
    const { orders, loading, error, isDeleted } = useSelector(state => state.order);
    const dispatch = useDispatch();

    const handleDelete = (orderId) => {
        dispatch(deleteMyOrder(orderId));
    };

    useEffect(() => {
        dispatch(getAllMyOrders());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error.message,
                { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (isDeleted) {
            toast.success('Order Deleted Successfully', { position: 'top-center', autoClose: 3000 });
            dispatch(removeIsDeleted());
            dispatch(getAllMyOrders());
        }
    }, [dispatch, error, isDeleted]);

    return (
        <>
            <PageTitle title="User Order" />
            {loading ? (<Loader />) : orders.length > 0 ? (<div className="my-orders-container">
                <div className="table-responsive">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order Id</th>
                                <th>Items Count</th>
                                <th> status</th>
                                <th>Total Price</th>
                                <th>View order</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.orderItems.length}</td>
                                    <td>{order.orderStatus}</td>
                                    <td>{order.totalPrice}</td>
                                    <td><Link className='order-link' href={`/order/${order._id}`}><LaunchOutlined /></Link></td>
                                    <td>
                                        <button onClick={() => handleDelete(order._id)} className='delete-button' disabled={order.orderStatus !== 'processing'}>
                                            <Delete />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>) : (
                <div className="no-orders">
                    <p className="no-order-message">no Orders found</p>
                </div>
            )}
        </>
    );
}

export default MyOrdersPage;
