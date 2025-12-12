/**
 * Servicio para interactuar con la API de Culqi
 * Usa llamadas HTTP directas en lugar del SDK para mayor control
 */


/**
 * Crear un cargo en Culqi usando la API REST directamente
 * @param {Object} chargeData - Datos del cargo
 * @param {string} chargeData.token - Token de Culqi generado en el frontend
 * @param {number} chargeData.amount - Monto en centavos (ej: 3240 = S/ 32.40)
 * @param {string} chargeData.email - Email del cliente
 * @param {string} chargeData.firstName - Nombre del cliente
 * @param {string} chargeData.lastName - Apellido del cliente
 * @param {string} chargeData.description - Descripción del cargo
 * @returns {Promise<Object>} - Respuesta de Culqi
 */
const createCharge = async (chargeData) => {
    try {
        const { token, amount, email, firstName, lastName, description } = chargeData;

        console.log('Culqi createCharge called with:', {
            token: token ? `${token.substring(0, 10)}...` : 'missing',
            amount,
            email,
            firstName,
            lastName,
            description
        });

        // Validar datos críticos
        if (!token) {
            throw new Error('Token de pago es requerido');
        }

        if (!amount || amount <= 0) {
            throw new Error('Monto inválido');
        }

        if (!email) {
            throw new Error('Email es requerido');
        }

        // Preparar datos para Culqi
        const chargePayload = {
            amount: amount,
            currency_code: 'PEN',
            email: email,
            source_id: token,
            description: description || 'Compra en Choco Delicia'
        };

        // Agregar metadata con información del comprador si está disponible
        if (firstName || lastName) {
            chargePayload.metadata = {
                nombre: firstName || '',
                apellido: lastName || ''
            };
        }

        // Agregar información del comprador para antifraud
        if (firstName && lastName) {
            chargePayload.antifraud_details = {
                first_name: firstName,
                last_name: lastName,
                email: email
            };
        }

        console.log('Calling Culqi API to create charge...');
        console.log('Payload:', chargePayload);

        // Llamar a la API de Culqi directamente
        const response = await fetch('https://api.culqi.com/v2/charges', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.CULQI_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chargePayload)
        });

        const responseData = await response.json();
        console.log('Culqi API response status:', response.status);
        console.log('Culqi API response:', responseData);

        if (!response.ok) {
            // Error de Culqi
            const errorMessage = responseData.user_message || responseData.merchant_message || 'Error al procesar el pago';
            throw new Error(errorMessage);
        }

        console.log('Culqi charge created successfully:', responseData.id);

        return {
            success: true,
            charge: responseData
        };
    } catch (error) {
        console.error('Error creating Culqi charge:', error);
        console.error('Error details:', {
            message: error.message,
            merchant_message: error.merchant_message,
            user_message: error.user_message,
            code: error.code
        });

        // Extraer mensaje de error
        const errorMessage = error.merchant_message || error.user_message || error.message || 'Error al procesar el pago';

        return {
            success: false,
            error: errorMessage,
            code: error.code || 'UNKNOWN_ERROR'
        };
    }
};

/**
 * Obtener información de un cargo
 * @param {string} chargeId - ID del cargo en Culqi
 * @returns {Promise<Object>} - Información del cargo
 */
const getCharge = async (chargeId) => {
    try {
        const response = await fetch(`https://api.culqi.com/v2/charges/${chargeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.CULQI_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const charge = await response.json();

        if (!response.ok) {
            throw new Error(charge.user_message || 'Error al obtener el cargo');
        }

        return {
            success: true,
            charge: charge
        };
    } catch (error) {
        console.error('Error getting Culqi charge:', error);
        return {
            success: false,
            error: error.message || 'Error al obtener el cargo'
        };
    }
};

/**
 * Validar webhook de Culqi
 * @param {Object} webhookData - Datos del webhook
 * @returns {boolean} - True si el webhook es válido
 */
const validateWebhook = (webhookData) => {
    // Culqi envía eventos con estructura específica
    return webhookData && webhookData.object && webhookData.id;
};

module.exports = {
    createCharge,
    getCharge,
    validateWebhook
};
