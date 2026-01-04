import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../constants/DesignSystem';

interface ProductCardProps {
    name: string;
    description: string;
    price: string;
    image: any;
    isFavorite?: boolean;
    onPress?: () => void;
    onFavoritePress?: () => void;
    onAddPress?: () => void;
}

export default function ProductCard({
    name,
    description,
    price,
    image,
    isFavorite = false,
    onPress,
    onFavoritePress,
    onAddPress,
}: ProductCardProps) {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Imagen del producto */}
            <View style={styles.imageContainer}>
                <Image source={image} style={styles.image} resizeMode="cover" />
            </View>

            {/* Botón de favorito */}
            <TouchableOpacity
                style={styles.favoriteButton}
                onPress={onFavoritePress}
                activeOpacity={0.7}
            >
                <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isFavorite ? Colors.status.error : Colors.text.secondary}
                />
            </TouchableOpacity>

            {/* Información del producto */}
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.description} numberOfLines={1}>
                    {description}
                </Text>

                {/* Precio y botón agregar */}
                <View style={styles.footer}>
                    <Text style={styles.price}>{price}</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={onAddPress}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={20} color={Colors.dark.background} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        width: 160,
        marginRight: Spacing.md,
        ...Shadows.medium,
    },
    imageContainer: {
        width: '100%',
        height: 140,
        backgroundColor: Colors.dark.surface,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    favoriteButton: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
        width: 32,
        height: 32,
        borderRadius: BorderRadius.circle,
        backgroundColor: Colors.dark.card,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.small,
    },
    info: {
        padding: Spacing.md,
    },
    name: {
        fontSize: Typography.sizes.bodySmall,
        fontWeight: Typography.weights.semibold,
        color: Colors.text.primary,
        marginBottom: Spacing.xs,
    },
    description: {
        fontSize: Typography.sizes.caption,
        color: Colors.text.secondary,
        marginBottom: Spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: Typography.sizes.body,
        fontWeight: Typography.weights.bold,
        color: Colors.primary.main,
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: BorderRadius.circle,
        backgroundColor: Colors.primary.main,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
