import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [creditCard, setCreditCard] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await api.post('/cart/checkout', {
                username: user.Username,
                creditCard,
                expiryDate
            });
            alert('Checkout successful!');
            navigate('/');
        } catch (error) {
            console.error('Checkout error:', error);
            setError(error.response?.data?.error || 'Checkout failed');
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
                        onChange={(e) => setCreditCard(e.target.value)}
                        required
                        placeholder="1234-5678-9012-3456"
                    />
                </div>
                <div className="form-group">
                    <label>Expiry Date:</label>
                    <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                        placeholder="MM/YY"
                    />
                </div>
                <button type="submit">Confirm Purchase</button>
            </form>
        </div>
    );
};

export default Checkout;
