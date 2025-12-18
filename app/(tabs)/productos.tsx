import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import SearchBar from '../../components/SearchBar';
import { getCategoryImage, getProductImage } from '../../constants/productImages';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { productService } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Productos() {
    const [categorias, setCategorias] = useState<any[]>([]);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const { addToCart } = useCart();
    const { addToFavorites, isFavorite } = useFavorites();
    const { colors } = useTheme();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await productService.getCategories();
            const data = response.data.map((cat: any) => ({
                ...cat,
                // Usar imágenes locales en lugar de URLs del servidor
                foto: getCategoryImage(cat.nombre || cat.name),
                imageFileName: cat.image, // Guardamos para referencia si se necesita
                productos: cat.productos.map((prod: any) => ({
                    ...prod,
                    // Usar imágenes locales basadas en el nombre del producto
                    foto: getProductImage(prod.nombre || prod.name, prod.image),
                    imageFileName: prod.image, // Guardamos para referencia
                    precio: `S/ ${prod.price}`
                }))
            }));
            setCategorias(data);

            const flatProducts: any[] = [];
            data.forEach((cat: any) => {
                const categoryColor = cat.color || '#8B4513';
                cat.productos.forEach((prod: any) => {
                    flatProducts.push({ ...prod, categoryName: cat.nombre, categoryColor });
                });
            });
            setAllProducts(flatProducts);

        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredContent = () => {
        if (searchText.trim().length > 0) {
            const searchLower = searchText.toLowerCase();
            const filtered = allProducts.filter(p =>
                (p.nombre || p.name || '').toLowerCase().includes(searchLower)
            );
            return { type: 'search', data: filtered };
        }
        if (selectedCategory) {
            const category = categorias.find(c => (c.nombre || c.name) === selectedCategory);
            return { type: 'category', data: category ? [category] : [] };
        }
        return { type: 'all', data: categorias };
    };

    const filteredContent = getFilteredContent();

    const renderProductItem = ({ item: prod, color }: { item: any, color?: string }) => (
        <TouchableOpacity style={[styles.productCard, { backgroundColor: colors.card }]}>
            <View style={[styles.productImage, { backgroundColor: colors.border }]}>
                <Image source={prod.foto} style={styles.productImageContent} resizeMode="contain" />
            </View>
            <Text style={[styles.productName, { color: colors.text }]}>{prod.nombre || prod.name}</Text>
            <Text style={[styles.productPrice, { color: colors.primary }]}>{prod.precio}</Text>

            <TouchableOpacity
                style={[styles.favoriteButton, { backgroundColor: colors.card }]}
                onPress={() => addToFavorites(prod)}
            >
                <Ionicons
                    name={isFavorite(prod.id) ? "heart" : "heart-outline"}
                    size={20}
                    color={isFavorite(prod.id) ? colors.danger : colors.tabIconDefault}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.addButton, { backgroundColor: color || colors.primary }]}
                onPress={() => addToCart(prod)}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderCategoria = ({ item }: { item: any }) => (
        <View style={styles.categorySection}>
            <View style={[styles.categoryHeader, { backgroundColor: item.color || '#8B4513' }]}>
                <Text style={styles.categoryTitle}>{item.nombre || item.name}</Text>
            </View>
            <FlatList
                data={item.productos}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsList}
                keyExtractor={(prod) => prod.id.toString()}
                renderItem={({ item: prod }) => renderProductItem({ item: prod, color: item.color })}
            />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <AppHeader />
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <Text style={[styles.mainTitle, { color: colors.text }]}>Nuestros Productos</Text>
                <Text style={[styles.subTitle, { color: colors.tabIconDefault }]}>Sabor auténtico en cada bocado</Text>
            </View>

            <SearchBar
                value={searchText}
                onChangeText={setSearchText}
                onClear={() => setSearchText('')}
                placeholder="Buscar bombones, trufas..."
            />

            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            !selectedCategory && styles.filterChipActive,
                            !selectedCategory && { backgroundColor: colors.primary },
                            selectedCategory ? { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border } : {}
                        ]}
                        onPress={() => setSelectedCategory(null)}
                    >
                        <Text style={[
                            styles.filterText,
                            !selectedCategory ? { color: '#FFF' } : { color: colors.text }
                        ]}>
                            Todos
                        </Text>
                    </TouchableOpacity>

                    {categorias.map((cat, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.filterChip,
                                selectedCategory === (cat.nombre || cat.name) && styles.filterChipActive,
                                selectedCategory === (cat.nombre || cat.name) && { backgroundColor: cat.color || colors.primary },
                                selectedCategory !== (cat.nombre || cat.name) && { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }
                            ]}
                            onPress={() => setSelectedCategory(cat.nombre || cat.name)}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedCategory === (cat.nombre || cat.name) ? { color: '#FFF' } : { color: colors.text }
                            ]}>
                                {cat.nombre || cat.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
            ) : filteredContent.type === 'search' ? (
                <FlatList
                    key="search-grid"
                    data={filteredContent.data}
                    numColumns={2}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={[styles.scrollContent, { paddingHorizontal: 15 }]}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    renderItem={({ item }) => (
                        <View style={{ width: '48%', marginBottom: 15 }}>
                            {renderProductItem({ item, color: item.categoryColor })}
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={50} color={colors.tabIconDefault} />
                            <Text style={[styles.emptyText, { color: colors.text }]}>No se encontraron productos</Text>
                        </View>
                    }
                />
            ) : (
                <FlatList
                    key="categories-list"
                    data={filteredContent.data}
                    renderItem={renderCategoria}
                    keyExtractor={(item) => (item.id || item.nombre).toString()}
                    contentContainerStyle={styles.scrollContent}
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
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#FFF',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#5D4037',
        textAlign: 'center',
        marginBottom: 6,
    },
    subTitle: {
        fontSize: 16,
        color: '#8D6E63',
        textAlign: 'center',
        fontWeight: '500',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    categorySection: {
        marginBottom: 25,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 15,
        marginHorizontal: 15,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        flex: 1,
    },
    productsList: {
        paddingHorizontal: 15,
    },
    productCard: {
        backgroundColor: '#FFF',
        borderRadius: 18,
        padding: 12,
        marginRight: 15,
        width: 150,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    productImage: {
        width: 100,
        height: 100,
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    productImageContent: {
        width: '100%',
        height: '100%',
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5D4037',
        textAlign: 'center',
        marginBottom: 4,
        height: 40,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5D4037',
        textAlign: 'center',
        marginBottom: 8,
        height: 36,
        lineHeight: 18,
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: -1,
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        borderRadius: 12,
        padding: 4,
    },
    filtersContainer: {
        marginBottom: 15,
    },
    filtersContent: {
        paddingHorizontal: 20,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    filterChipActive: {
    },
    filterText: {
        fontWeight: '600',
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
    },
});