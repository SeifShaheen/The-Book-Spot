import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BookList = () => {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.q = search;
            if (category) params.category = category;

            const response = await api.get('/books', { params });
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [category]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBooks();
    };

    const getStockStatus = (book) => {
        if (book.StockQuantity === 0) return { class: 'out-of-stock', text: 'Out of Stock' };
        if (book.StockQuantity < book.Threshold) return { class: 'low-stock', text: `Only ${book.StockQuantity} left` };
        return { class: 'in-stock', text: 'In Stock' };
    };

    return (
        <div className="book-list-container">
            <h2 className="page-title">Browse Books</h2>

            <div className="filters">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search by title, ISBN, or author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Science">Science</option>
                    <option value="Art">Art</option>
                    <option value="Religion">Religion</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                </select>
            </div>

            {loading ? (
                <div className="loading-spinner">Loading books...</div>
            ) : books.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <h3>No books found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="books-grid">
                    {books.map(book => {
                        const stock = getStockStatus(book);
                        return (
                            <div key={book.ISBN} className="book-card">
                                <div className="book-card-content">
                                    <h3>{book.Title}</h3>
                                    <p>by {book.Authors || 'Unknown Author'}</p>
                                    <p className="category">{book.Category}</p>
                                </div>
                                <div className="book-card-footer">
                                    <div className="price">${parseFloat(book.Price).toFixed(2)}</div>
                                    <span className={`stock-badge ${stock.class}`}>{stock.text}</span>
                                    <div className="book-card-actions">
                                        <Link to={`/books/${book.ISBN}`} className="btn btn-secondary">
                                            View Details
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <Link to={`/admin/edit-book/${book.ISBN}`} className="btn btn-primary">
                                                Edit
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BookList;
