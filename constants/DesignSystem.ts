// DesignSystem.ts - Sistema de diseño con tema oscuro/verde para ChocoDelicias

/**
 * Paleta de colores - Tema Oscuro/Verde
 * Basada en las imágenes de referencia proporcionadas
 */
export const Colors = {
    // Fondos oscuros
    dark: {
        background: '#0d1f1a',      // Fondo principal muy oscuro
        surface: '#1a2f2a',         // Superficie secundaria
        card: '#1e3a32',            // Fondo de cards
        cardHover: '#234239',       // Card en hover
        overlay: 'rgba(13, 31, 26, 0.9)', // Overlay oscuro
    },

    // Verde brillante (color primario)
    primary: {
        main: '#00ff88',            // Verde brillante principal
        light: '#33ffaa',           // Verde más claro
        dark: '#00cc6b',            // Verde más oscuro
        transparent: 'rgba(0, 255, 136, 0.15)', // Verde translúcido
    },

    // Textos
    text: {
        primary: '#ffffff',         // Texto principal blanco
        secondary: '#a0b0a8',       // Texto secundario gris verdoso
        disabled: '#6b7b73',        // Texto deshabilitado
        hint: '#8a9a92',           // Hints y placeholders
    },

    // Estados y alertas
    status: {
        success: '#00ff88',         // Éxito (verde brillante)
        error: '#ff4444',           // Error rojo
        warning: '#ffaa00',         // Advertencia naranja
        info: '#00b8ff',           // Información azul
    },

    // Badges y etiquetas
    badge: {
        new: '#00ff88',            // Badge "NUEVO"
        offer: '#ff4444',          // Badge "OFERTA"
        featured: '#00ff88',       // Badge "DESTACADO"
    },

    // Bordes y divisores
    border: {
        default: '#2a4a42',        // Borde por defecto
        light: '#3a5a52',          // Borde claro
        focus: '#00ff88',          // Borde en focus
    },
};

/**
 * Sistema de tipografía
 */
export const Typography = {
    sizes: {
        h1: 32,
        h2: 28,
        h3: 24,
        h4: 20,
        h5: 18,
        body: 16,
        bodySmall: 14,
        caption: 12,
        tiny: 10,
    },

    weights: {
        light: '300' as const,
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
        extrabold: '800' as const,
    },

    lineHeights: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
};

/**
 * Sistema de espaciado
 */
export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
    massive: 48,
};

/**
 * Radios de borde
 */
export const BorderRadius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    round: 50,
    circle: 9999,
};

/**
 * Sistema de sombras - Adaptado para tema oscuro
 */
export const Shadows = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },

    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    },

    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4,
    },

    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },

    // Sombra verde para elementos destacados
    glow: {
        shadowColor: '#00ff88',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
};

/**
 * Gradientes - Tema oscuro
 */
export const Gradients = {
    darkGreen: {
        colors: ['#1a2f2a', '#0d1f1a'],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
    },

    greenAccent: {
        colors: ['#00ff88', '#00cc6b'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 },
    },

    cardOverlay: {
        colors: ['transparent', 'rgba(13, 31, 26, 0.8)'],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
    },
};

/**
 * Animaciones
 */
export const Animations = {
    durations: {
        fast: 200,
        normal: 300,
        slow: 500,
    },

    springConfig: {
        damping: 15,
        stiffness: 150,
    },
};

/**
 * Opacidades
 */
export const Opacity = {
    disabled: 0.4,
    overlay: 0.9,
    subtle: 0.6,
    medium: 0.8,
    full: 1,
};

/**
 * Tamaños de iconos
 */
export const IconSizes = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
    huge: 48,
};

/**
 * Dimensiones comunes
 */
export const Dimensions = {
    buttonHeight: {
        small: 36,
        medium: 48,
        large: 56,
    },

    inputHeight: {
        small: 40,
        medium: 48,
        large: 56,
    },

    headerHeight: 60,
    tabBarHeight: 60,

    cardWidth: {
        small: 150,
        medium: 180,
        large: 220,
    },

    productCardHeight: 240,
};

export default {
    Colors,
    Typography,
    Spacing,
    BorderRadius,
    Shadows,
    Gradients,
    Animations,
    Opacity,
    IconSizes,
    Dimensions,
};
