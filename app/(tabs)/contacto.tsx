import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AppHeader from '../../components/AppHeader';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/DesignSystem';

const contactInfo = {
    phone: '+55 1234 5678',
    email: 'hola@chocodelicias.com',
    address: 'Calle del Cacao 123, Centro Histórico',
    hours: {
        weekdays: '9:00 AM - 8:00 PM',
        weekends: '10:00 AM - 6:00 PM',
    },
};

export default function Contacto() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleCall = () => {
        Linking.openURL(`tel:${contactInfo.phone}`);
    };

    const handleEmail = () => {
        Linking.openURL(`mailto:${contactInfo.email}`);
    };

    const handleLocation = () => {
        // Abrir en Google Maps
        const address = encodeURIComponent(contactInfo.address);
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`);
    };

    const handleSubmit = () => {
        // Aquí iría la lógica para enviar el mensaje
        console.log('Mensaje enviado:', { nombre, email, mensaje });
    };

    return (
        <View style={styles.container}>
            <AppHeader />

            {/* Título de la pantalla */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Contacto</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Mapa con ubicación */}
                <Animated.View
                    entering={FadeInUp.duration(600).springify()}
                    style={styles.mapContainer}
                >
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80' }}
                        style={styles.mapImage}
                        resizeMode="cover"
                    />
                    <View style={styles.mapOverlay}>
                        <View style={styles.locationCard}>
                            <Text style={styles.locationLabel}>UBICACIÓN</Text>
                            <Text style={styles.locationName}>Choco Delicias Centro</Text>
                        </View>
                        <TouchableOpacity style={styles.mapButton} onPress={handleLocation}>
                            <Ionicons name="navigate" size={24} color={Colors.primary.main} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Información de la tienda */}
                <View style={styles.content}>
                    <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                        <Text style={styles.sectionTitle}>Información de la tienda</Text>

                        <View style={styles.infoCard}>
                            {/* Dirección */}
                            <TouchableOpacity style={styles.infoItem} onPress={handleLocation}>
                                <View style={[styles.iconCircle, { backgroundColor: Colors.primary.main + '20' }]}>
                                    <Ionicons name="location" size={20} color={Colors.primary.main} />
                                </View>
                                <View style={styles.infoText}>
                                    <Text style={styles.infoLabel}>Dirección</Text>
                                    <Text style={styles.infoValue}>{contactInfo.address}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
                            </TouchableOpacity>

                            {/* Teléfono */}
                            <TouchableOpacity style={styles.infoItem} onPress={handleCall}>
                                <View style={[styles.iconCircle, { backgroundColor: Colors.status.info + '20' }]}>
                                    <Ionicons name="call" size={20} color={Colors.status.info} />
                                </View>
                                <View style={styles.infoText}>
                                    <Text style={styles.infoLabel}>Teléfono</Text>
                                    <Text style={styles.infoValue}>{contactInfo.phone}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
                            </TouchableOpacity>

                            {/* Email */}
                            <TouchableOpacity style={styles.infoItem} onPress={handleEmail}>
                                <View style={[styles.iconCircle, { backgroundColor: Colors.status.warning + '20' }]}>
                                    <MaterialIcons name="email" size={20} color={Colors.status.warning} />
                                </View>
                                <View style={styles.infoText}>
                                    <Text style={styles.infoLabel}>Email</Text>
                                    <Text style={styles.infoValue}>{contactInfo.email}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
                            </TouchableOpacity>

                            {/* Horario */}
                            <View style={styles.infoItem}>
                                <View style={[styles.iconCircle, { backgroundColor: Colors.primary.main + '20' }]}>
                                    <Ionicons name="time" size={20} color={Colors.primary.main} />
                                </View>
                                <View style={styles.infoText}>
                                    <Text style={styles.infoLabel}>Horario de atención</Text>
                                    <Text style={styles.infoValue}>Lun - Vie      {contactInfo.hours.weekdays}</Text>
                                    <Text style={styles.infoValue}>Sáb - Dom    {contactInfo.hours.weekends}</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Formulario de contacto */}
                    <Animated.View entering={FadeInDown.delay(400).duration(600)}>
                        <Text style={styles.sectionTitle}>Envíanos un mensaje</Text>

                        <View style={styles.formCard}>
                            {/* Nombre */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Nombre completo</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="person-outline" size={20} color={Colors.text.secondary} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ej. Juan Pérez"
                                        placeholderTextColor={Colors.text.hint}
                                        value={nombre}
                                        onChangeText={setNombre}
                                    />
                                </View>
                            </View>

                            {/* Email */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Correo electrónico</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialIcons name="alternate-email" size={20} color={Colors.text.secondary} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="tucorreo@ejemplo.com"
                                        placeholderTextColor={Colors.text.hint}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                    />
                                </View>
                            </View>

                            {/* Mensaje */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Mensaje</Text>
                                <View style={[styles.inputContainer, styles.textAreaContainer]}>
                                    <Ionicons name="chatbox-outline" size={20} color={Colors.text.secondary} style={styles.textAreaIcon} />
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="¿En qué podemos ayudarte?"
                                        placeholderTextColor={Colors.text.hint}
                                        value={mensaje}
                                        onChangeText={setMensaje}
                                        multiline
                                        numberOfLines={4}
                                    />
                                </View>
                            </View>

                            {/* Botón enviar */}
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.9}>
                                <Text style={styles.submitButtonText}>Enviar mensaje</Text>
                                <Ionicons name="arrow-forward" size={20} color={Colors.dark.background} />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>

                {/* Espaciado final */}
                <View style={{ height: Spacing.xxxl }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    titleContainer: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
    },
    title: {
        fontSize: Typography.sizes.h3,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
    },
    mapContainer: {
        height: 200,
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.dark.surface,
    },
    mapOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: Spacing.xl,
    },
    locationCard: {
        backgroundColor: Colors.dark.card,
        padding: Spacing.lg,
        borderRadius: BorderRadius.md,
        flex: 1,
        marginRight: Spacing.md,
        ...Shadows.medium,
    },
    locationLabel: {
        fontSize: Typography.sizes.tiny,
        color: Colors.primary.main,
        fontWeight: Typography.weights.bold,
        letterSpacing: 0.5,
        marginBottom: Spacing.xs,
    },
    locationName: {
        fontSize: Typography.sizes.body,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
    },
    mapButton: {
        width: 56,
        height: 56,
        borderRadius: BorderRadius.circle,
        backgroundColor: Colors.dark.card,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.medium,
    },
    content: {
        padding: Spacing.xl,
    },
    sectionTitle: {
        fontSize: Typography.sizes.h5,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
        marginBottom: Spacing.lg,
    },
    infoCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.xxl,
        ...Shadows.medium,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.default,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.circle,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    infoText: {
        flex: 1,
    },
    infoLabel: {
        fontSize: Typography.sizes.caption,
        color: Colors.text.secondary,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.primary,
        fontWeight: Typography.weights.medium,
    },
    formCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.xl,
        ...Shadows.medium,
    },
    inputGroup: {
        marginBottom: Spacing.lg,
    },
    inputLabel: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.primary,
        fontWeight: Typography.weights.semibold,
        marginBottom: Spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border.default,
    },
    input: {
        flex: 1,
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.primary,
        marginLeft: Spacing.sm,
    },
    textAreaContainer: {
        alignItems: 'flex-start',
        paddingVertical: Spacing.md,
    },
    textAreaIcon: {
        marginTop: Spacing.xs,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: Colors.primary.main,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.xxxl,
        gap: Spacing.sm,
        marginTop: Spacing.md,
    },
    submitButtonText: {
        fontSize: Typography.sizes.body,
        color: Colors.dark.background,
        fontWeight: Typography.weights.bold,
    },
});