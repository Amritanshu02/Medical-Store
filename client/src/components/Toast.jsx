import React, { useEffect } from 'react';
import '../styles/Toast.css';

const Toast = ({ message, onClose, type = 'success' }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, type === 'error' ? 5000 : 3000); // Show errors longer

        return () => clearTimeout(timer);
    }, [onClose, type]);

    return (
        <div className={`toast toast-${type}`}>
            <span>{message}</span>
            <button onClick={onClose} className="toast-close">×</button>
        </div>
    );
};

export default Toast;
