import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
            const response = await axios.post('http://localhost:9000/auth/login', formData);
            
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
            console.error('Login error:', err);
            // Use the error message from the interceptor or default
            const errorMessage = err.message || err.response?.data || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            
            // If it's a connection error, provide more helpful message
            if (err.isConnectionError || !err.response) {
                setError('Cannot connect to backend server. Please ensure:\n1. Backend is running on http://localhost:9000\n2. No firewall is blocking the connection\n3. Check backend terminal for errors');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="login-container">
                <div className="login-card">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label>Email</label>
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
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <p className="register-link">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
