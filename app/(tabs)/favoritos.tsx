import { Ionicons } from '@expo/vector-icons';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AppHeader from '../../components/AppHeader';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/DesignSystem';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export default function Favoritos() {
    const { favorites, removeFromFavorites } = useFavorites();
    const { addToCart } = useCart();

    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
            <View style={styles.card}>
                <View style={styles.imageContainer}>
                    {item.foto ? (
                        <Image source={item.foto} style={styles.image} resizeMode="cover" />
                    ) : (
                        <View style={[styles.image, styles.placeholderImage]}>
                            <Ionicons name="image-outline" size={40} color={Colors.text.secondary} />
                        </View>
                    )}
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{item.nombre || item.name}</Text>
                    <Text style={styles.description} numberOfLines={2}>
                        {item.descripcion || item.description || 'Delicioso chocolate artesanal'}
                    </Text>
                    <View style={styles.footer}>
                        <Text style={styles.price}>{item.precio || `S/ ${item.price}`}</Text>
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.cartButton}
                                onPress={() => addToCart(item)}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="cart-outline" size={18} color={Colors.dark.background} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeFromFavorites(item.id)}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="trash-outline" size={18} color={Colors.status.error} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <AppHeader />

            {/* Título */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Mis Favoritos</Text>
                <Text style={styles.subtitle}>
                    {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'}
                </Text>
            </View>

            {favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconCircle}>
                        <Ionicons name="heart-outline" size={60} color={Colors.primary.main} />
                    </View>
                    <Text style={styles.emptyText}>No tienes favoritos aún</Text>
                    <Text style={styles.emptySubtext}>
                        Explora nuestros productos y guarda los que más te gusten
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
    },
    listContent: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xxxl,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.lg,
        overflow: 'hidden',
        ...Shadows.medium,
    },
    imageContainer: {
        width: 120,
        height: 120,
        backgroundColor: Colors.dark.surface,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
        padding: Spacing.lg,
        justifyContent: 'space-between',
    },
    name: {
        fontSize: Typography.sizes.body,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
        marginBottom: Spacing.xs,
    },
    description: {
        fontSize: Typography.sizes.caption,
        color: Colors.text.secondary,
        lineHeight: Typography.lineHeights.normal * Typography.sizes.caption,
        marginBottom: Spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: Typography.sizes.h5,
        color: Colors.primary.main,
        fontWeight: Typography.weights.bold,
    },
    actions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    cartButton: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.circle,
        backgroundColor: Colors.primary.main,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButton: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.circle,
        backgroundColor: Colors.status.error + '20',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xxxl,
    },
    emptyIconCircle: {
        width: 120,
        height: 120,
        borderRadius: BorderRadius.circle,
        backgroundColor: Colors.primary.main + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    emptyText: {
        fontSize: Typography.sizes.h4,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
        textAlign: 'center',
        lineHeight: Typography.lineHeights.relaxed * Typography.sizes.bodySmall,
    },
});
