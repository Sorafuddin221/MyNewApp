'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function PaymentsClientComponent() {
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [insideDhakaShippingCost, setInsideDhakaShippingCost] = useState(0); // New state
  const [outsideDhakaShippingCost, setOutsideDhakaShippingCost] = useState(0); // New state

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = JSON.parse(localStorage.getItem('paymentSettings')) || {};
    setTaxPercentage(savedSettings.taxPercentage || 0);
    setInsideDhakaShippingCost(savedSettings.insideDhakaShippingCost || 0);
    setOutsideDhakaShippingCost(savedSettings.outsideDhakaShippingCost || 0);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const newSettings = {
      taxPercentage: Number(taxPercentage),
      insideDhakaShippingCost: Number(insideDhakaShippingCost), // Save new cost
      outsideDhakaShippingCost: Number(outsideDhakaShippingCost), // Save new cost
    };
    localStorage.setItem('paymentSettings', JSON.stringify(newSettings));
    toast.success('Payment settings saved successfully!');
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
