'use client';

import React, { useEffect, useState } from 'react';
import '@/UserStyles/Profile.css';
import Link from 'next/link';

import { useSelector } from 'react-redux';
import PageTitle from '@/components/PageTitle';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';

function ProfilePage() {
    const { loading, isAuthenticated, user } = useSelector(state => state.user);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    if (!mounted || loading) {
        return <Loader />;
    }

    return (
        <>
            <div className="profile-container">
                <PageTitle title={`${user?.name || 'User'} Profile`} />
                <div className="profile-image">
                    <h1 className="profile-heading">My profile</h1>
                    <img src={user?.avatar?.url || './images/profile.png'} alt="User Profile" className="profile-image" />
                    <Link href="/profile/update">Edit Profile</Link>
                </div>
                <div className="profile">
                    <div className="profile-details">
                        <h2>Username:</h2>
                        <p>{user?.name}</p>
                    </div>
                    <div className="profile-details">
                        <h2>Email:</h2>
                        <p>{user?.email}</p>
                    </div>
                    <div className="profile-details">
                        <h2>Joined On:</h2>
                        <p>{user?.createdAt ? String(user.createdAt).substring(0, 10) : 'N/A'}</p>
                    </div>
                </div>
                <div className="profile-buttons">
                    <Link href="/orders/user">My Orders</Link>
                    <Link href="/password/update">Change Password</Link>
                </div>
            </div>
        </>
    );
}

export default ProfilePage;
