const db = require('../config/db');

exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.execute('SELECT * FROM categories');

        // For each category, fetch its products
        const categoriesWithProducts = await Promise.all(categories.map(async (category) => {
            const [products] = await db.execute('SELECT * FROM products WHERE category_id = ?', [category.id]);
            return {
                ...category,
                productos: products
            };
        }));

        res.json(categoriesWithProducts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products');
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
