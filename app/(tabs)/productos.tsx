import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { productService } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Productos() {
    const [categorias, setCategorias] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { addToFavorites, isFavorite } = useFavorites();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await productService.getCategories();
            // Transform API data to match UI structure
            const data = response.data.map((cat: any) => ({
                ...cat,
                foto: cat.image ? { uri: `http://192.168.88.102:3000/images/${cat.image}` } : null,
                productos: cat.productos.map((prod: any) => ({
                    ...prod,
                    foto: prod.image ? { uri: `http://192.168.88.102:3000/images/${prod.image}` } : null,
                    precio: `S/ ${prod.price}`
                }))
            }));
            setCategorias(data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderCategoria = ({ item }: { item: any }) => (
        <View style={styles.categorySection}>
            <View style={[styles.categoryHeader, { backgroundColor: item.color || '#8B4513' }]}>
                <Text style={styles.categoryTitle}>{item.nombre || item.name}</Text>
            </View>
            <FlatList
                data={item.productos}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsList}
                keyExtractor={(prod, index) => index.toString()}
                renderItem={({ item: prod }) => (
                    <TouchableOpacity style={styles.productCard}>
                        <View style={[styles.productImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
                            <Text>Img</Text>
                        </View>
                        <Text style={styles.productName}>{prod.nombre || prod.name}</Text>
                        <Text style={styles.productPrice}>{prod.precio}</Text>

                        <TouchableOpacity
                            style={styles.favoriteButton}
                            onPress={() => addToFavorites(prod)}
                        >
                            <Ionicons
                                name={isFavorite(prod.id) ? "heart" : "heart-outline"}
                                size={20}
                                color={isFavorite(prod.id) ? "#FF5252" : "#8D6E63"}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: item.color || '#8B4513' }]}
                            onPress={() => addToCart(prod)}
                        >
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <AppHeader />
            <View style={styles.header}>
                <Text style={styles.mainTitle}>Nuestros Productos</Text>
                <Text style={styles.subTitle}>Sabor auténtico en cada bocado</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#8B4513" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={categorias}
                    renderItem={renderCategoria}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F0',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#FFF',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        marginBottom: 10,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#5D4037',
        textAlign: 'center',
        marginBottom: 6,
    },
    subTitle: {
        fontSize: 16,
        color: '#8D6E63',
        textAlign: 'center',
        fontWeight: '500',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    categorySection: {
        marginBottom: 25,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 15,
        marginHorizontal: 15,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        flex: 1,
    },
    productsList: {
        paddingHorizontal: 15,
    },
    productCard: {
        backgroundColor: '#FFF',
        borderRadius: 18,
        padding: 12,
        marginRight: 15,
        width: 150,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    productImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 10,
        borderRadius: 10,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5D4037',
        textAlign: 'center',
        marginBottom: 4,
        height: 40,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5D4037',
        textAlign: 'center',
        marginBottom: 8,
        height: 36,
        lineHeight: 18,
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: -1,
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 12,
        padding: 4,
    },
});