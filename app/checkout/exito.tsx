import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CheckoutSuccessScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const orderId = params.orderId as string;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-circle" size={120} color="#4CAF50" />
                </View>

                <Text style={styles.title}>¡Pedido Confirmado!</Text>
                <Text style={styles.subtitle}>
                    Tu pedido ha sido procesado exitosamente
                </Text>

                <View style={styles.orderInfo}>
                    <Text style={styles.orderLabel}>Número de Pedido</Text>
                    <Text style={styles.orderNumber}>#{orderId}</Text>
                </View>

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={24} color="#8B4513" />
                    <Text style={styles.infoText}>
                        Recibirás una confirmación con los detalles de tu pedido.
                        Puedes revisar el estado en tu historial de pedidos.
                    </Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.push(`/pedidos/${orderId}`)}
                    >
                        <Ionicons name="receipt-outline" size={20} color="#FFF" />
                        <Text style={styles.primaryButtonText}>Ver Pedido</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.push('/(tabs)/productos')}
                    >
                        <Ionicons name="cart-outline" size={20} color="#8B4513" />
                        <Text style={styles.secondaryButtonText}>Seguir Comprando</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.tertiaryButton}
                        onPress={() => router.push('/(tabs)/inicio')}
                    >
                        <Text style={styles.tertiaryButtonText}>Volver al Inicio</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F0',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    iconContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3E2723',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#8D6E63',
        textAlign: 'center',
        marginBottom: 30,
    },
    orderInfo: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderLabel: {
        fontSize: 14,
        color: '#8D6E63',
        marginBottom: 5,
    },
    orderNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#8B4513',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#FFF8E1',
        padding: 15,
        borderRadius: 8,
        marginBottom: 30,
        borderLeftWidth: 4,
        borderLeftColor: '#8B4513',
    },
    infoText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#5D4037',
        lineHeight: 20,
    },
    actions: {
        width: '100%',
        gap: 12,
    },
    primaryButton: {
        flexDirection: 'row',
        backgroundColor: '#8B4513',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 2,
        borderColor: '#8B4513',
    },
    secondaryButtonText: {
        color: '#8B4513',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tertiaryButton: {
        padding: 12,
        alignItems: 'center',
    },
    tertiaryButtonText: {
        color: '#8D6E63',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
