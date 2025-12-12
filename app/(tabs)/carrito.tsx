import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../context/CartContext';

export default function CartScreen() {
    const { cartItems, total, removeFromCart, updateQuantity } = useCart();
    const router = useRouter();

    if (cartItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="cart-outline" size={80} color="#D7CCC8" />
                <Text style={styles.emptyText}>Tu carrito está vacío</Text>
                <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/(tabs)/productos')}>
                    <Text style={styles.shopButtonText}>Ir a comprar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mi Carrito</Text>
                <Text style={styles.itemCount}>{cartItems.length} items</Text>
            </View>

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Image source={{ uri: item.image_url }} style={styles.itemImage} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>S/ {parseFloat(item.price).toFixed(2)}</Text>

                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                                    style={styles.quantityButton}
                                >
                                    <Ionicons name="remove" size={16} color="#5D4037" />
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                                    style={styles.quantityButton}
                                >
                                    <Ionicons name="add" size={16} color="#5D4037" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => removeFromCart(item.id)}
                            style={styles.removeButton}
                        >
                            <Ionicons name="trash-outline" size={20} color="#FF5252" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalAmount}>S/ {total.toFixed(2)}</Text>
                </View>
                <Link href="/checkout" asChild>
                    <TouchableOpacity style={styles.checkoutButton}>
                        <Text style={styles.checkoutButtonText}>Pagar Ahora</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F0',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF8F0',
    },
    emptyText: {
        fontSize: 18,
        color: '#8D6E63',
        marginTop: 15,
        marginBottom: 20,
    },
    shopButton: {
        backgroundColor: '#D4AF37',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    shopButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    header: {
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEBE9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5D4037',
    },
    itemCount: {
        fontSize: 14,
        color: '#8D6E63',
    },
    listContent: {
        padding: 15,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 10,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 15,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3E2723',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#D4AF37',
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5E6D8',
        borderRadius: 20,
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    quantityButton: {
        padding: 4,
    },
    quantityText: {
        marginHorizontal: 12,
        fontSize: 14,
        fontWeight: '600',
        color: '#5D4037',
    },
    removeButton: {
        padding: 10,
    },
    footer: {
        backgroundColor: '#FFF',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EFEBE9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    totalLabel: {
        fontSize: 18,
        color: '#8D6E63',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5D4037',
    },
    checkoutButton: {
        backgroundColor: '#8B4513',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
