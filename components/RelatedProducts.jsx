'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Product from './Product';
import Loader from './Loader';
import '../../componentStyles/RelatedProducts.css'; // Assuming a new CSS file for this component

const RelatedProducts = ({ productId, productCategory }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productId || !productCategory) {
            setLoading(false);
            return;
        }

        const fetchRelatedProducts = async () => {
            try {
                // Assuming an API endpoint like /api/products/related?categoryId=<id>&excludeProductId=<id>
                const response = await axios.get(`/api/products/related?categoryId=${productCategory}&excludeProductId=${productId}`);
                setRelatedProducts(response.data.products);
            } catch (err) {
                console.error("Error fetching related products:", err);
                setError("Failed to load related products.");
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [productId, productCategory]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (relatedProducts.length === 0) {
        return null; // Or a message like "No related products found."
    }

    return (
        <div className="related-products-container">
            <h3>Related Products</h3>
            <div className="related-products-grid">
                {relatedProducts.map((product) => (
                    <Product product={product} key={product._id} />
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
