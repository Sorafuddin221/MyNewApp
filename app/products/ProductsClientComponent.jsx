'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Product from '@/components/Product';
import NoProducts from '@/components/NoProducts';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import '@/componentStyles/Categories.css';

const ProductsClientComponent = ({ products, totalPages, currentPage, keyword, categories, category, showSubCategoryCards }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

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
        </div>
    );
};

export default ProductsClientComponent;

