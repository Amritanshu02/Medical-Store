import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import AlternativeSuggestions from '../components/AlternativeSuggestions';
import { useCart } from '../context/CartContext';
import { suggestAlternatives } from '../utils/ai';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import '../styles/Store.css';

const Store = () => {
    const [searchParams] = useSearchParams();
    const storeId = searchParams.get('storeId');
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState(null);
    const [altGroups, setAltGroups] = useState([]);
    const [altLoading, setAltLoading] = useState(false);
    const [altError, setAltError] = useState('');
    const { addToCart, setStoreId: setCartStoreId } = useCart();

    useEffect(() => {
        setCartStoreId(storeId);

        const fetchMedicines = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:9000/medicines');
                setMedicines(response.data || []);
                setError('');
            } catch (err) {
                console.error('Error fetching medicines:', err);
                setError('Failed to load medicines. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchMedicines();
    }, [storeId, setCartStoreId]);

    useEffect(() => {
        const loadSearchAlternatives = async () => {
            if (!searchQuery.trim() || medicines.length === 0) {
                setAltGroups([]);
                setAltError('');
                return;
            }

            const unmatched = medicines.filter((medicine) => {
                const matches =
                    medicine.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    medicine.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    medicine.composition?.toLowerCase().includes(searchQuery.toLowerCase());
                return matches && !medicine.available;
            });

            if (unmatched.length === 0) {
                setAltGroups([]);
                return;
            }

            try {
                setAltLoading(true);
                setAltError('');
                const response = await suggestAlternatives({
                    query: searchQuery,
                    catalog: medicines
                });
                setAltGroups(response.groups || []);
            } catch (err) {
                console.error('Error fetching alternatives:', err);
                setAltError('Could not load AI alternatives. Make sure the AI service is running on port 8000.');
            } finally {
                setAltLoading(false);
            }
        };

        const timeout = setTimeout(loadSearchAlternatives, 400);
        return () => clearTimeout(timeout);
    }, [searchQuery, medicines]);

    const handleAddToCart = async (medicine) => {
        if (!medicine.available) {
            setToast({ message: `${medicine.name} is out of stock. Showing alternatives.`, type: 'info' });
            try {
                setAltLoading(true);
                const response = await suggestAlternatives({
                    medicine,
                    catalog: medicines
                });
                setAltGroups(response.groups || []);
            } catch (err) {
                setAltError('Could not load AI alternatives. Make sure the AI service is running on port 8000.');
            } finally {
                setAltLoading(false);
            }
            return;
        }

        addToCart(medicine);
        setToast({ message: `${medicine.name} added to cart!`, type: 'success' });
    };

    const filteredMedicines = medicines.filter((medicine) =>
        medicine.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.composition?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="store-loading">
                    <p>Loading medicines...</p>
                </div>
                <Footer />
            </div>
        );
    }

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
            <div className="store-container">
                <h1>Available Medicines</h1>
                <div className="store-search">
                    <input
                        type="text"
                        placeholder="Search medicines..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="medicines-grid">
                    {filteredMedicines.length > 0 ? (
                        filteredMedicines.map((medicine) => (
                            <div key={medicine.id} className={`medicine-card ${medicine.available ? '' : 'out-of-stock'}`}>
                                <div className="medicine-image">
                                    {medicine.imageData ? (
                                        <img
                                            src={`http://localhost:9000/product/${medicine.id}/image`}
                                            alt={medicine.name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                if (e.target.nextSibling) {
                                                    e.target.nextSibling.style.display = 'flex';
                                                }
                                            }}
                                        />
                                    ) : null}
                                    <div className="placeholder-image" style={{display: medicine.imageData ? 'none' : 'flex'}}>No Image</div>
                                </div>
                                <div className="medicine-info">
                                    <h3>{medicine.name}</h3>
                                    <p className="brand">{medicine.brand}</p>
                                    {medicine.composition && (
                                        <p className="composition">{medicine.composition}</p>
                                    )}
                                    <p className="price">₹{medicine.price}</p>
                                    {!medicine.available && <p className="stock-badge">Out of stock</p>}
                                    <button
                                        className="add-to-cart-btn"
                                        onClick={() => handleAddToCart(medicine)}
                                    >
                                        <AddShoppingCartIcon /> {medicine.available ? 'Add to Cart' : 'Find alternatives'}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-medicines">
                            {searchQuery ? 'No medicines found matching your search.' : 'No medicines available.'}
                        </p>
                    )}
                </div>
                <AlternativeSuggestions
                    groups={altGroups}
                    loading={altLoading}
                    error={altError}
                    onAddToCart={handleAddToCart}
                />
            </div>
            <Footer />
        </div>
    );
};

export default Store;
