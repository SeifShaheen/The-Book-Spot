import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const AdminLogs = () => {
  const [activeTab, setActiveTab] = useState('reorders');
  const [actions, setActions] = useState([]);
  const [reorders, setReorders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actionsRes, reordersRes] = await Promise.all([
          api.get('/admin/logs/actions'),
          api.get('/admin/logs/reorders')
        ]);
        setActions(actionsRes.data);
        setReorders(reordersRes.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner">Loading logs...</div>;

  return (
    <div className="admin-logs">
      <Link to="/admin" className="back-link">← Back to Dashboard</Link>
      <h2>Admin Logs</h2>

      <div className="tab-buttons" style={{ marginBottom: '1.5rem' }}>
        <button
          className={`btn ${activeTab === 'reorders' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('reorders')}
        >
          Reorder Decisions
        </button>
        <button
          className={`btn ${activeTab === 'actions' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('actions')}
          style={{ marginLeft: '0.5rem' }}
        >
          Action Log
        </button>
      </div>

      {activeTab === 'reorders' && (
        <div className="card">
          <h3>Reorder Decisions</h3>
          {reorders.length === 0 ? (
            <div className="empty-state">No reorder decisions yet</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Book</th>
                    <th>Quantity</th>
                    <th>Publisher</th>
                    <th>Status</th>
                    <th>Decision By</th>
                  </tr>
                </thead>
                <tbody>
                  {reorders.map((r, idx) => (
                    <tr key={idx}>
                      <td>{new Date(r.OrderDate).toLocaleString()}</td>
                      <td>{r.BookTitle || r.ISBN || 'N/A'}</td>
                      <td>{r.Quantity}</td>
                      <td>{r.PublisherName}</td>
                      <td>
                        <span className={`stock-badge ${r.Status === 'Confirmed' ? 'in-stock' : 'low-stock'}`}>
                          {r.Status}
                        </span>
                      </td>
                      <td><strong>{r.DecisionBy || 'System'}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="card">
          <h3>Action Log (Audit Trail)</h3>
          {actions.length === 0 ? (
            <div className="empty-state">No actions logged yet</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Timestamp</th>
                    <th>Admin</th>
                    <th>Book</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {actions.map((a) => (
                    <tr key={a.ActionID}>
                      <td>{a.ActionID}</td>
                      <td>{new Date(a.UpdateTimestamp).toLocaleString()}</td>
                      <td><strong>{a.Username}</strong></td>
                      <td>{a.BookTitle || a.ISBN || 'N/A'}</td>
                      <td>{a.Notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminLogs;
