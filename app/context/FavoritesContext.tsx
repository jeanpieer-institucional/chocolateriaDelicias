import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Product {
    id: number;
    nombre?: string;
    name?: string;
    precio: string | number;
    image?: string;
    foto?: { uri: string };
    [key: string]: any;
}

interface FavoritesContextType {
    favorites: Product[];
    addToFavorites: (product: Product) => Promise<void>;
    removeFromFavorites: (productId: number) => Promise<void>;
    isFavorite: (productId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<Product[]>([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    useEffect(() => {
        saveFavorites();
    }, [favorites]);

    const loadFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    const saveFavorites = async () => {
        try {
            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    };

    const addToFavorites = async (product: Product) => {
        if (isFavorite(product.id)) {
            removeFromFavorites(product.id);
            return;
        }

        setFavorites(prev => [...prev, product]);
        // Optional: Alert.alert('Éxito', 'Producto agregado a favoritos');
    };

    const removeFromFavorites = async (productId: number) => {
        setFavorites(prev => prev.filter(item => item.id !== productId));
    };

    const isFavorite = (productId: number) => {
        return favorites.some(item => item.id === productId);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
