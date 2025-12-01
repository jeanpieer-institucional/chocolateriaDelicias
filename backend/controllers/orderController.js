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
