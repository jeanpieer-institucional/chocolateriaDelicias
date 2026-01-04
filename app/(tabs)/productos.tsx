import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import AppHeader from '../../components/AppHeader';
import CategoryChip from '../../components/CategoryChip';
import ProductCard from '../../components/ProductCard';
import { Colors, Spacing, Typography } from '../../constants/DesignSystem';
import { getCategoryImage, getProductImage } from '../../constants/productImages';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { productService } from '../services/api';

export default function Productos() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('Todo');
    const [loading, setLoading] = useState(true);
    const [categoriesData, setCategoriesData] = useState<any[]>([]);
    const [filterCategories, setFilterCategories] = useState<string[]>(['Todo']);
    const { addToCart, cartItems } = useCart();
    const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await productService.getCategories();

            // Procesar datos de productos
            const data = response.data.map((cat: any) => ({
                ...cat,
                foto: getCategoryImage(cat.nombre || cat.name),
                productos: cat.productos.map((prod: any) => ({
                    ...prod,
                    foto: getProductImage(prod.name, prod.image),
                    precio: `S/ ${prod.price}`,
                    descripcion: prod.description || 'Delicioso chocolate',
                }))
            }));
            setCategoriesData(data);

            // Procesar nombres de categorías para filtros
            const rawCategories = response.data || [];
            const processedCategories = rawCategories.map((cat: any) => {
                const name = cat.name || cat.nombre || '';
                return name.split(' ')[0]; // Tomar solo la primera palabra
            });
            const uniqueCategories = ['Todo', ...new Set(processedCategories)] as string[];
            setFilterCategories(uniqueCategories);

        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const isFavorite = (id: number) => favorites.some(fav => fav.id === id);

    const toggleFavorite = (product: any) => {
        if (isFavorite(product.id)) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product);
        }
    };

    const getFilteredCategories = () => {
        if (selectedCategory === 'Todo') {
            return categoriesData;
        }
        return categoriesData.filter(cat =>
            (cat.nombre || cat.name).toLowerCase().includes(selectedCategory.toLowerCase())
        );
    };

    const getTotalItems = () => {
        if (!cartItems || !Array.isArray(cartItems)) return 0;
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    };

    const getTotalPrice = () => {
        if (!cartItems || !Array.isArray(cartItems)) return '0.00';
        return cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary.main} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Productos</Text>
            </View>

            {/* Chips de categorías */}
            <View style={styles.categoriesWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                >
                    {filterCategories.map((cat) => (
                        <CategoryChip
                            key={cat}
                            label={cat}
                            selected={selectedCategory === cat}
                            onPress={() => setSelectedCategory(cat)}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Lista de Productos */}
            <FlatList
                data={getFilteredCategories()}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: category }) => (
                    <View style={styles.categorySection}>
                        <Text style={styles.categoryTitle}>{category.nombre || category.name}</Text>
                        <FlatList
                            data={category.productos}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.productsScroll}
                            keyExtractor={(prod) => prod.id.toString()}
                            renderItem={({ item: product, index }) => (
                                <Animated.View
                                    entering={FadeInRight.delay(index * 100).springify()}
                                    style={{ marginRight: Spacing.md }}
                                >
                                    <ProductCard
                                        name={product.name}
                                        description={product.descripcion}
                                        price={product.precio}
                                        image={product.foto}
                                        isFavorite={isFavorite(product.id)}
                                        onFavoritePress={() => toggleFavorite(product)}
                                        onAddPress={() => addToCart(product)}
                                        onPress={() => router.push(`/producto/${product.id}`)}
                                    />
                                </Animated.View>
                            )}
                        />
                    </View>
                )}
            />

            {/* Floating Cart Button (si es necesario, aunque AppHeader ya tiene carrito) */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.dark.background,
    },
    header: {
        paddingHorizontal: Spacing.xl,
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: Typography.sizes.h2,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
    },
    categoriesWrapper: {
        marginBottom: Spacing.lg,
    },
    categoriesContainer: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.sm,
    },
    listContent: {
        paddingBottom: 100, // Espacio para el tab bar
    },
    categorySection: {
        marginBottom: Spacing.xl,
    },
    categoryTitle: {
        fontSize: Typography.sizes.h4,
        fontWeight: Typography.weights.semibold,
        color: Colors.text.primary,
        marginLeft: Spacing.xl,
        marginBottom: Spacing.md,
    },
    productsScroll: {
        paddingHorizontal: Spacing.xl,
    },
});
