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
    const router = useRouter();

    const [address, setAddress] = useState(shippingInfo.address || "");
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
    const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber || "");
    const [country, setCountry] = useState(shippingInfo.country || "BD"); // Default to Bangladesh
    const [state, setState] = useState(shippingInfo.state || "");
    const [city, setCity] = useState(shippingInfo.city || "");

    // Error states for validation
    const [addressError, setAddressError] = useState(false);
    const [pinCodeError, setPinCodeError] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [stateError, setStateError] = useState(false);
    const [cityError, setCityError] = useState(false);

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
    }, [shippingInfo.shippingMethod, state, dhakaDivisionName]);

    const shippingInfoSubmit = (e) => {
        e.preventDefault();

        let isValid = true;

        // Reset all errors
        setAddressError(false);
        setPinCodeError(false);
        setPhoneNumberError(false);
        setStateError(false);
        setCityError(false);

        if (!address.trim()) {
            setAddressError(true);
            toast.error('Address is required!', { position: 'top-center', autoClose: 3000 });
            isValid = false;
        }
        if (!pinCode.trim()) {
            setPinCodeError(true);
            toast.error('Pincode is required!', { position: 'top-center', autoClose: 3000 });
            isValid = false;
        }
        if (!phoneNumber.trim()) {
            setPhoneNumberError(true);
            toast.error('Phone Number is required!', { position: 'top-center', autoClose: 3000 });
            isValid = false;
        } else if (phoneNumber.length !== 11) {
            setPhoneNumberError(true);
            toast.error('Invalid Phone number! It should be 11 Digits', { position: 'top-center', autoClose: 3000 });
            isValid = false;
        }

        if (!state.trim()) {
            setStateError(true);
            toast.error('Division is required!', { position: 'top-center', autoClose: 3000 });
            isValid = false;
        } else if (state && !city.trim()) {
            setCityError(true);
            toast.error('District is required!', { position: 'top-center', autoClose: 3000 });
            isValid = false;
        }

        if (isValid) {
            dispatch(saveShippingInfo({ address, pinCode, state, city, country, phoneNumber, shippingMethod: shippingInfo.shippingMethod }));
            router.push('/order/confirm');
        }
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
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                onFocus={() => setAddressError(false)}
                                onBlur={(e) => setAddressError(!e.target.value.trim())}
                                placeholder='Enter Your address'
                                name="address"
                                id="address"
                                className={addressError ? 'error-field' : ''}
                            />
                        </div>
                        <div className="shipping-form-group">
                            <label htmlFor="pinCode">Pincode</label>
                            <input
                                type="number"
                                value={pinCode}
                                onChange={(e) => setPinCode(e.target.value)}
                                onFocus={() => setPinCodeError(false)}
                                onBlur={(e) => setPinCodeError(!e.target.value.trim())}
                                placeholder='Enter Your pincode'
                                name="pinCode"
                                id="pinCode"
                                className={pinCodeError ? 'error-field' : ''}
                            />
                        </div>
                        <div className="shipping-form-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                onFocus={() => setPhoneNumberError(false)}
                                onBlur={(e) => {
                                    if (!e.target.value.trim() || e.target.value.length !== 11) {
                                        setPhoneNumberError(true);
                                    }
                                }}
                                placeholder='Enter Your Phone Number'
                                name="phoneNumber"
                                id="phoneNumber"
                                className={phoneNumberError ? 'error-field' : ''}
                            />
                        </div>
                    </div>
                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label htmlFor="country">Country</label>
                            <select
                                value={country}
                                onChange={(e) => {
                                    setCountry(e.target.value);
                                    setState("");
                                    setCity("");
                                }}
                                id="country"
                                name="country"
                                disabled
                                className={country ? '' : 'error-field'} // Country should always be selected
                            >
                                <option value="BD">Bangladesh</option>
                            </select>
                        </div>
                        <div className="shipping-form-group">
                            <label htmlFor="state">Division</label>
                            <select
                                value={state}
                                onChange={(e) => {
                                    setCity("");
                                    setState(e.target.value);
                                    setStateError(false); // Clear error on change
                                    setCityError(false); // Clear city error too
                                }}
                                onFocus={() => setStateError(false)}
                                onBlur={(e) => setStateError(!e.target.value.trim())}
                                id="state"
                                name="state"
                                disabled={isDivisionDisabled}
                                className={stateError ? 'error-field' : ''}
                            >
                                <option value="">Select a Division</option>
                                {bdData.divisions.map((item) => (
                                    <option value={item.name} key={item.name}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        {state && <div className="shipping-form-group">
                            <label htmlFor="city">District</label>
                            <select
                                value={city}
                                onChange={(e) => {
                                    setCity(e.target.value);
                                    setCityError(false); // Clear error on change
                                }}
                                onFocus={() => setCityError(false)}
                                onBlur={(e) => setCityError(!e.target.value.trim())}
                                id="city"
                                name="city"
                                className={cityError ? 'error-field' : ''}
                            >
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