const db = require('../config/db');

exports.getCart = async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await db.execute(
            `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url 
             FROM cart_items c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.addToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    try {
        // Check if item exists
        const [existing] = await db.execute(
            'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (existing.length > 0) {
            // Update quantity
            const newQuantity = existing[0].quantity + quantity;
            await db.execute(
                'UPDATE cart_items SET quantity = ? WHERE id = ?',
                [newQuantity, existing[0].id]
            );
        } else {
            // Insert new item
            await db.execute(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, productId, quantity]
            );
        }

        res.json({ message: 'Item added to cart' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateCartItem = async (req, res) => {
    const userId = req.user.id;
    const itemId = req.params.id;
    const { quantity } = req.body;

    try {
        if (quantity < 1) {
            await db.execute('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [itemId, userId]);
        } else {
            await db.execute('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, itemId, userId]);
        }
        res.json({ message: 'Cart updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const itemId = req.params.id;

    try {
        await db.execute('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [itemId, userId]);
        res.json({ message: 'Item removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
