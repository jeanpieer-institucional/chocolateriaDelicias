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
    const [shippingCost] = useState<number>(5.00); // Costo fijo de envío
    const [notes, setNotes] = useState<string>('');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [showCulqiModal, setShowCulqiModal] = useState(false);

    // Form state for new address
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

        // Si el método de pago es tarjeta, abrir Culqi
        if (paymentMethod === 'card') {
            setShowCulqiModal(true);
            return;
        }

        // Para otros métodos de pago (efectivo, transferencia)
        await processOrder();
    };

    const handleCulqiSuccess = async (culqiToken: string) => {
        setShowCulqiModal(false);
        setProcessing(true);

        try {
            console.log('Processing payment with Culqi token:', culqiToken);

            const items = cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }));

            const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://10.83.39.41:3000';
            console.log('Sending payment request to:', `${apiUrl}/api/payments/charge`);

            // Procesar pago con Culqi
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
            console.log('Payment response:', data);

            if (!response.ok) {
                const errorMsg = data.error || data.message || 'Error al procesar el pago';
                console.error('Payment failed:', errorMsg);
                throw new Error(errorMsg);
            }

            // Clear cart and navigate to success screen
            clearCart();
            router.replace({
                pathname: '/checkout/exito',
                params: { orderId: data.orderId }
            });
        } catch (error: any) {
            console.error('Payment error:', error);
            Alert.alert(
                'Error de Pago',
                error.message || 'No se pudo procesar el pago. Por favor, verifica tu conexión e intenta nuevamente.'
            );
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

            // Clear cart and navigate to success screen
            clearCart();
            router.replace({
                pathname: '/checkout/exito',
                params: { orderId: response.data.orderId }
            });
        } catch (error: any) {
            console.error('Checkout error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error al procesar el pedido';
            Alert.alert('Error', errorMessage);
        } finally {
            setProcessing(false);
        }
    };

    const finalTotal = total + shippingCost;

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Debes iniciar sesión para continuar</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#5D4037" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Dirección de Envío */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="location-outline" size={24} color="#8B4513" />
                        <Text style={styles.sectionTitle}>Dirección de Envío</Text>
                    </View>

                    {addressLoading ? (
                        <ActivityIndicator size="small" color="#8B4513" />
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
                            >
                                <Text style={styles.changeButtonText}>Cambiar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.addAddressButton}
                            onPress={() => setShowAddressModal(true)}
                        >
                            <Ionicons name="add-circle-outline" size={24} color="#8B4513" />
                            <Text style={styles.addAddressText}>Agregar Dirección</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Método de Pago */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="card-outline" size={24} color="#8B4513" />
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
                        >
                            <Ionicons
                                name={method.icon as any}
                                size={24}
                                color={paymentMethod === method.id ? '#8B4513' : '#8D6E63'}
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
                                <Ionicons name="checkmark-circle" size={24} color="#8B4513" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Notas Adicionales */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="document-text-outline" size={24} color="#8B4513" />
                        <Text style={styles.sectionTitle}>Notas (Opcional)</Text>
                    </View>
                    <TextInput
                        style={styles.notesInput}
                        placeholder="Instrucciones de entrega, preferencias, etc."
                        placeholderTextColor="#A1887F"
                        multiline
                        numberOfLines={3}
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>

                {/* Resumen del Pedido */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal ({cartItems.length} items)</Text>
                        <Text style={styles.summaryValue}>S/ {total.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Envío</Text>
                        <Text style={styles.summaryValue}>S/ {shippingCost.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>S/ {finalTotal.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Botón de Confirmar */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.confirmButton, processing && styles.confirmButtonDisabled]}
                    onPress={handleCheckout}
                    disabled={processing || !selectedAddress}
                >
                    {processing ? (
                        <ActivityIndicator color="#FFF" />
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
                                <Ionicons name="close" size={28} color="#5D4037" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalScroll}>
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
                                        <Ionicons name="checkmark-circle" size={24} color="#8B4513" />
                                    )}
                                </TouchableOpacity>
                            ))}

                            {/* Formulario para Nueva Dirección */}
                            <View style={styles.newAddressForm}>
                                <Text style={styles.formTitle}>Agregar Nueva Dirección</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Nombre del destinatario *"
                                    value={newAddress.name}
                                    onChangeText={(text) => setNewAddress({ ...newAddress, name: text })}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Teléfono *"
                                    keyboardType="phone-pad"
                                    value={newAddress.phone}
                                    onChangeText={(text) => setNewAddress({ ...newAddress, phone: text })}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Dirección *"
                                    value={newAddress.address_line1}
                                    onChangeText={(text) => setNewAddress({ ...newAddress, address_line1: text })}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Depto, piso, referencia (opcional)"
                                    value={newAddress.address_line2}
                                    onChangeText={(text) => setNewAddress({ ...newAddress, address_line2: text })}
                                />

                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={handleAddAddress}
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
        backgroundColor: '#FFF8F0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEBE9',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5D4037',
    },
    content: {
        flex: 1,
    },
    section: {
        backgroundColor: '#FFF',
        marginVertical: 10,
        marginHorizontal: 15,
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5D4037',
        marginLeft: 10,
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
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3E2723',
        marginBottom: 4,
    },
    addressPhone: {
        fontSize: 14,
        color: '#8D6E63',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: '#8D6E63',
        lineHeight: 20,
    },
    changeButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#F5E6D8',
        borderRadius: 8,
    },
    changeButtonText: {
        color: '#8B4513',
        fontWeight: '600',
    },
    addAddressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: '#F5E6D8',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D7CCC8',
        borderStyle: 'dashed',
    },
    addAddressText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#8B4513',
        fontWeight: '600',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    paymentOptionSelected: {
        backgroundColor: '#FFF8F0',
        borderColor: '#8B4513',
    },
    paymentText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 15,
        color: '#5D4037',
    },
    paymentTextSelected: {
        fontWeight: '600',
        color: '#8B4513',
    },
    notesInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#3E2723',
        textAlignVertical: 'top',
        minHeight: 80,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 15,
        color: '#8D6E63',
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#5D4037',
    },
    totalRow: {
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#EFEBE9',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3E2723',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8B4513',
    },
    footer: {
        padding: 20,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EFEBE9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    confirmButton: {
        backgroundColor: '#8B4513',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        backgroundColor: '#D7CCC8',
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    confirmButtonSubtext: {
        color: '#FFF',
        fontSize: 14,
        marginTop: 4,
    },
    errorText: {
        fontSize: 16,
        color: '#8D6E63',
        textAlign: 'center',
        marginTop: 50,
    },
    button: {
        backgroundColor: '#8B4513',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 20,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEBE9',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5D4037',
    },
    modalScroll: {
        padding: 20,
    },
    addressOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    addressOptionSelected: {
        backgroundColor: '#FFF8F0',
        borderColor: '#8B4513',
    },
    addressOptionInfo: {
        flex: 1,
    },
    addressOptionName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3E2723',
        marginBottom: 4,
    },
    addressOptionText: {
        fontSize: 14,
        color: '#8D6E63',
        lineHeight: 20,
    },
    newAddressForm: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#EFEBE9',
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#3E2723',
        marginBottom: 12,
    },
    addButton: {
        backgroundColor: '#8B4513',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
