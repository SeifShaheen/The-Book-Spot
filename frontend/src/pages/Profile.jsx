import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) return;
        const fetchProfile = async () => {
            try {
                const response = await api.get(`/auth/profile/${user.Username}`);
                setProfile(response.data);
                setFormData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/auth/profile/${user.Username}`, {
                firstName: formData.FirstName,
                lastName: formData.LastName,
                phone: formData.Phone,
                address: {
                    street: formData.ShippingStreet,
                    city: formData.ShippingCity,
                    country: formData.ShippingCountry
                }
            });
            setMessage('Profile updated successfully!');
            setEditing(false);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update profile');
        }
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (!profile) return <div className="empty-state">Could not load profile.</div>;

    return (
        <div className="profile-container">
            <h2>My Profile</h2>
            {message && <div className={message.includes('success') ? 'success-message' : 'error'}>{message}</div>}

            {!editing ? (
                <div className="profile-info card">
                    <p><strong>Username:</strong> {profile.Username}</p>
                    <p><strong>Name:</strong> {profile.FirstName} {profile.LastName}</p>
                    <p><strong>Email:</strong> {profile.Email}</p>
                    <p><strong>Phone:</strong> {profile.Phone || 'Not set'}</p>
                    <p><strong>Address:</strong> {profile.ShippingStreet || 'Not set'}, {profile.ShippingCity}, {profile.ShippingCountry}</p>
                    <button onClick={() => setEditing(true)}>Edit Profile</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="card">
                    <div className="form-group">
                        <label>First Name:</label>
                        <input name="FirstName" value={formData.FirstName || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input name="LastName" value={formData.LastName || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Phone:</label>
                        <input name="Phone" value={formData.Phone || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Street:</label>
                        <input name="ShippingStreet" value={formData.ShippingStreet || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>City:</label>
                        <input name="ShippingCity" value={formData.ShippingCity || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Country:</label>
                        <input name="ShippingCountry" value={formData.ShippingCountry || ''} onChange={handleChange} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit">Save Changes</button>
                        <button type="button" className="secondary" onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Profile;
