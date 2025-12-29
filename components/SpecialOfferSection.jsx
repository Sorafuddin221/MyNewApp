'use client';
import React, { useState, useEffect } from 'react';
import '../componentStyles/SpecialOfferSection.css';

function SpecialOfferSection() {
  const [offers, setOffers] = useState([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/special-offers');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setOffers(data);
          }
        }
      } catch (error) {
        console.error('Error fetching special offers:', error);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    if (offers.length > 1) {
      const interval = setInterval(() => {
        setCurrentOfferIndex((prevIndex) => (prevIndex + 1) % offers.length);
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }
  }, [offers]);

  const currentOffer = offers[currentOfferIndex];

  if (offers.length === 0) {
    return (
      <div className="special-offer-section">
        <h3>Special Offers</h3>
        <div className="default-offer-message">
          <p>No special offers configured yet.</p>
          {/* Using a placeholder image for default state */}
          <div className="offer-item">
            <img src="/images/default-offer.jpg" alt="Default Offer" />
            <div className="offer-content">
              <h3>Get exciting deals!</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="special-offer-section">
      <div className="offer-item">
        <img src={currentOffer.imageUrl} alt={`Special Offer ${currentOfferIndex + 1}`} />
        <div className="offer-content">
          <h3>Special Offer!</h3> {/* Text for the offer item */}
          {currentOffer.buttonUrl && (
            <button
              className="offer-button"
              onClick={() => window.open(currentOffer.buttonUrl, '_blank')}
            >
              View Offer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpecialOfferSection;

