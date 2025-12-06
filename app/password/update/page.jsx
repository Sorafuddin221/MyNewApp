'use client';

import React, { useEffect, useState } from 'react';
import '@/UserStyles/Form.css';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { removeErrors, removeSuccess, updatePassword } from '@/features/user/userSlice';
import PageTitle from '@/components/PageTitle';
import Loader from '@/components/Loader';


function UpdatePasswordPage() {
    const { success, loading, error } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const UpdatePasswordSubmit = async (e) => {
        e.preventDefault();
        const myForm = {
            oldPassword,
            newPassword,
            confirmPassword,
        };
        await dispatch(updatePassword(myForm));
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
            toast.success('Password Updated successfully',
                { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            router.push("/profile");
        }
    }, [dispatch, success, router]);

    return (
        <>
            {loading ? (<Loader />) : (
                <>
                    <PageTitle title="Password Update" />
                    <div className='update-container'>
                        <div className='form-content'>
                            <form className="form" onSubmit={UpdatePasswordSubmit}>
                                <h2>Update Password</h2>

                                <div className="input-group">
                                    <input type="password" placeholder='Input Old Password' name='oldPassword' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <input type="password" placeholder='Input New Password' name='newPassword' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <input type="password" placeholder='Input confirm Password' name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                                <button className="authBtn" type="submit" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default UpdatePasswordPage;
