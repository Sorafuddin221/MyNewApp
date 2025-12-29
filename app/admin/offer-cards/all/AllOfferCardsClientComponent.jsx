'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function AllOfferCardsClientComponent() {
  const [offerCards, setOfferCards] = useState([]);

  useEffect(() => {
    loadOfferCards();
  }, []);

  const loadOfferCards = async () => {
    try {
      const response = await fetch('/api/offer-cards');
      if (response.ok) {
        const data = await response.json();
        setOfferCards(data);
      } else {
        toast.error('Failed to fetch offer cards.');
      }
    } catch (error) {
      console.error('Error fetching offer cards:', error);
      toast.error('Error fetching offer cards.');
    }
  };

  const handleDelete = async (idToDelete) => {
    try {
      const response = await fetch(`/api/offer-cards/${idToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Offer card deleted successfully!');
        loadOfferCards(); // Reload offer cards after successful deletion
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete offer card.');
      }
    } catch (error) {
      console.error('Error deleting offer card:', error);
      toast.error('Error deleting offer card.');
    }
  };

  return (
    <div className="admin-settings-container">
      <h3>All Offer Cards</h3>
      {offerCards.length === 0 ? (
        <p>No offer cards added yet. Go to "Add New Offer Card" to create some.</p>
      ) : (
        <div className="slides-list"> {/* Reusing slides-list styling */}
          {offerCards.map((card, index) => (
            <div key={index} className="special-offer-item"> {/* Reusing special-offer-item styling */}
              <h4>Offer Card #{index + 1}</h4>
              <img src={card.imageUrl} alt={`Offer Card ${index + 1}`} style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem' }} />
              <p><strong>Title:</strong> {card.title}</p>
              <p><strong>Description:</strong> {card.description}</p>
              <p><strong>Button URL:</strong> {card.buttonUrl || 'N/A'}</p>
              <p><strong>Display Location:</strong> {card.displayLocation || 'N/A'}</p>
              <button
                type="button"
                onClick={() => handleDelete(card._id)}
                className="remove-btn"
              >
                Delete Offer Card
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllOfferCardsClientComponent;
