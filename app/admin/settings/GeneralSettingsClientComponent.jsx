'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function GeneralSettingsClientComponent() {
  const [siteTitle, setSiteTitle] = useState('');
  const [siteLogoUrl, setSiteLogoUrl] = useState('');
  const [siteFaviconUrl, setSiteFaviconUrl] = useState('');
  const [textIcon, setTextIcon] = useState('');
  const [loading, setLoading] = useState(true);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [faviconFile, setFaviconFile] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState('');

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setSiteTitle(data.siteTitle || '');
            setSiteLogoUrl(data.siteLogoUrl || '');
            setSiteFaviconUrl(data.siteFaviconUrl || '');
            setTextIcon(data.textIcon || '');
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Error fetching settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (faviconPreview) URL.revokeObjectURL(faviconPreview);
    };
  }, [logoPreview, faviconPreview]);

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setFile(null);
      setPreview('');
    }
  };

  const uploadImage = async (file, setUploading) => {
    if (!file) {
      return null;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

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

  const handleSave = async (e) => {
    e.preventDefault();
    
    let finalSiteLogoUrl = siteLogoUrl;
    if (logoFile) {
      finalSiteLogoUrl = await uploadImage(logoFile, setUploadingLogo);
      if (!finalSiteLogoUrl) return;
    }

    let finalSiteFaviconUrl = siteFaviconUrl;
    if (faviconFile) {
      finalSiteFaviconUrl = await uploadImage(faviconFile, setUploadingFavicon);
      if (!finalSiteFaviconUrl) return;
    }

    const newSettings = {
      siteTitle,
      siteLogoUrl: finalSiteLogoUrl,
      siteFaviconUrl: finalSiteFaviconUrl,
      textIcon,
    };

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        toast.success('General settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error saving settings.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-settings-container">
      <h3>General Settings</h3>
      <form onSubmit={handleSave} className="settings-form">
        <div className="form-group">
          <label htmlFor="siteTitle">Site Title:</label>
          <input
            type="text"
            id="siteTitle"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            placeholder="Enter site title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="siteLogo">Site Logo:</label>
          <input
            type="file"
            id="siteLogo"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setLogoFile, setLogoPreview)}
          />
          {(logoPreview || siteLogoUrl) && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <img src={logoPreview || siteLogoUrl} alt="Site Logo Preview" style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="siteFavicon">Site Favicon:</label>
          <input
            type="file"
            id="siteFavicon"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setFaviconFile, setFaviconPreview)}
          />
          {(faviconPreview || siteFaviconUrl) && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <img src={faviconPreview || siteFaviconUrl} alt="Site Favicon Preview" style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="textIcon">Text Icon:</label>
          <input
            type="text"
            id="textIcon"
            value={textIcon}
            onChange={(e) => setTextIcon(e.target.value)}
            placeholder="Enter text icon"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={uploadingLogo || uploadingFavicon}>
          {(uploadingLogo || uploadingFavicon) ? 'Uploading...' : 'Save General Settings'}
        </button>
      </form>
    </div>
  );
}

export default GeneralSettingsClientComponent;
