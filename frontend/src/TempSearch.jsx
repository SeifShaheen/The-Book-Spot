import { useState } from 'react';
import api from './api/axios';

const TempSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        try {
            setError('');
            const response = await api.get(`/search?q=${searchTerm}`);
            setResults(response.data);
        } catch (err) {
            console.error('Search error:', err);
            setError('Error fetching search results');
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}>
            <h2>Search Books</h2>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter book title"
                style={{ padding: '8px', marginRight: '10px' }}
            />
            <button onClick={handleSearch} style={{ padding: '8px 16px' }}>Search</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul style={{ marginTop: '20px', textAlign: 'left' }}>
                {results.map((book) => (
                    <li key={book.id || book.title}>
                        <strong>{book.title}</strong> - {book.author || 'Unknown Author'}
                    </li>
                ))}
            </ul>
            {results.length === 0 && searchTerm && !error && <p>No results found</p>}
        </div>
    );
};

export default TempSearch;
