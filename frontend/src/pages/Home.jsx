import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import '../home.css';

const Home = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [randomBooks, setRandomBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bestRes, randomRes] = await Promise.all([
                    api.get('/books/bestsellers'),
                    api.get('/books/random')
                ]);
                setBestSellers(bestRes.data);
                setRandomBooks(randomRes.data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStockStatus = (book) => {
        if (book.StockQuantity === 0) return { class: 'out-of-stock', text: 'Out of Stock' };
        if (book.StockQuantity < book.Threshold) return { class: 'low-stock', text: `Only ${book.StockQuantity} left` };
        return { class: 'in-stock', text: 'In Stock' };
    };

    const BookCard = ({ book }) => {
        const stock = getStockStatus(book);
        return (
            <div className="book-card" style={{ height: '100%' }}>
                <div className="book-card-content">
                    <h3>{book.Title}</h3>
                    <p>by {book.Authors || 'Unknown Author'}</p>
                    <p className="category">{book.Category}</p>
                </div>
                <div className="book-card-footer">
                    <div className="price">${parseFloat(book.Price).toFixed(2)}</div>
                    <span className={`stock-badge ${stock.class}`}>{stock.text}</span>
                    <div className="book-card-actions">
                        <Link to={`/books/${book.ISBN}`} className="btn btn-secondary" style={{ width: '100%' }}>
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="loading-spinner">Loading recommendations...</div>;

    return (
        <div className="home-container">
            <section className="hero-section">
                <h1 className="hero-title">Welcome to The Book Spot</h1>
                <p className="hero-subtitle">
                    Discover your next favorite story. We offer a vast collection of books across all genres,
                    from timeless classics to modern bestsellers.
                </p>
                <Link to="/browse" className="hero-btn">Browse Collection</Link>
            </section>

            <section className="recommendation-section">
                <h2 className="section-title">Best Sellers</h2>
                <div className="book-scroll-container">
                    {bestSellers.length > 0 ? (
                        bestSellers.map(book => <BookCard key={book.ISBN} book={book} />)
                    ) : (
                        <p>Check back soon for best sellers!</p>
                    )}
                </div>
            </section>

            <section className="recommendation-section">
                <h2 className="section-title">You Might Also Like</h2>
                <div className="book-scroll-container">
                    {randomBooks.length > 0 ? (
                        randomBooks.map(book => <BookCard key={book.ISBN} book={book} />)
                    ) : (
                        <p>Explore our collection to find your next read!</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
