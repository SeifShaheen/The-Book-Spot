import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

const AddAuthor = () => {
    const [name, setName] = useState('');
    const [authors, setAuthors] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            const response = await api.get('/admin/authors');
            setAuthors(response.data);
        } catch (err) {
            console.error('Error fetching authors:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || name.trim().length < 2) {
            setError('Author name is required (min 2 characters)');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await api.post('/admin/authors', { name: name.trim() });
            setMessage({ type: 'success', text: `Author "${name}" added successfully! ID: ${response.data.authorId}` });
            setName('');
            fetchAuthors(); // Refresh list
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to add author' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Manage Authors">
            <div className="form-container">
                <Link to="/admin" className="back-link">← Back to Dashboard</Link>

                {message.text && (
                    <div className={`message ${message.type}`}>{message.text}</div>
                )}

                <div className="modern-form">
                    <div className="form-section">
                        <h3>Add New Author</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label>Author Name <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (error) setError('');
                                        }}
                                        placeholder="e.g., Stephen King"
                                        className={error ? 'error' : ''}
                                    />
                                    {error && <span className="error-text">{error}</span>}
                                </div>
                                <div className="form-group" style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                                        {loading ? 'Adding...' : 'Add Author'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="form-section">
                        <h3>Existing Authors ({authors.length})</h3>
                        {authors.length === 0 ? (
                            <div className="empty-state">
                                <p>No authors yet. Add your first author above!</p>
                            </div>
                        ) : (
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {authors.map(author => (
                                            <tr key={author.AuthorID}>
                                                <td>{author.AuthorID}</td>
                                                <td>{author.Name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AddAuthor;
