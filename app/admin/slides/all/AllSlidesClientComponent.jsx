'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function AllSlidesClientComponent() {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = () => {
    const savedSlides = JSON.parse(localStorage.getItem('adminSlides')) || [];
    setSlides(savedSlides);
  };

  const handleDelete = (indexToDelete) => {
    const updatedSlides = slides.filter((_, index) => index !== indexToDelete);
    localStorage.setItem('adminSlides', JSON.stringify(updatedSlides));
    setSlides(updatedSlides);
    toast.success('Slide deleted successfully!');
  };

  return (
    <div className="admin-settings-container">
      <h3>All Slides</h3>
      {slides.length === 0 ? (
        <p>No slides added yet. Go to "Add New Slide" to create some.</p>
      ) : (
        <div className="slides-list">
          {slides.map((slide, index) => (
            <div key={index} className="special-offer-item"> {/* Reusing special-offer-item styling */}
              <h4>Slide #{index + 1}</h4>
              <img src={slide.imageUrl} alt={`Slide ${index + 1}`} style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem' }} />
              <p><strong>Image URL:</strong> {slide.imageUrl}</p>
              <p><strong>Button URL:</strong> {slide.buttonUrl || 'N/A'}</p>
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="remove-btn"
              >
                Delete Slide
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllSlidesClientComponent;
