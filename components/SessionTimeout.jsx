"use client";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../features/user/userSlice';
import { jwtDecode } from "jwt-decode";

const SessionTimeout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkSession = () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    dispatch(logoutSuccess());
                }
            }
        };

        const interval = setInterval(checkSession, 5000); 

        return () => clearInterval(interval);
    }, [dispatch]);

    return null;
};

export default SessionTimeout;