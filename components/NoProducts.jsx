'use client';
import React from 'react';
import '../componentStyles/NoProducts.css';

function NoProducts({keyword}) {
  return (
    <div className="no-products-content">
        <div className="no-products-icon">
            <h3 className="no-products-title">No product Found</h3>
            <p className="no-products-message">
                {keyword?`We couldn't find any products matching "${keyword}". 
                Try using different keywords or browse our complete catalog.`: 'No products are available.please check back later'}
            </p>
        </div>
    </div>
  )
}

export default NoProducts;