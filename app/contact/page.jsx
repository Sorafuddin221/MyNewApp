'use client';

import React, { useState } from 'react';
import PageTitle from '@/components/PageTitle';
import '@/pageStyles/ContactUs.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/contact', { name, email, message });
      toast.success(data.message);
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <PageTitle title="Contact Us - My Website" />
      <div className="contact-container">
        <div className="contact-form-section">
          <h2>Get in Touch</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit">Send Message</button>
          </form>
        </div>
        <div className="contact-address-section">
          <h2>Our Address</h2>
          <div className="address-item">
            <LocationOnIcon className="icon" />
            <p>123 Main Street, Anytown, USA 12345</p>
          </div>
          <div className="address-item">
            <PhoneIcon className="icon" />
            <p>+1 (555) 123-4567</p>
          </div>
          <div className="address-item">
            <EmailIcon className="icon" />
            <p>contact@example.com</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
