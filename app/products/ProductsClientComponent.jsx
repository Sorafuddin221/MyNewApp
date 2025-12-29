'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Product from '@/components/Product';
import NoProducts from '@/components/NoProducts';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import OfferCardDisplay from '@/components/OfferCardDisplay';
import RotatingOfferCards from '@/components/RotatingOfferCards'; // Import the new component
import '@/componentStyles/Categories.css';

const ProductsClientComponent = ({ products, totalPages, currentPage, keyword, categories, category, showSubCategoryCards }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [offerCards, setOfferCards] = useState([]);

    useEffect(() => {
        const fetchOfferCards = async () => {
            try {
                const response = await fetch('/api/offer-cards');
                if (response.ok) {
                    const data = await response.json();
                    const filteredCards = data.filter(
                        (card) => card.displayLocation === 'products_page_after_pagination'
                    );
                    setOfferCards(filteredCards);
                } else {
                    toast.error('Failed to fetch offer cards for products page.');
                }
            } catch (error) {
                console.error('Error fetching offer cards for products page:', error);
                toast.error('Error fetching offer cards for products page.');
            }
        };
        fetchOfferCards();
    }, []);

    const productsPageOfferCards = offerCards.filter(
        (card) => card.displayLocation === 'products_page_after_pagination'
    );

    const handlePageChange = (page) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('page', page);
        
        router.push(`/products?${newSearchParams.toString()}`);
    };

    const currentCategory = categories.find(cat => cat.name === category);

    return (
        <div className="products-section">
            {currentCategory && currentCategory.subcategories && currentCategory.subcategories.length > 0 && showSubCategoryCards && (
                <div className="category-container">
                    <h2 className="text-2xl font-bold text-center mb-8">Sub-Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                    {currentCategory.subcategories.map(sub => {
                                                        const newSearchParams = new URLSearchParams(searchParams.toString());
                                                        newSearchParams.set('category', category); // Ensure parent category is preserved
                                                        newSearchParams.set('subcategory', sub.name);
                                                        newSearchParams.delete('page'); // Reset page when filter changes

                                                        const newHref = `/products?${newSearchParams.toString()}`;

                                                        return (
                                                            <Link key={sub._id} href={newHref} className="category-card">
                                                                <img src={sub.image[0]?.url} alt={sub.name} />
                                                                <p>{sub.name}</p>
                                                            </Link>
                                                        );
                                                    })}                    </div>
                </div>
            )}
            {products && products.length > 0 ? (
                <div className="products-product-container">
                    {products.map((product) => (
                        <Product key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <NoProducts keyword={keyword} />
            )}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Dynamic Offer Cards for Products Page */}
            {productsPageOfferCards.length > 0 && (
                <section className="offer-section dynamic-products-page-offers">
                    <RotatingOfferCards cards={productsPageOfferCards} />
                </section>
            )}
        </div>
    );
};

export default ProductsClientComponent;

