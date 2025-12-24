import React from 'react';
import InfoSection from '@/components/InfoSection';
import OfferSection from '@/components/OfferSection';
import HotDeals from '@/components/HotDeals';
import ImageSlider from '@/components/ImageSlider';
import Categories from '@/components/Categories';
import ProductTabs from '@/components/ProductTabs';
import TrendingProducts from '@/components/TrendingProducts'; // New import
import SpecialOfferSection from '@/components/SpecialOfferSection'; // Import the new component
import '@/pageStyles/Home.css';

export default async function Home() {
  return (
    <>
      <div className="hero-section-wrapper">
        <div className="main-slider-container">
          <ImageSlider />
        </div>
        <div className="special-offer-container">
          <SpecialOfferSection />
        </div>
      </div>
      <Categories />
      <OfferSection />
      <HotDeals />
      <TrendingProducts /> {/* Use the new component */}
      <ProductTabs />
      <InfoSection />
    </>
  );
}
