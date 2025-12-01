import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../../components/AppHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const blogs = [
    {
        titulo: 'Experiencia con cacao orgánico',
        foto: require('../../assets/images/seleccion.png'),
        resumen: 'Descubre cómo seleccionamos el mejor cacao orgánico para nuestros chocolates artesanales',
        fecha: '15 Nov 2024',
        tiempoLectura: '5 min lectura',
        categoria: 'Cacao Premium'
    },
    {
        titulo: 'Receta de Brownies con ChocoDelisias',
        foto: require('../../assets/images/brownie.png'),
        resumen: 'Aprende a preparar brownies irresistibles usando nuestras tabletas premium de chocolate 70% cacao',
        fecha: '12 Nov 2024',
        tiempoLectura: '8 min lectura',
        categoria: 'Recetas'
    },
    {
        titulo: 'El arte del templado del chocolate',
        foto: require('../../assets/images/templado.png'),
        resumen: 'Conoce los secretos del proceso de templado que da ese brillo y textura perfecta a nuestros chocolates',
        fecha: '8 Nov 2024',
        tiempoLectura: '6 min lectura',
        categoria: 'Procesos'
    },
    {
        titulo: 'Beneficios del chocolate oscuro',
        foto: require('../../assets/images/beneficios.png'),
        resumen: 'Descubre los sorprendentes beneficios para la salud que ofrece el consumo moderado de chocolate oscuro',
        fecha: '3 Nov 2024',
        tiempoLectura: '7 min lectura',
        categoria: 'Salud'
    },
];

export default function Blogs() {
    return (
        <View style={styles.container}>
            <AppHeader />
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.mainTitle}>Blog ChocoDelisias</Text>
                <Text style={styles.subTitle}>Descubre el mundo del chocolate artesanal</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Featured Blog */}
                <Text style={styles.sectionTitle}>Artículo Destacado</Text>
                <TouchableOpacity style={styles.featuredCard}>
                    <Image source={blogs[0].foto} style={styles.featuredImg} />
                    <View style={styles.featuredContent}>
                        <View style={styles.featuredBadge}>
                            <Text style={styles.featuredBadgeText}>DESTACADO</Text>
                        </View>
                        <Text style={styles.featuredTitle}>{blogs[0].titulo}</Text>
                        <Text style={styles.featuredResumen}>{blogs[0].resumen}</Text>
                        <View style={styles.metaInfo}>
                            <Text style={styles.metaText}>{blogs[0].fecha}</Text>
                            <Text style={styles.metaDot}>•</Text>
                            <Text style={styles.metaText}>{blogs[0].tiempoLectura}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* All Blogs */}
                <Text style={styles.sectionTitle}>Todos los Artículos</Text>
                <View style={styles.blogsGrid}>
                    {blogs.map((blog, idx) => (
                        <TouchableOpacity key={idx} style={styles.blogCard}>
                            <View style={styles.imageContainer}>
                                <Image source={blog.foto} style={styles.blogImg} />
                                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(blog.categoria) }]}>
                                    <Text style={styles.categoryText}>{blog.categoria}</Text>
                                </View>
                            </View>

                            <View style={styles.blogContent}>
                                <Text style={styles.blogTitle}>{blog.titulo}</Text>
                                <Text style={styles.blogResumen} numberOfLines={3}>
                                    {blog.resumen}
                                </Text>

                                <View style={styles.cardFooter}>
                                    <View style={styles.metaInfo}>
                                        <Text style={styles.metaText}>{blog.fecha}</Text>
                                        <Text style={styles.metaDot}>•</Text>
                                        <Text style={styles.metaText}>{blog.tiempoLectura}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.readButton}>
                                        <Text style={styles.readButtonText}>Leer</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

// Función para colores de categoría
const getCategoryColor = (category: string): string => {
    const colors = {
        'Cacao Premium': '#8B4513',
        'Recetas': '#A0522D',
        'Procesos': '#CD853F',
        'Salud': '#D2691E'
    };
    return colors[category as keyof typeof colors] || '#8B4513';
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F0',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 50,
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 15,
        paddingBottom: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#5D4037',
        marginTop: 25,
        marginBottom: 15,
        marginLeft: 5,
    },
    featuredCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 8,
        marginBottom: 10,
    },
    featuredImg: {
        width: '100%',
        height: 200,
    },
    featuredContent: {
        padding: 20,
    },
    featuredBadge: {
        backgroundColor: '#8B4513',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 10,
    },
    featuredBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    featuredTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: 8,
        lineHeight: 24,
    },
    featuredResumen: {
        fontSize: 15,
        color: '#7E6B5A',
        lineHeight: 20,
        marginBottom: 12,
    },
    blogsGrid: {
        marginBottom: 20,
    },
    blogCard: {
        backgroundColor: '#FFF',
        borderRadius: 18,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
    },
    blogImg: {
        width: '100%',
        height: 160,
    },
    categoryBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#8B4513',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    categoryText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
    },
    blogContent: {
        padding: 16,
    },
    blogTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: 8,
        lineHeight: 22,
    },
    blogResumen: {
        fontSize: 14,
        color: '#7E6B5A',
        lineHeight: 19,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: '#9E8E7E',
        fontWeight: '500',
    },
    metaDot: {
        fontSize: 12,
        color: '#9E8E7E',
        marginHorizontal: 6,
    },
    readButton: {
        backgroundColor: '#8B4513',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 15,
    },
    readButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
});