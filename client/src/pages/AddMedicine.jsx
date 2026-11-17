import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AddMedicine.css';

const AddMedicine = () => {
    const { isStoreOwner } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        composition: '',
        description: '',
        price: '',
        substitutes: '',
        available: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!isStoreOwner()) {
            navigate('/admin/dashboard');
        }
    }, [isStoreOwner, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            
            // Create medicine object
            const medicine = {
                name: formData.name,
                brand: formData.brand,
                composition: formData.composition,
                description: formData.description,
                price: parseFloat(formData.price),
                available: formData.available,
                substitutes: formData.substitutes
            };

            formDataToSend.append('medicine', new Blob([JSON.stringify(medicine)], { type: 'application/json' }));
            if (imageFile) {
                formDataToSend.append('imageFile', imageFile);
            }

            const response = await axios.post('http://localhost:9000/medicine', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data) {
                setSuccess(true);
                // Reset form
                setFormData({
                    name: '',
                    brand: '',
                    composition: '',
                    description: '',
                    price: '',
                    substitutes: '',
                    available: true
                });
                setImageFile(null);
                
                setTimeout(() => {
                    navigate('/admin/manage-medicines');
                }, 2000);
            }
        } catch (err) {
            console.error('Error adding medicine:', err);
            setError(err.response?.data?.message || 'Failed to add medicine. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div>
                <Navbar />
                <div className="success-message">
                    <h2>Medicine added successfully!</h2>
                    <p>Redirecting to manage medicines...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="add-medicine-container">
                <h1>Add New Medicine</h1>
                <div className="add-medicine-card">
                    <form onSubmit={handleSubmit} className="add-medicine-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Medicine Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter medicine name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Brand *</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    placeholder="Enter brand name"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Composition</label>
                            <input
                                type="text"
                                name="composition"
                                value={formData.composition}
                                onChange={handleChange}
                                placeholder="Enter composition"
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter description"
                                rows="4"
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Price (₹) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter price"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Available</label>
                                <input
                                    type="checkbox"
                                    name="available"
                                    checked={formData.available}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Substitute Medicines</label>
                            <input
                                type="text"
                                name="substitutes"
                                value={formData.substitutes}
                                onChange={handleChange}
                                placeholder="Enter substitute medicines (comma-separated)"
                            />
                        </div>
                        <div className="form-group">
                            <label>Medicine Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Adding Medicine...' : 'Add Medicine'}
                            </button>
                            <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AddMedicine;
