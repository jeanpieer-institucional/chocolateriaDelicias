import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AppHeader from '../../components/AppHeader';
import CategoryChip from '../../components/CategoryChip';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/DesignSystem';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Datos de blogs
const blogDestacado = {
    id: 1,
    categoria: 'HISTORIA',
    titulo: 'La Historia Secreta del Cacao',
    descripcion: 'Descubre los orígenes antiguos de tu postre favorito y cómo ha evolucionado desde los...',
    tiempo: 'Hace 2 horas',
    imagen: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80',
};

const blogsRecientes = [
    {
        id: 2,
        categoria: 'RECETAS',
        titulo: 'Cómo hacer trufas en casa: Guía paso a paso',
        descripcion: 'Aprende los 3 pasos simples para dominar el arte del chocolate...',
        tiempo: '15 min',
        imagen: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 3,
        categoria: 'NOVEDADES',
        titulo: 'Llegó la Colección de Invierno 2024',
        descripcion: 'Descubre nuestra nueva corteza de chocolate amargo con menta y...',
        tiempo: '1h ago',
        imagen: 'https://images.unsplash.com/photo-1606312619070-d48b4cff3e0d?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 4,
        categoria: 'TIPS',
        titulo: 'Maridaje de Café y Chocolate',
        descripcion: 'La guía definitiva para combinar tus granos favoritos con cacao puro.',
        tiempo: '1 día',
        imagen: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80',
    },
];

const categorias = ['Todos', 'Recetas', 'Historia', 'Novedades'];

const getCategoryColor = (categoria: string) => {
    const colors: { [key: string]: string } = {
        'HISTORIA': Colors.primary.main,
        'RECETAS': Colors.primary.main,
        'NOVEDADES': Colors.primary.main,
        'TIPS': Colors.primary.main,
    };
    return colors[categoria] || Colors.primary.main;
};

export default function Blogs() {
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    return (
        <View style={styles.container}>
            <AppHeader />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Blog</Text>
                <TouchableOpacity>
                    <Ionicons name="search" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Chips de categorías */}
                <View style={styles.categoriesWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesContainer}
                    >
                        {categorias.map((cat) => (
                            <CategoryChip
                                key={cat}
                                label={cat}
                                selected={selectedCategory === cat}
                                onPress={() => setSelectedCategory(cat)}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Blog Destacado */}
                <Animated.View
                    entering={FadeInUp.duration(600).springify()}
                    style={styles.featuredSection}
                >
                    <View style={styles.featuredBadge}>
                        <Text style={styles.featuredBadgeText}>DESTACADO</Text>
                    </View>

                    <TouchableOpacity style={styles.featuredCard} activeOpacity={0.9}>
                        <Image
                            source={{ uri: blogDestacado.imagen }}
                            style={styles.featuredImage}
                        />
                        <View style={styles.featuredOverlay}>
                            <View style={styles.featuredContent}>
                                <View style={styles.featuredMeta}>
                                    <Text style={[styles.categoryTag, { color: getCategoryColor(blogDestacado.categoria) }]}>
                                        {blogDestacado.categoria}
                                    </Text>
                                    <Text style={styles.timeText}>• {blogDestacado.tiempo}</Text>
                                </View>
                                <Text style={styles.featuredTitle}>{blogDestacado.titulo}</Text>
                                <Text style={styles.featuredDescription}>{blogDestacado.descripcion}</Text>
                                <TouchableOpacity style={styles.readButton}>
                                    <Text style={styles.readButtonText}>Leer artículo</Text>
                                    <Ionicons name="arrow-forward" size={16} color={Colors.primary.main} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Blogs Recientes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recientes</Text>

                    <FlatList
                        data={blogsRecientes}
                        scrollEnabled={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item, index }) => (
                            <Animated.View entering={FadeInDown.delay(index * 100).duration(600)}>
                                <TouchableOpacity style={styles.blogCard} activeOpacity={0.9}>
                                    <View style={styles.blogContent}>
                                        <Text style={[styles.categoryTag, { color: getCategoryColor(item.categoria) }]}>
                                            {item.categoria}
                                        </Text>
                                        <Text style={styles.blogTitle}>{item.titulo}</Text>
                                        <Text style={styles.blogDescription}>{item.descripcion}</Text>
                                        <View style={styles.blogMeta}>
                                            <Ionicons name="time-outline" size={14} color={Colors.text.secondary} />
                                            <Text style={styles.blogTime}>{item.tiempo}</Text>
                                        </View>
                                    </View>
                                    <Image
                                        source={{ uri: item.imagen }}
                                        style={styles.blogImage}
                                    />
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    />
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
    },
    title: {
        fontSize: Typography.sizes.h3,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
    },
    categoriesWrapper: {
        marginBottom: Spacing.lg,
    },
    categoriesContainer: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.sm,
    },
    featuredSection: {
        paddingHorizontal: Spacing.xl,
        marginBottom: Spacing.xxl,
    },
    featuredBadge: {
        backgroundColor: Colors.primary.main,
        alignSelf: 'flex-start',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
        marginBottom: Spacing.md,
    },
    featuredBadgeText: {
        fontSize: Typography.sizes.tiny,
        color: Colors.dark.background,
        fontWeight: Typography.weights.extrabold,
        letterSpacing: 0.5,
    },
    featuredCard: {
        height: 320,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        ...Shadows.large,
    },
    featuredImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    featuredOverlay: {
        flex: 1,
        backgroundColor: 'rgba(13, 31, 26, 0.6)',
        justifyContent: 'flex-end',
    },
    featuredContent: {
        padding: Spacing.xl,
    },
    featuredMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    categoryTag: {
        fontSize: Typography.sizes.caption,
        fontWeight: Typography.weights.bold,
        letterSpacing: 0.5,
    },
    timeText: {
        fontSize: Typography.sizes.caption,
        color: Colors.text.secondary,
        marginLeft: Spacing.xs,
    },
    featuredTitle: {
        fontSize: Typography.sizes.h3,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
        marginBottom: Spacing.sm,
    },
    featuredDescription: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.text.secondary,
        lineHeight: Typography.lineHeights.normal * Typography.sizes.bodySmall,
        marginBottom: Spacing.lg,
    },
    readButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    readButtonText: {
        fontSize: Typography.sizes.bodySmall,
        color: Colors.primary.main,
        fontWeight: Typography.weights.semibold,
    },
    section: {
        paddingHorizontal: Spacing.xl,
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: Typography.sizes.h4,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
        marginBottom: Spacing.lg,
    },
    blogCard: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        ...Shadows.medium,
    },
    blogContent: {
        flex: 1,
        marginRight: Spacing.md,
    },
    blogTitle: {
        fontSize: Typography.sizes.body,
        color: Colors.text.primary,
        fontWeight: Typography.weights.bold,
        marginBottom: Spacing.xs,
        lineHeight: Typography.lineHeights.tight * Typography.sizes.body,
    },
    blogDescription: {
        fontSize: Typography.sizes.caption,
        color: Colors.text.secondary,
        lineHeight: Typography.lineHeights.normal * Typography.sizes.caption,
        marginBottom: Spacing.sm,
    },
    blogMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    blogTime: {
        fontSize: Typography.sizes.caption,
        color: Colors.text.secondary,
    },
    blogImage: {
        width: 100,
        height: 100,
        borderRadius: BorderRadius.md,
    },
});