import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const { user, isStoreOwner } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, PENDING, IN_PROGRESS, COMPLETED
    const [toast, setToast] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isStoreOwner()) {
            navigate('/');
            return;
        }

        fetchOrders();
    }, [user, isStoreOwner, navigate]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Get store by owner
            const storeResponse = await axios.get(`http://localhost:9000/stores/owner/${user.userId}`);
            if (storeResponse.data) {
                const storeId = storeResponse.data.id;
                // Get orders for this store
                console.log("storeId in admin dashboard ", storeId);
                const ordersResponse = await axios.get(`http://localhost:9000/orders/store/${storeId}`);
                console.log("ordersResponse", ordersResponse.data);
                setOrders(ordersResponse.data || []);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            let errorMessage = 'Failed to load orders.';
            if (err.request && !err.response) {
                errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
            } else if (err.response) {
                errorMessage = err.response.data?.message || 'Failed to load orders.';
            }
            setError(errorMessage);
            setToast({ message: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            console.log("Inside updateOrderStatus where orderId is ", orderId + " and status is " + status);
            await axios.put(`http://localhost:9000/orders/${orderId}/status`, { status });
            fetchOrders(); // Refresh orders
            setToast({ message: 'Order status updated successfully!', type: 'success' });
        } catch (err) {
            console.error('Error updating order status:', err);
            let errorMessage = 'Failed to update order status.';
            if (err.request && !err.response) {
                errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
            } else if (err.response) {
                errorMessage = err.response.data?.message || 'Failed to update order status.';
            }
            setToast({ message: errorMessage, type: 'error' });
        }
    };

    const filteredOrders = filter === 'ALL' 
        ? orders 
        : orders.filter(order => order.status === filter);

    const getStatusCount = (status) => {
        return orders.filter(order => order.status === status).length;
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="admin-dashboard">
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
            {error && <div className="error-banner">{error}</div>}
            <div className="admin-dashboard">
                <h1>Admin Dashboard</h1>
                
                <div className="dashboard-actions">
                    <button onClick={() => navigate('/admin/add-medicine')} className="btn-primary">
                        Add New Medicine
                    </button>
                    <button onClick={() => navigate('/admin/manage-medicines')} className="btn-secondary">
                        Manage Medicines
                    </button>
                </div>

                <div className="stats-cards">
                    <div className="stat-card">
                        <h3>Total Orders</h3>
                        <p>{orders.length}</p>
                    </div>
                    <div className="stat-card pending">
                        <h3>Pending</h3>
                        <p>{getStatusCount('PENDING')}</p>
                    </div>
                    <div className="stat-card in-progress">
                        <h3>In Progress</h3>
                        <p>{getStatusCount('IN_PROGRESS')}</p>
                    </div>
                    <div className="stat-card completed">
                        <h3>Completed</h3>
                        <p>{getStatusCount('COMPLETED')}</p>
                    </div>
                </div>

                <div className="filter-section">
                    <button 
                        className={filter === 'ALL' ? 'active' : ''}
                        onClick={() => setFilter('ALL')}
                    >
                        All Orders
                    </button>
                    <button 
                        className={filter === 'PENDING' ? 'active' : ''}
                        onClick={() => setFilter('PENDING')}
                    >
                        Pending
                    </button>
                    <button 
                        className={filter === 'IN_PROGRESS' ? 'active' : ''}
                        onClick={() => setFilter('IN_PROGRESS')}
                    >
                        In Progress
                    </button>
                    <button 
                        className={filter === 'COMPLETED' ? 'active' : ''}
                        onClick={() => setFilter('COMPLETED')}
                    >
                        Completed
                    </button>
                </div>

                <div className="orders-list">
                    {filteredOrders.length === 0 ? (
                        <p className="no-orders">No orders found</p>
                    ) : (
                        filteredOrders.map((order) => (
                            console.log("order in admin dashboard ", order),
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <h3>Order #{order.id}</h3>
                                    <span className={`status-badge ${order.status.toLowerCase().replace('_', '-')}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="order-details">
                                    <div className="detail-row">
                                        <strong>Customer:</strong> {order.customerName}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Phone:</strong> {order.customerPhone}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Email:</strong> {order.customerEmail}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Delivery Address:</strong> {order.deliveryAddress}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}
                                    </div>
                                    <div className="detail-row">
                                        <strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}
                                    </div>
                                </div>
                                <div className="order-items-section">
                                    <strong>Order Items:</strong>
                                    <ul>
                                        {order.orderItems && order.orderItems.map((item, idx) => (
                                            <li key={idx}>
                                                {item.medicineName} x {item.quantity} = ₹{item.totalPrice}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="order-actions">
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
