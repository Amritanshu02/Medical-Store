import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'CUSTOMER',
        address: '',
        // Store owner fields
        storeName: '',
        storeAddress: '',
        storePincode: '',
        storePhone: '',
        storeEmail: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:9000/auth/register', formData);
            
            if (response.data) {
                login(response.data);
                
                // Navigate based on role
                if (response.data.role === 'STORE_OWNER') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            console.error('Registration error:', err);
            // Use the error message from the interceptor or default
            let errorMessage = err.message || err.response?.data || 'Registration failed. Please try again.';
            
            // If it's a connection error, provide more helpful message
            if (err.isConnectionError || !err.response) {
                errorMessage = 'Cannot connect to backend server. Please ensure:\n1. Backend is running on http://localhost:9000\n2. No firewall is blocking the connection\n3. Check backend terminal for errors';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const isStoreOwner = formData.role === 'STORE_OWNER';

    return (
        <div>
            <Navbar />
            <div className="register-container">
                <div className="register-card">
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                minLength="6"
                            />
                        </div>
                        <div className="form-group">
                            <label>Register as *</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="CUSTOMER">Customer</option>
                                <option value="STORE_OWNER">Store Owner</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Address *</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                                rows="3"
                                required
                            />
                        </div>

                        {isStoreOwner && (
                            <>
                                <h3>Store Details</h3>
                                <div className="form-group">
                                    <label>Store Name *</label>
                                    <input
                                        type="text"
                                        name="storeName"
                                        value={formData.storeName}
                                        onChange={handleChange}
                                        placeholder="Enter store name"
                                        required={isStoreOwner}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Store Address *</label>
                                    <textarea
                                        name="storeAddress"
                                        value={formData.storeAddress}
                                        onChange={handleChange}
                                        placeholder="Enter store address"
                                        rows="3"
                                        required={isStoreOwner}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Store Pincode *</label>
                                    <input
                                        type="text"
                                        name="storePincode"
                                        value={formData.storePincode}
                                        onChange={handleChange}
                                        placeholder="Enter pincode"
                                        required={isStoreOwner}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Store Phone *</label>
                                    <input
                                        type="tel"
                                        name="storePhone"
                                        value={formData.storePhone}
                                        onChange={handleChange}
                                        placeholder="Enter store phone number"
                                        required={isStoreOwner}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Store Email</label>
                                    <input
                                        type="email"
                                        name="storeEmail"
                                        value={formData.storeEmail}
                                        onChange={handleChange}
                                        placeholder="Enter store email (optional)"
                                    />
                                </div>
                            </>
                        )}

                        {error && <div className="error-message">{error}</div>}
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                    <p className="login-link">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Register;
