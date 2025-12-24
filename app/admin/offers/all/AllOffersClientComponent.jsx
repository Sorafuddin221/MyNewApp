'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function AllOffersClientComponent() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = () => {
    const savedOffers = JSON.parse(localStorage.getItem('specialOffers')) || [];
    setOffers(savedOffers);
  };

  const handleDelete = (indexToDelete) => {
    const updatedOffers = offers.filter((_, index) => index !== indexToDelete);
    localStorage.setItem('specialOffers', JSON.stringify(updatedOffers));
    setOffers(updatedOffers);
    toast.success('Special offer deleted successfully!');
  };

  return (
    <div className="admin-settings-container">
      <h3>All Special Offers</h3>
      {offers.length === 0 ? (
        <p>No special offers added yet. Go to "Add New Special Offer" to create some.</p>
      ) : (
        <div className="slides-list"> {/* Reusing slides-list styling */}
          {offers.map((offer, index) => (
            <div key={index} className="special-offer-item">
              <h4>Special Offer #{index + 1}</h4>
              <img src={offer.imageUrl} alt={`Special Offer ${index + 1}`} style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem' }} />
              <p><strong>Image URL:</strong> {offer.imageUrl}</p>
              <p><strong>Button URL:</strong> {offer.buttonUrl || 'N/A'}</p>
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="remove-btn"
              >
                Delete Offer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllOffersClientComponent;
