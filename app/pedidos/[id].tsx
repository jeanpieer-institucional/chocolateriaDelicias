import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

export default function OrderDetails() {
    const { id } = useLocalSearchParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (token && id) {
            loadOrderDetails();
        }
    }, [token, id]);

    const loadOrderDetails = async () => {
        try {
            const response = await orderService.getOrderById(Number(id), token!);
            setOrder(response.data);
        } catch (error) {
            console.error('Error loading order details:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return '#4CAF50';
            case 'pending': return '#FF9800';
            case 'cancelled': return '#F44336';
            default: return '#8D6E63';
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8B4513" />
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.container}>
                <AppHeader />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Pedido no encontrado</Text>
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
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
                        <Ionicons name="arrow-back" size={24} color="#5D4037" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Pedido #{order.id}</Text>
                </View>

                <View style={styles.statusCard}>
                    <View style={styles.statusRow}>
                        <Text style={styles.label}>Estado:</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                            <Text style={styles.statusText}>{order.status}</Text>
                        </View>
                    </View>
                    <View style={styles.statusRow}>
                        <Text style={styles.label}>Fecha:</Text>
                        <Text style={styles.value}>
                            {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Productos</Text>
                <View style={styles.productsList}>
                    {order.items?.map((item: any, index: number) => (
                        <View key={index} style={styles.productItem}>
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>
                                    {item.product?.name || item.product_name || 'Producto'}
                                </Text>
                                <Text style={styles.productQuantity}>Cantidad: {item.quantity}</Text>
                            </View>
                            <Text style={styles.productPrice}>
                                S/ {item.price}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>S/ {order.total}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Envío</Text>
                        <Text style={styles.summaryValue}>S/ 0.00</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>S/ {order.total}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F0',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF8F0',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerBackButton: {
        marginRight: 15,
        padding: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5D4037',
    },
    statusCard: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#8D6E63',
        fontWeight: '500',
    },
    value: {
        fontSize: 16,
        color: '#5D4037',
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: 15,
    },
    productsList: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F5E6D8',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#5D4037',
        marginBottom: 4,
    },
    productQuantity: {
        fontSize: 14,
        color: '#8D6E63',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5D4037',
    },
    summaryCard: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#8D6E63',
    },
    summaryValue: {
        fontSize: 16,
        color: '#5D4037',
        fontWeight: '600',
    },
    totalRow: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F5E6D8',
        marginBottom: 0,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5D4037',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8B4513',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: '#8D6E63',
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
        backgroundColor: '#8B4513',
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});
