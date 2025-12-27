import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [supplyOrders, setSupplyOrders] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchData = async () => {
        try {
            const [ordersRes, stockRes] = await Promise.all([
                api.get('/admin/supply'),
                api.get('/admin/reports/low-stock')
            ]);
            setSupplyOrders(ordersRes.data);
            setLowStock(stockRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const confirmOrder = async (order) => {
        if (!window.confirm('Confirm this supply order?')) return;
        try {
            await api.post('/admin/supply/confirm', {
                username: order.Username,
                publisherId: order.PublisherID,
                orderDate: order.OrderDate,
                decisionBy: user.Username
            });
            fetchData();
        } catch (error) {
            alert('Failed to confirm order: ' + (error.response?.data?.error || error.message));
        }
    };

    const cancelOrder = async (order) => {
        if (!window.confirm('Cancel this supply order?')) return;
        try {
            await api.post('/admin/supply/cancel', {
                username: order.Username,
                publisherId: order.PublisherID,
                orderDate: order.OrderDate,
                decisionBy: user.Username
            });
            fetchData();
        } catch (error) {
            alert('Failed to cancel order: ' + (error.response?.data?.error || error.message));
        }
    };

    if (loading) return <div className="loading-spinner">Loading dashboard...</div>;

    return (
        <div className="admin-dashboard">
            {/* Quick Actions */}
            <div className="admin-links">
                <Link to="/admin/add-book" className="btn btn-primary">+ Add New Book</Link>
                <Link to="/admin/add-author" className="btn btn-primary">+ Add Author</Link>
                <Link to="/admin/add-publisher" className="btn btn-primary">+ Add Publisher</Link>
                {user.Username === 'admin' && (
                    <Link to="/admin/add-admin" className="btn btn-primary">+ Add Admin</Link>
                )}
                <Link to="/admin/reports" className="btn btn-secondary">View Reports</Link>
                <Link to="/admin/logs" className="btn btn-secondary">View Logs</Link>
                <Link to="/admin/database" className="btn btn-secondary">Database</Link>
            </div>

            {/* Low Stock Alert */}
            {lowStock.length > 0 && (
                <div className="message error" style={{ marginBottom: '1.5rem' }}>
                    ⚠️ <strong>{lowStock.length} book(s)</strong> are below reorder threshold!
                    <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                        {lowStock.slice(0, 3).map(b => (
                            <li key={b.ISBN}>{b.Title} ({b.StockQuantity} left)</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Supply Orders */}
            <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Pending Supply Orders</h3>
                {supplyOrders.length === 0 ? (
                    <div className="empty-state">
                        <p>No pending supply orders</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Publisher</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {supplyOrders.map((order, idx) => (
                                    <tr key={idx}>
                                        <td><strong>{order.PublisherName}</strong></td>
                                        <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                                        <td>{order.Items || 'N/A'}</td>
                                        <td>
                                            <span className={`stock-badge ${order.Status === 'Pending' ? 'low-stock' : 'in-stock'}`}>
                                                {order.Status}
                                            </span>
                                        </td>
                                        <td>
                                            {order.Status === 'Pending' && (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => confirmOrder(order)} className="btn btn-primary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}>
                                                        ✓ Confirm
                                                    </button>
                                                    <button onClick={() => cancelOrder(order)} className="btn btn-danger" style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}>
                                                        ✗ Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
