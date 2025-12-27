import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const BookDetails = () => {
    const { isbn } = useParams();
    const [book, setBook] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { user } = useAuth();
    const navigate = useNavigate();

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
            alert('Please login to add items to cart');
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
            alert(response.data.message || 'Added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to add to cart';
            alert(errorMessage);
        }
    };

    if (!book) return <div>Loading...</div>;

    return (
        <div className="book-details">
            <h2>{book.Title}</h2>
            <p><strong>ISBN:</strong> {book.ISBN}</p>
            <p><strong>Category:</strong> {book.Category}</p>
            <p><strong>Authors:</strong> {book.Authors}</p>
            <p><strong>Publisher:</strong> {book.PublisherName}</p>
            <p><strong>Price:</strong> ${book.Price}</p>
            <p><strong>Stock:</strong> {book.StockQuantity}</p>

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
