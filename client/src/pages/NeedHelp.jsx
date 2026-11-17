import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import '../styles/NeedHelp.css';
import axios from 'axios';

const NeedHelp = () => {
    const { user, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Placeholder contact details
    const supportPhone = '+91-XXX-XXX-XXXX';
    const supportEmail = 'support@arcmedical.com';

    React.useEffect(() => {
        // Pre-fill form if user is logged in
        if (isAuthenticated() && user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user, isAuthenticated]);

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
            // Submit query to backend
            const response = await axios.post('http://localhost:9000/support/contact', formData);
            
            if (response.status === 200) {
                setSuccess(true);
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            }
        } catch (err) {
            console.error('Error submitting query:', err);
            setError('Failed to submit your query. Please try again or call us directly.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="need-help-container">
                <div className="help-header">
                    <SupportAgentIcon className="help-icon" />
                    <h1>Need Help?</h1>
                    <p>We're here to assist you with any questions or concerns</p>
                </div>

                <div className="help-content">
                    <div className="contact-options">
                        <div className="contact-card">
                            <PhoneIcon className="contact-icon" />
                            <h3>Call Us</h3>
                            <p className="contact-detail">{supportPhone}</p>
                            <p className="contact-time">Mon-Sat: 9:00 AM - 9:00 PM</p>
                            <a href={`tel:${supportPhone}`} className="contact-button">
                                Call Now
                            </a>
                        </div>

                        <div className="contact-card">
                            <EmailIcon className="contact-icon" />
                            <h3>Email Us</h3>
                            <p className="contact-detail">{supportEmail}</p>
                            <p className="contact-time">We'll respond within 24 hours</p>
                            <a href={`mailto:${supportEmail}`} className="contact-button">
                                Send Email
                            </a>
                        </div>
                    </div>

                    <div className="query-form-section">
                        <h2>Submit Your Query</h2>
                        <p>Fill out the form below and we'll get back to you soon</p>
                        
                        {success && (
                            <div className="success-message">
                                <p>✓ Your query has been submitted successfully! We'll contact you soon.</p>
                            </div>
                        )}

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit} className="query-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
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
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number (optional)"
                                    maxLength="15"
                                />
                            </div>
                            <div className="form-group">
                                <label>Subject *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="What is your query about?"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Please describe your query in detail..."
                                    rows="6"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Query'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default NeedHelp;
