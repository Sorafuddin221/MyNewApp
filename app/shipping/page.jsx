'use client';

import React, { useState, useEffect } from 'react';
import '@/CartStyles/Shipping.css';
import PageTitle from '@/components/PageTitle';
import CheckoutPath from '@/Cart/CheckoutPath';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { data as bdData } from '@/Cart/bd-states-cities';
import { toast } from 'react-toastify';
import { saveShippingInfo } from '@/features/cart/cartSlice';

function ShippingPage() {
    const { shippingInfo } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const [address, setAddress] = useState(shippingInfo.address || "");
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
    const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber || "");
    const [country, setCountry] = useState(shippingInfo.country || "BD"); // Default to Bangladesh
    const [state, setState] = useState(shippingInfo.state || "");
    const [city, setCity] = useState(shippingInfo.city || "");
    const [isDivisionDisabled, setIsDivisionDisabled] = useState(false);

    // Get the exact "Dhaka" division name from bdData
    const dhakaDivisionName = bdData.divisions.find(div => div.name.toLowerCase() === 'dhaka')?.name || 'Dhaka';

    useEffect(() => {
        if (shippingInfo.shippingMethod === "inside") {
            setState(dhakaDivisionName);
            setCity(""); // Clear city if division is forced
            setIsDivisionDisabled(true);
        } else {
            setIsDivisionDisabled(false);
            // If previously forced to Dhaka, and now outside, clear state
            if (state === dhakaDivisionName && shippingInfo.shippingMethod !== "inside") {
                setState("");
                setCity("");
            }
        }
    }, [shippingInfo.shippingMethod]); // Depend on shippingMethod changes

    const router = useRouter();
    const shippingInfoSubmit = (e) => {
        e.preventDefault();
        if (phoneNumber.length !== 11) {
            toast.error('Invalid Phone number ! it should be 11 Digits', { position: 'top-center', autoClose: 3000 });
            return;
        }
        if (state && !city) {
            toast.error('Please select your District', { position: 'top-center', autoClose: 3000 });
            return;
        }
        dispatch(saveShippingInfo({ address, pinCode, state, city, country, phoneNumber, shippingMethod: shippingInfo.shippingMethod }));
        router.push('/order/confirm');
    };

    return (
        <>
            <PageTitle title="Shipping Info" />
            <CheckoutPath activePath={0} />
            <div className="shipping-form-container">
                <h1 className='shipping-form-header'>Shipping Details</h1>
                <form className='shipping-form' onSubmit={shippingInfoSubmit}>
                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label htmlFor="address">Address</label>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Enter Your address' name="address" id="address" />
                        </div>
                        <div className="shipping-form-group">
                            <label htmlFor="pinCode">Pincode</label>

                            <input type="number" value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder='Enter Your pincode' name="pinCode" id="pinCode" />
                        </div>
                        <div className="shipping-form-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder='Enter Your Phone Number' name="phoneNumber" id="phoneNumber" />
                        </div>
                    </div>
                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label htmlFor="country">Country</label>
                            <select value={country} onChange={(e) => {
                                setCountry(e.target.value);
                                setState("");
                                setCity("");
                            }}
                                id="country" name="country" disabled> {/* Disabled as it's fixed to Bangladesh */}
                                <option value="BD">Bangladesh</option>
                            </select>
                        </div>
                        <div className="shipping-form-group">
                            <label htmlFor="state">Division</label>
                            <select value={state} onChange={(e) => {
                                setCity("");
                                setState(e.target.value);

                            }} id="state" name="state" disabled={isDivisionDisabled}>
                                <option value="">Select a Division</option>
                                {bdData.divisions.map((item) => (
                                    <option value={item.name} key={item.name}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        {state && <div className="shipping-form-group">
                            <label htmlFor="city">District</label>
                            <select value={city} onChange={(e) => setCity(e.target.value)} id="city" name="city">
                                <option value="">Select a District</option>
                                {bdData.divisions.find(div => div.name === state)?.districts.map((item) => (
                                    <option value={item} key={item}>{item}</option>
                                ))}
                            </select>
                        </div>}
                    </div>
                    <button className="shipping-submit-btn">Continue</button>
                </form>
            </div>
        </>
    );
}

export default ShippingPage;