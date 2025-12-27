import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../book-details.css';

const BookDetails = () => {
    const { isbn } = useParams();
    const [book, setBook] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await api.get(`/books/${isbn}`);
                setBook(response.data);
            } catch (error) {
                console.error('Error fetching book:', error);
            }
        };
        fetchBook();
    }, [isbn]);

    const addToCart = async () => {
        if (!user) {
            addToast('Please login to add items to cart', 'info');
            navigate('/login');
            return;
        }

        try {
            const response = await api.post('/cart/add', {
                username: user.Username,
                isbn: book.ISBN,
                quantity: parseInt(quantity),
                role: user.role
            });
            addToast(response.data.message || 'Added to cart!', 'success');
        } catch (error) {
            console.error('Error adding to cart:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to add to cart';
            addToast(errorMessage, 'error');
        }
    };

    if (!book) return <div>Loading...</div>;

    return (
        <div className="book-details">
            <h2 className="book-details-title">{book.Title}</h2>
            <p><strong>ISBN:</strong> {book.ISBN}</p>
            {/* <p><strong>Publication year:</strong> {book.Publicationyear}</p> */}
            <p><strong>Publisher:</strong> {book.PublisherName}</p>
            <p><strong>Authors:</strong> {book.Authors}</p>
            <p><strong>Category:</strong> {book.Category}</p>
            <p><strong>Price:</strong> ${book.Price}</p>
            <p><strong>In Stock:</strong> {book.StockQuantity}</p>

            <div className="actions">
                <input
                    type="number"
                    min="1"
                    max={book.StockQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <button onClick={addToCart} disabled={book.StockQuantity < 1}>
                    {book.StockQuantity < 1 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

export default BookDetails;
