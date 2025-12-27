import { useToast } from '../context/ToastContext';

// ...

const AddBook = () => {
    // ...
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { addToast } = useToast();

    // ... (useEffect hooks)

    // ... (handleChange)

    // ... (validate)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            // Check if ISBN already exists
            try {
                const existingBook = await api.get(`/books/${formData.isbn}`);
                if (existingBook.data) {
                    setErrors({ ...errors, isbn: 'This ISBN already exists in the system' });
                    addToast(`A book with ISBN "${formData.isbn}" already exists: "${existingBook.data.Title}"`, 'error');
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
            addToast('Book added successfully!', 'success');
            setTimeout(() => navigate('/admin'), 1500);
        } catch (error) {
            console.error('Error adding book:', error);
            addToast(error.response?.data?.error || 'Failed to add book', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Add New Book">
            <div className="form-container">
                <Link to="/admin" className="back-link">← Back to Dashboard</Link>

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
