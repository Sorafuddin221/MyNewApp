'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import '@/componentStyles/Filters.css';

function Filters({ categories }) {
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
    </div>
  );
}

export default Filters;
