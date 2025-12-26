import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', firstName: '', lastName: '', email: '', phone: '',
        address: { street: '', buildingNo: '', city: '', region: '', postalCode: '', country: '' }
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

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
            setFormData(prev => ({ ...prev, address: { ...prev.address, postalCode: numbersOnly } }));
            return;
        }

        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
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
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Valid email is required';
        }
        // Phone validation - 11 digits
        if (formData.phone && formData.phone.length !== 11) {
            newErrors.phone = 'Phone must be exactly 11 digits';
        }
        // Address validation - all required except building number
        if (!formData.address.street) {
            newErrors.street = 'Street is required';
        }
        if (!formData.address.city) {
            newErrors.city = 'City is required';
        }
        if (!formData.address.region) {
            newErrors.region = 'Region/Province is required';
        }
        if (!formData.address.postalCode || formData.address.postalCode.length !== 5) {
            newErrors.postalCode = 'Postal code must be exactly 5 digits';
        }
        if (!formData.address.country) {
            newErrors.country = 'Country is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const result = await register(formData);
        if (result.success) {
            navigate('/login');
        } else {
            setErrors({ submit: result.message });
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container" style={{ maxWidth: '500px' }}>
                <h2>Create Account</h2>

                {errors.submit && <div className="message error">{errors.submit}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username <span className="required">*</span></label>
                        <input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            className={errors.username ? 'error' : ''}
                        />
                        {errors.username && <span className="error-text">{errors.username}</span>}
                    </div>

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

                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email <span className="required">*</span></label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
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

                    <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                        Shipping Address
                    </h3>

                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
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
                        <div className="form-group">
                            <label>Building No.</label>
                            <input name="address.buildingNo" value={formData.address.buildingNo} onChange={handleChange} placeholder="Building #" />
                        </div>
                    </div>

                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
