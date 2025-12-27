import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Luhn Algorithm for Credit Card Validation
const validateCreditCard = (cardNumber) => {
    const cleaned = cardNumber.replace(/[\s-]/g, '');

    if (!/^\d{13,19}$/.test(cleaned)) {
        return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

// Validate Expiry Date
const validateExpiryDate = (expiryDate) => {
    const regex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
    if (!regex.test(expiryDate)) {
        return { valid: false, message: 'Expiry date must be in MM/YY format' };
    }

    const [month, year] = expiryDate.split('/');
    const expMonth = parseInt(month);
    const expYear = parseInt('20' + year);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        return { valid: false, message: 'Credit card has expired' };
    }

    return { valid: true };
};

const Checkout = () => {
    const [creditCard, setCreditCard] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [error, setError] = useState('');
    const [cardError, setCardError] = useState('');
    const [expiryError, setExpiryError] = useState('');
    const [addressErrors, setAddressErrors] = useState({});
    const { user } = useAuth();
    const navigate = useNavigate();

    // Address selection
    const [addressChoice, setAddressChoice] = useState('current'); // 'current' or 'new'
    const [currentAddress, setCurrentAddress] = useState(null);
    const [newAddress, setNewAddress] = useState({
        street: '', buildingNo: '', city: '', region: '', postalCode: '', country: ''
    });
    const [loading, setLoading] = useState(true);

    // Fetch current address on mount
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const endpoint = user.role === 'admin'
                    ? `/auth/profile/admin/${user.Username}`
                    : `/auth/profile/${user.Username}`;
                const response = await api.get(endpoint);
                setCurrentAddress({
                    street: response.data.ShippingStreet || '',
                    buildingNo: response.data.ShippingBuildingNo || '',
                    city: response.data.ShippingCity || '',
                    region: response.data.ShippingRegion || '',
                    postalCode: response.data.ShippingPostalCode || '',
                    country: response.data.ShippingCountry || ''
                });
            } catch (error) {
                console.error('Error fetching address:', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchAddress();
    }, [user]);

    // Check if current address is complete
    const hasCompleteAddress = currentAddress &&
        currentAddress.street && currentAddress.city &&
        currentAddress.region && currentAddress.postalCode && currentAddress.country;

    // Handle credit card input with formatting
    const handleCardChange = (e) => {
        let value = e.target.value.replace(/\s/g, '');
        if (!/^\d*$/.test(value)) return;
        if (value.length > 16) value = value.slice(0, 16);
        const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
        setCreditCard(formatted);
        setCardError('');
    };

    // Handle expiry date input with formatting
    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\//g, '');
        if (!/^\d*$/.test(value)) return;
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2);
        setExpiryDate(value);
        setExpiryError('');
    };

    // Handle new address input
    const handleAddressChange = (e) => {
        const { name, value } = e.target;

        // Postal code: only numbers, max 5 digits
        if (name === 'postalCode') {
            const numbersOnly = value.replace(/\D/g, '').slice(0, 5);
            setNewAddress({ ...newAddress, postalCode: numbersOnly });
            if (addressErrors.postalCode) setAddressErrors({ ...addressErrors, postalCode: '' });
            return;
        }

        setNewAddress({ ...newAddress, [name]: value });
        if (addressErrors[name]) setAddressErrors({ ...addressErrors, [name]: '' });
    };

    // Validate new address
    const validateAddress = () => {
        const errors = {};
        if (!newAddress.street) errors.street = 'Street is required';
        if (!newAddress.city) errors.city = 'City is required';
        if (!newAddress.region) errors.region = 'Region is required';
        if (!newAddress.postalCode || newAddress.postalCode.length !== 5) {
            errors.postalCode = 'Postal code must be 5 digits';
        }
        if (!newAddress.country) errors.country = 'Country is required';
        setAddressErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setError('');
        setCardError('');
        setExpiryError('');

        // Validate credit card
        if (!validateCreditCard(creditCard)) {
            setCardError('Invalid credit card number');
            return;
        }

        // Validate expiry date
        const expiryValidation = validateExpiryDate(expiryDate);
        if (!expiryValidation.valid) {
            setExpiryError(expiryValidation.message);
            return;
        }

        // Validate address if new address selected
        if (addressChoice === 'new' && !validateAddress()) {
            return;
        }

        try {
            // If new address, update profile first
            if (addressChoice === 'new') {
                const profileEndpoint = user.role === 'admin'
                    ? `/auth/profile/admin/${user.Username}`
                    : `/auth/profile/${user.Username}`;

                // Get current profile to preserve other fields
                const profileRes = await api.get(profileEndpoint);
                const profile = profileRes.data;

                await api.put(profileEndpoint, {
                    firstName: profile.FirstName || 'User',
                    lastName: profile.LastName || 'User',
                    phone: profile.Phone,
                    address: {
                        street: newAddress.street,
                        buildingNo: newAddress.buildingNo,
                        city: newAddress.city,
                        region: newAddress.region,
                        postalCode: newAddress.postalCode,
                        country: newAddress.country
                    }
                });
            }

            // Process checkout
            await api.post('/cart/checkout', {
                username: user.Username,
                creditCard,
                expiryDate,
                role: user.role
            });
            alert('Checkout successful!');
            navigate('/');
        } catch (error) {
            console.error('Checkout error:', error);
            setError(error.response?.data?.message || error.response?.data?.error || 'Checkout failed');
        }
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className="checkout-container">
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleCheckout}>
                {/* Address Selection */}
                <div className="form-section" style={{ marginBottom: '1.5rem' }}>
                    <h3>Shipping Address</h3>


                    <div className="address-choice" style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginBottom: '1.5rem',
                        padding: '0.25rem',
                        backgroundColor: 'var(--bg-tertiary)',
                        borderRadius: '8px',
                        width: 'fit-content'
                    }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: hasCompleteAddress ? 'pointer' : 'not-allowed',
                            padding: '0.75rem 1.25rem',
                            borderRadius: '6px',
                            backgroundColor: addressChoice === 'current' ? 'var(--primary)' : 'transparent',
                            color: addressChoice === 'current' ? '#fff' : 'var(--text-secondary)',
                            fontWeight: addressChoice === 'current' ? '600' : '400',
                            transition: 'all 0.2s ease',
                            opacity: hasCompleteAddress ? 1 : 0.5
                        }}>
                            <input
                                type="radio"
                                name="addressChoice"
                                value="current"
                                checked={addressChoice === 'current'}
                                onChange={(e) => setAddressChoice(e.target.value)}
                                disabled={!hasCompleteAddress}
                                style={{ display: 'none' }}
                            />
                            Current Address
                        </label>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            padding: '0.75rem 1.25rem',
                            borderRadius: '6px',
                            backgroundColor: addressChoice === 'new' ? 'var(--primary)' : 'transparent',
                            color: addressChoice === 'new' ? '#fff' : 'var(--text-secondary)',
                            fontWeight: addressChoice === 'new' ? '600' : '400',
                            transition: 'all 0.2s ease'
                        }}>
                            <input
                                type="radio"
                                name="addressChoice"
                                value="new"
                                checked={addressChoice === 'new'}
                                onChange={(e) => setAddressChoice(e.target.value)}
                                style={{ display: 'none' }}
                            />
                            New Address
                        </label>
                    </div>

                    {addressChoice === 'current' && hasCompleteAddress && (
                        <div className="card" style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)' }}>
                            <p><strong>{currentAddress.street}</strong> {currentAddress.buildingNo && `#${currentAddress.buildingNo}`}</p>
                            <p>{currentAddress.city}, {currentAddress.region} {currentAddress.postalCode}</p>
                            <p>{currentAddress.country}</p>
                        </div>
                    )}

                    {addressChoice === 'current' && !hasCompleteAddress && (
                        <div className="message error">
                            No complete address on file. Please enter a new address.
                        </div>
                    )}

                    {addressChoice === 'new' && (
                        <div className="new-address-form">
                            <div className="message warning" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px' }}>
                                ⚠️ <strong>Note:</strong> This address will be saved to your profile.
                            </div>

                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Street <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <input
                                        name="street"
                                        value={newAddress.street}
                                        onChange={handleAddressChange}
                                        style={{ borderColor: addressErrors.street ? '#dc3545' : '' }}
                                    />
                                    {addressErrors.street && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.875rem' }}>{addressErrors.street}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Building No.</label>
                                    <input
                                        name="buildingNo"
                                        value={newAddress.buildingNo}
                                        onChange={handleAddressChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>City <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <input
                                        name="city"
                                        value={newAddress.city}
                                        onChange={handleAddressChange}
                                        style={{ borderColor: addressErrors.city ? '#dc3545' : '' }}
                                    />
                                    {addressErrors.city && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.875rem' }}>{addressErrors.city}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Region <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <input
                                        name="region"
                                        value={newAddress.region}
                                        onChange={handleAddressChange}
                                        style={{ borderColor: addressErrors.region ? '#dc3545' : '' }}
                                    />
                                    {addressErrors.region && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.875rem' }}>{addressErrors.region}</span>}
                                </div>
                            </div>

                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Postal Code <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <input
                                        name="postalCode"
                                        value={newAddress.postalCode}
                                        onChange={handleAddressChange}
                                        maxLength="5"
                                        style={{ borderColor: addressErrors.postalCode ? '#dc3545' : '' }}
                                    />
                                    {addressErrors.postalCode && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.875rem' }}>{addressErrors.postalCode}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Country <span style={{ color: 'var(--danger)' }}>*</span></label>
                                    <input
                                        name="country"
                                        value={newAddress.country}
                                        onChange={handleAddressChange}
                                        style={{ borderColor: addressErrors.country ? '#dc3545' : '' }}
                                    />
                                    {addressErrors.country && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.875rem' }}>{addressErrors.country}</span>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Payment Information */}
                <div className="form-section">
                    <h3>Payment Information</h3>
                    <div className="form-group">
                        <label>Credit Card Number:</label>
                        <input
                            type="text"
                            value={creditCard}
                            onChange={handleCardChange}
                            required
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            style={{ borderColor: cardError ? '#dc3545' : '' }}
                        />
                        {cardError && <p className="error" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{cardError}</p>}
                    </div>
                    <div className="form-group">
                        <label>Expiry Date:</label>
                        <input
                            type="text"
                            value={expiryDate}
                            onChange={handleExpiryChange}
                            required
                            placeholder="MM/YY"
                            maxLength="5"
                            style={{ borderColor: expiryError ? '#dc3545' : '' }}
                        />
                        {expiryError && <p className="error" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{expiryError}</p>}
                    </div>
                </div>

                <button type="submit" style={{ marginTop: '1rem' }}>Confirm Purchase</button>
            </form>
        </div>
    );
};

export default Checkout;
