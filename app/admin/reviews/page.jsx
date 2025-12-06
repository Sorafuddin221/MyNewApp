'use client';

import React, { useEffect, useState } from 'react';
import '@/AdminStyles/ReviewsList.css';
import PageTitle from '@/components/PageTitle';
import { Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage, deleteReview, fetchAdminProducts, fetchProductReviews, removeErrors, removeSuccess } from '@/features/admin/adminSlice';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';

function ReviewsListPage() {
    const { products, loading, error, reviews, success, message } = useSelector(state => state.admin);
    const router = useRouter();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    const handleViewReviews = (productId) => {
        setSelectedProduct(productId);
        dispatch(fetchProductReviews(productId));
    };

    const handleDeleteReview = (productId, reviewId) => {
        const confirm = window.confirm('Are you sure you want to delete this review?');
        if (confirm) {
            dispatch(deleteReview({ productId, reviewId }));
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error.message,
                { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (success) {
            toast.success(message,
                { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            dispatch(clearMessage());
            router.push("/admin/products"); // Redirect to admin products list after review deletion
        }
    }, [dispatch, error, success, message, router]);

    if (!products || products.length === 0) {
        return (
            <div className="reviews-list-container">
                <h1 className='reviews-list-title'>Admin Reviews</h1>
                <p>No Product Found</p>
            </div>
        );
    }

    return (
        <>
            {loading ? (<Loader />) : (
                <>
                    <PageTitle title="All Reviews" />
                    <div className="reviews-list-container">
                        <h1 className='reviews-list-title'>ALL Products</h1>
                        <table className="reviews-table">
                            <thead>
                                <tr>
                                    <th>Sl No</th>
                                    <th>Product Name</th>
                                    <th>Product Image</th>
                                    <th>Number of Reviews</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product._id}>
                                        <td>{index + 1}</td>
                                        <td>{product.name}</td>
                                        <td>
                                            <img src={product.image[0].url} alt={product.name} className='product-image' />
                                        </td>
                                        <td>{product.numOfReviews}</td>
                                        <td>
                                            {product.numOfReviews > 0 && (
                                                <button className="action-btn view-btn"
                                                    onClick={() => handleViewReviews(product._id)}
                                                >view Reviews</button>)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {selectedProduct && reviews && reviews.length > 0 && (<div className="reviews-details">
                            <h2>Reviews for Product</h2>
                            <table className='reviews-table'>
                                <thead>
                                    <tr>
                                        <th>Sl No</th>
                                        <th>Reviewer Name</th>
                                        <th>Rating</th>
                                        <th>Comment</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews.map((review, index) => (
                                        <tr key={review._id}>
                                            <td>{index + 1}</td>
                                            <td>{review.name}</td>
                                            <td>{review.rating}</td>
                                            <td>{review.comment}</td>
                                            <td>
                                                <button onClick={() => handleDeleteReview(selectedProduct, review._id)} className="action-btn delete-btn" ><Delete /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>)}
                    </div>
                </>
            )}
        </>
    );
}

export default ReviewsListPage;
