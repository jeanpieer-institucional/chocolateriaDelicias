import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GuestHeader() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Bienvenido</Text>
                    <Text style={styles.subtitle}>Únete a Choco Delisias</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <Text style={styles.loginButtonText}>Ingresar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => router.push('/(auth)/register')}
                    >
                        <Text style={styles.registerButtonText}>Registro</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3E2723', // Dark Chocolate
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginBottom: 10,
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#D4AF37', // Gold
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    subtitle: {
        fontSize: 12,
        color: '#F5F5DC', // Beige
        opacity: 0.8,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    loginButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#D4AF37',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    loginButtonText: {
        color: '#D4AF37',
        fontSize: 12,
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: '#D4AF37',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    registerButtonText: {
        color: '#3E2723',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
