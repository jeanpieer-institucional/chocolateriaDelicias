import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ImageBackground
                source={require('../assets/images/chocolate_bg.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <SafeAreaView style={styles.safeArea}>
                        <Animated.View entering={FadeInUp.delay(200).duration(1000)} style={styles.headerContainer}>
                            <Text style={styles.title}>Choco Delisias</Text>
                            <Text style={styles.subtitle}>El arte del chocolate premium</Text>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(400).duration(1000)} style={styles.bottomContainer}>
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => router.push('/(auth)/login')} // Assuming auth route exists, or just /login
                                activeOpacity={0.8}
                            >
                                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.registerButton}
                                onPress={() => router.push('/(auth)/register')}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.registerButtonText}>Registrarse</Text>
                            </TouchableOpacity>

                            <Link href="/(tabs)/inicio" asChild>
                                <TouchableOpacity style={styles.guestButton}>
                                    <Text style={styles.guestButtonText}>Continuar como invitado</Text>
                                </TouchableOpacity>
                            </Link>
                        </Animated.View>
                    </SafeAreaView>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: width,
        height: height,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)', // Dark overlay for readability
        justifyContent: 'space-between',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    headerContainer: {
        marginTop: height * 0.1,
        alignItems: 'center',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#D4AF37', // Gold color
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        fontFamily: 'serif', // Or a custom font if available
    },
    subtitle: {
        fontSize: 18,
        color: '#F5F5DC', // Beige/Cream
        marginTop: 10,
        textAlign: 'center',
        letterSpacing: 1,
        fontWeight: '500',
    },
    bottomContainer: {
        marginBottom: 40,
        gap: 16,
    },
    loginButton: {
        backgroundColor: '#D4AF37', // Gold
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    loginButtonText: {
        color: '#3E2723', // Dark Chocolate
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: 'transparent',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#D4AF37',
    },
    registerButtonText: {
        color: '#D4AF37',
        fontSize: 18,
        fontWeight: 'bold',
    },
    guestButton: {
        marginTop: 10,
        alignItems: 'center',
    },
    guestButtonText: {
        color: '#F5F5DC',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
