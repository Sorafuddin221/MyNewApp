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
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('page', page);
        const search = current.toString();
        const query = search ? `?${search}` : '';
        // Need to check if we are on a category page or general products page
        if (category && showSubCategoryCards) { // We are on a dynamic category page
            router.push(`/products/${encodeURIComponent(category)}${query}`);
        } else { // We are on the general products page
            const existingCategoryParam = searchParams.get('category');
            if(existingCategoryParam) {
                current.set('category', existingCategoryParam);
            }
            const existingSubCategoryParam = searchParams.get('subcategory');
            if(existingSubCategoryParam) {
                current.set('subcategory', existingSubCategoryParam);
            }
            router.push(`/products${query}`);
        }
    };

    const currentCategory = categories.find(cat => cat.name === category);

    return (
        <div className="products-section">
            {currentCategory && currentCategory.subcategories && currentCategory.subcategories.length > 0 && showSubCategoryCards && (
                <div className="category-container">
                    <h2 className="text-2xl font-bold text-center mb-8">Sub-Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                    {currentCategory.subcategories.map(sub => {
                                                        const current = new URLSearchParams();
                                                        current.set('subcategory', sub.name); // Always set subcategory

                                                        // Preserve other search params like keyword, sort, discount
                                                        if (searchParams.has('keyword')) {
                                                            current.set('keyword', searchParams.get('keyword'));
                                                        }
                                                        if (searchParams.has('sort')) {
                                                            current.set('sort', searchParams.get('sort'));
                                                        }
                                                        if (searchParams.has('discount')) {
                                                            current.set('discount', searchParams.get('discount'));
                                                        }

                                                        // Remove page if it exists to reset pagination on filter change
                                                        current.delete('page');
                                                        
                                                        const newQuery = current.toString();
                                                        let newHref;

                                                        if (showSubCategoryCards) { // On /products/[category] page
                                                            newHref = `/products/${encodeURIComponent(category)}${newQuery ? `?${newQuery}` : ''}`;
                                                        } else { // On /products page, handled by sidebar - this path shouldn't be taken for subcategory cards
                                                            // This case for subcategory cards should ideally not happen if showSubCategoryCards is false
                                                            // but for robustness, if it did, it would need specific handling for the /products page.
                                                            // For now, assuming showSubCategoryCards is true for subcategory cards here.
                                                            // If a subcategory is clicked on /products, it's handled by FiltersClientComponent
                                                            // The newHref logic for FiltersClientComponent is in that file.
                                                            // This newHref is for the product display component's internal subcategory cards.
                                                            newHref = `/products?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(sub.name)}${newQuery ? `&${newQuery}` : ''}`;
                                                        }

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

