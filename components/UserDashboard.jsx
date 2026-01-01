  'use client';

import React, { useState, useEffect, useRef } from 'react';
import '@/UserStyles/UserDashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { logout, removeSuccess } from '@/features/user/userSlice';
import { clearCart } from '@/features/cart/cartSlice';
import { ArrowDropDown } from '@mui/icons-material';
import Portal from './Portal';


function UserDashboard({ user }) {
    const { cartItems } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
    const dashboardRef = useRef(null);
    const menuRef = useRef(null);

    function toggleMenu() {
        if (dashboardRef.current) {
            const rect = dashboardRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY + 5, // Add a small vertical offset
                right: window.innerWidth - rect.right // Align right edge with avatar's right edge
            });
        }
        setMenuVisible(!menuVisible);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dashboardRef.current && !dashboardRef.current.contains(event.target) &&
                menuRef.current && !menuRef.current.contains(event.target)
            ) {
                setMenuVisible(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Define navigation functions
    const navigateToOrders = () => {
        router.push("/orders/user");
        setMenuVisible(false);
    };
    const navigateToProfile = () => {
        router.push("/profile");
        setMenuVisible(false);
    };
    const navigateToCart = () => {
        router.push("/cart");
        setMenuVisible(false);
    };
    const navigateToAdminDashboard = () => {
        router.push("/admin/dashboard");
        setMenuVisible(false);
    };

    const logoutUser = () => {
        dispatch(logout())
            .unwrap()
            .then(() => {
                toast.success('Logout Successful', { position: 'top-center', autoClose: 3000 });
                dispatch(removeSuccess());
                dispatch(clearCart());
                router.push('/');
                setMenuVisible(false);
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
            {menuVisible && (
                <Portal>
                    <div
                        className="menu-options"
                        ref={menuRef}
                        style={{ top: `${menuPosition.top}px`, right: `${menuPosition.right}px` }}
                    >
                        {options.map((item) => (
                            <button key={item.name} onClick={item.funcName} className={`menu-option-btn ${item.isCart ? (cartItems.length > 0 ? 'cart-not-empty' : '') : ''}`}>{item.name}</button>
                        ))}
                    </div>
                </Portal>
            )}
        </div>
    );
}

export default UserDashboard;