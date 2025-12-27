import { useState } from 'react';
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
    const { user } = useAuth();
    const navigate = useNavigate();

    // Handle credit card input with formatting
    const handleCardChange = (e) => {
        let value = e.target.value.replace(/\s/g, ''); // Remove spaces

        // Only allow digits
        if (!/^\d*$/.test(value)) {
            return;
        }

        // Limit to 16 digits
        if (value.length > 16) {
            value = value.slice(0, 16);
        }

        // Add spaces every 4 digits
        const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
        setCreditCard(formatted);

        // Clear error when user starts typing
        setCardError('');
    };

    // Handle expiry date input with formatting
    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\//g, ''); // Remove slashes

        // Only allow digits
        if (!/^\d*$/.test(value)) {
            return;
        }

        // Limit to 4 digits (MMYY)
        if (value.length > 4) {
            value = value.slice(0, 4);
        }

        // Add slash after MM
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }

        setExpiryDate(value);

        // Clear error when user starts typing
        setExpiryError('');
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

        try {
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

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleCheckout}>
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
                <button type="submit">Confirm Purchase</button>
            </form>
        </div>
    );
};

export default Checkout;
