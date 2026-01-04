import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import AppHeader from '../../../components/AppHeader';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../../constants/DesignSystem';
import { useAddress } from '../../context/AddressContext';
import { useAuth } from '../../context/AuthContext';

export default function AddressManagementScreen() {
    const router = useRouter();
    const { addresses, loading, createAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddress();
    const { user } = useAuth();

    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        is_default: false
    });

    const resetForm = () => {
        setFormData({
            name: user?.name || '',
            phone: '',
            address_line1: '',
            address_line2: '',
            is_default: false
        });
        setEditingAddress(null);
    };

    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    const handleEdit = (address: any) => {
        setEditingAddress(address);
        setFormData({
            name: address.name,
            phone: address.phone,
            address_line1: address.address_line1,
            address_line2: address.address_line2 || '',
            is_default: address.is_default
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.phone || !formData.address_line1) {
            Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
            return;
        }

        try {
            if (editingAddress) {
                await updateAddress(editingAddress.id, formData);
                Alert.alert('Éxito', 'Dirección actualizada correctamente');
            } else {
                await createAddress(formData);
                Alert.alert('Éxito', 'Dirección agregada correctamente');
            }
            setShowModal(false);
            resetForm();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al guardar la dirección');
        }
    };

    const handleDelete = (address: any) => {
        Alert.alert(
            'Eliminar Dirección',
            '¿Estás seguro de que deseas eliminar esta dirección?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAddress(address.id);
                            Alert.alert('Éxito', 'Dirección eliminada correctamente');
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Error al eliminar la dirección');
                        }
                    }
                }
            ]
        );
    };

    const handleSetDefault = async (address: any) => {
        if (address.is_default) return;

        try {
            await setDefaultAddress(address.id);
            Alert.alert('Éxito', 'Dirección predeterminada actualizada');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al actualizar dirección predeterminada');
        }
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <AppHeader />
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Mis Direcciones</Text>
                </View>
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconCircle}>
                        <Ionicons name="person-outline" size={60} color={Colors.primary.main} />
                    </View>
                    <Text style={styles.emptyText}>Debes iniciar sesión</Text>
                    <Text style={styles.emptySubtext}>Para ver y gestionar tus direcciones</Text>
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

            {/* Título con botón agregar */}
            <View style={styles.titleContainer}>
                <View>
                    <Text style={styles.title}>Mis Direcciones</Text>
                    {!loading && <Text style={styles.subtitle}>{addresses.length} direcciones</Text>}
                </View>
                <TouchableOpacity onPress={handleAddNew} style={styles.addButton} activeOpacity={0.8}>
                    <Ionicons name="add-circle" size={32} color={Colors.primary.main} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary.main} />
                        <Text style={styles.loadingText}>Cargando direcciones...</Text>
                    </View>
                ) : addresses.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="location-outline" size={60} color={Colors.primary.main} />
                        </View>
                        <Text style={styles.emptyText}>No tienes direcciones guardadas</Text>
                        <Text style={styles.emptySubtext}>Agrega tu primera dirección de envío</Text>
                        <TouchableOpacity style={styles.addFirstButton} onPress={handleAddNew} activeOpacity={0.9}>
                            <Text style={styles.addFirstButtonText}>Agregar Dirección</Text>
                            <Ionicons name="arrow-forward" size={20} color={Colors.dark.background} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    addresses.map((address, index) => (
                        <Animated.View key={address.id} entering={FadeInDown.delay(index * 50).duration(400)}>
                            <View style={styles.addressCard}>
                                {address.is_default && (
                                    <View style={styles.defaultBadge}>
                                        <Ionicons name="star" size={12} color={Colors.dark.background} />
                                        <Text style={styles.defaultBadgeText}>Predeterminada</Text>
                                    </View>
                                )}

                                <View style={styles.addressInfo}>
                                    <Text style={styles.addressName}>{address.name}</Text>
                                    <Text style={styles.addressPhone}>{address.phone}</Text>
                                    <Text style={styles.addressText}>{address.address_line1}</Text>
                                    {address.address_line2 && (
                                        <Text style={styles.addressText}>{address.address_line2}</Text>
                                    )}
                                </View>

                                <View style={styles.addressActions}>
                                    {!address.is_default && (
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() => handleSetDefault(address)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name="star-outline" size={18} color={Colors.primary.main} />
                                            <Text style={styles.actionButtonText}>Predeterminada</Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => handleEdit(address)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="create-outline" size={18} color={Colors.status.info} />
                                        <Text style={[styles.actionButtonText, { color: Colors.status.info }]}>Editar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => handleDelete(address)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="trash-outline" size={18} color={Colors.status.error} />
                                        <Text style={[styles.actionButtonText, { color: Colors.status.error }]}>Eliminar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                    ))
                )}
                <View style={{ height: Spacing.xxxl }} />
            </ScrollView>

            {/* Modal para Agregar/Editar Dirección */}
            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                            >
                                <Ionicons name="close-circle" size={32} color={Colors.text.secondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                            <Text style={styles.label}>Nombre del destinatario *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: Juan Pérez"
                                placeholderTextColor={Colors.text.hint}
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                            />

                            <Text style={styles.label}>Teléfono *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: 987654321"
                                placeholderTextColor={Colors.text.hint}
                                keyboardType="phone-pad"
                                value={formData.phone}
                                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            />

                            <Text style={styles.label}>Dirección *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: Av. Principal 123"
                                placeholderTextColor={Colors.text.hint}
                                value={formData.address_line1}
                                onChangeText={(text) => setFormData({ ...formData, address_line1: text })}
                            />

                            <Text style={styles.label}>Depto, piso, referencia (opcional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: Depto 301, edificio azul"
                                placeholderTextColor={Colors.text.hint}
                                value={formData.address_line2}
                                onChangeText={(text) => setFormData({ ...formData, address_line2: text })}
                            />

                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => setFormData({ ...formData, is_default: !formData.is_default })}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={formData.is_default ? "checkbox" : "square-outline"}
                                    size={24}
                                    color={Colors.primary.main}
                                />
                                <Text style={styles.checkboxLabel}>Establecer como dirección predeterminada</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.9}>
                                <Text style={styles.saveButtonText}>
                                    {editingAddress ? 'Actualizar Dirección' : 'Guardar Dirección'}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    addButton: {
        padding: Spacing.xs,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
    },
    loadingContainer: {
        paddingTop: 100,
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
        paddingTop: 100,
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
    addFirstButton: {
        backgroundColor: Colors.primary.main,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.xxl,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.xxxl,
        gap: Spacing.sm,
    },
    addFirstButtonText: {
        color: Colors.dark.background,
        fontWeight: Typography.weights.bold,
        fontSize: Typography.sizes.body,
    },
    addressCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        ...Shadows.medium,
        position: 'relative',
    },
    defaultBadge: {
        position: 'absolute',
        top: Spacing.md,
        right: Spacing.md,
        backgroundColor: Colors.primary.main,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.xl,
        gap: 4,
    },
    defaultBadgeText: {
        color: Colors.dark.background,
        fontSize: Typography.sizes.tiny,
        fontWeight: Typography.weights.bold,
    },
    addressInfo: {
        marginBottom: Spacing.lg,
        paddingRight: 100,
    },
    addressName: {
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.bold,
        color: Colors.text.primary,
        marginBottom: Spacing.xs,
    },
    addressPhone: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
        marginBottom: Spacing.xs,
    },
    addressText: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
        lineHeight: Typography.lineHeights.normal * Typography.sizes.bodySmall,
    },
    addressActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.xl,
        gap: 4,
    },
    actionButtonText: {
        fontSize: Typography.sizes.caption,
        color: Colors.primary.main,
        fontWeight: Typography.weights.semibold,
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
        maxHeight: '90%',
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
    label: {
        fontSize: Typography.sizes.bodySmall,
        fontWeight: Typography.weights.semibold,
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
        marginTop: Spacing.md,
    },
    input: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.lg,
        marginBottom: Spacing.xl,
        gap: Spacing.sm,
    },
    checkboxLabel: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.primary,
    },
    saveButton: {
        backgroundColor: Colors.primary.main,
        padding: Spacing.lg,
        borderRadius: BorderRadius.xxxl,
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    saveButtonText: {
        color: Colors.dark.background,
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.bold,
    },
});
