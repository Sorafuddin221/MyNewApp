'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function AllSlidesClientComponent() {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      const response = await fetch('/api/slides');
      if (response.ok) {
        const data = await response.json();
        setSlides(data);
      } else {
        toast.error('Failed to fetch slides.');
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Error fetching slides.');
    }
  };

  const handleDelete = async (idToDelete) => {
    try {
      const response = await fetch(`/api/slides/${idToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Slide deleted successfully!');
        loadSlides(); // Reload slides after successful deletion
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete slide.');
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Error deleting slide.');
    }
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
