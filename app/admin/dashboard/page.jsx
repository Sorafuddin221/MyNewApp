'use client';

import React, { useEffect } from 'react';
import '@/AdminStyles/Dashboard.css';
import PageTitle from '@/components/PageTitle';

import {
    AttachMoney,
    Dashboard as DashboardIcon,
    Error,
    Instagram,
    Inventory,
    LinkedIn,
    People,
    ShoppingCart,
    Star,
    YouTube
} from '@mui/icons-material';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts, fetchAllOrders } from '@/features/admin/adminSlice';


function DashboardPage() {
    const { products, orders, totalAmount } = useSelector(state => state.admin);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAdminProducts());
        dispatch(fetchAllOrders());
    }, [dispatch]);

    const totalProducts = products.length;
    const totalOrders = orders.length;
    const outOfStock = products.filter(product => product.stock === 0).length;
    const inStock = products.filter(product => product.stock > 0).length;
    const totalReviews = products.reduce((acc, product) => acc + (product.reviews.length || 0), 0);

    return (
        <>
            <PageTitle title="Admin Dashboard" />
            <div className="dashboard-container">
                <div className="sidebar">
                    <div className="logo">
                        <DashboardIcon className='logo-icon' />
                        Admin Dashboard
                    </div>
                    <nav className="nav-menu">
                        <div className="nav-section">
                            <h3>Products</h3>
                            <Link href="/admin/products">
                                <Inventory className='nav-icon' />
                                All Products
                            </Link>
                            <Link href="/admin/product/create">
                                <Inventory className='nav-icon' />
                                Add New Product
                            </Link>
                        </div>
                        <div className="nav-section">
                            <h3>Users</h3>
                            <Link href="/admin/users">
                                <People className='nav-icon' />
                                All Users
                            </Link>

                        </div>
                        <div className="nav-section">
                            <h3>Orders</h3>
                            <Link href="/admin/orders">
                                <ShoppingCart className='nav-icon' />
                                All Orders
                            </Link>

                        </div>
                        <div className="nav-section">
                            <h3>Reviews</h3>
                            <Link href="/admin/reviews">
                                <Star className='nav-icon' />
                                All Reviews
                            </Link>

                        </div>
                    </nav>
                </div>
                <div className="main-content">
                    <div className="stats-grid">
                        <div className="stat-box">
                            <Inventory className='icon' />
                            <h3>Total Products</h3>
                            <p>{totalProducts}</p>
                        </div>
                        <div className="stat-box">
                            <ShoppingCart className='icon' />
                            <h3>Total Orders</h3>
                            <p>{totalOrders}</p>
                        </div>
                        <div className="stat-box">
                            <Star className='icon' />
                            <h3>Total Reviews</h3>
                            <p>{totalReviews}</p>
                        </div>
                        <div className="stat-box">
                            <AttachMoney className='icon' />
                            <h3>Total Revenue</h3>
                            <p>{totalAmount}</p>
                        </div>
                        <div className="stat-box">
                            <Error className='icon' />
                            <h3>Out Of Stock</h3>
                            <p>{outOfStock}</p>
                        </div>
                        <div className="stat-box">
                            <Inventory className='icon' />
                            <h3>In Stock</h3>
                            <p>{inStock}</p>
                        </div>
                    </div>

                    <div className="social-stats">
                        <div className="social-box instagram">
                            <Instagram className='icon' />
                            <h3>Instagram</h3>
                            <p>123k Followers</p>
                            <p>12 Posts</p>
                        </div>

                        <div className="social-box linkedIn">
                            <LinkedIn className='icon' />
                            <h3>Linkedin</h3>
                            <p>123k Followers</p>
                            <p>12 Posts</p>
                        </div>

                        <div className="social-box youtube">
                            <YouTube className='icon' />
                            <h3>you Tube</h3>
                            <p>123k Followers</p>
                            <p>12 Posts</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DashboardPage;
