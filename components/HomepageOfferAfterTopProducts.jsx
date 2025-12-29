'use client';

import React, { useState, useEffect } from 'react';
import RotatingOfferCards from './RotatingOfferCards';
import OfferCardDisplay from './OfferCardDisplay'; // Fallback if only one card and no rotation
import '@/componentStyles/OfferSection.css'; // Reusing existing styles

const HomepageOfferAfterTopProducts = () => {
  const [offerCards, setOfferCards] = useState([]);
  const [showContent, setShowContent] = useState(false); // State to control timed display

  useEffect(() => {
    const fetchOfferCards = async () => {
      try {
        const response = await fetch('/api/offer-cards');
        if (response.ok) {
          const data = await response.json();
          const filteredCards = data.filter(card => card.displayLocation === 'homepage_after_top_products');
          setOfferCards(filteredCards);
        } else {
          console.error('Failed to fetch offer cards for HomepageAfterTopProducts section.');
        }
      } catch (error) {
        console.error('Error fetching offer cards for HomepageAfterTopProducts section:', error);
      }
    };
    fetchOfferCards();

    // Set a timeout to show the content after 5 seconds
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  if (!showContent || offerCards.length === 0) {
    return null; // Don't render anything until timer expires or if no cards
  }

  return (
    <section className="offer-section dynamic-homepage-offers">
      {offerCards.length > 1 ? (
        <RotatingOfferCards cards={offerCards} />
      ) : (
        // If only one card, still use OfferCardDisplay for consistency, no rotation
        <OfferCardDisplay card={offerCards[0]} />
      )}
    </section>
  );
};

export default HomepageOfferAfterTopProducts;
