import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AlternativeSuggestions from '../components/AlternativeSuggestions';
import { suggestAlternatives } from '../utils/ai';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import '../styles/Cart.css';

const Cart = () => {
    const { cart, addToCart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();
    const navigate = useNavigate();
    const [catalog, setCatalog] = useState([]);
    const [altGroups, setAltGroups] = useState([]);
    const [altLoading, setAltLoading] = useState(false);
    const [altError, setAltError] = useState('');

    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const response = await axios.get('http://localhost:9000/medicines');
                setCatalog(response.data || []);
            } catch (err) {
                console.error('Error fetching catalog for alternatives:', err);
            }
        };
        fetchCatalog();
    }, []);

    useEffect(() => {
        const loadCartAlternatives = async () => {
            if (cart.length === 0 || catalog.length === 0) {
                setAltGroups([]);
                return;
            }

            const outOfStockItems = cart.filter((item) => {
                const live = catalog.find((med) => String(med.id) === String(item.id));
                return live ? !live.available : item.available === false;
            });

            if (outOfStockItems.length === 0) {
                setAltGroups([]);
                setAltError('');
                return;
            }

            try {
                setAltLoading(true);
                setAltError('');
                const groups = [];
                for (const item of outOfStockItems) {
                    const live = catalog.find((med) => String(med.id) === String(item.id)) || item;
                    const response = await suggestAlternatives({
                        medicine: live,
                        catalog
                    });
                    groups.push(...(response.groups || []));
                }
                setAltGroups(groups);
            } catch (err) {
                setAltError('Could not load AI alternatives. Make sure the AI service is running on port 8000.');
            } finally {
                setAltLoading(false);
            }
        };

        loadCartAlternatives();
    }, [cart, catalog]);

    if (cart.length === 0) {
        return (
            <div>
                <Navbar />
                <div className="cart-empty">
                    <h2>Your cart is empty</h2>
                    <p>Add medicines to your cart to continue</p>
                    <button onClick={() => navigate('/search')} className="btn-primary">
                        Browse Stores
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="cart-container">
                <h1>Shopping Cart</h1>
                <div className="cart-content">
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    {item.image || item.imageData ? (
                                        <img 
                                            src={item.image || `http://localhost:9000/product/${item.id}/image`}
                                            alt={item.name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                if (e.target.nextSibling) {
                                                    e.target.nextSibling.style.display = 'flex';
                                                }
                                            }}
                                        />
                                    ) : null}
                                    <div className="placeholder-image" style={{display: (item.image || item.imageData) ? 'none' : 'flex'}}>No Image</div>
                                </div>
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    {item.brand && <p className="brand">{item.brand}</p>}
                                    <p className="price">₹{item.price}</p>
                                    {item.discount && (
                                        <p className="discount">Save {item.discount}%</p>
                                    )}
                                </div>
                                <div className="cart-item-quantity">
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="quantity-btn"
                                    >
                                        <RemoveIcon />
                                    </button>
                                    <span className="quantity-value">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="quantity-btn"
                                    >
                                        <AddIcon />
                                    </button>
                                </div>
                                <div className="cart-item-total">
                                    <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <div className="cart-item-actions">
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="delete-btn"
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Items ({getTotalItems()})</span>
                            <span>₹{getTotalPrice().toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{getTotalPrice().toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={() => navigate('/checkout')}
                            className="btn-checkout"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
                <AlternativeSuggestions
                    groups={altGroups}
                    loading={altLoading}
                    error={altError}
                    onAddToCart={(medicine) => addToCart(medicine)}
                />
            </div>
            <Footer />
        </div>
    );
};

export default Cart;
