const db = require('../config/db');

// Get all addresses for a user
exports.getAddresses = async (req, res) => {
    const userId = req.user.id;

    try {
        const [addresses] = await db.execute(
            'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
            [userId]
        );
        res.json(addresses);
    } catch (err) {
        console.error('Error fetching addresses:', err.message);
        res.status(500).json({ message: 'Server error fetching addresses' });
    }
};

// Create a new address
exports.createAddress = async (req, res) => {
    const userId = req.user.id;
    const { name, phone, address_line1, address_line2, is_default } = req.body;

    try {
        // Validate required fields
        if (!name || !phone || !address_line1) {
            return res.status(400).json({
                message: 'Name, phone, and address are required'
            });
        }

        // Validate phone format (basic validation for numbers)
        const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                message: 'Invalid phone number format'
            });
        }

        // If this is set as default, unset other defaults
        if (is_default) {
            await db.execute(
                'UPDATE addresses SET is_default = FALSE WHERE user_id = ?',
                [userId]
            );
        }

        // Insert new address
        const [result] = await db.execute(
            'INSERT INTO addresses (user_id, name, phone, address_line1, address_line2, is_default) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, name, phone, address_line1, address_line2 || null, is_default || false]
        );

        // Get the created address
        const [addresses] = await db.execute(
            'SELECT * FROM addresses WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            message: 'Address created successfully',
            address: addresses[0]
        });
    } catch (err) {
        console.error('Error creating address:', err.message);
        res.status(500).json({ message: 'Server error creating address' });
    }
};

// Update an existing address
exports.updateAddress = async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.id;
    const { name, phone, address_line1, address_line2, is_default } = req.body;

    try {
        // Check if address belongs to user
        const [addresses] = await db.execute(
            'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
            [addressId, userId]
        );

        if (addresses.length === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Validate required fields
        if (!name || !phone || !address_line1) {
            return res.status(400).json({
                message: 'Name, phone, and address are required'
            });
        }

        // Validate phone format
        const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                message: 'Invalid phone number format'
            });
        }

        // If this is set as default, unset other defaults
        if (is_default) {
            await db.execute(
                'UPDATE addresses SET is_default = FALSE WHERE user_id = ? AND id != ?',
                [userId, addressId]
            );
        }

        // Update address
        await db.execute(
            'UPDATE addresses SET name = ?, phone = ?, address_line1 = ?, address_line2 = ?, is_default = ? WHERE id = ? AND user_id = ?',
            [name, phone, address_line1, address_line2 || null, is_default || false, addressId, userId]
        );

        // Get updated address
        const [updatedAddresses] = await db.execute(
            'SELECT * FROM addresses WHERE id = ?',
            [addressId]
        );

        res.json({
            message: 'Address updated successfully',
            address: updatedAddresses[0]
        });
    } catch (err) {
        console.error('Error updating address:', err.message);
        res.status(500).json({ message: 'Server error updating address' });
    }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.id;

    try {
        // Check if address belongs to user
        const [addresses] = await db.execute(
            'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
            [addressId, userId]
        );

        if (addresses.length === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Delete address
        await db.execute(
            'DELETE FROM addresses WHERE id = ? AND user_id = ?',
            [addressId, userId]
        );

        res.json({ message: 'Address deleted successfully' });
    } catch (err) {
        console.error('Error deleting address:', err.message);
        res.status(500).json({ message: 'Server error deleting address' });
    }
};

// Set an address as default
exports.setDefaultAddress = async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.id;

    try {
        // Check if address belongs to user
        const [addresses] = await db.execute(
            'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
            [addressId, userId]
        );

        if (addresses.length === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Unset all defaults for this user
        await db.execute(
            'UPDATE addresses SET is_default = FALSE WHERE user_id = ?',
            [userId]
        );

        // Set this address as default
        await db.execute(
            'UPDATE addresses SET is_default = TRUE WHERE id = ? AND user_id = ?',
            [addressId, userId]
        );

        // Get updated address
        const [updatedAddresses] = await db.execute(
            'SELECT * FROM addresses WHERE id = ?',
            [addressId]
        );

        res.json({
            message: 'Default address updated successfully',
            address: updatedAddresses[0]
        });
    } catch (err) {
        console.error('Error setting default address:', err.message);
        res.status(500).json({ message: 'Server error setting default address' });
    }
};
