'use client';
import React, { useEffect, useState } from 'react';
import Product from './Product';
import Loader from './Loader';
import axios from 'axios';
import '../../componentStyles/TrendingProducts.css'; // Assuming a new CSS file for this component

const TrendingProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrendingProducts = async () => {
            try {
                const response = await axios.get('/api/products/trending');
                setProducts(response.data.products);
            } catch (err) {
                console.error("Error fetching trending products:", err);
                setError("Failed to load trending products.");
            } finally {
                setLoading(false);
            }
        };
        fetchTrendingProducts();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="home-container">
            <h2 className="home-heading">trending new</h2>
            <div className="home-product-container">
                {products && products.length > 0 ? (
                    products.map((product) => (
                        <Product product={product} key={product._id} hideAddToCartButton={true} />
                    ))
                ) : (
                    <p>No trending products found.</p>
                )}
            </div>
        </div>
    );
};

export default TrendingProducts;
