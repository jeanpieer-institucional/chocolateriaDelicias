import axios from 'axios';
import { Platform } from 'react-native';

// IMPORTANTE: Para Expo Go o dispositivo físico, usa tu IP local
// Para emulador de Android, usa 10.0.2.2
// Para simulador de iOS, usa localhost
const LOCAL_IP = /* '10.133.149.41' */ '10.83.39.41';

// Detectar si estamos en Expo Go o en un build nativo
const getBaseURL = () => {
    // Si estás usando Expo Go, SIEMPRE usa la IP local
    // Expo Go corre en un dispositivo físico, no hay emulador
    if (Platform.OS === 'android') {
        // Para Android Emulator usa 10.0.2.2
        // Para Expo Go en Android, usa LOCAL_IP
        // By default, asumimos Expo Go (más común)
        return `http://${LOCAL_IP}:3000/api`;
    } else if (Platform.OS === 'ios') {
        // Para iOS Simulator usa localhost
        // Para Expo Go en iOS, usa LOCAL_IP
        // By default, asumimos Expo Go (más común)
        return `http://${LOCAL_IP}:3000/api`;
    }
    return `http://${LOCAL_IP}:3000/api`;
};

const BASE_URL = getBaseURL();

console.log('🌐 API Base URL:', BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 segundos de timeout
});

// Interceptor para logging
api.interceptors.request.use(
    (config) => {
        console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Interceptor para logging de errores
api.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
    },
    async (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('⏱️ Request timeout - el servidor no responde');
        } else if (error.message === 'Network Error') {
            console.error('🔌 Network Error - verifica la conexión');
            console.error('URL intentada:', error.config?.url);
            console.error('Base URL:', BASE_URL);
        } else if (error.response) {
            console.error('❌ API Error:', error.response.status, error.response.data);

            // Manejar errores 401 (Token inválido o expirado)
            if (error.response.status === 401) {
                console.log('🔐 Token inválido o expirado - cerrando sesión...');

                // Importar AsyncStorage para limpiar la sesión
                const AsyncStorage = require('@react-native-async-storage/async-storage').default;

                try {
                    await AsyncStorage.removeItem('user');
                    await AsyncStorage.removeItem('token');
                    console.log('✅ Sesión cerrada automáticamente');

                    // Nota: El AuthContext detectará el cambio en el próximo render
                    // y redirigirá al usuario a la pantalla de login
                } catch (clearError) {
                    console.error('Error al limpiar sesión:', clearError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    register: (userData: any) => api.post('/auth/register', userData),
    login: (credentials: any) => api.post('/auth/login', credentials),
    updateProfile: (name: string, token: string) =>
        api.put('/auth/profile', { name }, {
            headers: { Authorization: `Bearer ${token}` }
        }),
    changePassword: (currentPassword: string, newPassword: string, token: string) =>
        api.put('/auth/password', { currentPassword, newPassword }, {
            headers: { Authorization: `Bearer ${token}` }
        }),
    uploadProfilePicture: (formData: FormData, token: string) =>
        api.post('/auth/profile-picture', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }),
};

export const productService = {
    getCategories: () => api.get('/products/categories'),
    getAllProducts: () => api.get('/products'),
};

export const orderService = {
    createOrder: (
        items: any[],
        token: string,
        addressId: number,
        paymentMethod: string,
        shippingCost: number,
        notes?: string
    ) =>
        api.post('/orders', {
            items,
            addressId,
            paymentMethod,
            shippingCost,
            notes
        }, {
            headers: { Authorization: `Bearer ${token}` }
        }),
    getOrders: (token: string) =>
        api.get('/orders', { headers: { Authorization: `Bearer ${token}` } }),
    getOrderById: (id: number, token: string) =>
        api.get(`/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
};

export const addressService = {
    getAddresses: (token: string) =>
        api.get('/addresses', { headers: { Authorization: `Bearer ${token}` } }),
    createAddress: (addressData: any, token: string) =>
        api.post('/addresses', addressData, { headers: { Authorization: `Bearer ${token}` } }),
    updateAddress: (id: number, addressData: any, token: string) =>
        api.put(`/addresses/${id}`, addressData, { headers: { Authorization: `Bearer ${token}` } }),
    deleteAddress: (id: number, token: string) =>
        api.delete(`/addresses/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
    setDefaultAddress: (id: number, token: string) =>
        api.put(`/addresses/${id}/default`, {}, { headers: { Authorization: `Bearer ${token}` } }),
};

export default api;
