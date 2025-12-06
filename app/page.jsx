import React from 'react';
import ImageSlider from '@/components/ImageSlider';
import Categories from '@/components/Categories';
import ProductTabs from '@/components/ProductTabs';
import TrendingProducts from '@/components/TrendingProducts'; // New import
import '@/pageStyles/Home.css';

export default async function Home() {
  return (
    <>
        <>
          <ImageSlider />
          <Categories />
          <TrendingProducts /> {/* Use the new component */}
         <ProductTabs />
        </>
    </>
  );
}
