'use client';
import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import { toast } from 'react-toastify';
import './NotificationBell.css'; 

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/api/admin/notifications');
            if (data.success) {
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000); // Poll for new notifications every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (notificationId) => {
        try {
            const { data } = await api.put('/api/admin/notifications', { notificationId });
            if (data.success) {
                // The notification is removed from the list upon navigation,
                // but we can also refetch to be sure.
                fetchNotifications();
            }
        } catch (error) {
            toast.error("Failed to mark notification as read.");
            console.error("Failed to mark notification as read.", error);
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="notification-bell">
            <button onClick={toggleDropdown} className="bell-button">
                <i className="fa fa-bell"></i>
                {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
            </button>
            {isOpen && (
                <div className="notification-dropdown">
                    {notifications.length > 0 ? (
                        <ul>
                            {notifications.map(notif => (
                                <li key={notif._id} className="notification-item">
                                    <p>{notif.message}</p>
                                    <Link href={notif.link} passHref>
                                        <button onClick={() => handleMarkAsRead(notif._id)} className="answer-button">
                                            Answer
                                        </button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-notifications">No new notifications</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
