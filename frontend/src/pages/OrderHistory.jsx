import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const response = await api.get('/orders/history', { params: { username: user.Username } });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, [user]);

    return (
        <div className="order-history-container">
            <h2>My Order History</h2>
            {orders.length === 0 ? <p>No past orders found.</p> : (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.OrderID}>
                                <td>#{order.OrderID}</td>
                                <td>{new Date(order.OrderDate).toLocaleString()}</td>
                                <td>{order.Items}</td>
                                <td>${order.TotalPrice}</td>
                                <td>{order.Status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderHistory;
