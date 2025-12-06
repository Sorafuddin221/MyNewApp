'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '@/features/user/userSlice';
import Navbar from './Navbar';
import Footer from './Footer';
import UserDashboard from './UserDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LayoutClient({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();


  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <Navbar />
      {children}
      {isAuthenticated && user && <UserDashboard user={user} />}
      <Footer />
      <ToastContainer autoClose={3000} theme="colored" />
    </>
  );
}