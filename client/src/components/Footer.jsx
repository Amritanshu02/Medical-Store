import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>About</h3>
                    <ul>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/careers">Careers</Link></li>
                        <li><Link to="/blog">Blog</Link></li>
                        <li><Link to="/press">Press</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>For Customers</h3>
                    <ul>
                        <li><Link to="/search">Browse Stores</Link></li>
                        <li><Link to="/offers">Offers</Link></li>
                        <li><Link to="/medicines">Medicines</Link></li>
                        <li><Link to="/healthcare">Healthcare</Link></li>
                        <li><Link to="/lab-tests">Lab Tests</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>For Partners</h3>
                    <ul>
                        <li><Link to="/partner">Partner With Us</Link></li>
                        <li><Link to="/register">Register Store</Link></li>
                        <li><Link to="/login">Store Login</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Support</h3>
                    <ul>
                        <li><Link to="/need-help">Help & Support</Link></li>
                        <li><Link to="/faq">FAQs</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms & Conditions</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Download App</h3>
                    <div className="app-downloads">
                        <a href="#" className="app-link">
                            <img src="https://www.zomato.com/webassets/zomato_web/app-download-android.png" alt="Download on Google Play" />
                        </a>
                        <a href="#" className="app-link">
                            <img src="https://www.zomato.com/webassets/zomato_web/app-download-ios.png" alt="Download on App Store" />
                        </a>
                    </div>
                    <div className="social-links">
                        <a href="#" className="social-icon">Facebook</a>
                        <a href="#" className="social-icon">Twitter</a>
                        <a href="#" className="social-icon">Instagram</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p>&copy; 2024 ARCEE Medicals. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/terms">Terms</Link>
                        <Link to="/sitemap">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
