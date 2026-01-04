import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AppHeader from '../../components/AppHeader';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/DesignSystem';
import CulqiPayment from '../components/CulqiPayment';
import { useAddress } from '../context/AddressContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';

export default function CheckoutScreen() {
    const router = useRouter();
    const { cartItems, total, clearCart } = useCart();
    const { addresses, selectedAddress, selectAddress, createAddress, loading: addressLoading } = useAddress();
    const { user, token } = useAuth();

    const [paymentMethod, setPaymentMethod] = useState<string>('cash');
    const [shippingCost] = useState<number>(5.00);
    const [notes, setNotes] = useState<string>('');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [showCulqiModal, setShowCulqiModal] = useState(false);

    const [newAddress, setNewAddress] = useState({
        name: user?.name || '',
        phone: '',
        address_line1: '',
        address_line2: '',
        is_default: false
    });

    const paymentMethods = [
        { id: 'cash', name: 'Efectivo contra entrega', icon: 'cash-outline' },
        { id: 'card', name: 'Tarjeta de crédito/débito', icon: 'card-outline' },
        { id: 'transfer', name: 'Transferencia bancaria', icon: 'swap-horizontal-outline' },
    ];

    const handleAddAddress = async () => {
        if (!newAddress.name || !newAddress.phone || !newAddress.address_line1) {
            Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
            return;
        }

        try {
            await createAddress(newAddress);
            setShowAddressModal(false);
            setNewAddress({
                name: user?.name || '',
                phone: '',
                address_line1: '',
                address_line2: '',
                is_default: false
            });
            Alert.alert('Éxito', 'Dirección agregada correctamente');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al agregar dirección');
        }
    };

    const handleCheckout = async () => {
        if (!selectedAddress) {
            Alert.alert('Error', 'Por favor selecciona una dirección de envío');
            return;
        }

        if (!paymentMethod) {
            Alert.alert('Error', 'Por favor selecciona un método de pago');
            return;
        }

        if (!token) {
            Alert.alert('Error', 'Debes iniciar sesión para continuar');
            return;
        }

        if (paymentMethod === 'card') {
            setShowCulqiModal(true);
            return;
        }

        await processOrder();
    };

    const handleCulqiSuccess = async (culqiToken: string) => {
        setShowCulqiModal(false);
        setProcessing(true);

        try {
            const items = cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }));

            const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://10.83.39.41:3000';

            const response = await fetch(`${apiUrl}/api/payments/charge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    token: culqiToken,
                    items,
                    addressId: selectedAddress!.id,
                    shippingCost,
                    notes: notes.trim() || null
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Error al procesar el pago');
            }

            clearCart();
            router.replace({
                pathname: '/checkout/exito',
                params: { orderId: data.orderId }
            });
        } catch (error: any) {
            Alert.alert('Error de Pago', error.message || 'No se pudo procesar el pago');
        } finally {
            setProcessing(false);
        }
    };

    const handleCulqiError = (error: string) => {
        setShowCulqiModal(false);
        Alert.alert('Error de Pago', error);
    };

    const processOrder = async () => {
        setProcessing(true);

        try {
            const items = cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }));

            const response = await orderService.createOrder(
                items,
                token!,
                selectedAddress!.id,
                paymentMethod,
                shippingCost,
                notes.trim() || undefined
            );

            clearCart();
            router.replace({
                pathname: '/checkout/exito',
                params: { orderId: response.data.orderId }
            });
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || error.message || 'Error al procesar el pedido');
        } finally {
            setProcessing(false);
        }
    };

    const finalTotal = total + shippingCost;

    if (!user) {
        return (
            <View style={styles.container}>
                <AppHeader />
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconCircle}>
                        <Ionicons name="lock-closed-outline" size={60} color={Colors.primary.main} />
                    </View>
                    <Text style={styles.emptyText}>Debes iniciar sesión</Text>
                    <Text style={styles.emptySubtext}>Para continuar con tu compra</Text>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => router.push('/(auth)/login')}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
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
                <Text style={styles.title}>Checkout</Text>
                <Text style={styles.subtitle}>{cartItems.length} productos</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Dirección de Envío */}
                <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="location-outline" size={22} color={Colors.primary.main} />
                        <Text style={styles.sectionTitle}>Dirección de Envío</Text>
                    </View>

                    {addressLoading ? (
                        <ActivityIndicator size="small" color={Colors.primary.main} />
                    ) : selectedAddress ? (
                        <View style={styles.selectedAddress}>
                            <View style={styles.addressInfo}>
                                <Text style={styles.addressName}>{selectedAddress.name}</Text>
                                <Text style={styles.addressPhone}>{selectedAddress.phone}</Text>
                                <Text style={styles.addressText}>{selectedAddress.address_line1}</Text>
                                {selectedAddress.address_line2 && (
                                    <Text style={styles.addressText}>{selectedAddress.address_line2}</Text>
                                )}
                            </View>
                            <TouchableOpacity
                                style={styles.changeButton}
                                onPress={() => setShowAddressModal(true)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.changeButtonText}>Cambiar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.addAddressButton}
                            onPress={() => setShowAddressModal(true)}
                            activeOpacity={0.9}
                        >
                            <Ionicons name="add-circle-outline" size={24} color={Colors.primary.main} />
                            <Text style={styles.addAddressText}>Agregar Dirección</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>

                {/* Método de Pago */}
                <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="card-outline" size={22} color={Colors.primary.main} />
                        <Text style={styles.sectionTitle}>Método de Pago</Text>
                    </View>

                    {paymentMethods.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={[
                                styles.paymentOption,
                                paymentMethod === method.id && styles.paymentOptionSelected
                            ]}
                            onPress={() => setPaymentMethod(method.id)}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name={method.icon as any}
                                size={22}
                                color={paymentMethod === method.id ? Colors.primary.main : Colors.text.secondary}
                            />
                            <Text
                                style={[
                                    styles.paymentText,
                                    paymentMethod === method.id && styles.paymentTextSelected
                                ]}
                            >
                                {method.name}
                            </Text>
                            {paymentMethod === method.id && (
                                <Ionicons name="checkmark-circle" size={22} color={Colors.primary.main} />
                            )}
                        </TouchableOpacity>
                    ))}
                </Animated.View>

                {/* Notas Adicionales */}
                <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="document-text-outline" size={22} color={Colors.primary.main} />
                        <Text style={styles.sectionTitle}>Notas (Opcional)</Text>
                    </View>
                    <TextInput
                        style={styles.notesInput}
                        placeholder="Instrucciones de entrega, preferencias, etc."
                        placeholderTextColor={Colors.text.hint}
                        multiline
                        numberOfLines={3}
                        value={notes}
                        onChangeText={setNotes}
                    />
                </Animated.View>

                {/* Resumen del Pedido */}
                <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal ({cartItems.length} items)</Text>
                        <Text style={styles.summaryValue}>S/ {total.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Envío</Text>
                        <Text style={styles.summaryValue}>S/ {shippingCost.toFixed(2)}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>S/ {finalTotal.toFixed(2)}</Text>
                    </View>
                </Animated.View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Botón de Confirmar */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.confirmButton, (processing || !selectedAddress) && styles.confirmButtonDisabled]}
                    onPress={handleCheckout}
                    disabled={processing || !selectedAddress}
                    activeOpacity={0.9}
                >
                    {processing ? (
                        <ActivityIndicator color={Colors.dark.background} />
                    ) : (
                        <>
                            <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
                            <Text style={styles.confirmButtonSubtext}>S/ {finalTotal.toFixed(2)}</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Modal de Direcciones */}
            <Modal
                visible={showAddressModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAddressModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar Dirección</Text>
                            <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                                <Ionicons name="close-circle" size={32} color={Colors.text.secondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                            {addresses.map((address) => (
                                <TouchableOpacity
                                    key={address.id}
                                    style={[
                                        styles.addressOption,
                                        selectedAddress?.id === address.id && styles.addressOptionSelected
                                    ]}
                                    onPress={() => {
                                        selectAddress(address);
                                        setShowAddressModal(false);
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.addressOptionInfo}>
                                        <Text style={styles.addressOptionName}>{address.name}</Text>
                                        <Text style={styles.addressOptionText}>{address.phone}</Text>
                                        <Text style={styles.addressOptionText}>{address.address_line1}</Text>
                                        {address.address_line2 && (
                                            <Text style={styles.addressOptionText}>{address.address_line2}</Text>
                                        )}
                                    </View>
                                    {selectedAddress?.id === address.id && (
                                        <Ionicons name="checkmark-circle" size={24} color={Colors.primary.main} />
                                    )}
                                </TouchableOpacity>
                            ))}

                            {/* Formulario para Nueva Dirección */}
                            <View style={styles.newAddressForm}>
                                <Text style={styles.formTitle}>Agregar Nueva Dirección</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Nombre del destinatario *"
                                    placeholderTextColor={Colors.text.hint}
                                    value={newAddress.name}
                                    onChangeText={(text) => setNewAddress({ ...newAddress, name: text })}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Teléfono *"
                                    placeholderTextColor={Colors.text.hint}
                                    keyboardType="phone-pad"
                                    value={newAddress.phone}
                                    onChangeText={(text) => setNewAddress({ ...newAddress, phone: text })}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Dirección *"
                                    placeholderTextColor={Colors.text.hint}
                                    value={newAddress.address_line1}
                                    onChangeText={(text) => setNewAddress({ ...newAddress, address_line1: text })}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Depto, piso, referencia (opcional)"
                                    placeholderTextColor={Colors.text.hint}
                                    value={newAddress.address_line2}
                                    onChangeText={(text) => setNewAddress({ ...newAddress, address_line2: text })}
                                />

                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={handleAddAddress}
                                    activeOpacity={0.9}
                                >
                                    <Text style={styles.addButtonText}>Agregar Dirección</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal de Culqi */}
            {user && (
                <CulqiPayment
                    visible={showCulqiModal}
                    amount={finalTotal}
                    email={user.email}
                    onSuccess={handleCulqiSuccess}
                    onError={handleCulqiError}
                    onClose={() => setShowCulqiModal(false)}
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
    content: {
        flex: 1,
    },
    section: {
        backgroundColor: Colors.dark.card,
        marginVertical: Spacing.sm,
        marginHorizontal: Spacing.xl,
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        ...Shadows.medium,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    sectionTitle: {
        fontSize: Typography.sizes.h5,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
    },
    selectedAddress: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    addressInfo: {
        flex: 1,
    },
    addressName: {
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
        marginBottom: 4,
    },
    addressPhone: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
        marginBottom: 4,
    },
    addressText: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
        lineHeight: Typography.lineHeights.normal * Typography.sizes.bodySmall,
    },
    changeButton: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        backgroundColor: Colors.primary.main + '20',
        borderRadius: BorderRadius.md,
    },
    changeButtonText: {
        color: Colors.primary.main,
        fontWeight: Typography.weights.semibold,
        fontSize: Typography.sizes.bodySmall,
    },
    addAddressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.lg,
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 2,
        borderColor: Colors.border.default,
        borderStyle: 'dashed',
        gap: Spacing.sm,
    },
    addAddressText: {
        fontSize: Typography.sizes.body,
        color: Colors.primary.main,
        fontWeight: Typography.weights.semibold,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        marginBottom: Spacing.sm,
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 2,
        borderColor: 'transparent',
        gap: Spacing.md,
    },
    paymentOptionSelected: {
        backgroundColor: Colors.primary.main + '15',
        borderColor: Colors.primary.main,
    },
    paymentText: {
        flex: 1,
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
    },
    paymentTextSelected: {
        fontWeight: Typography.weights.semibold,
        color: Colors.text.primary,
    },
    notesInput: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.primary,
        textAlignVertical: 'top',
        minHeight: 80,
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    summaryLabel: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
    },
    summaryValue: {
        fontSize: Typography.sizes.bodySmall,
        fontWeight: Typography.weights.semibold,
        color: Colors.text.primary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border.default,
        marginVertical: Spacing.md,
    },
    totalLabel: {
        fontSize: Typography.sizes.h5,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
    },
    totalValue: {
        fontSize: Typography.sizes.h4,
        fontWeight: Typography.weights.extrabold,
        color: Colors.primary.main,
    },
    footer: {
        padding: Spacing.xl,
        backgroundColor: Colors.dark.card,
        borderTopWidth: 1,
        borderTopColor: Colors.border.default,
        ...Shadows.large,
    },
    confirmButton: {
        backgroundColor: Colors.primary.main,
        padding: Spacing.lg,
        borderRadius: BorderRadius.xxxl,
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        backgroundColor: Colors.text.disabled,
    },
    confirmButtonText: {
        color: Colors.dark.background,
        fontSize: Typography.sizes.h5,
        fontWeight: Typography.weights.bold,
    },
    confirmButtonSubtext: {
        color: Colors.dark.background,
        fontSize: Typography.sizes.bodySmall,
        marginTop: 4,
        opacity: 0.9,
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
    },
    emptySubtext: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginBottom: Spacing.xxl,
    },
    loginButton: {
        backgroundColor: Colors.primary.main,
        paddingHorizontal: Spacing.xxl,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.xxxl,
    },
    loginButtonText: {
        color: Colors.dark.background,
        fontWeight: Typography.weights.bold,
        fontSize: Typography.sizes.body,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.dark.card,
        borderTopLeftRadius: BorderRadius.xxl,
        borderTopRightRadius: BorderRadius.xxl,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.default,
    },
    modalTitle: {
        fontSize: Typography.sizes.h4,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
    },
    modalScroll: {
        padding: Spacing.xl,
    },
    addressOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: Spacing.lg,
        marginBottom: Spacing.sm,
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    addressOptionSelected: {
        backgroundColor: Colors.primary.main + '15',
        borderColor: Colors.primary.main,
    },
    addressOptionInfo: {
        flex: 1,
    },
    addressOptionName: {
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
        marginBottom: 4,
    },
    addressOptionText: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
        lineHeight: Typography.lineHeights.normal * Typography.sizes.bodySmall,
    },
    newAddressForm: {
        marginTop: Spacing.xl,
        paddingTop: Spacing.xl,
        borderTopWidth: 1,
        borderTopColor: Colors.border.default,
    },
    formTitle: {
        fontSize: Typography.sizes.h5,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
        marginBottom: Spacing.lg,
    },
    input: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.primary,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    addButton: {
        backgroundColor: Colors.primary.main,
        padding: Spacing.lg,
        borderRadius: BorderRadius.xxxl,
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    addButtonText: {
        color: Colors.dark.background,
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.bold,
    },
});
