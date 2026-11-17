import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [storeId, setStoreId] = useState(null);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const savedStoreId = localStorage.getItem('storeId');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        if (savedStoreId) {
            // setStoreId(parseInt(savedStoreId));
            console.log("savedStoreId in cart context ", savedStoreId);
            setStoreId(savedStoreId);
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        if (storeId) {
            console.log("storeId in cart context ", storeId);
            localStorage.setItem('storeId', storeId.toString());
        }
    }, [cart, storeId]);

    const addToCart = (medicine) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === medicine.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === medicine.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...medicine, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (medicineId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== medicineId));
    };

    const updateQuantity = (medicineId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(medicineId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === medicineId
                    ? { ...item, quantity: quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        setStoreId(null);
        localStorage.removeItem('cart');
        localStorage.removeItem('storeId');
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const value = {
        cart,
        storeId,
        setStoreId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
