import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../profile.css';
import '../profile-form.css';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const { addToast } = useToast();

    useEffect(() => {
        if (!user) return;
        const fetchProfile = async () => {
            try {
                const endpoint = user.role === 'admin'
                    ? `/auth/profile/admin/${user.Username}`
                    : `/auth/profile/${user.Username}`;
                const response = await api.get(endpoint);
                setProfile(response.data);
                setFormData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                addToast('Failed to load profile', 'error');
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, addToast]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Phone: only numbers, max 11 digits
        if (name === 'Phone') {
            const numbersOnly = value.replace(/\D/g, '').slice(0, 11);
            setFormData(prev => ({ ...prev, [name]: numbersOnly }));
            if (errors.phone) setErrors({ ...errors, phone: '' });
            return;
        }

        // Postal code: only numbers, max 5 digits
        if (name === 'ShippingPostalCode') {
            const numbersOnly = value.replace(/\D/g, '').slice(0, 5);
            setFormData(prev => ({ ...prev, [name]: numbersOnly }));
            if (errors.postalCode) setErrors({ ...errors, postalCode: '' });
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear specific errors
        if (name === 'FirstName' && errors.firstName) setErrors({ ...errors, firstName: '' });
        if (name === 'LastName' && errors.lastName) setErrors({ ...errors, lastName: '' });
        if (name === 'ShippingStreet' && errors.street) setErrors({ ...errors, street: '' });
        if (name === 'ShippingCity' && errors.city) setErrors({ ...errors, city: '' });
        if (name === 'ShippingRegion' && errors.region) setErrors({ ...errors, region: '' });
        if (name === 'ShippingCountry' && errors.country) setErrors({ ...errors, country: '' });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.FirstName || formData.FirstName.trim().length < 2) {
            newErrors.firstName = 'First name is required (min 2 characters)';
        }
        if (!formData.LastName || formData.LastName.trim().length < 2) {
            newErrors.lastName = 'Last name is required (min 2 characters)';
        }

        if (user.role !== 'admin') {
            if (formData.Phone && formData.Phone.length !== 11) {
                newErrors.phone = 'Phone must be exactly 11 digits';
            }
        }

        if (!formData.ShippingStreet) newErrors.street = 'Street is required';
        if (!formData.ShippingCity) newErrors.city = 'City is required';
        if (!formData.ShippingRegion) newErrors.region = 'Region is required';
        if (!formData.ShippingPostalCode || formData.ShippingPostalCode.length !== 5) {
            newErrors.postalCode = 'Postal code must be 5 digits';
        }
        if (!formData.ShippingCountry) newErrors.country = 'Country is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            addToast('Please correct the validation errors', 'error');
            return;
        }

        try {
            const endpoint = user.role === 'admin'
                ? `/auth/profile/admin/${user.Username}`
                : `/auth/profile/${user.Username}`;

            const updateData = {
                firstName: formData.FirstName,
                lastName: formData.LastName,
                address: {
                    street: formData.ShippingStreet,
                    buildingNo: formData.ShippingBuildingNo,
                    city: formData.ShippingCity,
                    region: formData.ShippingRegion,
                    postalCode: formData.ShippingPostalCode,
                    country: formData.ShippingCountry
                }
            };

            if (user.role !== 'admin') {
                updateData.phone = formData.Phone;
            }

            await api.put(endpoint, updateData);
            setProfile(formData);
            addToast('Profile updated successfully!', 'success');
            setEditing(false);
        } catch (error) {
            console.error('Update error:', error);
            addToast(error.response?.data?.message || 'Failed to update profile', 'error');
        }
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (!profile) return <div className="empty-state">Could not load profile.</div>;

    return (
        <div className="profile-container">

            {!editing ? (
                <div className="profile-info card">
                    <p><strong>Username:</strong> {profile.Username}</p>
                    <p><strong>Name:</strong> {profile.FirstName} {profile.LastName}</p>
                    <p><strong>Email:</strong> {profile.Email}</p>
                    {user.role !== 'admin' && <p><strong>Phone:</strong> {profile.Phone || 'Not set'}</p>}
                    <p><strong>Address:</strong> {profile.ShippingStreet || 'Not set'}, {profile.ShippingCity}, {profile.ShippingCountry}</p>
                    <button onClick={() => setEditing(true)} className="btn btn-primary edit-profile-btn">Edit Profile</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="modern-form">
                    <div className="form-section">
                        <h3>Personal Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name <span className="required">*</span></label>
                                <input
                                    name="FirstName"
                                    value={formData.FirstName || ''}
                                    onChange={handleChange}
                                    className={errors.firstName ? 'error' : ''}
                                />
                                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                            </div>
                            <div className="form-group">
                                <label>Last Name <span className="required">*</span></label>
                                <input
                                    name="LastName"
                                    value={formData.LastName || ''}
                                    onChange={handleChange}
                                    className={errors.lastName ? 'error' : ''}
                                />
                                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                            </div>
                        </div>

                        {user.role !== 'admin' && (
                            <div className="form-group">
                                <label>Phone (11 digits)</label>
                                <input
                                    name="Phone"
                                    value={formData.Phone || ''}
                                    onChange={handleChange}
                                    maxLength="11"
                                    className={errors.phone ? 'error' : ''}
                                />
                                {errors.phone && <span className="error-text">{errors.phone}</span>}
                                {formData.Phone && !errors.phone && <span className="hint">{formData.Phone.length}/11 digits</span>}
                            </div>
                        )}
                    </div>

                    <div className="form-section">
                        <h3>Address</h3>
                        <div className="form-row">
                            <div className="form-group" style={{ flex: 2 }}>
                                <label>Street <span className="required">*</span></label>
                                <input
                                    name="ShippingStreet"
                                    value={formData.ShippingStreet || ''}
                                    onChange={handleChange}
                                    className={errors.street ? 'error' : ''}
                                />
                                {errors.street && <span className="error-text">{errors.street}</span>}
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Building No.</label>
                                <input
                                    name="ShippingBuildingNo"
                                    value={formData.ShippingBuildingNo || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City <span className="required">*</span></label>
                                <input
                                    name="ShippingCity"
                                    value={formData.ShippingCity || ''}
                                    onChange={handleChange}
                                    className={errors.city ? 'error' : ''}
                                />
                                {errors.city && <span className="error-text">{errors.city}</span>}
                            </div>
                            <div className="form-group">
                                <label>Region/Province <span className="required">*</span></label>
                                <input
                                    name="ShippingRegion"
                                    value={formData.ShippingRegion || ''}
                                    onChange={handleChange}
                                    className={errors.region ? 'error' : ''}
                                />
                                {errors.region && <span className="error-text">{errors.region}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Postal Code <span className="required">*</span></label>
                                <input
                                    name="ShippingPostalCode"
                                    value={formData.ShippingPostalCode || ''}
                                    onChange={handleChange}
                                    maxLength="5"
                                    className={errors.postalCode ? 'error' : ''}
                                />
                                {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
                            </div>
                            <div className="form-group">
                                <label>Country <span className="required">*</span></label>
                                <input
                                    name="ShippingCountry"
                                    value={formData.ShippingCountry || ''}
                                    onChange={handleChange}
                                    className={errors.country ? 'error' : ''}
                                />
                                {errors.country && <span className="error-text">{errors.country}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setErrors({}); }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Profile;
