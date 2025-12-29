'use client';

import React, { useState, useEffect } from 'react';
import '@/componentStyles/OfferSection.css';
import RotatingOfferCards from './RotatingOfferCards';
import OfferCardDisplay from './OfferCardDisplay';

const OfferSection = () => {
  const [offerCards, setOfferCards] = useState([]);

  useEffect(() => {
    const fetchOfferCards = async () => {
      try {
        const response = await fetch('/api/offer-cards');
        if (response.ok) {
          const data = await response.json();
          // Filter for displayLocation === 'none' as currently in OfferSection
          const filteredCards = data.filter(card => card.displayLocation === 'none');
          setOfferCards(filteredCards);
        } else {
          console.error('Failed to fetch offer cards for OfferSection.');
        }
      } catch (error) {
        console.error('Error fetching offer cards for OfferSection:', error);
      }
    };
    fetchOfferCards();
  }, []);

  if (offerCards.length === 0) {
    return (
      <section className="offer-section">
        <p style={{ textAlign: 'center', width: '100%', padding: '2rem' }}>No offer cards for this section.</p>
      </section>
    );
  }

  return (
    <section className="offer-section dynamic-homepage-offers">
      <RotatingOfferCards cards={offerCards} />
    </section>
  );
};

export default OfferSection;
