import { Ionicons } from '@expo/vector-icons';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';

export default function Favoritos() {
    const { favorites, removeFromFavorites } = useFavorites();
    const { addToCart } = useCart();
    const { colors } = useTheme();

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.imageContainer}>
                {item.foto ? (
                    <Image source={item.foto} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.placeholderImage]}>
                        <Text>Img</Text>
                    </View>
                )}
            </View>
            <View style={styles.infoContainer}>
                <Text style={[styles.name, { color: colors.text }]}>{item.nombre || item.name}</Text>
                <Text style={[styles.price, { color: colors.primary }]}>{item.precio}</Text>
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.cartButton, { backgroundColor: colors.primary }]}
                        onPress={() => addToCart(item)}
                    >
                        <Ionicons name="cart-outline" size={20} color="#FFF" />
                        <Text style={styles.cartButtonText}>Agregar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeFromFavorites(item.id)}
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.danger} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <AppHeader />
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <Text style={[styles.title, { color: colors.text }]}>Mis Favoritos ❤️</Text>
                <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>Tus productos guardados</Text>
            </View>

            {favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-dislike-outline" size={80} color={colors.tabIconDefault} />
                    <Text style={[styles.emptyText, { color: colors.text }]}>No tienes favoritos aún</Text>
                    <Text style={[styles.emptySubtext, { color: colors.tabIconDefault }]}>Explora nuestros productos y guarda los que más te gusten</Text>
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
        backgroundColor: '#FFF8F0',
    },
    header: {
        padding: 20,
        backgroundColor: '#FFF',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#8D6E63',
    },
    listContent: {
        padding: 15,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        marginRight: 15,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        resizeMode: 'contain',
    },
    placeholderImage: {
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: 5,
    },
    price: {
        fontSize: 15,
        fontWeight: '600',
        color: '#8B4513',
        marginBottom: 10,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cartButton: {
        backgroundColor: '#8B4513',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    cartButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 5,
    },
    removeButton: {
        padding: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#8D6E63',
        marginTop: 20,
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#A1887F',
        textAlign: 'center',
    },
});
