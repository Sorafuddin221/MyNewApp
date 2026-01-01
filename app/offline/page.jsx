import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import '../../pageStyles/Offline.css';

const OfflinePage = () => {
    return (
        <>
            <Head>
                <title>You are Offline</title>
            </Head>
            <div className="offline-container">
                <div className="offline-content">
                    <h1 className="offline-title">You are Offline</h1>
                    <p className="offline-message">
                        It seems you've lost your internet connection. Please check your network settings and try again.
                    </p>
                    <Link href="/" className="offline-button">
                        Go to Homepage
                    </Link>
                </div>
            </div>
        </>
    );
};

export default OfflinePage;
