"use client";

import React, { useEffect, useState } from 'react';
import PageTitle from '@/components/PageTitle';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleUser, removeErrors, removeSuccess, updateUserRole, setUser } from '@/features/admin/adminSlice';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';

function UpdateRoleClient({ userId, initialUser }) {
    const { success, loading, error } = useSelector(state => state.admin);
    const { user } = useSelector(state => state.admin); // Get user from Redux store for updates
    const dispatch = useDispatch();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: ""
    });

    // Use the initial data passed from the Server Component
    useEffect(() => {
        if (initialUser) {
            dispatch(setUser(initialUser)); // Set initial user in redux store
        }
    }, [initialUser, dispatch]);

    // This effect now only runs when the user state in Redux changes, not for initial fetching
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                role: user.role || "",
            });
        }
    }, [user]);

    const { name, email, role } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(updateUserRole({ userId, role }));
    };

    useEffect(() => {
        if (success) {
            toast.success("User Role Updated Successfully", { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            router.push('/admin/users');
        }
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error, success, router]);

    if (!userId) return <Loader />; // Or a "User Not Found" message

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <PageTitle title="Update User Role" />
                    <div className="page-wrapper">
                        <div className="update-user-role-container">
                            <h1>Update User Role</h1>
                            <form className="update-user-role-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" name="name" id="name" readOnly value={name} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" name="email" id="email" readOnly value={email} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="role">Role</label>
                                    <select name="role" id="role" required value={role} onChange={handleChange}>
                                        <option value="">select Role</option>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <button className="btn btn-primary" type="submit" disabled={loading}>Update Role</button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default UpdateRoleClient;
