import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { authService } from '../services/api';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            alert('Por favor complete todos los campos');
            return;
        }

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            setLoading(true);
            await authService.register({ name, email, password });
            alert('Registro exitoso');
            router.replace('/(auth)/login');
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || 'Error en el registro';
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
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Animated.View entering={FadeInUp.delay(200).duration(1000)} style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                <Ionicons name="arrow-back" size={24} color="#D4AF37" />
                            </TouchableOpacity>
                            <Text style={styles.title}>Crear Cuenta</Text>
                            <Text style={styles.subtitle}>Únete a la experiencia Choco Delisias</Text>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(400).duration(1000)} style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color="#D4AF37" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nombre Completo"
                                    placeholderTextColor="rgba(245, 245, 220, 0.5)"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
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

                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#D4AF37" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirmar Contraseña"
                                    placeholderTextColor="rgba(245, 245, 220, 0.5)"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showPassword}
                                />
                            </View>

                            <TouchableOpacity style={styles.registerButton} onPress={handleRegister} activeOpacity={0.8}>
                                <Text style={styles.registerButtonText}>Registrarse</Text>
                            </TouchableOpacity>

                            <View style={styles.loginContainer}>
                                <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                                <Link href="/(auth)/login" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.loginLink}>Inicia Sesión</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </ImageBackground>
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
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#D4AF37', // Gold
        marginBottom: 10,
        fontFamily: 'serif',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#F5F5DC', // Beige
        opacity: 0.8,
        textAlign: 'center',
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
    registerButton: {
        backgroundColor: '#D4AF37',
        borderRadius: 30,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    registerButtonText: {
        color: '#3E2723',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        color: '#F5F5DC',
        fontSize: 14,
    },
    loginLink: {
        color: '#D4AF37',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
