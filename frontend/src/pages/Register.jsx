import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', firstName: '', lastName: '', email: '', phone: '',
        address: { street: '', city: '', country: '' }
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await register(formData);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Username:</label><input name="username" onChange={handleChange} required /></div>
                <div className="form-group"><label>Password:</label><input name="password" type="password" onChange={handleChange} required /></div>
                <div className="form-group"><label>First Name:</label><input name="firstName" onChange={handleChange} required /></div>
                <div className="form-group"><label>Last Name:</label><input name="lastName" onChange={handleChange} required /></div>
                <div className="form-group"><label>Email:</label><input name="email" type="email" onChange={handleChange} required /></div>
                <div className="form-group"><label>Phone:</label><input name="phone" onChange={handleChange} /></div>
                <h3>Address</h3>
                <div className="form-group"><label>Street:</label><input name="address.street" onChange={handleChange} /></div>
                <div className="form-group"><label>City:</label><input name="address.city" onChange={handleChange} /></div>
                <div className="form-group"><label>Country:</label><input name="address.country" onChange={handleChange} /></div>
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Register;
