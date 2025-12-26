import { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDatabaseView = () => {
    const [selectedTable, setSelectedTable] = useState('Book');
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);

    const tables = [
        'Book', 'Author', 'BookAuthor', 'Publisher', 'PublisherPhone', 'PublisherAddress',
        'Customer', 'Order', 'OrderItem', 'SupplyOrder', 'SupplyOrderItem'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/admin/database/${selectedTable}`);
                setData(response.data);
                if (response.data.length > 0) {
                    setColumns(Object.keys(response.data[0]));
                } else {
                    setColumns([]);
                }
            } catch (error) {
                console.error('Error fetching table data:', error);
                setData([]);
                setColumns([]);
            }
        };
        fetchData();
    }, [selectedTable]);

    return (
        <div className="database-view-container">
            <h2>Database Viewer</h2>
            <div className="form-group">
                <label>Select Table:</label>
                <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
                    {tables.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {data.length === 0 ? <p>No data found in {selectedTable}</p> : (
                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                {columns.map(col => <th key={col}>{col}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, idx) => (
                                <tr key={idx}>
                                    {columns.map(col => <td key={col}>{row[col]}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDatabaseView;
