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
import { usePathname } from 'next/navigation'; // Import usePathname
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts, fetchAllOrders } from '@/features/admin/adminSlice';


function DashboardPage() {
    const { products, orders, totalAmount } = useSelector(state => state.admin);
    const dispatch = useDispatch();
    const pathname = usePathname(); // Get current pathname

    useEffect(() => {
        dispatch(fetchAdminProducts());
        dispatch(fetchAllOrders());
    }, [dispatch]);

    const totalProducts = products.length;
    const totalOrders = orders.length;
    const outOfStock = products.filter(product => product.stock === 0).length;
    const inStock = products.filter(product => product.stock > 0).length;
    const totalReviews = products.reduce((acc, product) => acc + (product.reviews.length || 0), 0);

    const isActive = (path) => pathname === path;

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
                            <Link href="/admin/products" className={isActive("/admin/products") ? "active-link" : ""}>
                                <Inventory className='nav-icon' />
                                All Products
                            </Link>
                            <Link href="/admin/product/create" className={isActive("/admin/product/create") ? "active-link" : ""}>
                                <Inventory className='nav-icon' />
                                Add New Product
                            </Link>
                        </div>
                        <div className="nav-section">
                            <h3>Slides</h3>
                            <Link href="/admin/slides/all" className={isActive("/admin/slides/all") ? "active-link" : ""}>
                                <Inventory className='nav-icon' />
                                All Slides
                            </Link>
                            <Link href="/admin/slides/create" className={isActive("/admin/slides/create") ? "active-link" : ""}>
                                <Inventory className='nav-icon' />
                                Add New Slide
                            </Link>
                        </div>
                        <div className="nav-section">
                            <h3>Special Offers</h3>
                            <Link href="/admin/offers/all" className={isActive("/admin/offers/all") ? "active-link" : ""}>
                                <Inventory className='nav-icon' />
                                All Special Offers
                            </Link>
                            <Link href="/admin/offers/create" className={isActive("/admin/offers/create") ? "active-link" : ""}>
                                <Inventory className='nav-icon' />
                                Add New Special Offer
                            </Link>
                        </div>
                        <div className="nav-section">
                            <h3>Offer Cards</h3>
                            <Link href="/admin/offer-cards/all" className={isActive("/admin/offer-cards/all") ? "active-link" : ""}>
                                <Inventory className='nav-icon' />
                                All Offer Cards
                            </Link>
                            <Link href="/admin/offer-cards/create" className={isActive("/admin/offer-cards/create") ? "active-link" : ""}>
                                <Inventory className='nav-icon' />
                                Add New Offer Card
                            </Link>
                        </div>
                        <div className="nav-section">
                            <h3>Users</h3>
                            <Link href="/admin/users" className={isActive("/admin/users") ? "active-link" : ""}>
                                <People className='nav-icon' />
                                All Users
                            </Link>

                        </div>
                        <div className="nav-section">
                            <h3>Orders</h3>
                            <Link href="/admin/orders" className={isActive("/admin/orders") ? "active-link" : ""}>
                                <ShoppingCart className='nav-icon' />
                                All Orders
                            </Link>

                        </div>
                        <div className="nav-section">
                            <h3>Reviews</h3>
                            <Link href="/admin/reviews" className={isActive("/admin/reviews") ? "active-link" : ""}>
                                <Star className='nav-icon' />
                                All Reviews
                            </Link>
                        </div>
                        <div className="nav-section">
                            <h3>Payments</h3>
                            <Link href="/admin/payments" className={isActive("/admin/payments") ? "active-link" : ""}>
                                <AttachMoney className='nav-icon' />
                                Configure Payments
                            </Link>
                        </div>
                        <div className="nav-section">
                            <h3>Settings</h3>
                            <Link href="/admin/settings" className={isActive("/admin/settings") ? "active-link" : ""}>
                                <DashboardIcon className='nav-icon' /> {/* Reusing DashboardIcon, can be changed */}
                                General Settings
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
