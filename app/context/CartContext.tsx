import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { orderService } from '../services/api';
import { useAuth } from './AuthContext';

interface CartItem {
    id: number; // Product ID
    name: string;
    price: string;
    image_url: any; // Local image resource o URL object
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    loading: boolean;
    total: number;
    addToCart: (product: any, quantity?: number) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { token, user } = useAuth();

    const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price.replace('S/ ', '')) * item.quantity), 0);

    // Load cart from AsyncStorage on mount
    useEffect(() => {
        loadCart();
    }, []);

    // Save cart to AsyncStorage whenever it changes
    useEffect(() => {
        saveCart();
    }, [cartItems]);

    const loadCart = async () => {
        try {
            const storedCart = await AsyncStorage.getItem('cart');
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    const saveCart = async () => {
        try {
            await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    };

    const addToCart = async (product: any, quantity: number = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Usar la imagen local directamente (foto ya es un recurso local desde productImages)
                const imageResource = product.foto;

                return [...prevItems, {
                    id: product.id,
                    name: product.nombre || product.name,
                    price: product.precio.toString().replace('S/ ', ''),
                    image_url: imageResource,
                    quantity: quantity
                }];
            }
        });
        Alert.alert('Éxito', 'Producto agregado al carrito');
    };

    const removeFromCart = async (productId: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = async (productId: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = async () => {
        setCartItems([]);
        await AsyncStorage.removeItem('cart');
    };

    const checkout = async () => {
        if (!token) {
            Alert.alert('Error', 'Debes iniciar sesión para realizar la compra');
            return;
        }

        if (cartItems.length === 0) {
            Alert.alert('Error', 'El carrito está vacío');
            return;
        }

        try {
            setLoading(true);
            const orderItems = cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }));

            await orderService.createOrder(orderItems, token);
            await clearCart();
            Alert.alert('Éxito', '¡Compra realizada con éxito!');
        } catch (error: any) {
            console.error('Checkout error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Error al procesar la compra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            loading,
            total,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            checkout
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
