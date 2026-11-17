import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import '../styles/PrescriptionUpload.css';
import axios from 'axios';

const PrescriptionUpload = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [stores, setStores] = useState([]);
    const [formData, setFormData] = useState({
        storeId: '',
        patientName: '',
        patientPhone: '',
        patientEmail: '',
        deliveryAddress: ''
    });
    const [prescriptionFile, setPrescriptionFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [fetchingStores, setFetchingStores] = useState(true);

    useEffect(() => {
        // Redirect if not authenticated
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        // Load user data
        if (user) {
            setFormData(prev => ({
                ...prev,
                patientName: user.name || '',
                patientEmail: user.email || ''
            }));
        }

        // Fetch stores
        fetchStores();
    }, [user, isAuthenticated, navigate]);

    const fetchStores = async () => {
        try {
            setFetchingStores(true);
            const response = await axios.get('http://localhost:9000/stores/active');
            setStores(response.data || []);
        } catch (err) {
            console.error('Error fetching stores:', err);
            setError('Failed to load stores. Please try again.');
        } finally {
            setFetchingStores(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/pdf', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                setError('Please upload a valid file (JPEG, PNG, or PDF)');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size should be less than 5MB');
                return;
            }
            setPrescriptionFile(file);
            setError('');
        }
    };

    const validateForm = () => {
        if (!formData.storeId) {
            setError('Please select a store');
            return false;
        }
        if (!formData.patientName.trim()) {
            setError('Please enter patient name');
            return false;
        }
        if (!formData.patientPhone.trim()) {
            setError('Please enter phone number');
            return false;
        }
        if (!/^[0-9]{10}$/.test(formData.patientPhone)) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }
        if (!formData.patientEmail.trim()) {
            setError('Please enter email');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patientEmail)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.deliveryAddress.trim()) {
            setError('Please enter delivery address');
            return false;
        }
        if (!prescriptionFile) {
            setError('Please upload a prescription');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('prescriptionFile', prescriptionFile);
            formDataToSend.append('storeId', formData.storeId);
            formDataToSend.append('patientName', formData.patientName);
            formDataToSend.append('patientPhone', formData.patientPhone);
            formDataToSend.append('patientEmail', formData.patientEmail);
            formDataToSend.append('deliveryAddress', formData.deliveryAddress);
            if (user && user.userId) {
                formDataToSend.append('userId', user.userId);
            }

            const response = await axios.post('http://localhost:9000/prescription/upload', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setSuccess(true);
                // Reset form after success
                setTimeout(() => {
                    setFormData({
                        storeId: '',
                        patientName: user?.name || '',
                        patientPhone: '',
                        patientEmail: user?.email || '',
                        deliveryAddress: ''
                    });
                    setPrescriptionFile(null);
                    setSuccess(false);
                }, 3000);
            }
        } catch (err) {
            console.error('Error uploading prescription:', err);
            setError(err.response?.data?.message || 'Failed to upload prescription. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingStores) {
        return (
            <div>
                <Navbar />
                <div className="prescription-upload-container">
                    <p>Loading stores...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="prescription-upload-container">
                <div className="prescription-header">
                    <UploadFileIcon className="upload-icon" />
                    <h1>Upload Prescription</h1>
                    <p>Upload your prescription and we'll process it for you</p>
                </div>

                {success && (
                    <div className="success-message">
                        <p>✓ Prescription uploaded successfully! The store owner will receive your prescription and contact you soon.</p>
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}

                <div className="prescription-form-card">
                    <form onSubmit={handleSubmit} className="prescription-form">
                        <div className="form-group">
                            <label>Select Store *</label>
                            <select
                                name="storeId"
                                value={formData.storeId}
                                onChange={handleChange}
                                required
                                className="store-select"
                            >
                                <option value="">-- Select a store --</option>
                                {stores && stores.map(store => (
                                    <option key={store.id} value={store.id}>
                                        {store.name} - {store.address} ({store.pincode})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Patient Name *</label>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    placeholder="Enter patient name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="patientPhone"
                                    value={formData.patientPhone}
                                    onChange={handleChange}
                                    placeholder="Enter 10-digit phone number"
                                    maxLength="10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="patientEmail"
                                value={formData.patientEmail}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Delivery Address *</label>
                            <textarea
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleChange}
                                placeholder="Enter complete delivery address with pincode"
                                rows="4"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Prescription File *</label>
                            <div className="file-upload-area">
                                <input
                                    type="file"
                                    id="prescription-file"
                                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                                    onChange={handleFileChange}
                                    className="file-input"
                                    required
                                />
                                <label htmlFor="prescription-file" className="file-upload-label">
                                    <UploadFileIcon />
                                    <span>
                                        {prescriptionFile 
                                            ? prescriptionFile.name 
                                            : 'Click to upload or drag and drop'}
                                    </span>
                                    <p className="file-hint">JPEG, PNG or PDF (Max 5MB)</p>
                                </label>
                            </div>
                            {prescriptionFile && (
                                <div className="file-preview">
                                    <p>Selected: {prescriptionFile.name}</p>
                                    <button 
                                        type="button" 
                                        onClick={() => setPrescriptionFile(null)}
                                        className="btn-remove-file"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="form-note">
                            <p><strong>Note:</strong> Your prescription will be sent to the selected store owner via email. They will review it and contact you to confirm the medicines and pricing.</p>
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Uploading...' : 'Upload Prescription'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PrescriptionUpload;
