import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AppHeader from '../../components/AppHeader';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/DesignSystem';
import { getProductImage } from '../../constants/productImages';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { productService } from '../services/api';

export default function ProductDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

    useEffect(() => {
        if (id) {
            loadProduct();
        }
    }, [id]);

    const loadProduct = async () => {
        try {
            // Try to fetch from API first
            const response = await productService.getProductById(Number(id));
            const prod = response.data;

            // Format product data
            setProduct({
                ...prod,
                foto: getProductImage(prod.name, prod.image),
                price: parseFloat(prod.price),
                description: prod.description || 'Una deliciosa experiencia de chocolate premium elaborado con los mejores cacaos peruanos.',
            });
        } catch (error) {
            console.error('Error loading product:', error);
            // Fallback or error handling
        } finally {
            setLoading(false);
        }
    };

    const isFavorite = (productId: number) => favorites.some(fav => fav.id === productId);

    const toggleFavorite = () => {
        if (!product) return;

        if (isFavorite(product.id)) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, quantity);
        router.back();
    };

    const incrementQuantity = () => setQuantity(q => q + 1);
    const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary.main} />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.container}>
                <AppHeader />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Producto no encontrado</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <Animated.View entering={FadeInDown.duration(600)} style={styles.imageContainer}>
                    <Image source={product.foto} style={styles.image} resizeMode="cover" />
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={toggleFavorite}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name={isFavorite(product.id) ? "heart" : "heart-outline"}
                            size={28}
                            color={isFavorite(product.id) ? Colors.status.error : Colors.primary.main}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.backIcon}
                        onPress={() => router.back()}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="arrow-back" size={24} color={Colors.dark.background} />
                    </TouchableOpacity>
                </Animated.View>

                {/* Product Info */}
                <View style={styles.infoContainer}>
                    <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                        <View style={styles.headerRow}>
                            <Text style={styles.name}>{product.name}</Text>
                            <Text style={styles.price}>S/ {product.price.toFixed(2)}</Text>
                        </View>

                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={16} color={Colors.status.warning} />
                            <Text style={styles.ratingText}>4.8 (120 reviews)</Text>
                        </View>

                        <Text style={styles.descriptionLabel}>Descripción</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </Animated.View>

                    {/* Quantity Selector */}
                    <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.quantityContainer}>
                        <Text style={styles.quantityLabel}>Cantidad</Text>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
                                <Ionicons name="remove" size={24} color={Colors.primary.main} />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
                                <Ionicons name="add" size={24} color={Colors.primary.main} />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Add to Cart Button */}
                    <Animated.View entering={FadeInDown.delay(300).duration(600)}>
                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={handleAddToCart}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.addToCartText}>Agregar al Carrito</Text>
                            <View style={styles.priceTag}>
                                <Text style={styles.priceTagText}>S/ {(product.price * quantity).toFixed(2)}</Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <View style={{ height: Spacing.xxxl }} />
            </ScrollView>
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
    scrollContent: {
        paddingBottom: Spacing.xl,
    },
    imageContainer: {
        width: '100%',
        height: 350,
        backgroundColor: Colors.dark.surface,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    backIcon: {
        position: 'absolute',
        top: Spacing.lg,
        left: Spacing.lg,
        width: 40,
        height: 40,
        borderRadius: BorderRadius.circle,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteButton: {
        position: 'absolute',
        bottom: -20,
        right: Spacing.xl,
        width: 50,
        height: 50,
        borderRadius: BorderRadius.circle,
        backgroundColor: Colors.dark.card,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.medium,
        zIndex: 10,
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    infoContainer: {
        flex: 1,
        padding: Spacing.xl,
        marginTop: Spacing.sm,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.xs,
    },
    name: {
        flex: 1,
        fontSize: Typography.sizes.h3,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
        marginRight: Spacing.md,
    },
    price: {
        fontSize: Typography.sizes.h4,
        fontWeight: Typography.weights.extrabold,
        color: Colors.primary.main,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    ratingText: {
        marginLeft: Spacing.xs,
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
    },
    descriptionLabel: {
        fontSize: Typography.sizes.h5,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
    },
    description: {
        fontSize: Typography.sizes.body,
        color: Colors.text.secondary,
        lineHeight: 24,
        marginBottom: Spacing.xl,
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
        backgroundColor: Colors.dark.card,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    quantityLabel: {
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.semibold,
        color: Colors.text.primary,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.circle,
        backgroundColor: Colors.dark.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    quantityText: {
        fontSize: Typography.sizes.h5,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
        width: 30,
        textAlign: 'center',
    },
    addToCartButton: {
        flexDirection: 'row',
        backgroundColor: Colors.primary.main,
        padding: Spacing.lg,
        borderRadius: BorderRadius.xxxl,
        alignItems: 'center',
        justifyContent: 'space-between',
        ...Shadows.glow,
    },
    addToCartText: {
        color: Colors.dark.background,
        fontSize: Typography.sizes.h5,
        fontWeight: Typography.weights.bold,
        marginLeft: Spacing.md,
    },
    priceTag: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.xl,
    },
    priceTagText: {
        color: Colors.dark.background,
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.bold,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    errorText: {
        fontSize: Typography.sizes.h5,
        color: Colors.text.secondary,
        marginBottom: Spacing.lg,
    },
    backButton: {
        backgroundColor: Colors.primary.main,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.xxxl,
    },
    backButtonText: {
        color: Colors.dark.background,
        fontWeight: Typography.weights.bold,
    },
});
