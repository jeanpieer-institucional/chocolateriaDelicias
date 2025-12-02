import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../../components/AppHeader';

export default function Contacto() {
    const contactInfo = {
        phone: '+51 952 295 720',
        email: 'soporte.ofertas.piero@gmail.com',
        address: 'Av. Dulce 123, Miraflores, Lima',
        hours: {
            weekdays: '9:00 AM - 8:00 PM',
            weekends: '10:00 AM - 6:00 PM'
        }
    };

    const handleCall = () => {
        Linking.openURL(`tel:${contactInfo.phone}`);
    };

    const handleEmail = () => {
        Linking.openURL(`mailto:${contactInfo.email}`);
    };

    const handleOpenMaps = () => {
        const address = encodeURIComponent(contactInfo.address);
        Linking.openURL(`https://maps.google.com/?q=${address}`);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <AppHeader />
            {/* Header Section */}
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1429554429301-01d0aaae5e05?auto=format&fit=crop&w=800&q=80' }}
                    style={styles.headerImage}
                />
                <View style={styles.headerOverlay}>
                    <Text style={styles.headerTitle}>Visítanos</Text>
                    <Text style={styles.headerSubtitle}>Te esperamos con los brazos abiertos</Text>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Store Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.storeHeader}>
                        <Text style={styles.storeName}>ChocoDelizia Tienda</Text>
                        <View style={styles.statusBadge}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>Abierto ahora</Text>
                        </View>
                    </View>

                    <Text style={styles.storeDescription}>
                        Tu destino premium para los mejores chocolates artesanales elaborados con cacao peruano de la más alta calidad.
                    </Text>

                    {/* Contact Items */}
                    <View style={styles.contactList}>
                        {/* Phone */}
                        <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                            <View style={[styles.iconContainer, { backgroundColor: '#27AE60' }]}>
                                <Ionicons name="call" size={20} color="#FFF" />
                            </View>
                            <View style={styles.contactText}>
                                <Text style={styles.contactLabel}>Teléfono</Text>
                                <Text style={styles.contactValue}>{contactInfo.phone}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#8D6E63" />
                        </TouchableOpacity>

                        {/* Email */}
                        <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                            <View style={[styles.iconContainer, { backgroundColor: '#E74C3C' }]}>
                                <Ionicons name="mail" size={20} color="#FFF" />
                            </View>
                            <View style={styles.contactText}>
                                <Text style={styles.contactLabel}>Email</Text>
                                <Text style={styles.contactValue}>{contactInfo.email}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#8D6E63" />
                        </TouchableOpacity>

                        {/* Address */}
                        <TouchableOpacity style={styles.contactItem} onPress={handleOpenMaps}>
                            <View style={[styles.iconContainer, { backgroundColor: '#3498DB' }]}>
                                <Ionicons name="location" size={20} color="#FFF" />
                            </View>
                            <View style={styles.contactText}>
                                <Text style={styles.contactLabel}>Dirección</Text>
                                <Text style={styles.contactValue}>{contactInfo.address}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#8D6E63" />
                        </TouchableOpacity>

                        {/* Hours */}
                        <View style={styles.contactItem}>
                            <View style={[styles.iconContainer, { backgroundColor: '#9B59B6' }]}>
                                <FontAwesome5 name="clock" size={18} color="#FFF" />
                            </View>
                            <View style={styles.contactText}>
                                <Text style={styles.contactLabel}>Horario</Text>
                                <View>
                                    <Text style={styles.hoursText}>Lunes a Viernes: {contactInfo.hours.weekdays}</Text>
                                    <Text style={styles.hoursText}>Sábados y Domingos: {contactInfo.hours.weekends}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                        <Ionicons name="call" size={24} color="#8B4513" />
                        <Text style={styles.actionText}>Llamar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
                        <Ionicons name="mail" size={24} color="#8B4513" />
                        <Text style={styles.actionText}>Email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={handleOpenMaps}>
                        <Ionicons name="navigate" size={24} color="#8B4513" />
                        <Text style={styles.actionText}>Cómo llegar</Text>
                    </TouchableOpacity>
                </View>

                {/* Map Preview */}
                <View style={styles.mapSection}>
                    <Text style={styles.sectionTitle}>Nuestra Ubicación</Text>
                    <View style={styles.mapPreview}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' }}
                            style={styles.mapImage}
                        />
                        <TouchableOpacity style={styles.mapButton} onPress={handleOpenMaps}>
                            <Text style={styles.mapButtonText}>Abrir en Maps</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F0',
    },
    header: {
        height: 99,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(139, 69, 19, 0.85)',
        padding: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#FFF8F0',
        fontWeight: '500',
    },
    content: {
        padding: 20,
    },
    infoCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 15,
        elevation: 8,
        marginBottom: 20,
    },
    storeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    storeName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5D4037',
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#27AE60',
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        color: '#27AE60',
        fontWeight: '600',
    },
    storeDescription: {
        fontSize: 15,
        color: '#7E6B5A',
        lineHeight: 22,
        marginBottom: 20,
    },
    contactList: {
        gap: 16,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    contactText: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 13,
        color: '#8D6E63',
        fontWeight: '500',
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 16,
        color: '#5D4037',
        fontWeight: '600',
    },
    hoursText: {
        fontSize: 14,
        color: '#5D4037',
        marginBottom: 2,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    actionButton: {
        backgroundColor: '#FFF',
        flex: 1,
        marginHorizontal: 6,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F5E6D8',
    },
    actionText: {
        fontSize: 13,
        color: '#8B4513',
        fontWeight: '600',
        marginTop: 6,
    },
    mapSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: 15,
    },
    mapPreview: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    mapImage: {
        width: '100%',
        height: 150,
    },
    mapButton: {
        backgroundColor: '#8B4513',
        paddingVertical: 14,
        alignItems: 'center',
    },
    mapButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});