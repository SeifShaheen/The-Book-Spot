import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchCart = async () => {
        if (!user) return;
        try {
            const response = await api.get('/cart', { params: { username: user.Username, role: user.role } });
            setItems(response.data.items);
            setTotal(response.data.grandTotal);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const removeFromCart = async (isbn) => {
        try {
            await api.post('/cart/remove', { username: user.Username, isbn, role: user.role });
            fetchCart();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const updateQuantity = async (isbn, change) => {
        try {
            await api.post('/cart/update-quantity', { username: user.Username, isbn, change, role: user.role });
            fetchCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to update quantity';
            alert(errorMessage);
        }
    };

    if (!user) return <p>Please login to view cart</p>;

    return (
        <div className="cart-container">
            <h2>Shopping Cart</h2>
            {items.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author(s)</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.ISBN}>
                                    <td>{item.Title}</td>
                                    <td>{item.Authors || 'Unknown'}</td>
                                    <td>${item.Price}</td>
                                    <td>
                                        <div className="quantity-controls">
                                            <button className="qty-btn" onClick={() => updateQuantity(item.ISBN, -1)}>−</button>
                                            <span className="qty-value">{item.Quantity}</span>
                                            <button className="qty-btn" onClick={() => updateQuantity(item.ISBN, 1)}>+</button>
                                        </div>
                                    </td>
                                    <td>${item.Total}</td>
                                    <td>
                                        <button className="btn-remove" onClick={() => removeFromCart(item.ISBN)}>Remove All</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="cart-summary">
                        <h3>Grand Total: ${total}</h3>
                        <button className="btn-checkout" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
