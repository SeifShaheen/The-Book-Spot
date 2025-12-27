import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useToast } from '../context/ToastContext';

const EditBook = () => {
  const { isbn } = useParams();
  const [formData, setFormData] = useState({
    title: '', category: 'Science', price: '',
    publicationYear: '', stockQuantity: '', threshold: '', publisherId: ''
  });

  // Publishers state
  const [publishers, setPublishers] = useState([]);
  const [filteredPublishers, setFilteredPublishers] = useState([]);
  const [publisherSearch, setPublisherSearch] = useState('');
  const [showPublisherDropdown, setShowPublisherDropdown] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { addToast } = useToast();

  // Fetch book data and publishers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, pubRes] = await Promise.all([
          api.get(`/books/${isbn}`),
          api.get('/admin/publishers')
        ]);

        const book = bookRes.data;
        setFormData({
          title: book.Title,
          category: book.Category,
          price: book.Price,
          publicationYear: book.PublicationYear,
          stockQuantity: book.StockQuantity,
          threshold: book.Threshold,
          publisherId: book.PublisherID
        });

        setPublishers(pubRes.data);
        setFilteredPublishers(pubRes.data);

        // Set publisher search to current publisher name
        const currentPub = pubRes.data.find(p => p.PublisherID === book.PublisherID);
        if (currentPub) setPublisherSearch(currentPub.Name);

      } catch (error) {
        console.error('Error fetching data:', error);
        addToast('Failed to load book data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isbn, addToast]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const selectPublisher = (pub) => {
    setFormData({ ...formData, publisherId: pub.PublisherID });
    setPublisherSearch(pub.Name);
    setShowPublisherDropdown(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 2) {
      newErrors.title = 'Title is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.stockQuantity === '' || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Stock cannot be negative';
    }
    if (formData.threshold === '' || parseInt(formData.threshold) < 0) {
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

    setSaving(true);
    try {
      await api.put(`/books/${isbn}`, { ...formData, username: user.Username });
      addToast('Book updated successfully!', 'success');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      console.error('Error updating book:', error);
      addToast(error.response?.data?.error || 'Failed to update book', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout title="Edit Book"><div className="loading-spinner">Loading book data...</div></Layout>;

  return (
    <Layout title="Edit Book">
      <div className="form-container">
        <Link to="/admin" className="back-link">← Back to Dashboard</Link>

        <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <strong>ISBN:</strong> {isbn}
        </div>

        <form onSubmit={handleSubmit} className="modern-form">
          <div className="form-row">
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
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-danger"
              onClick={async () => {
                if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) return;
                try {
                  await api.delete(`/books/${isbn}`, { data: { username: user.Username } });
                  addToast('Book deleted successfully!', 'success');
                  navigate('/admin');
                } catch (error) {
                  addToast('Failed to delete book: ' + (error.response?.data?.error || error.message), 'error');
                }
              }}
            >
              Delete Book
            </button>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditBook;
