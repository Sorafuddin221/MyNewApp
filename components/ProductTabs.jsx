'use client';
import { useState, useEffect } from 'react';
import '../componentStyles/ProductTabs.css';
import Product from './Product';
import axios from 'axios';
import Pagination from './Pagination'; // Import Pagination

const ProductTabs = () => {
    const [activeTab, setActiveTab] = useState('featured');
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`/api/products?keyword=${activeTab}&page=${currentPage}`);
                setProducts(data.products);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]); // Clear products on error
                setTotalPages(0);
            }
        };

        fetchProducts();
    }, [activeTab, currentPage]);

    // Reset to page 1 when tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="product-tabs-container">
            <h2 className="product-tabs-heading">Top Products</h2>
            <p className="product-tabs-subheading">Browse our top products</p>
            <div className="product-tabs">
                <button
                    className={`tab-btn ${activeTab === 'featured' ? 'active' : ''}`}
                    onClick={() => setActiveTab('featured')}
                >
                    Featured Products
                </button>
                <button
                    className={`tab-btn ${activeTab === 'new-arrival' ? 'active' : ''}`}
                    onClick={() => setActiveTab('new-arrival')}
                >
                    New Arrivals
                </button>
                <button
                    className={`tab-btn ${activeTab === 'offer' ? 'active' : ''}`}
                    onClick={() => setActiveTab('offer')}
                >
                    Our Offers
                </button>
            </div>
            <div className="product-tabs-content">
                {products.length > 0 ? (
                    products.map((product) => (
                        <Product key={product._id} product={product} />
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ProductTabs;