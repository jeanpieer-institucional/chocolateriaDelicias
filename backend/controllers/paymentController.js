const culqiService = require('../services/culqiService');
const db = require('../config/db');

/**
 * Procesar pago con Culqi y crear pedido
 */
const processPayment = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const {
            token,          // Token de Culqi
            items,          // Items del pedido
            addressId,
            shippingCost,
            notes
        } = req.body;

        const userId = req.user.id;

        console.log('Processing payment for user:', userId);
        console.log('Payment data:', { token: token ? 'present' : 'missing', items: items?.length, addressId });

        // Obtener información del usuario desde la base de datos
        const [users] = await connection.query(
            'SELECT email, name FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const userEmail = users[0].email;
        console.log('User email retrieved:', userEmail);

        // Validaciones
        if (!token) {
            console.error('Payment token missing');
            return res.status(400).json({ message: 'Token de pago requerido' });
        }

        if (!items || items.length === 0) {
            console.error('Order items missing');
            return res.status(400).json({ message: 'Items del pedido requeridos' });
        }

        if (!addressId) {
            console.error('Address ID missing');
            return res.status(400).json({ message: 'Dirección de envío requerida' });
        }

        await connection.beginTransaction();

        // 1. Calcular total del pedido
        let subtotal = 0;
        for (const item of items) {
            const [products] = await connection.query(
                'SELECT price FROM products WHERE id = ?',
                [item.productId]
            );

            if (products.length === 0) {
                throw new Error(`Producto ${item.productId} no encontrado`);
            }

            subtotal += parseFloat(products[0].price) * item.quantity;
        }

        const shipping = parseFloat(shippingCost) || 0;
        const totalAmount = subtotal + shipping;

        console.log('Order total calculated:', { subtotal, shipping, totalAmount });

        // 2. Convertir a centavos para Culqi
        const amountInCents = Math.round(totalAmount * 100);

        // 3. Obtener nombre y apellido del usuario
        const userName = users[0].name || '';
        const nameParts = userName.trim().split(' ');
        const firstName = nameParts[0] || 'Cliente';
        const lastName = nameParts.slice(1).join(' ') || 'Choco Delicia';

        // 4. Procesar pago con Culqi
        console.log('Creating Culqi charge:', { amountInCents, email: userEmail, firstName, lastName });
        const paymentResult = await culqiService.createCharge({
            token: token,
            amount: amountInCents,
            email: userEmail,
            firstName: firstName,
            lastName: lastName,
            description: `Pedido Choco Delicia - ${userName}`
        });

        console.log('Culqi payment result:', { success: paymentResult.success, error: paymentResult.error });

        if (!paymentResult.success) {
            await connection.rollback();
            return res.status(400).json({
                message: 'Pago rechazado',
                error: paymentResult.error,
                code: paymentResult.code
            });
        }

        // 5. Crear pedido en la base de datos
        const [orderResult] = await connection.query(
            `INSERT INTO orders (
                user_id, 
                address_id, 
                total_amount, 
                shipping_cost, 
                payment_method, 
                payment_status,
                payment_id,
                transaction_id,
                notes, 
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                addressId,
                totalAmount,
                shipping,
                'card',
                'paid',
                paymentResult.charge.id,
                paymentResult.charge.reference_code,
                notes || null,
                'processing' // Pago confirmado, pedido listo para preparar
            ]
        );

        const orderId = orderResult.insertId;
        console.log('Order created:', orderId);

        // 5. Insertar items del pedido
        for (const item of items) {
            const [products] = await connection.query(
                'SELECT price FROM products WHERE id = ?',
                [item.productId]
            );

            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)',
                [orderId, item.productId, item.quantity, products[0].price]
            );
        }

        await connection.commit();

        console.log('Payment processed successfully:', { orderId, paymentId: paymentResult.charge.id });

        res.status(201).json({
            message: 'Pago procesado y pedido creado exitosamente',
            orderId: orderId,
            paymentId: paymentResult.charge.id,
            transactionId: paymentResult.charge.reference_code
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error processing payment:', error);
        res.status(500).json({
            message: 'Error al procesar el pago',
            error: error.message
        });
    } finally {
        connection.release();
    }
};

/**
 * Webhook de Culqi para recibir notificaciones de eventos
 */
const handleWebhook = async (req, res) => {
    try {
        const webhookData = req.body;

        // Validar webhook
        if (!culqiService.validateWebhook(webhookData)) {
            return res.status(400).json({ message: 'Invalid webhook data' });
        }

        console.log('Culqi Webhook received:', webhookData);

        // Procesar según el tipo de evento
        const eventType = webhookData.object;

        if (eventType === 'event') {
            const event = webhookData;

            // Manejar diferentes tipos de eventos
            switch (event.type) {
                case 'charge.succeeded':
                    // Pago exitoso
                    await handleChargeSucceeded(event.data);
                    break;

                case 'charge.failed':
                    // Pago fallido
                    await handleChargeFailed(event.data);
                    break;

                case 'refund.created':
                    // Reembolso creado
                    await handleRefundCreated(event.data);
                    break;

                default:
                    console.log('Unhandled event type:', event.type);
            }
        }

        // Responder a Culqi
        res.status(200).json({ received: true });

    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ message: 'Error processing webhook' });
    }
};

/**
 * Manejar evento de pago exitoso
 */
const handleChargeSucceeded = async (chargeData) => {
    try {
        const paymentId = chargeData.id;

        // Actualizar estado del pedido
        await db.query(
            'UPDATE orders SET payment_status = ? WHERE payment_id = ?',
            ['paid', paymentId]
        );

        console.log(`Payment ${paymentId} marked as paid`);
    } catch (error) {
        console.error('Error handling charge succeeded:', error);
    }
};

/**
 * Manejar evento de pago fallido
 */
const handleChargeFailed = async (chargeData) => {
    try {
        const paymentId = chargeData.id;
        const errorMessage = chargeData.outcome?.user_message || 'Payment failed';

        // Actualizar estado del pedido
        await db.query(
            'UPDATE orders SET payment_status = ?, payment_error = ? WHERE payment_id = ?',
            ['failed', errorMessage, paymentId]
        );

        console.log(`Payment ${paymentId} marked as failed`);
    } catch (error) {
        console.error('Error handling charge failed:', error);
    }
};

/**
 * Manejar evento de reembolso
 */
const handleRefundCreated = async (refundData) => {
    try {
        const chargeId = refundData.charge_id;

        // Actualizar estado del pedido
        await db.query(
            'UPDATE orders SET payment_status = ? WHERE payment_id = ?',
            ['refunded', chargeId]
        );

        console.log(`Payment ${chargeId} refunded`);
    } catch (error) {
        console.error('Error handling refund:', error);
    }
};

module.exports = {
    processPayment,
    handleWebhook
};
