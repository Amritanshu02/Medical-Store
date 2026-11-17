import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import SearchIcon from '@mui/icons-material/Search';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { offersData } from '../data/products';
import '../styles/Offers.css';

const Offers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState(null);

    const filteredOffers = offersData.filter(offer => {
        return offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            offer.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            offer.code?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const copyToClipboard = (code) => {
        try {
            navigator.clipboard.writeText(code);
            setToast({ message: `Coupon code ${code} copied to clipboard!`, type: 'success' });
        } catch (err) {
            setToast({ message: 'Failed to copy code. Please try again.', type: 'error' });
        }
    };

    return (
        <div>
            <Navbar />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="offers-container">
                <h1 className="page-title">Special Offers & Deals</h1>
                <div className="search-section">
                    <div className="search-bar">
                        <SearchIcon className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search offers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="offers-grid">
                    {filteredOffers.length > 0 ? (
                        filteredOffers.map(offer => (
                            <div key={offer.id} className="offer-card">
                                <div className="offer-image-container">
                                    <img src={offer.image} alt={offer.title} className="offer-image" />
                                    {offer.discount > 0 && (
                                        <div className="offer-badge">
                                            {offer.discount}% OFF
                                        </div>
                                    )}
                                </div>
                                <div className="offer-content">
                                    <h3 className="offer-title">{offer.title}</h3>
                                    <p className="offer-description">{offer.description}</p>
                                    <div className="offer-code-section">
                                        {offer.code && (
                                            <div className="offer-code">
                                                <span>Code: <strong>{offer.code}</strong></span>
                                                <button 
                                                    className="copy-btn"
                                                    onClick={() => copyToClipboard(offer.code)}
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="offer-footer">
                                        <span className="offer-category">
                                            <LocalOfferIcon /> {offer.category}
                                        </span>
                                        <span className="offer-validity">
                                            Valid till: {new Date(offer.validTill).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <p>No offers found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Offers;
