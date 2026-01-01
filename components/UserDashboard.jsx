  'use client';

import React, { useState, useEffect, useRef } from 'react';
import '@/UserStyles/UserDashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { logout, removeSuccess } from '@/features/user/userSlice';
import { clearCart } from '@/features/cart/cartSlice';
import { ArrowDropDown } from '@mui/icons-material';


function UserDashboard({ user }) {
    const { cartItems } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);
    const dashboardRef = useRef(null);

    function toggleMenu() {
        setMenuVisible(!menuVisible);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dashboardRef.current && !dashboardRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dashboardRef]);

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
        { name: `Cart (${cartItems.length})`, funcName: navigateToCart, isCart: true },
        { name: 'Logout', funcName: logoutUser },
    ];

    if (user?.role === 'admin') {
        options.unshift({
            name: 'Admin Dashboard', funcName: navigateToAdminDashboard
        });
    }

    return (
        <div className="dashboard-container" ref={dashboardRef}>
            <div className={`overlay ${menuVisible ? 'show' : ''}`} onClick={toggleMenu}></div>
            <div className="profile-header" onClick={toggleMenu}>
                <img className='profile-avatar' src={user?.avatar?.url || './images/profile.png'} alt="profile-img" />
                <span className="profile-name">{user?.name || 'User'}</span>
                <ArrowDropDown className='profile-arrow' />
            </div>
            {menuVisible && (<div className="menu-options">
                {options.map((item) => (
                    <button key={item.name} onClick={item.funcName} className={`menu-option-btn ${item.isCart ? (cartItems.length > 0 ? 'cart-not-empty' : '') : ''}`}>{item.name}</button>
                ))}
            </div>)}
        </div>
    );
}

export default UserDashboard;