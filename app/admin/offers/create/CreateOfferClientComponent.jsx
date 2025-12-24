'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function CreateOfferClientComponent() {
  const [imageUrl, setImageUrl] = useState(''); // Stores the URL returned from the backend
  const [buttonUrl, setButtonUrl] = useState('');
  const [imageFile, setImageFile] = useState(null); // Stores the selected file object
  const [imagePreview, setImagePreview] = useState(''); // Stores the URL for local preview
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Cleanup for image preview URL
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview('');
    }
  };

  const uploadImage = async () => {
    if (!imageFile) {
      toast.error('No image selected for upload.');
      return null;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();
      toast.success('Image uploaded successfully!');
      return data.imageUrl; // Return the URL from the backend
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading image.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    let finalImageUrl = imageUrl; // Start with manually entered URL if any

    if (imageFile) {
      finalImageUrl = await uploadImage(); // Upload if a file is selected
      if (!finalImageUrl) {
        return; // Stop if upload failed
      }
    }

    if (!finalImageUrl) {
      toast.error('An image is required for the special offer.');
      return;
    }

    const newOffer = { imageUrl: finalImageUrl, buttonUrl };

    const existingOffers = JSON.parse(localStorage.getItem('specialOffers')) || [];
    const updatedOffers = [...existingOffers, newOffer];
    localStorage.setItem('specialOffers', JSON.stringify(updatedOffers));

    toast.success('Special offer added successfully!');
    setImageUrl('');
    setButtonUrl('');
    setImageFile(null);
    setImagePreview('');
  };

  return (
    <div className="admin-settings-container">
      <h3>Add New Special Offer</h3>
      <form onSubmit={handleAddOffer} className="settings-form">
        <div className="form-group">
          <label htmlFor="imageUpload">Image Upload:</label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleFileChange}
          />
          {imagePreview && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <img src={imagePreview} alt="Image Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }} />
            </div>
          )}
        </div>
        {/* Optionally keep a text input for URL for advanced users, or rely solely on upload */}
        <div className="form-group">
          <label htmlFor="imageUrlText">Or Enter Image URL:</label>
          <input
            type="text"
            id="imageUrlText"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL directly (e.g., from an external source)"
            disabled={!!imageFile} // Disable if file is selected
          />
        </div>
        <div className="form-group">
          <label htmlFor="buttonUrl">Button URL (Optional):</label>
          <input
            type="text"
            id="buttonUrl"
            value={buttonUrl}
            onChange={(e) => setButtonUrl(e.target.value)}
            placeholder="Enter button URL"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Add Special Offer'}
        </button>
      </form>
    </div>
  );
}

export default CreateOfferClientComponent;
