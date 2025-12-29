'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function CreateOfferCardClientComponent() {
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [displayLocation, setDisplayLocation] = useState('none'); // New state for display location
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
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
      return data.imageUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading image.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAddOfferCard = async (e) => {
    e.preventDefault();
    let finalImageUrl = imageUrl;

    if (imageFile) {
      finalImageUrl = await uploadImage();
      if (!finalImageUrl) {
        return;
      }
    }

    if (!finalImageUrl || !title || !description) {
      toast.error('Image, Title, and Description are required.');
      return;
    }

    const newOfferCard = { imageUrl: finalImageUrl, title, description, buttonUrl, displayLocation }; // Include displayLocation

    try {
      const response = await fetch('/api/offer-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOfferCard),
      });

      if (!response.ok) {
        throw new Error('Failed to save offer card');
      }

      toast.success('Offer card added successfully!');
      setImageUrl('');
      setTitle('');
      setDescription('');
      setButtonUrl('');
      setDisplayLocation('none'); // Reset display location
      setImageFile(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error saving offer card:', error);
      toast.error('Error saving offer card.');
    }
  };

  return (
    <div className="admin-settings-container">
      <h3>Add New Offer Card</h3>
      <form onSubmit={handleAddOfferCard} className="settings-form">
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
        <div className="form-group">
          <label htmlFor="imageUrlText">Or Enter Image URL:</label>
          <input
            type="text"
            id="imageUrlText"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL directly"
            disabled={!!imageFile}
          />
        </div>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required
          ></textarea>
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
        {/* New form group for display location */}
        <div className="form-group">
          <label htmlFor="displayLocation">Display Location:</label>
          <select
            id="displayLocation"
            value={displayLocation}
            onChange={(e) => setDisplayLocation(e.target.value)}
          >
            <option value="none">None</option>
            <option value="homepage_after_top_products">Homepage (After Top Products)</option>
            <option value="products_page_after_pagination">Products Page (After Pagination)</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Add Offer Card'}
        </button>
      </form>
    </div>
  );
}

export default CreateOfferCardClientComponent;
