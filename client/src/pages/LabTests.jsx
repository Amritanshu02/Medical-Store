import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { labTestsData } from '../data/products';
import '../styles/ProductListing.css';

const LabTests = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [toast, setToast] = useState(null);

    const categories = ['All', ...new Set(labTestsData.map(item => item.category))];

    const filteredProducts = labTestsData.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleBookTest = (product) => {
        setToast({ 
            message: `Lab test "${product.name}" booking initiated. Our team will contact you shortly!`, 
            type: 'info' 
        });
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
            <div className="product-listing-container">
                <h1 className="page-title">Lab Tests</h1>
                <div className="search-filter-section">
                    <div className="search-bar">
                        <SearchIcon className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search lab tests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        className="filter-toggle"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FilterListIcon /> Filters
                    </button>
                </div>

                {showFilters && (
                    <div className="filter-section">
                        <h3>Filter by Category</h3>
                        <div className="category-filters">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="products-grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleBookTest}
                                type="labtest"
                            />
                        ))
                    ) : (
                        <div className="no-results">
                            <p>No lab tests found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LabTests;
