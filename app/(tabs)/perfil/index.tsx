import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AppHeader from '../../../components/AppHeader';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../../constants/DesignSystem';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';

export default function PerfilScreen() {
    const router = useRouter();
    const { user, token, login, logout } = useAuth();
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

    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro que deseas cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/');
                    },
                },
            ]
        );
    };

    if (!user) {
        return null;
    }

    const menuItems = [
        {
            icon: 'person-outline',
            title: 'Editar Nombre',
            subtitle: user.name,
            onPress: () => setShowEditName(true),
            color: Colors.primary.main,
        },
        {
            icon: 'mail-outline',
            title: 'Correo Electrónico',
            subtitle: user.email,
            onPress: () => { },
            color: Colors.status.info,
            disabled: true,
        },
        {
            icon: 'lock-closed-outline',
            title: 'Cambiar Contraseña',
            subtitle: '••••••••',
            onPress: () => setShowChangePassword(true),
            color: Colors.status.warning,
        },
        {
            icon: 'receipt-outline',
            title: 'Mis Pedidos',
            subtitle: 'Ver historial de compras',
            onPress: () => router.push('/pedidos'),
            color: Colors.primary.main,
        },
        {
            icon: 'location-outline',
            title: 'Mis Direcciones',
            subtitle: 'Gestionar direcciones de envío',
            onPress: () => router.push('/(tabs)/perfil/direcciones'),
            color: Colors.status.success,
        },
    ];

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Avatar Section */}
                <Animated.View entering={FadeInDown.duration(600)} style={styles.avatarSection}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                </Animated.View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    {menuItems.map((item, index) => (
                        <Animated.View key={index} entering={FadeInDown.delay(index * 50).duration(400)}>
                            <TouchableOpacity
                                style={[styles.menuItem, item.disabled && styles.menuItemDisabled]}
                                onPress={item.onPress}
                                disabled={item.disabled}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: item.color + '20' }]}>
                                    <Ionicons name={item.icon as any} size={22} color={item.color} />
                                </View>
                                <View style={styles.menuItemText}>
                                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                                </View>
                                {!item.disabled && (
                                    <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                {/* Logout Button */}
                <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.logoutSection}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.9}>
                        <Ionicons name="log-out-outline" size={22} color={Colors.status.error} />
                        <Text style={styles.logoutText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={{ height: Spacing.xxxl }} />
            </ScrollView>

            {/* Edit Name Modal */}
            <Modal visible={showEditName} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Nombre</Text>
                        <TextInput
                            style={styles.input}
                            value={newName}
                            onChangeText={setNewName}
                            placeholder="Nombre completo"
                            placeholderTextColor={Colors.text.hint}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setShowEditName(false);
                                    setNewName(user.name);
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
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
            <Modal visible={showChangePassword} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="Contraseña actual"
                            placeholderTextColor={Colors.text.hint}
                            secureTextEntry
                        />
                        <TextInput
                            style={styles.input}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="Nueva contraseña"
                            placeholderTextColor={Colors.text.hint}
                            secureTextEntry
                        />
                        <TextInput
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirmar contraseña"
                            placeholderTextColor={Colors.text.hint}
                            secureTextEntry
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setShowChangePassword(false);
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleChangePassword}
                                disabled={loadingPassword}
                            >
                                <Text style={styles.saveButtonText}>
                                    {loadingPassword ? 'Cambiando...' : 'Cambiar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
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
    avatarSection: {
        alignItems: 'center',
        paddingVertical: Spacing.xxl,
        paddingHorizontal: Spacing.xl,
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: BorderRadius.round,
        backgroundColor: Colors.primary.main,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        ...Shadows.glow,
    },
    avatarText: {
        fontSize: 40,
        color: Colors.dark.background,
        fontWeight: Typography.weights.bold,
    },
    userName: {
        fontSize: Typography.sizes.h3,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
        marginBottom: Spacing.xs,
    },
    userEmail: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
    },
    menuSection: {
        paddingHorizontal: Spacing.xl,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        ...Shadows.medium,
    },
    menuItemDisabled: {
        opacity: 0.6,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.circle,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    menuItemText: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: Typography.sizes.body,
        color: Colors.text.primary,
        fontWeight: Typography.weights.semibold,
        marginBottom: 2,
    },
    menuItemSubtitle: {
        fontSize: Typography.sizes.caption,
        color: Colors.text.secondary,
    },
    logoutSection: {
        paddingHorizontal: Spacing.xl,
        marginTop: Spacing.xl,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.status.error + '15',
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.lg,
        gap: Spacing.sm,
    },
    logoutText: {
        fontSize: Typography.sizes.body,
        color: Colors.status.error,
        fontWeight: Typography.weights.semibold,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    modalContent: {
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.xxl,
        width: '100%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: Typography.sizes.h4,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
        marginBottom: Spacing.xl,
        textAlign: 'center',
    },
    input: {
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.primary,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.lg,
    },
    modalButton: {
        flex: 1,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.dark.surface,
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    cancelButtonText: {
        color: Colors.text.secondary,
        fontSize: Typography.sizes.bodySmall,
        fontWeight: Typography.weights.semibold,
    },
    saveButton: {
        backgroundColor: Colors.primary.main,
    },
    saveButtonText: {
        color: Colors.dark.background,
        fontSize: Typography.sizes.bodySmall,
        fontWeight: Typography.weights.bold,
    },
});
