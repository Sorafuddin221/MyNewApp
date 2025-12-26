'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { toast } from 'react-toastify';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '@/componentStyles/HotDeals.css';

const HotDeals = () => {
    const [hotDeals, setHotDeals] = useState([]);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const res = await fetch('/api/products?limit=100');
                if (!res.ok) {
                    let errorMessage = 'Failed to fetch products';
                    const contentType = res.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const errorData = await res.json();
                        errorMessage = errorData.message || errorMessage;
                    } else {
                        errorMessage = await res.text();
                    }
                    throw new Error(errorMessage);
                }
                const data = await res.json();
                
                const allProducts = data.products || [];

                const deals = allProducts.filter(product => {
                    if (typeof product.price === 'number' && typeof product.offeredPrice === 'number' && product.price > 0) {
                        const discount = ((product.price - product.offeredPrice) / product.price) * 100;
                        return discount >= 20;
                    }
                    return false;
                });

                setHotDeals(deals);
            } catch (error) {
                console.error("Error fetching hot deals:", error);
                toast.error(error.message);
            }
        };

        fetchDeals();
    }, []);

    if (hotDeals.length === 0) {
        return null; // Don't render the section if there are no hot deals
    }

    return (
        <section className="hot-deals-section">
        <div className="hot-deals-header">
            <h2 className="hot-deals-title">Hot Deals</h2>
        </div>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="hot-deals-swiper"
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
            >
                {hotDeals.map(product => {
                    const discount = Math.round(((product.price - product.offeredPrice) / product.price) * 100);
                    return (
                        <SwiperSlide key={product._id}>
                            <Link href={`/product/${product._id}`} className="hot-deal-card-link">
                                <div className="hot-deal-card">
                                    <div className="hot-deal-image-container">
                                        <Image
                                            src={product.image[0]?.url || '/images/blog-placeholder.png'}
                                            alt={product.name}
                                            width={250}
                                            height={250}
                                            className="hot-deal-image"
                                        />
                                        <div className="discount-badge">{discount}% OFF</div>
                                    </div>
                                    <div className="hot-deal-info">
                                        <h3 className="hot-deal-name">{product.name}</h3>
                                        <div className="hot-deal-pricing">
                                                                                    <span className="hot-deal-offered-price">TK {product.offeredPrice?.toFixed(2)}</span>
                                                                                    <span className="hot-deal-original-price">TK {product.price?.toFixed(2)}</span>                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </section>
    );
};

export default HotDeals;
