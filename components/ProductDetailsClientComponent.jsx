'use client';
const URL = 'https://your-domain.com';

import React, { useEffect, useState } from 'react';
import '@/pageStyles/ProductDetails.css';
import PageTitle from '@/components/PageTitle';
import MuiRating from '@mui/material/Rating'; // Renamed to avoid conflict
import { useDispatch, useSelector } from 'react-redux';
import { createReview, getProductDetails, removeErrors, removeSuccess } from '@/features/products/productSlice';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import { removeMessage, addItemsToCart } from '@/features/cart/cartSlice';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import '@/pageStyles/ProductDetailsTabs.css';
import RelatedProducts from './RelatedProducts'; // New import
import ReviewsTab from './ReviewsTab';
import CustomerQueryTab from './CustomerQueryTab';

function ProductDetailsClientComponent({ initialProduct, productId }) {
    const { id } = initialProduct ? initialProduct : { id: productId }; // Use initialProduct if available, otherwise productId
    const [userRating, setUserRating] = useState(0);
    const [comment, setComment] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeTab, setActiveTab] = useState('reviews');
    const [selectedColor, setSelectedColor] = useState(''); // New state

    const { loading, error, product: reduxProduct, reviewSuccess, reviewLoading } = useSelector((state) => state.product);
    const { loading: cartLoading, error: cartError, success, message } = useSelector((state) => state.cart);
    const { user, isAuthenticated } = useSelector((state) => state.user); // Added isAuthenticated

    const dispatch = useDispatch();

    // Use initial product data if provided, otherwise fetch
    const product = initialProduct || reduxProduct;

    useEffect(() => {
        if (!initialProduct && productId) { // Only dispatch if no initialProduct is provided (e.g., direct client-side navigation)
            dispatch(getProductDetails(productId));
        }
        return () => {
            dispatch(removeErrors());
        };
    }, [dispatch, productId, initialProduct]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (cartError) {
            toast.error(cartError, { position: 'top-center', autoClose: 3000 });
            dispatch(removeMessage());
        }
    }, [dispatch, error, cartError]);

    useEffect(() => {
        if (success) {
            toast.success(message, { position: 'top-center', autoClose: 3000 });
            dispatch(removeMessage());
        }
    }, [dispatch, success, message]);

    const decreaseQuantity = () => {
        if (quantity <= 1) {
            toast.error('Quantity cannot be less than 1', { position: 'top-center', autoClose: 3000 });
            return;
        }
        setQuantity(qty => qty - 1);
    };

    const increaseQuantity = () => {
        if (product.stock <= quantity) {
            toast.error('Cannot exceed available Stock!', { position: 'top-center', autoClose: 3000 });
            return;
        }
        setQuantity(qty => qty + 1);
    };

    const addToCart = () => {
        if (!isAuthenticated) { // Check for authentication
            toast.error("Please login to your account");
            return;
        }

        if (!product || !product._id) {
            toast.error('Product information is not available. Cannot add to cart.', { position: 'top-center', autoClose: 3000 });
            console.error("Attempted to add to cart without valid product or product ID.");
            return;
        }
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            toast.error('Please select a color for the product.', { position: 'top-center', autoClose: 3000 });
            return;
        }
        console.log("Adding to cart: product ID being sent:", product._id, "with color:", selectedColor);
        dispatch(addItemsToCart({ id: product._id, quantity, color: selectedColor }));
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!userRating) {
            toast.error('Please select a Rating', { position: 'top-center', autoClose: 3000 });
            return;
        }
        dispatch(createReview({
            rating: userRating,
            comment,
            productId: product._id
        }));
    };

    useEffect(() => {
        if (reviewSuccess) {
            toast.success('Review Submitted Successfully', { position: 'top-center', autoClose: 3000 });
            setUserRating(0);
            setComment("");
            dispatch(removeSuccess());
            dispatch(getProductDetails(product._id)); // Re-fetch product details after review
        }
    }, [reviewSuccess, product?._id, dispatch]);

    useEffect(() => {
        if (product && product.image && product.image.length > 0) {
            setSelectedImage(product.image[0].url);
        }
    }, [product]);

    if (loading && !initialProduct) { // Show loader only if fetching and no initialProduct is available
        return <Loader />;
    }
    if (error && !initialProduct) {
        return (
            <>
                <PageTitle title="Product Details" />
                <p>Error: {error}</p>
                <p>Product not found.</p>
            </>
        );
    }
    if (!product) {
        return (
            <>
                <PageTitle title="Product Details" />
                <p>Product not found.</p>
            </>
        );
    }

    const discount = product.offeredPrice ? Math.round(((product.price - product.offeredPrice) / product.price) * 100) : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "name": product.name,
                        "image": product.image.map((img) => img.url),
                        "description": product.description,
                        "sku": product._id,
                        "brand": {
                            "@type": "Brand",
                            "name": "My E-Shop"
                        },
                        "offers": {
                            "@type": "Offer",
                            "url": `${URL}/product/${product._id}`,
                            "priceCurrency": "BDT",
                            "price": product.offeredPrice ? product.offeredPrice : product.price,
                            "itemCondition": "https://schema.org/NewCondition",
                            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                            "seller": {
                                "@type": "Organization",
                                "name": "My E-Shop"
                            }
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": product.ratings,
                            "reviewCount": product.numOfReviews
                        },
                        "review": product.reviews.map((review) => ({
                            "@type": "Review",
                            "author": {
                                "@type": "Person",
                                "name": review.name
                            },
                            "datePublished": review.createdAt,
                            "reviewBody": review.comment,
                            "reviewRating": {
                                "@type": "Rating",
                                "ratingValue": review.rating
                            }
                        }))
                    })
                }}
            />

            <PageTitle title={`${product.name} -Details`} />
            <div className="product-details-container">
                <div className="product-detail-container">
                    <div className="product-image-container">
                        {discount && <div className="discount-badge">{discount}% off</div>}
                        {selectedImage && (
                            <Zoom
                                overlayBgColorStart="rgba(0, 0, 0, 0.5)"
                                overlayBgColorEnd="rgba(0, 0, 0, 0.5)"
                            >
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className='product-detail-image'
                                />
                            </Zoom>
                        )}

                        {product.image.length > 1 && (<div className="product-thumbnails">
                            {product.image.map((img, index) => (
                                <img src={img.url} alt={`thumbnail ${index + 1}`} key={index} className='thumbnail-image' onClick={() => setSelectedImage(img.url)} />
                            ))}
                        </div>)}
                    </div>
                    <div className="product-info">
                        <h2>{product.name}</h2>
                        <div
                            className='product-description'
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                        <p className="product-category">Category: {product.category?.name}</p>
                        <p className="product-price">
                            {product.offeredPrice ? (
                                <>
                                    <span className="original-price">TK {product.price}</span>
                                    <span className="offered-price">TK {product.offeredPrice}</span>
                                </>
                            ) : (
                                <strong>Price: TK {product.price}</strong>
                            )}
                        </p>
                        <div className="product-rating">
                            <MuiRating
                                value={product.ratings}
                                precision={0.5}
                                readOnly
                            />
                            <span className='productCardSpan'>
                                ({product.numOfReviews} {product.numOfReviews === 1 ? "Review" : "Reviews"})
                            </span>
                        </div>
                        <div className="stock-status">
                            <span className={product.stock > 1 ? `in stock` : 'Out of Stock'}>
                                {product.stock > 0 ? `in stock (${product.stock} available)` : 'Out of stock'}
                            </span>
                        </div>

                        {product.colors && product.colors.length > 0 && (
                            <div className="color-selection">
                                <span className="color-label">Colors:</span>
                                <div className="color-options">
                                    {product.colors.map((color) => (
                                        <div
                                            key={color.name}
                                            className={`color-swatch ${selectedColor === color.name ? 'selected' : ''}`}
                                            style={{ backgroundColor: color.hexCode }}
                                            onClick={() => setSelectedColor(color.name)}
                                            title={color.name}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.stock > 0 && (<> <div className="quantity-controls">
                            <span className="quantity-label">quantity</span>
                            <button className="quantity-button" onClick={decreaseQuantity}>-</button>
                            <input type="text" value={quantity} readOnly className="quantity-value" />
                            <button onClick={increaseQuantity} className="quantity-button">+</button>
                        </div>
                            <button className="add-to-cart-btn" onClick={addToCart} disabled={cartLoading} >{cartLoading ? 'Adding' : ' Add to card'}</button>
                        </>)}
                    </div>
                </div>

                <div className="product-details-tabs">
                    <div className="tab-headers">
                        <button
                            className={`tab-header ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews
                        </button>
                        {user && (
                            <button
                                className={`tab-header ${activeTab === 'queries' ? 'active' : ''}`}
                                onClick={() => setActiveTab('queries')}
                            >
                                Customer Queries
                            </button>
                        )}
                    </div>
                    <div className="tab-content">
                        {activeTab === 'reviews' && (
                            <ReviewsTab
                                product={product}
                                userRating={userRating}
                                setUserRating={setUserRating}
                                comment={comment}
                                setComment={setComment}
                                handleReviewSubmit={handleReviewSubmit}
                                reviewLoading={reviewLoading}
                            />
                        )}
                        {activeTab === 'queries' && user && (
                            <CustomerQueryTab
                                product={product}
                                user={user}
                            />
                        )}
                    </div>
                </div>
            </div>

            {product && product.category && (
                <RelatedProducts
                    productId={product._id}
                    productCategory={product.category._id}
                />
            )}
        </>
    );
}

export default ProductDetailsClientComponent;