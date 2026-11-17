import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import axios from 'axios';
import '../styles/Checkout.css';

const Checkout = () => {
    const { cart, storeId, getTotalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        deliveryAddress: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        // Check if cart is empty
        if (cart.length === 0) {
            navigate('/cart');
        }
        // Load user data from localStorage if available
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            // Also load saved address if available
            const savedAddress = localStorage.getItem('savedAddress');
            setFormData(prev => ({
                ...prev,
                customerName: userData.name || '',
                customerEmail: userData.email || '',
                deliveryAddress: savedAddress || prev.deliveryAddress
            }));
        }
    }, [cart, navigate]);

    const saveAddress = () => {
        if (!formData.deliveryAddress.trim()) {
            setToast({ message: 'Please enter an address to save', type: 'error' });
            return;
        }
        localStorage.setItem('savedAddress', formData.deliveryAddress);
        setToast({ message: 'Address saved for future use!', type: 'success' });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.customerName.trim()) {
            setError('Please enter your name');
            return false;
        }
        if (!formData.customerPhone.trim()) {
            setError('Please enter your phone number');
            return false;
        }
        if (!/^[0-9]{10}$/.test(formData.customerPhone)) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }
        if (!formData.customerEmail.trim()) {
            setError('Please enter your email');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.deliveryAddress.trim()) {
            setError('Please enter your delivery address');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Get user ID from localStorage or use a default
            // const user = localStorage.getItem('user');
            // // const userId = user ? JSON.parse(user).id : 1; // Default to 1 if not logged in
            // const userId = user ? JSON.parse(user).userId : 1; 
            const userData = JSON.parse(localStorage.getItem("user"));
            console.log("userData in checkout ", userData);
            const userId = userData?.userId || userData?._id;// Default to 1 if not logged in
            console.log("userId in checkout ", userId);

            if (!userId) {
                setError("User not logged in properly.");
                return;
              }

            console.log("storeId in checkout ", storeId);
            console.log("String(storeId) in checkout ", String(storeId));
            const orderRequest = {
                userId: userId,
                storeId: String(storeId),
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                customerEmail: formData.customerEmail,
                deliveryAddress: formData.deliveryAddress,
                orderItems: cart.map(item => ({
                    medicineId: item.id,
                    medicineName: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            console.log("orderRequest ", orderRequest);
            const response = await axios.post('http://localhost:9000/orders/create', orderRequest);

            if (response.data) {
                setOrderId(response.data.id);
                setOrderSuccess(true);
                clearCart();
            }
        } catch (err) {
            console.error('Error creating order:', err);
            let errorMessage = 'Failed to place order. Please try again.';
            if (err.response) {
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                }
            } else if (err.request) {
                errorMessage = 'Cannot connect to server. Please make sure the backend is running on http://localhost:9000';
            }
            setError(errorMessage);
            setToast({ message: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div>
                <Navbar />
                <div className="order-success">
                    <div className="success-content">
                        <div className="success-icon">✓</div>
                        <h2>Order Placed Successfully!</h2>
                        <p>Order ID: #{orderId}</p>
                        <p>Your order will be dispatched within 24-48 hours.</p>
                        <p>You will receive a confirmation email shortly.</p>
                        <p className="payment-info">Payment Method: Cash on Delivery</p>
                        <button onClick={() => navigate('/')} className="btn-primary">
                            Continue Shopping
                        </button>
                    </div>
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
            <div className="checkout-container">
                <h1>Checkout</h1>
                <div className="checkout-content">
                    <div className="checkout-form-section">
                        <h2>Delivery Address</h2>
                        <form onSubmit={handleSubmit} className="checkout-form">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="customerPhone"
                                    value={formData.customerPhone}
                                    onChange={handleChange}
                                    placeholder="Enter 10-digit phone number"
                                    maxLength="10"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="customerEmail"
                                    value={formData.customerEmail}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Delivery Address *</label>
                                <textarea
                                    name="deliveryAddress"
                                    value={formData.deliveryAddress}
                                    onChange={handleChange}
                                    placeholder="Enter your complete address with pincode"
                                    rows="4"
                                    required
                                />
                                <button type="button" onClick={saveAddress} className="btn-save-address">
                                    Save Address for Future
                                </button>
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <button type="submit" className="btn-place-order" disabled={loading}>
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </form>
                    </div>
                    <div className="order-summary-section">
                        <h2>Order Summary</h2>
                        <div className="order-items">
                            {cart.map((item) => (
                                <div key={item.id} className="order-item">
                                    <div className="order-item-info">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-quantity">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="item-price">₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className="order-total">
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>₹{getTotalPrice().toFixed(2)}</span>
                            </div>
                            <div className="total-row">
                                <span>Delivery</span>
                                <span>Free</span>
                            </div>
                            <div className="total-row final-total">
                                <span>Total</span>
                                <span>₹{getTotalPrice().toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="payment-info-box">
                            <p>💵 Payment will be collected in cash upon delivery</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
