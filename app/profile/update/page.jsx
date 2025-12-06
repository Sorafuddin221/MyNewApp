'use client';

import React, { useEffect, useState } from 'react';
import '@/UserStyles/Form.css';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { updateProfile, removeErrors, removeSuccess } from '@/features/user/userSlice';
import Loader from '@/components/Loader';


function UpdateProfilePage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("./images/profile.png");
    const { user, error, success, message, loading } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

    const profileImageUpdate = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                }
            };
            reader.onerror = (error) => {
                toast.error('Error reading File');
            };
            reader.readAsDataURL(file);
            setAvatar(file); // Store the actual File object
        }
    };

    const updateSubmit = async (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('name', name);
        myForm.set('email', email);
        if (avatar) {
            myForm.set('avatar', avatar); // Pass the File object directly
        }

        await dispatch(updateProfile(myForm));
    };

    useEffect(() => {
        if (error) {
            toast.error(error,
                { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (success) {
            toast.success(message,
                { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            router.push("/profile");
        }
    }, [dispatch, success, router]);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url || './images/profile.png');
        }
    }, [user]);

    return (
        <>
            {loading ? (<Loader />) : (
                <>
                    <div className="update-container">
                        <div className="form-content">
                            <form className="form" encType='multipart/form-data' onSubmit={updateSubmit}>
                                <h2>Update Profile</h2>
                                <div className="input-group avatar-group">
                                    <input name='avatar' type="file" accept='image/' className='file-input' onChange={profileImageUpdate} />
                                    <img src={avatarPreview} alt="user Profile" className="avatar" />
                                </div>
                                <div className="input-group">
                                    <input type="text" placeholder='Input your User Name' name='name' value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <input placeholder='Email' name='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                <button className="authBtn" type="submit" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update'}
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default UpdateProfilePage;
