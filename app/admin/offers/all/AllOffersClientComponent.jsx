'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function AllOffersClientComponent() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const response = await fetch('/api/special-offers');
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      } else {
        toast.error('Failed to fetch special offers.');
      }
    } catch (error) {
      console.error('Error fetching special offers:', error);
      toast.error('Error fetching special offers.');
    }
  };

  const handleDelete = async (idToDelete) => {
    try {
      const response = await fetch(`/api/special-offers/${idToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Special offer deleted successfully!');
        loadOffers(); // Reload offers after successful deletion
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete special offer.');
      }
    } catch (error) {
      console.error('Error deleting special offer:', error);
      toast.error('Error deleting special offer.');
    }
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
