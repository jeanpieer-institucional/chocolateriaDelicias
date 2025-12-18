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
import { useAddress } from '../../context/AddressContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function AddressManagementScreen() {
    const router = useRouter();
    const { addresses, loading, createAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddress();
    const { user } = useAuth();
    const { colors } = useTheme();

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
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Mis Direcciones</Text>
                    <View style={styles.headerSpacer} />
                </View>
                <View style={styles.emptyContainer}>
                    <Ionicons name="person-outline" size={80} color={colors.tabIconDefault} />
                    <Text style={[styles.emptyText, { color: colors.text }]}>Debes iniciar sesión para ver tus direcciones</Text>
                    <TouchableOpacity
                        style={[styles.emptyButton, { backgroundColor: colors.primary }]}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <Text style={styles.emptyButtonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Mis Direcciones</Text>
                <TouchableOpacity onPress={handleAddNew} style={styles.addButton}>
                    <Ionicons name="add" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
                ) : addresses.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="location-outline" size={80} color={colors.tabIconDefault} />
                        <Text style={[styles.emptyText, { color: colors.text }]}>No tienes direcciones guardadas</Text>
                        <TouchableOpacity style={[styles.emptyButton, { backgroundColor: colors.primary }]} onPress={handleAddNew}>
                            <Text style={styles.emptyButtonText}>Agregar Primera Dirección</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    addresses.map((address) => (
                        <View key={address.id} style={[styles.addressCard, { backgroundColor: colors.card }]}>
                            {address.is_default && (
                                <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
                                    <Ionicons name="star" size={12} color="#FFF" />
                                    <Text style={styles.defaultBadgeText}>Predeterminada</Text>
                                </View>
                            )}

                            <View style={styles.addressInfo}>
                                <Text style={[styles.addressName, { color: colors.text }]}>{address.name}</Text>
                                <Text style={[styles.addressPhone, { color: colors.tabIconDefault }]}>{address.phone}</Text>
                                <Text style={[styles.addressText, { color: colors.tabIconDefault }]}>{address.address_line1}</Text>
                                {address.address_line2 && (
                                    <Text style={[styles.addressText, { color: colors.tabIconDefault }]}>{address.address_line2}</Text>
                                )}
                            </View>

                            <View style={styles.addressActions}>
                                {!address.is_default && (
                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: colors.background }]}
                                        onPress={() => handleSetDefault(address)}
                                    >
                                        <Ionicons name="star-outline" size={20} color={colors.primary} />
                                        <Text style={[styles.actionButtonText, { color: colors.primary }]}>Predeterminada</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: colors.background }]}
                                    onPress={() => handleEdit(address)}
                                >
                                    <Ionicons name="create-outline" size={20} color={colors.primary} />
                                    <Text style={[styles.actionButtonText, { color: colors.primary }]}>Editar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: colors.background }]}
                                    onPress={() => handleDelete(address)}
                                >
                                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                                    <Text style={[styles.actionButtonText, { color: colors.danger }]}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
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
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                            >
                                <Ionicons name="close" size={28} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalScroll}>
                            <Text style={[styles.label, { color: colors.text }]}>Nombre del destinatario *</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                                placeholder="Ej: Juan Pérez"
                                placeholderTextColor={colors.placeholder || '#A1887F'}
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                            />

                            <Text style={[styles.label, { color: colors.text }]}>Teléfono *</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                                placeholder="Ej: 987654321"
                                placeholderTextColor={colors.placeholder || '#A1887F'}
                                keyboardType="phone-pad"
                                value={formData.phone}
                                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            />

                            <Text style={[styles.label, { color: colors.text }]}>Dirección *</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                                placeholder="Ej: Av. Principal 123"
                                placeholderTextColor={colors.placeholder || '#A1887F'}
                                value={formData.address_line1}
                                onChangeText={(text) => setFormData({ ...formData, address_line1: text })}
                            />

                            <Text style={[styles.label, { color: colors.text }]}>Depto, piso, referencia (opcional)</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                                placeholder="Ej: Depto 301, edificio azul"
                                placeholderTextColor={colors.placeholder || '#A1887F'}
                                value={formData.address_line2}
                                onChangeText={(text) => setFormData({ ...formData, address_line2: text })}
                            />

                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => setFormData({ ...formData, is_default: !formData.is_default })}
                            >
                                <Ionicons
                                    name={formData.is_default ? "checkbox" : "square-outline"}
                                    size={24}
                                    color={colors.primary}
                                />
                                <Text style={[styles.checkboxLabel, { color: colors.text }]}>Establecer como dirección predeterminada</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
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
    addButton: {
        padding: 5,
    },
    headerSpacer: {
        width: 24,
    },
    content: {
        flex: 1,
        padding: 15,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 18,
        color: '#8D6E63',
        marginTop: 20,
        marginBottom: 30,
    },
    emptyButton: {
        backgroundColor: '#8B4513',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    emptyButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    addressCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: 'relative',
    },
    defaultBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#D4AF37',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    defaultBadgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    addressInfo: {
        marginBottom: 15,
        paddingRight: 100,
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
    addressActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F5E6D8',
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    actionButtonText: {
        fontSize: 12,
        color: '#8B4513',
        fontWeight: '600',
        marginLeft: 4,
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
        maxHeight: '90%',
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
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5D4037',
        marginBottom: 8,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#3E2723',
        marginBottom: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 20,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 14,
        color: '#5D4037',
    },
    saveButton: {
        backgroundColor: '#8B4513',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
