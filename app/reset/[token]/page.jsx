'use client';

import React from 'react';
import '@/UserStyles/Form.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import PageTitle from '@/components/PageTitle';
import { removeErrors, removeSuccess, resetPassword } from '@/features/user/userSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { use } from 'react';

function ResetPasswordPage({ params }) {
    const resolvedParams = use(params);
    const { token } = resolvedParams;
    const { success, loading, error } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const resetPasswordSubmit = async (e) => {
        e.preventDefault();
        const data = {
            password,
            confirmPassword,
        };
        await dispatch(resetPassword({ token, userData: data }));
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
            toast.success('Password Reset successfully',
                { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            router.push("/login");

        }
    }, [dispatch, success, router]);

    return (
        <>
            <PageTitle title="Reset Password " />
            <div className='form-container'>
                <div className='form-content'>
                    <form className="form" onSubmit={resetPasswordSubmit}>
                        <h2>Reset Password</h2>

                        <div className="input-group">
                            <input type="password" placeholder='Enter Your New Password' name='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <input type="password" placeholder='Enter confirm Password' name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <button className="authBtn" disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>

                    </form>
                </div>
            </div>
        </>
    );
}

export default ResetPasswordPage;
