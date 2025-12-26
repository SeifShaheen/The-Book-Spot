import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

const AddBook = () => {
    const [formData, setFormData] = useState({
        isbn: '', title: '', category: 'Science', price: '',
        publicationYear: new Date().getFullYear(), stockQuantity: '', threshold: '', publisherId: ''
    });
    const [publishers, setPublishers] = useState([]);
    const [filteredPublishers, setFilteredPublishers] = useState([]);
    const [publisherSearch, setPublisherSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPublishers = async () => {
            try {
                const response = await api.get('/admin/publishers');
                setPublishers(response.data);
                setFilteredPublishers(response.data);
            } catch (error) {
                console.error('Error fetching publishers:', error);
            }
        };
        fetchPublishers();
    }, []);

    useEffect(() => {
        if (publisherSearch) {
            const filtered = publishers.filter(p =>
                p.Name.toLowerCase().includes(publisherSearch.toLowerCase())
            );
            setFilteredPublishers(filtered);
        } else {
            setFilteredPublishers(publishers);
        }
    }, [publisherSearch, publishers]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const selectPublisher = (pub) => {
        setFormData({ ...formData, publisherId: pub.PublisherID });
        setPublisherSearch(pub.Name);
        setShowDropdown(false);
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.isbn || formData.isbn.length < 10) {
            newErrors.isbn = 'ISBN must be at least 10 characters';
        }
        if (!formData.title || formData.title.length < 2) {
            newErrors.title = 'Title is required';
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }
        if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
            newErrors.stockQuantity = 'Stock cannot be negative';
        }
        if (!formData.threshold || parseInt(formData.threshold) < 0) {
            newErrors.threshold = 'Threshold cannot be negative';
        }
        if (!formData.publisherId) {
            newErrors.publisherId = 'Please select a publisher';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await api.post('/books', formData);
            setMessage({ type: 'success', text: 'Book added successfully!' });
            setTimeout(() => navigate('/admin'), 1500);
        } catch (error) {
            console.error('Error adding book:', error);
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to add book' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Add New Book">
            <div className="form-container">
                <Link to="/admin" className="back-link">← Back to Dashboard</Link>

                {message.text && (
                    <div className={`message ${message.type}`}>{message.text}</div>
                )}

                <form onSubmit={handleSubmit} className="modern-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>ISBN <span className="required">*</span></label>
                            <input
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                placeholder="e.g., 978-0-123456-78-9"
                                className={errors.isbn ? 'error' : ''}
                            />
                            {errors.isbn && <span className="error-text">{errors.isbn}</span>}
                        </div>
                        <div className="form-group">
                            <label>Title <span className="required">*</span></label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Book title"
                                className={errors.title ? 'error' : ''}
                            />
                            {errors.title && <span className="error-text">{errors.title}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category <span className="required">*</span></label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                <option value="Science">Science</option>
                                <option value="Art">Art</option>
                                <option value="Religion">Religion</option>
                                <option value="History">History</option>
                                <option value="Geography">Geography</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Publication Year</label>
                            <input
                                name="publicationYear"
                                type="number"
                                value={formData.publicationYear}
                                onChange={handleChange}
                                min="1000" max="2100"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price ($) <span className="required">*</span></label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                className={errors.price ? 'error' : ''}
                            />
                            {errors.price && <span className="error-text">{errors.price}</span>}
                        </div>
                        <div className="form-group">
                            <label>Stock Quantity <span className="required">*</span></label>
                            <input
                                name="stockQuantity"
                                type="number"
                                value={formData.stockQuantity}
                                onChange={handleChange}
                                placeholder="0"
                                className={errors.stockQuantity ? 'error' : ''}
                            />
                            {errors.stockQuantity && <span className="error-text">{errors.stockQuantity}</span>}
                        </div>
                        <div className="form-group">
                            <label>Reorder Threshold <span className="required">*</span></label>
                            <input
                                name="threshold"
                                type="number"
                                value={formData.threshold}
                                onChange={handleChange}
                                placeholder="10"
                                className={errors.threshold ? 'error' : ''}
                            />
                            {errors.threshold && <span className="error-text">{errors.threshold}</span>}
                        </div>
                    </div>

                    <div className="form-group publisher-search">
                        <label>Publisher <span className="required">*</span></label>
                        <div className="search-input-container">
                            <input
                                type="text"
                                value={publisherSearch}
                                onChange={(e) => {
                                    setPublisherSearch(e.target.value);
                                    setShowDropdown(true);
                                    if (!e.target.value) setFormData({ ...formData, publisherId: '' });
                                }}
                                onFocus={() => setShowDropdown(true)}
                                placeholder="Type to search publishers..."
                                className={errors.publisherId ? 'error' : ''}
                            />
                            {showDropdown && filteredPublishers.length > 0 && (
                                <ul className="publisher-dropdown">
                                    {filteredPublishers.map(pub => (
                                        <li key={pub.PublisherID} onClick={() => selectPublisher(pub)}>
                                            {pub.Name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {errors.publisherId && <span className="error-text">{errors.publisherId}</span>}
                        {publishers.length === 0 && (
                            <p className="hint">No publishers found. <Link to="/admin/add-publisher">Add one first</Link></p>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Book'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default AddBook;
