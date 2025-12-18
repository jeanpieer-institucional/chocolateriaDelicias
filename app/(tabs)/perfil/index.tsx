import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/api';

export default function PerfilScreen() {
    const router = useRouter();
    const { user, token, login } = useAuth();
    const { theme, toggleTheme, colors } = useTheme();
    const [showEditName, setShowEditName] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    // Edit name states
    const [newName, setNewName] = useState(user?.name || '');
    const [loadingName, setLoadingName] = useState(false);

    // Change password states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loadingPassword, setLoadingPassword] = useState(false);

    const handleUpdateName = async () => {
        if (!newName || newName.trim().length < 2) {
            Alert.alert('Error', 'El nombre debe tener al menos 2 caracteres');
            return;
        }

        try {
            setLoadingName(true);
            const response = await authService.updateProfile(newName.trim(), token!);

            // Update user in context
            await login(response.data.user, token!);

            Alert.alert('Éxito', 'Perfil actualizado correctamente');
            setShowEditName(false);
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Error al actualizar perfil');
        } finally {
            setLoadingName(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Por favor complete todos los campos');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        try {
            setLoadingPassword(true);
            await authService.changePassword(currentPassword, newPassword, token!);

            Alert.alert('Éxito', 'Contraseña cambiada correctamente');
            setShowChangePassword(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Error al cambiar contraseña');
        } finally {
            setLoadingPassword(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} style={{ color: '#FFF' }} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Avatar Section */}
            <View style={[styles.avatarSection, { backgroundColor: colors.primary }]}>
                <View style={styles.avatarCircle}>
                    <Text style={[styles.avatarText, { color: colors.card }]}>{user.name.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
            </View>

            {/* Info Cards */}
            <View style={styles.cardsContainer}>
                {/* Theme Toggle Card */}
                <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                    <TouchableOpacity
                        style={styles.cardHeader}
                        onPress={toggleTheme}
                    >
                        <View style={[styles.cardIconContainer, { backgroundColor: colors.background }]}>
                            <Ionicons name={theme === 'dark' ? "moon" : "sunny"} size={20} color={colors.primary} />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={[styles.cardLabel, { color: colors.tabIconDefault }]}>Tema</Text>
                            <Text style={[styles.cardValue, { color: colors.text }]}>{theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}</Text>
                        </View>
                        <View pointerEvents="none">
                            <Ionicons
                                name={theme === 'dark' ? "toggle" : "toggle-outline"}
                                size={30}
                                color={colors.primary}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Name Card */}
                <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.cardIconContainer, { backgroundColor: colors.background }]}>
                            <Ionicons name="person-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={[styles.cardLabel, { color: colors.tabIconDefault }]}>Nombre</Text>
                            <Text style={[styles.cardValue, { color: colors.text }]}>{user.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            setNewName(user.name);
                            setShowEditName(true);
                        }}>
                            <Ionicons name="pencil" size={20} color={colors.secondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Email Card */}
                <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.cardIconContainer, { backgroundColor: colors.background }]}>
                            <Ionicons name="mail-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={[styles.cardLabel, { color: colors.tabIconDefault }]}>Correo Electrónico</Text>
                            <Text style={[styles.cardValue, { color: colors.text }]}>{user.email}</Text>
                        </View>
                    </View>
                </View>

                {/* Password Card */}
                <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                    <TouchableOpacity
                        style={styles.cardHeader}
                        onPress={() => setShowChangePassword(true)}
                    >
                        <View style={[styles.cardIconContainer, { backgroundColor: colors.background }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={[styles.cardLabel, { color: colors.tabIconDefault }]}>Contraseña</Text>
                            <Text style={[styles.cardValue, { color: colors.text }]}>••••••••</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
                    </TouchableOpacity>
                </View>

                {/* Addresses Card */}
                <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                    <TouchableOpacity
                        style={styles.cardHeader}
                        onPress={() => router.push('/(tabs)/perfil/direcciones')}
                    >
                        <View style={[styles.cardIconContainer, { backgroundColor: colors.background }]}>
                            <Ionicons name="location-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={[styles.cardLabel, { color: colors.tabIconDefault }]}>Mis Direcciones</Text>
                            <Text style={[styles.cardValue, { color: colors.text }]}>Gestionar direcciones de envío</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Edit Name Modal */}
            <Modal
                visible={showEditName}
                transparent
                animationType="fade"
                onRequestClose={() => setShowEditName(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Editar Nombre</Text>

                        <TextInput
                            style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                            placeholder="Nuevo nombre"
                            placeholderTextColor={colors.placeholder}
                            value={newName}
                            onChangeText={setNewName}
                            autoFocus
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.border }]}
                                onPress={() => setShowEditName(false)}
                            >
                                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.secondary }]}
                                onPress={handleUpdateName}
                                disabled={loadingName}
                            >
                                <Text style={styles.saveButtonText}>
                                    {loadingName ? 'Guardando...' : 'Guardar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                visible={showChangePassword}
                transparent
                animationType="fade"
                onRequestClose={() => setShowChangePassword(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Cambiar Contraseña</Text>

                        <TextInput
                            style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                            placeholder="Contraseña actual"
                            placeholderTextColor={colors.placeholder}
                            secureTextEntry
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                        />

                        <TextInput
                            style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                            placeholder="Nueva contraseña"
                            placeholderTextColor={colors.placeholder}
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />

                        <TextInput
                            style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                            placeholder="Confirmar nueva contraseña"
                            placeholderTextColor={colors.placeholder}
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.border }]}
                                onPress={() => {
                                    setShowChangePassword(false);
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                }}
                            >
                                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.secondary }]}
                                onPress={handleChangePassword}
                                disabled={loadingPassword}
                            >
                                <Text style={styles.saveButtonText}>
                                    {loadingPassword ? 'Guardando...' : 'Cambiar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#8B4513',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#8B4513',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
        marginBottom: 15,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFF',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
        color: '#FFF8F0',
        opacity: 0.9,
    },
    cardsContainer: {
        padding: 20,
    },
    infoCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF8F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    cardLabel: {
        fontSize: 12,
        color: '#8D6E63',
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 16,
        color: '#5D4037',
        fontWeight: '600',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 25,
        width: '100%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        backgroundColor: '#FFF8F0',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#F5E6D8',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F5E6D8',
    },
    saveButton: {
        backgroundColor: '#D4AF37',
    },
    cancelButtonText: {
        color: '#5D4037',
        fontWeight: '600',
        fontSize: 16,
    },
    saveButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
