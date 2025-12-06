'use client';

import React, { useEffect, useState } from 'react';
import '@/UserStyles/Form.css';
import PageTitle from '@/components/PageTitle';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, removeErrors, removeSuccess } from '@/features/user/userSlice';

function ForgotPasswordPage() {
    const { loading, error, success, message } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");

    const forgotPasswordEmail = (e) => {
        e.preventDefault();
        dispatch(forgotPassword({ email }));
    };

    useEffect(() => {
        if (error) {
            toast.error(error.message,
                { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (success) {
            toast.success(message,
                { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
        }
    }, [dispatch, success]);

    return (
        <>
            <PageTitle title="Forget Password" />
            <div className="forgot-container">
                <div className="form-content email-group">
                    <form className="form" onSubmit={forgotPasswordEmail}>
                        <h2>Forgot Password</h2>
                        <div className="input-group">
                            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} name="email" placeholder='Enter Your Registered Email' />
                        </div>
                        <button className="authBtn" disabled={loading}>{loading ? 'Sending' : 'Send'}</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ForgotPasswordPage;
