import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AppHeader from '../../components/AppHeader';
import CategoryChip from '../../components/CategoryChip';
import DarkSearchBar from '../../components/DarkSearchBar';
import ProductCard from '../../components/ProductCard';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/DesignSystem';
import { getProductImage } from '../../constants/productImages';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { productService } from '../services/api';

const SCREEN_WIDTH = Dimensions.get('window').width;

const novedades = [
    {
        id: 1,
        titulo: 'Colección Otoño',
        descripcion: 'Sabores cálidos de avellana, canela y especias para esta temporada.',
        imagen: require('../../assets/images/tabletas.png'),
        badge: 'NUEVO',
        badgeColor: Colors.badge.new,
    },
    {
        id: 2,
        titulo: 'Cajas Regalo',
        descripcion: 'El detalle perfecto para tus seres queridos. Dulzura en cada bocado.',
        imagen: require('../../assets/images/regalos.png'),
        badge: 'OFERTA',
        badgeColor: Colors.badge.offer,
    },
];

export default function Inicio() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('Todo');
    const [searchText, setSearchText] = useState('');
    const [categories, setCategories] = useState<string[]>(['Todo']);
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const { addToCart } = useCart();
    const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

    const isFavorite = (id: number) => favorites.some(fav => fav.id === id);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Cargar categorías
            const catResponse = await productService.getCategories();
            const rawCategories = catResponse.data || [];

            // Procesar nombres de categorías (primera palabra)
            const processedCategories = rawCategories.map((cat: any) => {
                const name = cat.name || cat.nombre || '';
                return name.split(' ')[0]; // Tomar solo la primera palabra
            });

            // Eliminar duplicados y agregar 'Todo' al principio
            const uniqueCategories = ['Todo', ...new Set(processedCategories)] as string[];
            setCategories(uniqueCategories);

            // Cargar productos para "Más Vendidos" (simulado con los primeros productos)
            const prodResponse = await productService.getAllProducts();
            const products = prodResponse.data || [];

            // Formatear productos
            const formattedProducts = products.slice(0, 5).map((prod: any) => ({
                id: prod.id,
                nombre: prod.name,
                descripcion: prod.description || 'Chocolate premium',
                precio: `S/ ${prod.price}`,
                foto: getProductImage(prod.name, prod.image),
            }));

            setFeaturedProducts(formattedProducts);

        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const toggleFavorite = (product: any) => {
        if (isFavorite(product.id)) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product);
        }
    };

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* SearchBar - Directamente después del header */}
                <Animated.View
                    entering={FadeInDown.delay(100).duration(600)}
                    style={styles.searchContainer}
                >
                    <DarkSearchBar onSearch={setSearchText} />
                </Animated.View>

                {/* Chips de categorías */}
                <Animated.View
                    entering={FadeInDown.delay(200).duration(600)}
                    style={styles.categoriesWrapper}
                >
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesContainer}
                    >
                        {categories.map((cat, index) => (
                            <CategoryChip
                                key={`${cat}-${index}`}
                                label={cat}
                                selected={selectedCategory === cat}
                                onPress={() => setSelectedCategory(cat)}
                            />
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* Sección Novedades */}
                <Animated.View
                    entering={FadeInDown.delay(300).duration(600)}
                    style={styles.section}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Novedades</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/productos')}>
                            <Text style={styles.seeAll}>Ver todo</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.novedadesContainer}
                    >
                        {novedades.map((item, index) => (
                            <Animated.View
                                key={item.id}
                                entering={FadeInDown.delay(400 + index * 100).duration(600)}
                            >
                                <TouchableOpacity style={styles.novedadCard} activeOpacity={0.9}>
                                    <Image source={item.imagen} style={styles.novedadImage} />
                                    <View style={styles.novedadOverlay}>
                                        <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
                                            <Text style={styles.badgeText}>{item.badge}</Text>
                                        </View>
                                        <View style={styles.novedadInfo}>
                                            <Text style={styles.novedadTitulo}>{item.titulo}</Text>
                                            <Text style={styles.novedadDescripcion}>{item.descripcion}</Text>
                                            <TouchableOpacity
                                                style={styles.explorarButton}
                                                onPress={() => router.push('/(tabs)/productos')}
                                            >
                                                <Text style={styles.explorarText}>Explorar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* Sección Más Vendidos */}
                <Animated.View
                    entering={FadeInDown.delay(500).duration(600)}
                    style={styles.section}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Más Vendidos</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/productos')}>
                            <Text style={styles.seeAll}>Ver todo</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView // Cambiado a ScrollView horizontal para mejor performance
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.productsContainer}
                    >
                        {featuredProducts.map((item, index) => (
                            <Animated.View
                                key={item.id}
                                entering={FadeInDown.delay(600 + index * 50).duration(600)}
                                style={{ marginRight: Spacing.md }}
                            >
                                <ProductCard
                                    name={item.nombre}
                                    description={item.descripcion}
                                    price={item.precio}
                                    image={item.foto}
                                    isFavorite={isFavorite(item.id)}
                                    onFavoritePress={() => toggleFavorite(item)}
                                    onAddPress={() => addToCart(item)}
                                    onPress={() => router.push(`/producto/${item.id}`)}
                                />
                            </Animated.View>
                        ))}
                    </ScrollView>
                </Animated.View>

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
    searchContainer: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.md,
        marginBottom: Spacing.lg,
    },
    categoriesWrapper: {
        marginBottom: Spacing.lg,
    },
    categoriesContainer: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.sm,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: Typography.sizes.h4,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
    },
    seeAll: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.primary.main,
        fontWeight: Typography.weights.semibold,
    },
    novedadesContainer: {
        paddingHorizontal: Spacing.xl,
    },
    novedadCard: {
        width: SCREEN_WIDTH * 0.7,
        height: 200,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        marginRight: Spacing.lg,
        ...Shadows.medium,
    },
    novedadImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    novedadOverlay: {
        flex: 1,
        backgroundColor: 'rgba(13, 31, 26, 0.5)',
        justifyContent: 'space-between',
        padding: Spacing.lg,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
    },
    badgeText: {
        fontSize: Typography.sizes.tiny,
        color: Colors.dark.background,
        fontWeight: Typography.weights.extrabold,
        letterSpacing: 0.5,
    },
    novedadInfo: {
        gap: Spacing.xs,
    },
    novedadTitulo: {
        fontSize: Typography.sizes.h4,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
    },
    novedadDescripcion: {
        fontSize: Typography.sizes.caption,
        color: Colors.text.secondary,
        lineHeight: Typography.lineHeights.normal * Typography.sizes.caption,
    },
    explorarButton: {
        backgroundColor: Colors.dark.card,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.md,
        alignSelf: 'flex-start',
        marginTop: Spacing.sm,
    },
    explorarText: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.primary,
        fontWeight: Typography.weights.semibold,
    },
    productsContainer: {
        paddingHorizontal: Spacing.xl,
    },
});
