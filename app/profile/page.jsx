'use client';

import React, { useEffect, useState } from 'react';
import '@/UserStyles/NewProfile.css';
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
            <PageTitle title={`${user?.name || 'User'}'s Profile`} />
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-page-header">
                        <div className="profile-avatar-container">
                            <img 
                                src={user?.avatar?.url || './images/profile.png'} 
                                alt="User Profile" 
                                className="profile-page-avatar" 
                            />
                            <Link href="/profile/update" className="edit-profile-btn">
                                Edit Profile
                            </Link>
                        </div>
                        <div className="profile-info">
                            <h1 className="profile-page-user-name">{user?.name}</h1>
                            <p className="profile-email">{user?.email}</p>
                            <p className="profile-joined">
                                Joined on: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                    <div className="profile-actions">
                        <Link href="/orders/user" className="action-btn">
                            My Orders
                        </Link>
                        <Link href="/password/update" className="action-btn">
                            Change Password
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfilePage;
