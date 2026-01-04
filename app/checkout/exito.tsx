import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/DesignSystem';

export default function CheckoutSuccessScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const orderId = params.orderId as string;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Animated.View entering={ZoomIn.duration(600)} style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="checkmark" size={60} color={Colors.dark.background} />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.textContainer}>
                    <Text style={styles.title}>¡Pedido Confirmado!</Text>
                    <Text style={styles.subtitle}>
                        Tu pedido ha sido procesado exitosamente
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.orderInfo}>
                    <Text style={styles.orderLabel}>Número de Pedido</Text>
                    <Text style={styles.orderNumber}>#{orderId}</Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={24} color={Colors.text.primary} />
                    <Text style={styles.infoText}>
                        Recibirás una confirmación con los detalles de tu pedido.
                        Puedes revisar el estado en tu historial de pedidos.
                    </Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.actions}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.push(`/pedidos/${orderId}`)}
                        activeOpacity={0.9}
                    >
                        <Ionicons name="receipt-outline" size={22} color={Colors.dark.background} />
                        <Text style={styles.primaryButtonText}>Ver Pedido</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.push('/(tabs)/productos')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="cart-outline" size={22} color={Colors.primary.main} />
                        <Text style={styles.secondaryButtonText}>Seguir Comprando</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.tertiaryButton}
                        onPress={() => router.push('/(tabs)/inicio')}
                    >
                        <Text style={styles.tertiaryButtonText}>Volver al Inicio</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    iconContainer: {
        marginBottom: Spacing.xxl,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: BorderRadius.circle,
        backgroundColor: Colors.status.success,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.glow,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: Typography.sizes.h2,
        fontWeight: Typography.weights.extrabold,
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: Typography.sizes.body,
        color: Colors.text.secondary,
        textAlign: 'center',
        maxWidth: 250,
    },
    orderInfo: {
        backgroundColor: Colors.dark.card,
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.xxl,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        marginBottom: Spacing.xl,
        width: '100%',
        ...Shadows.medium,
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    orderLabel: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
        marginBottom: Spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    orderNumber: {
        fontSize: Typography.sizes.h1,
        fontWeight: Typography.weights.extrabold,
        color: Colors.primary.main,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.surface,
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.xxxl,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary.main,
        ...Shadows.small,
        width: '100%',
    },
    infoText: {
        flex: 1,
        marginLeft: Spacing.md,
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
        lineHeight: 20,
    },
    actions: {
        width: '100%',
        gap: Spacing.md,
    },
    primaryButton: {
        flexDirection: 'row',
        backgroundColor: Colors.primary.main,
        padding: Spacing.lg,
        borderRadius: BorderRadius.xxl,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        ...Shadows.glow,
    },
    primaryButtonText: {
        color: Colors.dark.background,
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.bold,
    },
    secondaryButton: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.surface,
        padding: Spacing.lg,
        borderRadius: BorderRadius.xxl,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        borderWidth: 2,
        borderColor: Colors.primary.main,
    },
    secondaryButtonText: {
        color: Colors.primary.main,
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.bold,
    },
    tertiaryButton: {
        padding: Spacing.md,
        alignItems: 'center',
    },
    tertiaryButtonText: {
        color: Colors.text.secondary,
        fontSize: Typography.sizes.bodySmall,
        textDecorationLine: 'underline',
    },
});
