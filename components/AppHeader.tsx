import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../app/context/AuthContext';
import { useCart } from '../app/context/CartContext';

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
            icon: 'receipt-outline',
            label: 'Mis Pedidos',
            onPress: () => {
                setShowProfileMenu(false);
            },
        },
        {
            icon: 'log-out-outline',
            label: 'Cerrar Sesión',
            onPress: handleLogout,
            color: '#E74C3C',
        },
    ];

    return (
        <>
            <View style={styles.container}>
                <View style={styles.leftSection}>
                    <Text style={styles.welcomeText}>Bienvenido</Text>
                    <Text style={styles.subText}>
                        {user ? user.name : 'Únete a Choco Delisias'}
                    </Text>
                </View>

                <View style={styles.rightSection}>
                    <TouchableOpacity style={styles.iconButton} onPress={handleCartPress}>
                        <Ionicons name="cart-outline" size={24} color="#8B4513" />
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
                            color="#8B4513"
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
                                    <Ionicons name="person" size={24} color="#FFF" />
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
                                        color={item.color || '#5D4037'}
                                    />
                                    <Text style={[
                                        styles.menuItemText,
                                        item.color && { color: item.color }
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
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F5E6D8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    leftSection: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 14,
        color: '#8D6E63',
        fontWeight: '500',
    },
    subText: {
        fontSize: 16,
        color: '#5D4037',
        fontWeight: 'bold',
        marginTop: 2,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF8F0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F5E6D8',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF5252',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#8B4513',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 60,
        paddingRight: 20,
    },
    menuContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        width: 280,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
        overflow: 'hidden',
    },
    menuHeader: {
        backgroundColor: '#8B4513',
        padding: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 12,
        color: '#FFF8F0',
        opacity: 0.9,
    },
    menuItems: {
        paddingVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        gap: 16,
    },
    menuItemText: {
        fontSize: 15,
        color: '#5D4037',
        fontWeight: '500',
    },
});
