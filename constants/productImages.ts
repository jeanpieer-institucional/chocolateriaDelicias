// Mapeo de imágenes locales para productos
// Este archivo permite usar imágenes locales en lugar de URLs de la base de datos

export const productImages: Record<string, any> = {
    // Bombones
    'bombon': require('../assets/images/bombon.png'),
    'bombones': require('../assets/images/bombones.png'),

    // Trufas
    'trufas': require('../assets/images/trufas.png'),
    'trufa bailey': require('../assets/images/trufaBailey.png'),
    'trufa blanca': require('../assets/images/trufaBlanc.png'),
    'trufa coco': require('../assets/images/trufaCoco.png'),
    'trufa dark': require('../assets/images/trufaDark.png'),
    'trufa menta': require('../assets/images/trufaMenta.png'),
    'trufa naranja': require('../assets/images/trufaNaranja.png'),

    // Tabletas
    'tabletas': require('../assets/images/tabletas.png'),

    // Brownies
    'brownie': require('../assets/images/brownie.png'),
    'brownies': require('../assets/images/brownie.png'),

    // Sabores/Ingredientes
    'almendra': require('../assets/images/almendra.png'),
    'avellana': require('../assets/images/avellana.png'),
    'cafe': require('../assets/images/cafe.png'),
    'caramelo': require('../assets/images/caramelo.png'),
    'fresa': require('../assets/images/fresa.png'),
    'frutos rojos': require('../assets/images/frutosRojos.png'),
    'maracuya': require('../assets/images/maracuya.png'),
    'nibs': require('../assets/images/nibs.png'),
    'crocante': require('../assets/images/crocante.png'),

    // Categorías
    'chocolate artesanal': require('../assets/images/chocoArtesanal.png'),
    'tradicional': require('../assets/images/tradicional.png'),
    'regalos': require('../assets/images/regalos.png'),
    'seleccion': require('../assets/images/seleccion.png'),

    // Otros
    'beneficios': require('../assets/images/beneficios.png'),
    'gracia': require('../assets/images/gracia.png'),
    'peru': require('../assets/images/peru.png'),
    'templado': require('../assets/images/templado.png'),
    'chocolate_bg': require('../assets/images/chocolate_bg.png'),
};

// Imagen por defecto
export const defaultProductImage = require('../assets/images/bombon.png');

/**
 * Obtiene la imagen local para un producto basado en su nombre
 * @param productName - Nombre del producto o categoría
 * @param imageFileName - Nombre del archivo de imagen (sin extensión) de la BD (opcional)
 * @returns Recurso de imagen local
 */
export const getProductImage = (productName: string, imageFileName?: string): any => {
    // Normalizar el nombre a minúsculas
    const normalizedName = productName.toLowerCase().trim();

    // Si hay un nombre de archivo de la BD, intentar usarlo primero
    if (imageFileName) {
        const normalizedFileName = imageFileName.replace(/\.(png|jpg|jpeg|webp)$/i, '').toLowerCase();
        if (productImages[normalizedFileName]) {
            return productImages[normalizedFileName];
        }
    }

    // Buscar por nombre de producto
    if (productImages[normalizedName]) {
        return productImages[normalizedName];
    }

    // Buscar coincidencia parcial
    const partialMatch = Object.keys(productImages).find(key =>
        normalizedName.includes(key) || key.includes(normalizedName)
    );

    if (partialMatch) {
        return productImages[partialMatch];
    }

    // Retornar imagen por defecto
    return defaultProductImage;
};

/**
 * Obtiene la imagen local para una categoría
 * @param categoryName - Nombre de la categoría
 * @returns Recurso de imagen local
 */
export const getCategoryImage = (categoryName: string): any => {
    const normalizedName = categoryName.toLowerCase().trim();

    // Mapeo específico de categorías
    const categoryMap: Record<string, string> = {
        'bombones': 'bombones',
        'trufas': 'trufas',
        'tabletas': 'tabletas',
        'brownies': 'brownie',
        'chocolate artesanal': 'chocolate artesanal',
        'tradicional': 'tradicional',
        'regalos': 'regalos',
        'selección': 'seleccion',
    };

    const mappedKey = categoryMap[normalizedName];
    if (mappedKey && productImages[mappedKey]) {
        return productImages[mappedKey];
    }

    return getProductImage(categoryName);
};
