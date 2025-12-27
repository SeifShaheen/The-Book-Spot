import { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminReports = () => {
    const [sales, setSales] = useState(null);
    const [topCustomers, setTopCustomers] = useState([]);
    const [topBooks, setTopBooks] = useState([]);
    const [reorderCount, setReorderCount] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [dateSales, setDateSales] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [salesRes, customersRes, booksRes, reorderRes, lowStockRes] = await Promise.all([
                    api.get('/admin/reports/sales'),
                    api.get('/admin/reports/customers'),
                    api.get('/admin/reports/books'),
                    api.get('/admin/reports/reorders'),
                    api.get('/admin/reports/low-stock')
                ]);
                setSales(salesRes.data.MonthlySales);
                setTopCustomers(customersRes.data);
                setTopBooks(booksRes.data);
                setReorderCount(reorderRes.data);
                setLowStock(lowStockRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reports:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchDateSales = async () => {
        if (!selectedDate) return;
        try {
            const response = await api.get(`/admin/reports/sales-on-date?date=${selectedDate}`);
            setDateSales(response.data);
        } catch (error) {
            console.error('Error fetching date sales:', error);
        }
    };

    if (loading) return <div className="loading-spinner">Loading Reports...</div>;

    return (
        <div className="reports-container">
            <h2>Admin Reports</h2>

            {/* Low Stock Alert */}
            {lowStock.length > 0 && (
                <div className="alert-banner">
                    ⚠️ {lowStock.length} book(s) are below stock threshold!
                </div>
            )}

            <div className="reports-grid">
                {/* Monthly Sales */}
                <div className="report-card">
                    <h3>Sales Last 30 Days</h3>
                    <p className="big-number">${Number(sales || 0).toFixed(2)}</p>
                </div>

                {/* Sales by Date */}
                <div className="report-card">
                    <h3>Sales on Date</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                        <button onClick={fetchDateSales}>Search</button>
                    </div>
                    {dateSales && (
                        <p>{dateSales.OrderCount} orders | ${Number(dateSales.TotalSales || 0).toFixed(2)}</p>
                    )}
                </div>

                {/* Top 5 Customers */}
                <div className="report-card">
                    <h3>Top 5 Customers (3 Months)</h3>
                    {topCustomers.length === 0 ? <p className="empty-state">No data</p> : (
                        <ul>
                            {topCustomers.map((c, i) => (
                                <li key={i}>{c.FirstName} {c.LastName} - ${c.TotalSpent}</li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Top 10 Books */}
                <div className="report-card">
                    <h3>Top 10 Selling Books (3 Months)</h3>
                    {topBooks.length === 0 ? <p className="empty-state">No data</p> : (
                        <ul>
                            {topBooks.map((b, i) => (
                                <li key={i}>{b.Title} - {b.TotalSold} sold</li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Book Reorder Count */}
                <div className="report-card">
                    <h3>Book Reorder Count</h3>
                    {reorderCount.length === 0 ? <p className="empty-state">No reorders</p> : (
                        <ul>
                            {reorderCount.slice(0, 10).map((b, i) => (
                                <li key={i}>{b.Title} - {b.ReorderCount}x</li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Low Stock Books */}
                <div className="report-card danger">
                    <h3>Low Stock Alert</h3>
                    {lowStock.length === 0 ? <p className="empty-state">All books well stocked</p> : (
                        <ul>
                            {lowStock.map((b, i) => (
                                <li key={i}>{b.Title} - {b.StockQuantity} left (below {b.Threshold})</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
