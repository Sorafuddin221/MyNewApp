'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import '@/componentStyles/Filters.css';

function FiltersClientComponent({ categories, recentProducts }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  
  const handleCategoryClick = (categoryName) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (categoryName) {
      newSearchParams.set('category', categoryName);
    } else {
      newSearchParams.delete('category');
    }
    newSearchParams.delete('page'); // Reset page when category changes
    router.push(`/products?${newSearchParams.toString()}`);
  };

  return (
    <div className="filter-section">
      <h3 className="filter-heading">Categories</h3>
      <ul>
        <li
          onClick={() => handleCategoryClick('')}
          className={!currentCategory ? 'active' : ''}
        >
          All
        </li>
        {categories.map((cat) => (
          <li
            key={cat._id}
            onClick={() => handleCategoryClick(cat.name)}
            className={currentCategory === cat.name ? 'active' : ''}
          >
            {cat.name}
          </li>
        ))}
      </ul>

      {recentProducts && recentProducts.length > 0 && (
        <div className="recent-products-sidebar">
          <h3 className="filter-heading">Recent Products</h3>
          <div className="recent-products-list">
            {recentProducts.map((product) => (
              <Link href={`/product/${product._id}`} key={product._id} className="recent-product-card">
                <div className="recent-product-image">
                  <Image
                    src={product.image[0]?.url || '/images/blog-placeholder.png'}
                    alt={product.name}
                    width={60}
                    height={60}
                  />
                </div>
                <div className="recent-product-info">
                  <p className="recent-product-name">{product.name}</p>
                  <p className="recent-product-price">TK {product.offeredPrice || product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
}

export default FiltersClientComponent;
