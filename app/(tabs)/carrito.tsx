import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AppHeader from '../../components/AppHeader';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/DesignSystem';
import { useCart } from '../context/CartContext';

export default function CartScreen() {
    const { cartItems, total, removeFromCart, updateQuantity } = useCart();
    const router = useRouter();

    if (cartItems.length === 0) {
        return (
            <View style={styles.container}>
                <AppHeader />
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconCircle}>
                        <Ionicons name="cart-outline" size={60} color={Colors.primary.main} />
                    </View>
                    <Text style={styles.emptyText}>Tu carrito está vacío</Text>
                    <Text style={styles.emptySubtext}>
                        Agrega productos para comenzar tu compra
                    </Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => router.push('/(tabs)/productos')}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.shopButtonText}>Explorar Productos</Text>
                        <Ionicons name="arrow-forward" size={20} color={Colors.dark.background} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader />

            {/* Título */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Mi Carrito</Text>
                <Text style={styles.subtitle}>
                    {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
                </Text>
            </View>

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
                        <View style={styles.cartItem}>
                            <Image source={item.image_url} style={styles.itemImage} resizeMode="cover" />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>S/ {parseFloat(item.price).toFixed(2)}</Text>

                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity
                                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                                        style={styles.quantityButton}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="remove" size={18} color={Colors.text.primary} />
                                    </TouchableOpacity>
                                    <Text style={styles.quantityText}>{item.quantity}</Text>
                                    <TouchableOpacity
                                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                                        style={styles.quantityButton}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="add" size={18} color={Colors.text.primary} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => removeFromCart(item.id)}
                                style={styles.removeButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="trash-outline" size={20} color={Colors.status.error} />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}
            />

            {/* Footer con total y botón de pago */}
            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Subtotal</Text>
                    <Text style={styles.totalValue}>S/ {total.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Envío</Text>
                    <Text style={styles.totalValue}>Gratis</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                    <Text style={styles.grandTotalLabel}>Total</Text>
                    <Text style={styles.grandTotalValue}>S/ {total.toFixed(2)}</Text>
                </View>
                <Link href="/checkout" asChild>
                    <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.9}>
                        <Text style={styles.checkoutButtonText}>Proceder al Pago</Text>
                        <Ionicons name="arrow-forward" size={20} color={Colors.dark.background} />
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    titleContainer: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
    },
    title: {
        fontSize: Typography.sizes.h3,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
    },
    listContent: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: 200, // Space for footer
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        alignItems: 'center',
        ...Shadows.medium,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.dark.surface,
    },
    itemDetails: {
        flex: 1,
        marginLeft: Spacing.lg,
    },
    itemName: {
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.semibold,
        color: Colors.text.primary,
        marginBottom: Spacing.xs,
    },
    itemPrice: {
        fontSize: Typography.sizes.h5,
        fontWeight: Typography.weights.bold,
        color: Colors.primary.main,
        marginBottom: Spacing.sm,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.xl,
        alignSelf: 'flex-start',
        paddingHorizontal: Spacing.xs,
    },
    quantityButton: {
        padding: Spacing.sm,
    },
    quantityText: {
        marginHorizontal: Spacing.md,
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.semibold,
        color: Colors.text.primary,
        minWidth: 24,
        textAlign: 'center',
    },
    removeButton: {
        padding: Spacing.sm,
        backgroundColor: Colors.status.error + '20',
        borderRadius: BorderRadius.circle,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xxxl,
    },
    emptyIconCircle: {
        width: 120,
        height: 120,
        borderRadius: BorderRadius.circle,
        backgroundColor: Colors.primary.main + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    emptyText: {
        fontSize: Typography.sizes.h4,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginBottom: Spacing.xxl,
        lineHeight: Typography.lineHeights.relaxed * Typography.sizes.bodySmall,
    },
    shopButton: {
        backgroundColor: Colors.primary.main,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.xxl,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.xxxl,
        gap: Spacing.sm,
    },
    shopButtonText: {
        color: Colors.dark.background,
        fontWeight: Typography.weights.bold,
        fontSize: Typography.sizes.body,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.dark.card,
        padding: Spacing.xl,
        borderTopWidth: 1,
        borderTopColor: Colors.border.default,
        ...Shadows.large,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    totalLabel: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
    },
    totalValue: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.primary,
        fontWeight: Typography.weights.medium,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border.default,
        marginVertical: Spacing.md,
    },
    grandTotalLabel: {
        fontSize: Typography.sizes.h5,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
    },
    grandTotalValue: {
        fontSize: Typography.sizes.h4,
        color: Colors.primary.main,
        fontWeight: Typography.weights.extrabold,
    },
    checkoutButton: {
        backgroundColor: Colors.primary.main,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.xxxl,
        marginTop: Spacing.lg,
        gap: Spacing.sm,
    },
    checkoutButtonText: {
        color: Colors.dark.background,
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.bold,
    },
});
