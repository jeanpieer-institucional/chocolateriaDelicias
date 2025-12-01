import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const CARD_WIDTH = Dimensions.get("window").width * 0.28;
const SCREEN_WIDTH = Dimensions.get("window").width;

const ofertas = [
    {
        texto: '¡Caja de Bombones gourmet - 15% Dcto!',
        foto: require('../../assets/images/bombones.png'),
        color: '#8B4513'
    },
    {
        texto: 'Tabletas premium 2x1 este mes',
        foto: require('../../assets/images/tabletas.png'),
        color: '#A0522D'
    },
    {
        texto: 'Regalos y cajas: Envío gratis',
        foto: require('../../assets/images/regalos.png'),
        color: '#CD853F'
    }
]

import AppHeader from '../../components/AppHeader';

export default function Inicio() {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <AppHeader />
            {/* Header con gradiente */}
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' }}
                    style={styles.logo}
                />
                <Text style={styles.title}>Bienvenidos a ChocoDelicias</Text>
                <Text style={styles.desc}>Chocolatería artesanal para disfrutar y regalar sabores</Text>
            </View>

            {/* Sección de ofertas */}
            <View style={styles.ofertasSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.bannerTitle}>Ofertas del Mes</Text>
                    <View style={styles.titleUnderline}></View>
                </View>

                <View style={styles.bannerRow}>
                    {ofertas.map((item, idx) => (
                        <View key={idx} style={[styles.bannerCard, { borderTopColor: item.color }]}>
                            <View style={styles.imageContainer}>
                                {item.foto && (
                                    <Image source={item.foto} style={styles.bannerImg} resizeMode='contain' />
                                )}
                            </View>
                            <Text style={styles.bannerText}>{item.texto}</Text>
                            <View style={[styles.promoBadge, { backgroundColor: item.color }]}>
                                <Text style={styles.promoBadgeText}>PROMO</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Sección adicional */}
            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>🍫 Chocolate Artesanal</Text>
                <Text style={styles.infoText}>
                    Descubre nuestra exclusiva selección de chocolates elaborados
                    con los mejores ingredientes y mucho amor.
                </Text>

                <View style={styles.featuresRow}>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureIcon}>🚚</Text>
                        <Text style={styles.featureText}>Envío Rápido</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureIcon}>⭐</Text>
                        <Text style={styles.featureText}>Calidad Premium</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Text style={styles.featureIcon}>🎁</Text>
                        <Text style={styles.featureText}>Regalos Especiales</Text>
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
        backgroundColor: 'linear-gradient(135deg, #8B4513, #D2691E)',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#FFF',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    desc: {
        fontSize: 16,
        color: '#FFF8F0',
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '500',
    },
    ofertasSection: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        alignItems: 'center',
        marginBottom: 25,
    },
    bannerTitle: {
        fontSize: 24,
        color: '#5D4037',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    titleUnderline: {
        width: 60,
        height: 4,
        backgroundColor: '#D2691E',
        borderRadius: 2,
    },
    bannerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        gap: 12,
    },
    bannerCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        alignItems: 'center',
        padding: 16,
        width: CARD_WIDTH,
        minHeight: 180,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
        borderTopWidth: 4,
        position: 'relative',
        justifyContent: 'space-between',
    },
    imageContainer: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    bannerImg: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    bannerText: {
        fontSize: 13,
        color: '#5D4037',
        textAlign: 'center',
        fontWeight: '600',
        lineHeight: 18,
        flex: 1,
    },
    promoBadge: {
        position: 'absolute',
        top: -10,
        right: -5,
        backgroundColor: '#8B4513',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    promoBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    infoSection: {
        backgroundColor: '#FFF',
        margin: 20,
        padding: 25,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: 12,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 15,
        color: '#7E6B5A',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    featuresRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    featureItem: {
        alignItems: 'center',
    },
    featureIcon: {
        fontSize: 24,
        marginBottom: 6,
    },
    featureText: {
        fontSize: 12,
        color: '#8B4513',
        fontWeight: '600',
        textAlign: 'center',
    },
});