'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function PaymentsClientComponent() {
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [insideDhakaShippingCost, setInsideDhakaShippingCost] = useState(0); // New state
  const [outsideDhakaShippingCost, setOutsideDhakaShippingCost] = useState(0); // New state

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/payment-settings');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setTaxPercentage(data.taxPercentage || 0);
            setInsideDhakaShippingCost(data.insideDhakaShippingCost || 0);
            setOutsideDhakaShippingCost(data.outsideDhakaShippingCost || 0);
          }
        }
      } catch (error) {
        console.error('Error fetching payment settings:', error);
        toast.error('Error fetching payment settings.');
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const newSettings = {
      taxPercentage: Number(taxPercentage),
      insideDhakaShippingCost: Number(insideDhakaShippingCost),
      outsideDhakaShippingCost: Number(outsideDhakaShippingCost),
    };

    try {
      const response = await fetch('/api/payment-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        toast.success('Payment settings saved successfully!');
      } else {
        throw new Error('Failed to save payment settings');
      }
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast.error('Error saving payment settings.');
    }
  };

  return (
    <div className="admin-settings-container">
      <h3>Configure Payments</h3>
      <form onSubmit={handleSave} className="settings-form">
        <div className="form-group">
          <label htmlFor="taxPercentage">Tax Percentage (%):</label>
          <input
            type="number"
            id="taxPercentage"
            value={taxPercentage}
            onChange={(e) => setTaxPercentage(e.target.value)}
            placeholder="Enter tax percentage"
            min="0"
            max="100"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="insideDhakaShippingCost">Inside Dhaka Shipping Cost:</label>
          <input
            type="number"
            id="insideDhakaShippingCost"
            value={insideDhakaShippingCost}
            onChange={(e) => setInsideDhakaShippingCost(e.target.value)}
            placeholder="Enter shipping cost for Inside Dhaka"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="outsideDhakaShippingCost">Outside Dhaka Shipping Cost:</label>
          <input
            type="number"
            id="outsideDhakaShippingCost"
            value={outsideDhakaShippingCost}
            onChange={(e) => setOutsideDhakaShippingCost(e.target.value)}
            placeholder="Enter shipping cost for Outside Dhaka"
            min="0"
            step="0.01"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Payment Settings</button>
      </form>
    </div>
  );
}

export default PaymentsClientComponent;
