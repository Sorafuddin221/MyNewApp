'use client';

import React, { useState, useEffect } from 'react';
import '@/UserStyles/UserDashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { logout, removeSuccess } from '@/features/user/userSlice';
import { clearCart } from '@/features/cart/cartSlice';


function UserDashboard({ user }) {
    const { cartItems } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    function toggleMenu() {
        setMenuVisible(!menuVisible);
    }

    // Define navigation functions
    const navigateToOrders = () => {
        router.push("/orders/user");
    };
    const navigateToProfile = () => {
        router.push("/profile");
    };
    const navigateToCart = () => {
        router.push("/cart");
    };
    const navigateToAdminDashboard = () => {
        router.push("/admin/dashboard");
    };

    const logoutUser = () => {
        dispatch(logout())
            .unwrap()
            .then(() => {
                toast.success('Logout Successful', { position: 'top-center', autoClose: 3000 });
                dispatch(removeSuccess());
                dispatch(clearCart());
                router.push('/');
            })
            .catch((error) => {
                toast.error(error.message || 'Logout Failed', { position: 'top-center', autoClose: 3000 });
            });
    };

    const options = [
        { name: 'Orders', funcName: navigateToOrders },
        { name: 'Account', funcName: navigateToProfile },
        { name: `Cart (${isClient ? cartItems.length : 0})`, funcName: navigateToCart, isCart: true },
        { name: 'Logout', funcName: logoutUser },
    ];

    if (user?.role === 'admin') {
        options.unshift({
            name: 'Admin Dashboard', funcName: navigateToAdminDashboard
        });
    }

    if (!isClient) {
        return null;
    }

    return (
        <>
            <div className={`overlay ${menuVisible ? 'show' : ''}`} onClick={toggleMenu}></div>
            <div className="dashboard-container">
                <div className="profile-header" onClick={toggleMenu}>
                    <img className='profile-avatar' src={user?.avatar?.url || './images/profile.png'} alt="profile-img" />
                    <span className="profile-name">{user?.name || 'User'}</span>
                </div>
                {menuVisible && (<div className="menu-options">
                    {options.map((item) => (
                        <button key={item.name} onClick={item.funcName} className={`menu-option-btn ${item.isCart ? (cartItems.length > 0 ? 'cart-not-empty' : '') : ''}`}>{item.name}</button>
                    ))}
                </div>)}
            </div>
        </>
    );
}

export default UserDashboard;