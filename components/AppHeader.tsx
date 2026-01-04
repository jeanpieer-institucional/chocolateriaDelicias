import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../app/context/AuthContext';
import { useCart } from '../app/context/CartContext';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../constants/DesignSystem';

export default function AppHeader() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleProfilePress = () => {
        if (user) {
            setShowProfileMenu(true);
        } else {
            router.push('/');
        }
    };

    const handleCartPress = () => {
        router.push('/(tabs)/carrito');
    };

    const handleLogout = async () => {
        setShowProfileMenu(false);
        try {
            await logout();
            router.replace('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const menuItems = [
        {
            icon: 'person-outline',
            label: 'Ver Perfil',
            onPress: () => {
                setShowProfileMenu(false);
                router.push('/(tabs)/perfil');
            },
        },
        {
            icon: 'heart-outline',
            label: 'Favoritos',
            onPress: () => {
                setShowProfileMenu(false);
                router.push('/(tabs)/favoritos');
            },
        },
        {
            icon: 'receipt-outline',
            label: 'Mis Pedidos',
            onPress: () => {
                setShowProfileMenu(false);
                router.push('/pedidos');
            },
        },
        {
            icon: 'log-out-outline',
            label: 'Cerrar Sesión',
            onPress: handleLogout,
            color: Colors.status.error,
        },
    ];

    return (
        <>
            <View style={styles.container}>
                <View style={styles.leftSection}>
                    <Text style={styles.welcomeText}>Bienvenido</Text>
                    <Text style={styles.subText}>
                        {user ? user.name : 'Piero'}
                    </Text>
                </View>

                <View style={styles.rightSection}>
                    <TouchableOpacity style={styles.iconButton} onPress={handleCartPress}>
                        <Ionicons name="cart-outline" size={24} color={Colors.primary.main} />
                        {cartItems.length > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {cartItems.length > 9 ? '9+' : cartItems.length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton} onPress={handleProfilePress}>
                        <Ionicons
                            name={user ? "person" : "person-outline"}
                            size={24}
                            color={Colors.primary.main}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={showProfileMenu}
                transparent
                animationType="fade"
                onRequestClose={() => setShowProfileMenu(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowProfileMenu(false)}
                >
                    <View style={styles.menuContainer}>
                        <View style={styles.menuHeader}>
                            <View style={styles.userInfo}>
                                <View style={styles.avatarCircle}>
                                    <Ionicons name="person" size={24} color={Colors.dark.background} />
                                </View>
                                <View>
                                    <Text style={styles.userName}>{user?.name}</Text>
                                    <Text style={styles.userEmail}>{user?.email}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.menuItems}>
                            {menuItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.menuItem}
                                    onPress={item.onPress}
                                >
                                    <Ionicons
                                        name={item.icon as any}
                                        size={22}
                                        color={item.color || Colors.text.primary}
                                    />
                                    <Text style={[
                                        styles.menuItemText,
                                        { color: item.color || Colors.text.primary }
                                    ]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingTop: 50,
        paddingBottom: Spacing.lg,
        backgroundColor: Colors.dark.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.default,
        ...Shadows.medium,
    },
    leftSection: {
        flex: 1,
    },
    welcomeText: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
        fontWeight: Typography.weights.semibold,
        marginBottom: Spacing.xs,
    },
    subText: {
        fontSize: Typography.sizes.h4,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.circle,
        backgroundColor: Colors.dark.card,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: Colors.primary.main,
        borderRadius: BorderRadius.circle,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.dark.surface,
    },
    badgeText: {
        color: Colors.dark.background,
        fontSize: Typography.sizes.tiny,
        fontWeight: Typography.weights.bold,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 60,
        paddingRight: Spacing.xl,
    },
    menuContainer: {
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        width: 280,
        ...Shadows.large,
        overflow: 'hidden',
    },
    menuHeader: {
        backgroundColor: Colors.primary.main,
        padding: Spacing.xl,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    avatarCircle: {
        width: 50,
        height: 50,
        borderRadius: BorderRadius.round,
        backgroundColor: 'rgba(13, 31, 26, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.dark.background,
    },
    userName: {
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.bold,
        color: Colors.dark.background,
        marginBottom: 2,
    },
    userEmail: {
        fontSize: Typography.sizes.caption,
        color: Colors.dark.background,
        opacity: 0.8,
    },
    menuItems: {
        paddingVertical: Spacing.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        gap: Spacing.lg,
    },
    menuItemText: {
        fontSize: Typography.sizes.bodySmall,
        fontWeight: Typography.weights.medium,
    },
});
