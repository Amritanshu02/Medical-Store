import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { medicinesData } from '../data/products';
import { useCart } from '../context/CartContext';
import '../styles/ProductListing.css';

const Medicines = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [toast, setToast] = useState(null);
    const { addToCart } = useCart();

    const categories = ['All', ...new Set(medicinesData.map(item => item.category))];

    const filteredProducts = medicinesData.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddToCart = (product) => {
        addToCart(product);
        setToast({ message: `${product.name} added to cart!`, type: 'success' });
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
                <div className="search-filter-section">
                    <div className="search-bar">
                        <SearchIcon className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search medicines..."
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
                                onAddToCart={handleAddToCart}
                                type="medicine"
                            />
                        ))
                    ) : (
                        <div className="no-results">
                            <p>No medicines found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Medicines;
