import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Por favor ingrese correo y contraseña');
            return;
        }

        try {
            setLoading(true);
            const response = await authService.login({ email, password });
            console.log('Login successful:', response.data);

            // Save user and token to AuthContext
            await login(response.data.user, response.data.token);

            // Navigate to home
            router.replace('/(tabs)/inicio');
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || 'Credenciales inválidas';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/images/chocolate_bg.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar style="light" />
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
                        <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={styles.formContainer}>

                            <View style={styles.header}>
                                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                    <Ionicons name="arrow-back" size={28} color="#D4AF37" />
                                </TouchableOpacity>
                                <View style={styles.headerTextContainer}>
                                    <Text style={styles.headerTitle}>Bienvenido de Nuevo</Text>
                                    <Text style={styles.headerSubtitle}>Continúa la experiencia Choco Delisias</Text>
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#D4AF37" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Correo Electrónico"
                                    placeholderTextColor="rgba(245, 245, 220, 0.5)"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#D4AF37" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Contraseña"
                                    placeholderTextColor="rgba(245, 245, 220, 0.5)"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#D4AF37" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.forgotButton}>
                                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
                                <Text style={styles.loginButtonText}>Ingresar</Text>
                            </TouchableOpacity>

                            <View style={styles.dividerContainer}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>O</Text>
                                <View style={styles.divider} />
                            </View>

                            <View style={styles.socialContainer}>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Ionicons name="logo-google" size={24} color="#D4AF37" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Ionicons name="logo-facebook" size={24} color="#D4AF37" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.registerContainer}>
                                <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
                                <Link href="/(auth)/register" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.registerLink}>Regístrate</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </ImageBackground >
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: width,
        height: height,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(62, 39, 35, 0.85)', // Dark Chocolate overlay
    },
    keyboardView: {
        flex: 1,
    },
    subtitle: {
        fontSize: 16,
        color: '#F5F5DC', // Beige
        opacity: 0.8,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)', // Gold with opacity
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#F5F5DC',
        fontSize: 16,
    },
    forgotButton: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        color: '#D4AF37',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#D4AF37',
        borderRadius: 30,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    loginButtonText: {
        color: '#3E2723',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(245, 245, 220, 0.2)',
    },
    dividerText: {
        color: '#F5F5DC',
        paddingHorizontal: 16,
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 30,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    registerText: {
        color: '#F5F5DC',
        fontSize: 14,
    },
    registerLink: {
        color: '#D4AF37',
        fontSize: 14,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    backButton: {
        marginRight: 20,
        padding: 5,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#D4AF37',
        marginBottom: 5,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#F5F5DC',
        opacity: 0.8,
    },
});
