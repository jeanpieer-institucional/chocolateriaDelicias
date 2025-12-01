import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { productService } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Productos() {
    const [categorias, setCategorias] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await productService.getCategories();
            // Transform API data to match UI structure
            const data = response.data.map((cat: any) => ({
                ...cat,
                // Map image names to require statements or URIs
                // In a real app, these would be URLs. For now, we handle the static images or URLs.
                // If the API returns a filename like 'peru.png', we need to handle it.
                // For simplicity in this demo, we might need to rely on the backend sending full URLs or handle local mapping if we kept local assets.
                // Assuming backend sends filenames and we map them or use them as URIs if they are URLs.
                // Let's assume for this integration the backend returns what we put in the DB.
                // Since we inserted filenames, we need a way to resolve them.
                // For now, I will use a placeholder or try to require if it matches known assets (difficult dynamically).
                // Better approach: Use the URLs from the DB if they were URLs, or just display the name if image fails.
                // I will use a placeholder image for now if it's just a filename to avoid crash, or try to use a base URL for images.
                foto: cat.image ? { uri: `http://localhost:3000/images/${cat.image}` } : null,
                productos: cat.productos.map((prod: any) => ({
                    ...prod,
                    foto: prod.image ? { uri: `http://localhost:3000/images/${prod.image}` } : null,
                    precio: `$${prod.price}`
                }))
            }));
            setCategorias(data);
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback to empty or error state
        } finally {
            setLoading(false);
        }
    };

    const renderCategoria = ({ item }: { item: any }) => (
        <View style={styles.categorySection}>
            <View style={[styles.categoryHeader, { backgroundColor: item.color || '#8B4513' }]}>
                <Text style={styles.categoryTitle}>{item.nombre || item.name}</Text>
                {/* Image handling might need adjustment based on actual data */}
            </View>
            <FlatList
                data={item.productos}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsList}
                keyExtractor={(prod, index) => index.toString()}
                renderItem={({ item: prod }) => (
                    <TouchableOpacity style={styles.productCard}>
                        {/* <Image source={prod.foto} style={styles.productImage} /> */}
                        <View style={[styles.productImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
                            <Text>Img</Text>
                        </View>
                        <Text style={styles.productName}>{prod.nombre || prod.name}</Text>
                        <Text style={styles.productPrice}>{prod.precio}</Text>
                        <TouchableOpacity style={[styles.addButton, { backgroundColor: item.color || '#8B4513' }]}>
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
            {/* Header */}
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
    categoryImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
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
});