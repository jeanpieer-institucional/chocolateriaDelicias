const db = require('../config/db');

exports.createOrder = async (req, res) => {
    const userId = req.user.id;
    const { items } = req.body; // items: [{ productId, quantity }]

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

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

        // Create Order
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
            [userId, totalAmount, 'pending']
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
            totalAmount: totalAmount
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
            'SELECT id, total_amount as total, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC',
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
            'SELECT id, total_amount as total, status, created_at FROM orders WHERE id = ? AND user_id = ?',
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
