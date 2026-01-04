import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AppHeader from '../../components/AppHeader';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/DesignSystem';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

export default function OrderHistory() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (token) {
            loadOrders();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadOrders = async () => {
        try {
            const response = await orderService.getOrders(token!);
            setOrders(response.data);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'entregado':
                return Colors.status.success;
            case 'pending':
            case 'pendiente':
                return Colors.status.warning;
            case 'cancelled':
            case 'cancelado':
                return Colors.status.error;
            case 'processing':
            case 'en proceso':
                return Colors.status.info;
            default:
                return Colors.text.secondary;
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'Entregado';
            case 'pending': return 'Pendiente';
            case 'cancelled': return 'Cancelado';
            case 'processing': return 'En Proceso';
            default: return status;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/pedidos/${item.id}`)}
                activeOpacity={0.9}
            >
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.orderId}>Pedido #{item.id}</Text>
                        <Text style={styles.dateText}>{formatDate(item.created_at || Date.now())}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status || 'pending') + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(item.status || 'pending') }]}>
                            {getStatusText(item.status || 'pending')}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardBody}>
                    <View style={styles.row}>
                        <Ionicons name="cube-outline" size={18} color={Colors.text.secondary} />
                        <Text style={styles.itemsText}>
                            {item.items ? `${item.items.length} productos` : 'Ver detalles'}
                        </Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalText}>S/ {parseFloat(item.total || 0).toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.viewDetailsRow}>
                    <Text style={styles.viewDetailsText}>Ver detalles</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.primary.main} />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <AppHeader />

            {/* Título */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Mis Pedidos</Text>
                {!loading && <Text style={styles.subtitle}>{orders.length} pedidos</Text>}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                    <Text style={styles.loadingText}>Cargando pedidos...</Text>
                </View>
            ) : orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconCircle}>
                        <Ionicons name="receipt-outline" size={60} color={Colors.primary.main} />
                    </View>
                    <Text style={styles.emptyText}>No tienes pedidos aún</Text>
                    <Text style={styles.emptySubtext}>
                        Realiza tu primera compra y aparecerá aquí
                    </Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => router.push('/(tabs)/productos')}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.shopButtonText}>Ir a Comprar</Text>
                        <Ionicons name="arrow-forward" size={20} color={Colors.dark.background} />
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        fontSize: Typography.sizes.caption,
        color: Colors.text.secondary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: Spacing.lg,
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
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
    listContent: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xxxl,
    },
    card: {
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        ...Shadows.medium,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    orderId: {
        fontSize: Typography.sizes.body,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
        marginBottom: 2,
    },
    dateText: {
        fontSize: Typography.sizes.caption,
        color: Colors.text.secondary,
    },
    statusBadge: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.xl,
    },
    statusText: {
        fontSize: Typography.sizes.caption,
        fontWeight: Typography.weights.semibold,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border.default,
        marginVertical: Spacing.md,
    },
    cardBody: {
        marginBottom: Spacing.md,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    itemsText: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
    },
    totalText: {
        fontSize: Typography.sizes.h5,
        color: Colors.primary.main,
        fontWeight: Typography.weights.bold,
    },
    viewDetailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: Spacing.xs,
    },
    viewDetailsText: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.primary.main,
        fontWeight: Typography.weights.semibold,
    },
});
