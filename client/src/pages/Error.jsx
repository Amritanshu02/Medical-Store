import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Error.css';

const Error = () => {
    return (
        <div>
            <Navbar />
            <div className="error-container">
                <div className="error-content">
                    <h1>404</h1>
                    <h2>Page Not Found</h2>
                    <p>Sorry, this page is currently under development or doesn't exist.</p>
                    <div className="error-actions">
                        <Link to="/" className="btn-primary">Go to Home</Link>
                        <Link to="/search" className="btn-secondary">Browse Stores</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Error;;