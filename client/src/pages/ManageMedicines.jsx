import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import '../styles/ManageMedicines.css';

const ManageMedicines = () => {
    const { user, isStoreOwner } = useAuth();
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState([]);
    const [storeMedicines, setStoreMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);
    const [storeId, setStoreId] = useState(null);
    const [csvFile, setCsvFile] = useState(null);
    const [uploadingCsv, setUploadingCsv] = useState(false);
    const [csvResult, setCsvResult] = useState(null);

    useEffect(() => {
        if (!isStoreOwner()) {
            navigate('/admin/dashboard');
            return;
        }

        fetchStoreId();
        fetchAllMedicines();
        fetchStoreMedicines();
    }, [user, isStoreOwner, navigate]);

    const fetchStoreId = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/stores/owner/${user.userId}`);
            if (response.data) {
                setStoreId(response.data.id);
            }
        } catch (err) {
            console.error('Error fetching store:', err);
        }
    };

    const fetchAllMedicines = async () => {
        try {
            const response = await axios.get('http://localhost:9000/medicines');
            setMedicines(response.data || []);
        } catch (err) {
            console.error('Error fetching medicines:', err);
            setError('Failed to load medicines');
        } finally {
            setLoading(false);
        }
    };

    const fetchStoreMedicines = async () => {
        if (!storeId) return;
        
        try {
            // Fetch store-specific medicines if you have an endpoint
            // For now, we'll work with all medicines
        } catch (err) {
            console.error('Error fetching store medicines:', err);
        }
    };

    const handleCsvUpload = async (e) => {
        e.preventDefault();
        if (!csvFile) {
            setToast({ message: 'Please choose a CSV file first.', type: 'error' });
            return;
        }

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            setUploadingCsv(true);
            setCsvResult(null);
            const response = await axios.post('http://localhost:9000/medicines/upload-csv', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setCsvResult(response.data);
            setCsvFile(null);
            await fetchAllMedicines();
            setToast({
                message: `CSV imported: ${response.data.created} created, ${response.data.updated} updated.`,
                type: 'success'
            });
        } catch (err) {
            const errorMessage = err.response?.data || err.message || 'Failed to upload CSV.';
            setToast({ message: String(errorMessage), type: 'error' });
        } finally {
            setUploadingCsv(false);
        }
    };

    const toggleAvailability = async (medicineId, available) => {
        try {
            // Update medicine availability
            // This would need a backend endpoint to update StoreMedicine
            setToast({ 
                message: 'Availability toggle functionality requires backend endpoint. Feature coming soon!', 
                type: 'info' 
            });
        } catch (err) {
            console.error('Error toggling availability:', err);
            let errorMessage = 'Failed to update availability.';
            if (err.request && !err.response) {
                errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
            } else if (err.response) {
                errorMessage = err.response.data?.message || 'Failed to update availability.';
            }
            setToast({ message: errorMessage, type: 'error' });
        }
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="manage-medicines">
                    <p>Loading...</p>
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
            <div className="manage-medicines">
                <div className="page-header">
                    <h1>Manage Medicines</h1>
                    <button onClick={() => navigate('/admin/add-medicine')} className="btn-primary">
                        Add New Medicine
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="csv-upload-card">
                    <h2>Upload medicines CSV</h2>
                    <p>
                        Required columns: <strong>name, brand, price</strong>.
                        Optional: <strong>composition, description, available, substitutes</strong>.
                    </p>
                    <p className="info-text">
                        Matching name + brand updates the existing medicine. Use true/false for availability.
                    </p>
                    <form onSubmit={handleCsvUpload} className="csv-upload-form">
                        <input
                            type="file"
                            accept=".csv,text/csv"
                            onChange={(e) => setCsvFile(e.target.files[0])}
                        />
                        <button type="submit" className="btn-primary" disabled={uploadingCsv}>
                            {uploadingCsv ? 'Uploading...' : 'Upload CSV'}
                        </button>
                        <a href="http://localhost:9000/medicines/csv-template" className="btn-secondary csv-template-link">
                            Download template
                        </a>
                    </form>
                    {csvResult && (
                        <div className="csv-result">
                            <p>Created: {csvResult.created} | Updated: {csvResult.updated} | Skipped rows: {csvResult.skipped}</p>
                            {csvResult.errors?.length > 0 && (
                                <ul>
                                    {csvResult.errors.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                <div className="medicines-section">
                    <h2>All Medicines ({medicines.length})</h2>
                    <p className="info-text">
                        You can add existing medicines to your store and mark their availability.
                    </p>
                    
                    <div className="medicines-grid">
                        {medicines.map((medicine) => (
                            <div key={medicine.id} className="medicine-manage-card">
                                <div className="medicine-image">
                                    {medicine.imageData ? (
                                        <img
                                            src={`http://localhost:9000/product/${medicine.id}/image`}
                                            alt={medicine.name}
                                        />
                                    ) : (
                                        <div className="placeholder-image">No Image</div>
                                    )}
                                </div>
                                <div className="medicine-details">
                                    <h3>{medicine.name}</h3>
                                    <p className="brand">{medicine.brand}</p>
                                    <p className="composition">{medicine.composition}</p>
                                    <p className="price">₹{medicine.price}</p>
                                    {medicine.substitutes && (
                                        <p className="substitutes">
                                            <strong>Substitutes:</strong> {medicine.substitutes}
                                        </p>
                                    )}
                                    <div className="availability-control">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={medicine.available}
                                                onChange={(e) => toggleAvailability(medicine.id, e.target.checked)}
                                            />
                                            Available in Store
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {medicines.length === 0 && (
                        <p className="no-medicines">No medicines found. Add your first medicine!</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ManageMedicines;
