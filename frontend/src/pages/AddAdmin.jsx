import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useToast } from '../context/ToastContext';

const AddAdmin = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { addToast } = useToast();

    // Only superadmin (username 'admin') can access this page
    useEffect(() => {
        if (user.Username !== 'admin') {
            addToast('Only the superadmin (admin) can create new admins', 'error');
            navigate('/admin');
        }
    }, [user.Username, navigate, addToast]);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: { street: '', buildingNo: '', city: '', region: '', postalCode: '', country: '' }
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Phone: only numbers, max 11 digits
        if (name === 'phone') {
            const numbersOnly = value.replace(/\D/g, '').slice(0, 11);
            setFormData(prev => ({ ...prev, phone: numbersOnly }));
            return;
        }

        // Postal code: only numbers, max 5 digits
        if (name === 'address.postalCode') {
            const numbersOnly = value.replace(/\D/g, '').slice(0, 5);
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, postalCode: numbersOnly }
            }));
            return;
        }

        // Address nested fields
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username || formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Valid email is required';
        }
        if (!formData.firstName || formData.firstName.trim().length < 2) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName || formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Last name is required';
        }

        // Address validation
        if (!formData.address.street) newErrors.street = 'Street is required';
        if (!formData.address.city) newErrors.city = 'City is required';
        if (!formData.address.region) newErrors.region = 'Region is required';
        if (!formData.address.postalCode || formData.address.postalCode.length !== 5) {
            newErrors.postalCode = 'Postal code must be 5 digits';
        }
        if (!formData.address.country) newErrors.country = 'Country is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            await api.post('/admin/register-admin', {
                username: formData.username,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                currentUser: user.Username
            });
            addToast('Admin created successfully!', 'success');
            setTimeout(() => navigate('/admin'), 1500);
        } catch (error) {
            console.error('Error creating admin:', error);
            addToast(error.response?.data?.message || error.response?.data?.error || 'Failed to create admin', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Add New Admin">
            <div className="form-container">
                <Link to="/admin" className="back-link">← Back to Dashboard</Link>

                <form onSubmit={handleSubmit} className="modern-form">
                    <div className="form-section">
                        <h3>Account Information</h3>
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
                                <label>Password <span className="required">*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Min 6 characters"
                                        className={errors.password ? 'error' : ''}
                                        style={{ paddingRight: '2.5rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '0.75rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '1.1rem',
                                            padding: '0',
                                            color: 'var(--text-secondary)'
                                        }}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <span className="error-text">{errors.password}</span>}
                            </div>
                            <div className="form-group">
                                <label>Confirm Password <span className="required">*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm password"
                                        className={errors.confirmPassword ? 'error' : ''}
                                        style={{ paddingRight: '2.5rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '0.75rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '1.1rem',
                                            padding: '0',
                                            color: 'var(--text-secondary)'
                                        }}
                                    >
                                        {showConfirmPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Personal Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name <span className="required">*</span></label>
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="First name"
                                    className={errors.firstName ? 'error' : ''}
                                />
                                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                            </div>
                            <div className="form-group">
                                <label>Last Name <span className="required">*</span></label>
                                <input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last name"
                                    className={errors.lastName ? 'error' : ''}
                                />
                                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Phone (11 digits)</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="e.g., 01234567890"
                                maxLength="11"
                                className={errors.phone ? 'error' : ''}
                            />
                            {errors.phone && <span className="error-text">{errors.phone}</span>}
                            {formData.phone && !errors.phone && <span className="hint">{formData.phone.length}/11 digits</span>}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Address</h3>
                        <div className="form-row">
                            <div className="form-group" style={{ flex: 2 }}>
                                <label>Street <span className="required">*</span></label>
                                <input
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    placeholder="Street address"
                                    className={errors.street ? 'error' : ''}
                                />
                                {errors.street && <span className="error-text">{errors.street}</span>}
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Building No.</label>
                                <input
                                    name="address.buildingNo"
                                    value={formData.address.buildingNo}
                                    onChange={handleChange}
                                    placeholder="Building #"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City <span className="required">*</span></label>
                                <input
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className={errors.city ? 'error' : ''}
                                />
                                {errors.city && <span className="error-text">{errors.city}</span>}
                            </div>
                            <div className="form-group">
                                <label>Region/Province <span className="required">*</span></label>
                                <input
                                    name="address.region"
                                    value={formData.address.region}
                                    onChange={handleChange}
                                    placeholder="State/Province"
                                    className={errors.region ? 'error' : ''}
                                />
                                {errors.region && <span className="error-text">{errors.region}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Postal Code <span className="required">*</span></label>
                                <input
                                    name="address.postalCode"
                                    value={formData.address.postalCode}
                                    onChange={handleChange}
                                    placeholder="5 digits"
                                    maxLength="5"
                                    className={errors.postalCode ? 'error' : ''}
                                />
                                {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
                            </div>
                            <div className="form-group">
                                <label>Country <span className="required">*</span></label>
                                <input
                                    name="address.country"
                                    value={formData.address.country}
                                    onChange={handleChange}
                                    placeholder="Country"
                                    className={errors.country ? 'error' : ''}
                                />
                                {errors.country && <span className="error-text">{errors.country}</span>}
                            </div>
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
