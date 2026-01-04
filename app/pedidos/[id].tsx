import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AppHeader from '../../components/AppHeader';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/DesignSystem';
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
            case 'completed': return Colors.status.success;
            case 'pending': return Colors.status.warning;
            case 'cancelled': return Colors.status.error;
            case 'processing': return Colors.status.info;
            default: return Colors.text.secondary;
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary.main} />
                <Text style={styles.loadingText}>Cargando detalles...</Text>
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.container}>
                <AppHeader />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color={Colors.status.error} />
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

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>Detalles del Pedido #{id}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.statusCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="information-circle-outline" size={20} color={Colors.primary.main} />
                        <Text style={styles.cardTitle}>Información</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Estado</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                                {order.status}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Fecha</Text>
                        <Text style={styles.value}>
                            {new Date(order.created_at).toLocaleDateString()}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Hora</Text>
                        <Text style={styles.value}>
                            {new Date(order.created_at).toLocaleTimeString()}
                        </Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.productsSection}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="cube-outline" size={20} color={Colors.primary.main} />
                        <Text style={styles.cardTitle}>Productos</Text>
                    </View>
                    <View style={styles.divider} />

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
                                    S/ {parseFloat(item.price).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.summaryCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="receipt-outline" size={20} color={Colors.primary.main} />
                        <Text style={styles.cardTitle}>Resumen de Pago</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>S/ {parseFloat(order.total).toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Envío</Text>
                        <Text style={styles.summaryValue}>S/ 0.00</Text>
                    </View>

                    <View style={styles.dashDivider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Pagado</Text>
                        <Text style={styles.totalValue}>S/ {parseFloat(order.total).toFixed(2)}</Text>
                    </View>
                </Animated.View>

                {/* Tracking Steps Visual */}
                <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.trackingCard}>
                    <Text style={styles.cardTitle}>Seguimiento</Text>
                    <View style={styles.divider} />

                    <View style={styles.timeline}>
                        <View style={styles.timelineItem}>
                            <View style={[styles.timelineDot, { backgroundColor: Colors.primary.main }]} />
                            <View style={[styles.timelineLine, { backgroundColor: Colors.primary.main }]} />
                            <Text style={[styles.timelineText, { color: Colors.primary.main }]}>Pedido Recibido</Text>
                        </View>
                        <View style={styles.timelineItem}>
                            <View style={[styles.timelineDot, { backgroundColor: order.status !== 'pending' ? Colors.primary.main : Colors.dark.surface, borderColor: Colors.primary.main, borderWidth: 2 }]} />
                            <View style={[styles.timelineLine, { backgroundColor: order.status === 'completed' ? Colors.primary.main : Colors.dark.surface }]} />
                            <Text style={[styles.timelineText, { color: order.status !== 'pending' ? Colors.text.primary : Colors.text.disabled }]}>Procesando</Text>
                        </View>
                        <View style={styles.timelineItem}>
                            <View style={[styles.timelineDot, { backgroundColor: order.status === 'completed' ? Colors.primary.main : Colors.dark.surface, borderColor: Colors.primary.main, borderWidth: 2 }]} />
                            <Text style={[styles.timelineText, { color: order.status === 'completed' ? Colors.text.primary : Colors.text.disabled }]}>Entregado</Text>
                        </View>
                    </View>
                </Animated.View>

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
    loadingText: {
        marginTop: Spacing.md,
        color: Colors.text.secondary,
        fontSize: Typography.sizes.bodySmall,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
    },
    headerBackButton: {
        marginRight: Spacing.md,
        padding: Spacing.xs,
    },
    title: {
        fontSize: Typography.sizes.h4,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
    },
    scrollContent: {
        padding: Spacing.xl,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    cardTitle: {
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border.default,
        marginBottom: Spacing.md,
    },
    dashDivider: {
        height: 1,
        borderWidth: 1,
        borderColor: Colors.border.default,
        borderStyle: 'dashed',
        marginVertical: Spacing.md,
    },
    statusCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        ...Shadows.medium,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    label: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
    },
    value: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.primary,
        fontWeight: Typography.weights.semibold,
    },
    statusBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
    },
    statusText: {
        fontWeight: Typography.weights.bold,
        fontSize: Typography.sizes.caption,
        textTransform: 'uppercase',
    },
    productsSection: {
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        ...Shadows.medium,
    },
    productsList: {
        gap: Spacing.md,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productInfo: {
        flex: 1,
        marginRight: Spacing.md,
    },
    productName: {
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.semibold,
        color: Colors.text.primary,
        marginBottom: 2,
    },
    productQuantity: {
        fontSize: Typography.sizes.caption,
        color: Colors.text.secondary,
    },
    productPrice: {
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.bold,
        color: Colors.primary.main,
    },
    summaryCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        ...Shadows.medium,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xs,
    },
    summaryLabel: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
    },
    summaryValue: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.primary,
        fontWeight: Typography.weights.semibold,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
    },
    totalValue: {
        fontSize: Typography.sizes.h4,
        fontWeight: Typography.weights.extrabold,
        color: Colors.primary.main,
    },
    trackingCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        ...Shadows.medium,
    },
    timeline: {
        marginLeft: Spacing.sm,
    },
    timelineItem: {
        marginTop: Spacing.xs,
        marginBottom: Spacing.xl,
        position: 'relative',
        paddingLeft: Spacing.xl,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: BorderRadius.circle,
        position: 'absolute',
        left: 0,
        top: 4,
        zIndex: 1,
    },
    timelineLine: {
        width: 2,
        height: 40,
        position: 'absolute',
        left: 5,
        top: 16,
        zIndex: 0,
    },
    timelineText: {
        fontSize: Typography.sizes.bodySmall,
        fontWeight: Typography.weights.semibold,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xxxl,
    },
    errorText: {
        fontSize: Typography.sizes.h5,
        color: Colors.text.secondary,
        marginVertical: Spacing.lg,
        fontWeight: Typography.weights.medium,
    },
    backButton: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.primary.main,
        borderRadius: BorderRadius.xxxl,
    },
    backButtonText: {
        color: Colors.dark.background,
        fontWeight: Typography.weights.bold,
        fontSize: Typography.sizes.body,
    },
});
