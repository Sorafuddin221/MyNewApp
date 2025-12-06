'use client';
import React, { useEffect, useState } from 'react';
import Product from './Product';
import Loader from './Loader';
import axios from 'axios';
import '../../componentStyles/TrendingProducts.css';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation'; // If you need navigation (prev/next buttons)
import 'swiper/css/pagination'; // If you need pagination (dots)
// import required modules
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // Add Autoplay if needed

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

    if (products.length === 0) {
        return (
            <div className="home-container">
                <h2 className="home-heading">trending new</h2>
                <p>No trending products found.</p>
            </div>
        );
    }

    return (
        <div className="home-container">
            <h2 className="home-heading">trending new</h2>
            <div className="home-product-container">
                <Swiper
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation={true} // Enable navigation buttons
                    pagination={{ clickable: true }} // Enable pagination dots
                    loop={true} // Loop through slides
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 40,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 50,
                        },
                    }}
                    modules={[Navigation, Pagination, Autoplay]} // Register modules
                    className="mySwiper"
                >
                    {products.map((product) => (
                        <SwiperSlide key={product._id}>
                            <Product product={product} hideAddToCartButton={true} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default TrendingProducts;
