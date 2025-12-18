import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { orderService } from '../services/api';

export default function OrderHistory() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const router = useRouter();
    const { colors } = useTheme();

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
                return '#4CAF50';
            case 'pending':
            case 'pendiente':
                return '#FF9800';
            case 'cancelled':
            case 'cancelado':
                return '#F44336';
            default:
                return '#8D6E63';
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'Entregado';
            case 'pending': return 'Pendiente';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() => router.push(`/pedidos/${item.id}`)}
        >
            <View style={[styles.cardHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.orderId, { color: colors.text }]}>Pedido #{item.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status || 'pending') }]}>
                    <Text style={styles.statusText}>{getStatusText(item.status || 'pending')}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.row}>
                    <Ionicons name="calendar-outline" size={16} color={colors.tabIconDefault} />
                    <Text style={[styles.dateText, { color: colors.tabIconDefault }]}>
                        {new Date(item.created_at || Date.now()).toLocaleDateString()}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Ionicons name="cash-outline" size={16} color={colors.tabIconDefault} />
                    <Text style={[styles.totalText, { color: colors.primary }]}>S/ {item.total}</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <Text style={[styles.itemsText, { color: colors.tabIconDefault }]}>
                    {item.items ? `${item.items.length} productos` : 'Ver detalles'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.tabIconDefault} />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.title, { color: colors.text }]}>Mis Pedidos 📦</Text>
                    <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>Historial de compras</Text>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
            ) : orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={80} color={colors.tabIconDefault} />
                    <Text style={[styles.emptyText, { color: colors.text }]}>No tienes pedidos aún</Text>
                    <Text style={[styles.emptySubtext, { color: colors.tabIconDefault }]}>Tus compras aparecerán aquí</Text>
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
        backgroundColor: '#FFF8F0',
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 60, //Separación con el header de la ventana de pedidos
        backgroundColor: '#FFF',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5D4037',
    },
    subtitle: {
        fontSize: 14,
        color: '#8D6E63',
    },
    listContent: {
        padding: 15,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F5E6D8',
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5D4037',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardBody: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    dateText: {
        marginLeft: 8,
        color: '#8D6E63',
        fontSize: 14,
    },
    totalText: {
        marginLeft: 8,
        color: '#5D4037',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemsText: {
        color: '#8D6E63',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#8D6E63',
        marginTop: 20,
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#A1887F',
        textAlign: 'center',
    },
});
