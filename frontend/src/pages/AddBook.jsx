import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

const AddBook = () => {
    const [formData, setFormData] = useState({
        isbn: '', title: '', category: 'Science', price: '',
        publicationYear: new Date().getFullYear(), stockQuantity: '', threshold: '', publisherId: '',
        authors: [] // Array of author IDs
    });

    // Publishers state
    const [publishers, setPublishers] = useState([]);
    const [filteredPublishers, setFilteredPublishers] = useState([]);
    const [publisherSearch, setPublisherSearch] = useState('');
    const [showPublisherDropdown, setShowPublisherDropdown] = useState(false);

    // Authors state
    const [authors, setAuthors] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [authorSearch, setAuthorSearch] = useState('');
    const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
    const [selectedAuthors, setSelectedAuthors] = useState([]); // Array of {id, name}

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pubRes, authRes] = await Promise.all([
                    api.get('/admin/publishers'),
                    api.get('/admin/authors')
                ]);
                setPublishers(pubRes.data);
                setFilteredPublishers(pubRes.data);
                setAuthors(authRes.data);
                setFilteredAuthors(authRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Filter publishers
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

    // Filter authors (exclude already selected)
    useEffect(() => {
        const selectedIds = selectedAuthors.map(a => a.id);
        let filtered = authors.filter(a => !selectedIds.includes(a.AuthorID));
        if (authorSearch) {
            filtered = filtered.filter(a =>
                a.Name.toLowerCase().includes(authorSearch.toLowerCase())
            );
        }
        setFilteredAuthors(filtered);
    }, [authorSearch, authors, selectedAuthors]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // Validate ISBN-13 format and checksum
    const validateISBN13 = (isbn) => {
        // Remove dashes and spaces
        const cleanISBN = isbn.replace(/[-\s]/g, '');

        // Must be exactly 13 digits
        if (!/^\d{13}$/.test(cleanISBN)) {
            return { valid: false, error: 'ISBN must be exactly 13 digits' };
        }

        // Must start with 978 or 979
        if (!cleanISBN.startsWith('978') && !cleanISBN.startsWith('979')) {
            return { valid: false, error: 'ISBN-13 must start with 978 or 979' };
        }

        // Validate checksum
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(cleanISBN[i]) * (i % 2 === 0 ? 1 : 3);
        }
        const checkDigit = (10 - (sum % 10)) % 10;

        if (parseInt(cleanISBN[12]) !== checkDigit) {
            return { valid: false, error: 'Invalid ISBN checksum' };
        }

        return { valid: true };
    };

    const selectPublisher = (pub) => {
        setFormData({ ...formData, publisherId: pub.PublisherID });
        setPublisherSearch(pub.Name);
        setShowPublisherDropdown(false);
    };

    const selectAuthor = (author) => {
        const newSelected = [...selectedAuthors, { id: author.AuthorID, name: author.Name }];
        setSelectedAuthors(newSelected);
        setFormData({ ...formData, authors: newSelected.map(a => a.id) });
        setAuthorSearch('');
        setShowAuthorDropdown(false);
        if (errors.authors) setErrors({ ...errors, authors: '' });
    };

    const removeAuthor = (authorId) => {
        const newSelected = selectedAuthors.filter(a => a.id !== authorId);
        setSelectedAuthors(newSelected);
        setFormData({ ...formData, authors: newSelected.map(a => a.id) });
    };

    const validate = () => {
        const newErrors = {};
        const isbnValidation = validateISBN13(formData.isbn);
        if (!formData.isbn) {
            newErrors.isbn = 'ISBN is required';
        } else if (!isbnValidation.valid) {
            newErrors.isbn = isbnValidation.error;
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
        if (formData.authors.length === 0) {
            newErrors.authors = 'Please select at least one author';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Check if ISBN already exists
            try {
                const existingBook = await api.get(`/books/${formData.isbn}`);
                if (existingBook.data) {
                    setErrors({ ...errors, isbn: 'This ISBN already exists in the system' });
                    setMessage({ type: 'error', text: `A book with ISBN "${formData.isbn}" already exists: "${existingBook.data.Title}"` });
                    setLoading(false);
                    return;
                }
            } catch (checkError) {
                // 404 means book doesn't exist - that's what we want
                if (checkError.response?.status !== 404) {
                    throw checkError;
                }
            }

            // Proceed to add the book
            await api.post('/books', { ...formData, username: user.Username });
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

                    {/* Publisher Selection */}
                    <div className="form-group publisher-search">
                        <label>Publisher <span className="required">*</span></label>
                        <div className="search-input-container">
                            <input
                                type="text"
                                value={publisherSearch}
                                onChange={(e) => {
                                    setPublisherSearch(e.target.value);
                                    setShowPublisherDropdown(true);
                                    if (!e.target.value) setFormData({ ...formData, publisherId: '' });
                                }}
                                onFocus={() => setShowPublisherDropdown(true)}
                                onBlur={() => setTimeout(() => setShowPublisherDropdown(false), 200)}
                                placeholder="Type to search publishers..."
                                className={errors.publisherId ? 'error' : ''}
                            />
                            {showPublisherDropdown && filteredPublishers.length > 0 && (
                                <ul className="publisher-dropdown">
                                    {filteredPublishers.map(pub => (
                                        <li key={pub.PublisherID} onMouseDown={() => selectPublisher(pub)}>
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

                    {/* Author Selection */}
                    <div className="form-group publisher-search">
                        <label>Author(s) <span className="required">*</span></label>

                        {/* Selected Authors Tags */}
                        {selectedAuthors.length > 0 && (
                            <div className="selected-tags">
                                {selectedAuthors.map(author => (
                                    <span key={author.id} className="tag">
                                        {author.name}
                                        <button type="button" onClick={() => removeAuthor(author.id)}>×</button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="search-input-container">
                            <input
                                type="text"
                                value={authorSearch}
                                onChange={(e) => {
                                    setAuthorSearch(e.target.value);
                                    setShowAuthorDropdown(true);
                                }}
                                onFocus={() => setShowAuthorDropdown(true)}
                                onBlur={() => setTimeout(() => setShowAuthorDropdown(false), 200)}
                                placeholder="Type to search and add authors..."
                                className={errors.authors ? 'error' : ''}
                            />
                            {showAuthorDropdown && filteredAuthors.length > 0 && (
                                <ul className="publisher-dropdown">
                                    {filteredAuthors.map(author => (
                                        <li key={author.AuthorID} onMouseDown={() => selectAuthor(author)}>
                                            {author.Name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {errors.authors && <span className="error-text">{errors.authors}</span>}
                        {authors.length === 0 && (
                            <p className="hint">No authors found. <Link to="/admin/add-author">Add one first</Link></p>
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
