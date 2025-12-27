import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

const AddAdmin = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Only superadmin (username 'admin') can access this page
    useEffect(() => {
        if (user.Username !== 'admin') {
            alert('Only the superadmin (admin) can create new admins');
            navigate('/admin');
        }
    }, [user.Username, navigate]);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        email: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username || formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
            await api.post('/admin/register-admin', {
                username: formData.username,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                currentUser: user.Username
            });
            setMessage({ type: 'success', text: 'Admin created successfully!' });
            setTimeout(() => navigate('/admin'), 1500);
        } catch (error) {
            console.error('Error creating admin:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || error.response?.data?.error || 'Failed to create admin'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Add New Admin">
            <div className="form-container">
                <Link to="/admin" className="back-link">← Back to Dashboard</Link>

                {message.text && (
                    <div className={`message ${message.type}`}>{message.text}</div>
                )}

                <form onSubmit={handleSubmit} className="modern-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Username <span className="required">*</span></label>
                            <input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                className={errors.username ? 'error' : ''}
                            />
                            {errors.username && <span className="error-text">{errors.username}</span>}
                        </div>
                        <div className="form-group">
                            <label>Email <span className="required">*</span></label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@example.com"
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First name (optional)"
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last name (optional)"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Password <span className="required">*</span></label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Min 6 characters"
                                className={errors.password ? 'error' : ''}
                            />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>
                        <div className="form-group">
                            <label>Confirm Password <span className="required">*</span></label>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                className={errors.confirmPassword ? 'error' : ''}
                            />
                            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Admin'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default AddAdmin;
