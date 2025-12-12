const db = require('../config/db');

exports.createOrder = async (req, res) => {
    const userId = req.user.id;
    const { items, addressId, paymentMethod, shippingCost, notes } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
    }

    if (!addressId) {
        return res.status(400).json({ message: 'Shipping address is required' });
    }

    if (!paymentMethod) {
        return res.status(400).json({ message: 'Payment method is required' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Verify address belongs to user
        const [addresses] = await connection.execute(
            'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
            [addressId, userId]
        );

        if (addresses.length === 0) {
            throw new Error('Invalid address');
        }

        let totalAmount = 0;
        const orderItemsData = [];

        // Verify prices and calculate total
        for (const item of items) {
            const [products] = await connection.execute(
                'SELECT price FROM products WHERE id = ?',
                [item.productId]
            );

            if (products.length === 0) {
                throw new Error(`Product ${item.productId} not found`);
            }

            const price = parseFloat(products[0].price);
            totalAmount += price * item.quantity;
            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: price
            });
        }

        // Add shipping cost to total
        const finalShippingCost = parseFloat(shippingCost) || 0;
        const finalTotal = totalAmount + finalShippingCost;

        // Create Order
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (user_id, address_id, total_amount, shipping_cost, payment_method, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, addressId, finalTotal, finalShippingCost, paymentMethod, 'pending', notes || null]
        );

        const orderId = orderResult.insertId;

        // Create Order Items
        for (const item of orderItemsData) {
            await connection.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)',
                [orderId, item.productId, item.quantity, item.price]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: 'Order created successfully',
            orderId: orderId,
            totalAmount: finalTotal,
            shippingCost: finalShippingCost
        });

    } catch (error) {
        await connection.rollback();
        console.error('Order creation error:', error);
        res.status(500).json({ message: error.message || 'Server error creating order' });
    } finally {
        connection.release();
    }
};

exports.getOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const [orders] = await db.execute(
            `SELECT o.id, o.total_amount as total, o.shipping_cost, o.payment_method, 
                    o.status, o.notes, o.created_at,
                    a.name as address_name, a.phone as address_phone, 
                    a.address_line1, a.address_line2
             FROM orders o
             LEFT JOIN addresses a ON o.address_id = a.id
             WHERE o.user_id = ? 
             ORDER BY o.created_at DESC`,
            [userId]
        );
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
};

exports.getOrderById = async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;
    try {
        const [orders] = await db.execute(
            `SELECT o.id, o.total_amount as total, o.shipping_cost, o.payment_method,
                    o.status, o.notes, o.created_at,
                    a.name as address_name, a.phone as address_phone,
                    a.address_line1, a.address_line2
             FROM orders o
             LEFT JOIN addresses a ON o.address_id = a.id
             WHERE o.id = ? AND o.user_id = ?`,
            [orderId, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orders[0];

        const [items] = await db.execute(
            `SELECT oi.id, oi.quantity, oi.price_at_time as price, p.name as product_name, p.image 
             FROM order_items oi 
             JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = ?`,
            [orderId]
        );

        order.items = items;
        res.json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Server error fetching order details' });
    }
};

/**
 * Actualizar el estado de un pedido
 * Permite cambiar el estado de pending -> processing -> completed
 */
exports.updateOrderStatus = async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id;

    // Validar que el estado sea válido
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Invalid status. Valid options: pending, processing, completed, cancelled'
        });
    }

    try {
        // Verificar que el pedido existe y pertenece al usuario
        const [orders] = await db.execute(
            'SELECT id, status FROM orders WHERE id = ? AND user_id = ?',
            [orderId, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const currentStatus = orders[0].status;

        // Actualizar el estado
        await db.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, orderId]
        );

        console.log(`Order ${orderId} status updated: ${currentStatus} -> ${status}`);

        res.json({
            message: 'Order status updated successfully',
            orderId: orderId,
            previousStatus: currentStatus,
            newStatus: status
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error updating order status' });
    }
};
