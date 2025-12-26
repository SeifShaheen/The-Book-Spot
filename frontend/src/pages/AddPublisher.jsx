import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

const AddPublisher = () => {
    const [formData, setFormData] = useState({
        name: '', phone: '',
        address: { line1: '', line2: '', city: '', region: '', postalCode: '', country: '' }
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Phone: only allow numbers, max 11 digits
        if (name === 'phone') {
            const numbersOnly = value.replace(/\D/g, '').slice(0, 11);
            setFormData(prev => ({ ...prev, phone: numbersOnly }));
            if (errors.phone) setErrors({ ...errors, phone: '' });
            return;
        }

        // Postal Code: only allow numbers, max 5 digits
        if (name === 'address.postalCode') {
            const numbersOnly = value.replace(/\D/g, '').slice(0, 5);
            setFormData(prev => ({ ...prev, address: { ...prev.address, postalCode: numbersOnly } }));
            if (errors['address.postalCode']) setErrors({ ...errors, 'address.postalCode': '' });
            return;
        }

        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        // Clear errors
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name || formData.name.length < 2) {
            newErrors.name = 'Publisher name is required';
        }
        if (formData.phone && formData.phone.length !== 11) {
            newErrors.phone = 'Phone must be exactly 11 digits';
        }
        if (!formData.address.line1) {
            newErrors['address.line1'] = 'Address line 1 is required';
        }
        if (!formData.address.city) {
            newErrors['address.city'] = 'City is required';
        }
        if (formData.address.postalCode && formData.address.postalCode.length !== 5) {
            newErrors['address.postalCode'] = 'Postal code must be exactly 5 digits';
        }
        if (!formData.address.country) {
            newErrors['address.country'] = 'Country is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const response = await api.post('/admin/publishers', formData);
            setMessage({ type: 'success', text: `Publisher added successfully! ID: ${response.data.publisherId}` });
            setTimeout(() => navigate('/admin'), 1500);
        } catch (error) {
            console.error('Error adding publisher:', error);
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to add publisher' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Add New Publisher">
            <div className="form-container">
                <Link to="/admin" className="back-link">← Back to Dashboard</Link>

                {message.text && (
                    <div className={`message ${message.type}`}>{message.text}</div>
                )}

                <form onSubmit={handleSubmit} className="modern-form">
                    <div className="form-section">
                        <h3>Publisher Info</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Publisher Name <span className="required">*</span></label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Penguin Random House"
                                    className={errors.name ? 'error' : ''}
                                />
                                {errors.name && <span className="error-text">{errors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label>Phone Number (11 digits)</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="e.g., 01234567890"
                                    maxLength="11"
                                    className={errors.phone ? 'error' : ''}
                                />
                                {errors.phone && <span className="error-text">{errors.phone}</span>}
                                {formData.phone && <span className="hint">{formData.phone.length}/11 digits</span>}
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Address</h3>
                        <div className="form-group">
                            <label>Address Line 1 <span className="required">*</span></label>
                            <input
                                name="address.line1"
                                value={formData.address.line1}
                                onChange={handleChange}
                                placeholder="Street address"
                                className={errors['address.line1'] ? 'error' : ''}
                            />
                            {errors['address.line1'] && <span className="error-text">{errors['address.line1']}</span>}
                        </div>
                        <div className="form-group">
                            <label>Address Line 2</label>
                            <input
                                name="address.line2"
                                value={formData.address.line2}
                                onChange={handleChange}
                                placeholder="Apt, Suite, Building (optional)"
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>City <span className="required">*</span></label>
                                <input
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className={errors['address.city'] ? 'error' : ''}
                                />
                                {errors['address.city'] && <span className="error-text">{errors['address.city']}</span>}
                            </div>
                            <div className="form-group">
                                <label>Region/State</label>
                                <input
                                    name="address.region"
                                    value={formData.address.region}
                                    onChange={handleChange}
                                    placeholder="State/Province"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Postal Code (5 digits)</label>
                                <input
                                    name="address.postalCode"
                                    value={formData.address.postalCode}
                                    onChange={handleChange}
                                    placeholder="e.g., 12345"
                                    maxLength="5"
                                    className={errors['address.postalCode'] ? 'error' : ''}
                                />
                                {errors['address.postalCode'] && <span className="error-text">{errors['address.postalCode']}</span>}
                            </div>
                            <div className="form-group">
                                <label>Country <span className="required">*</span></label>
                                <input
                                    name="address.country"
                                    value={formData.address.country}
                                    onChange={handleChange}
                                    placeholder="Country"
                                    className={errors['address.country'] ? 'error' : ''}
                                />
                                {errors['address.country'] && <span className="error-text">{errors['address.country']}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Publisher'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default AddPublisher;
