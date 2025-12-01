const express = require('express');
const router = express.Router();
const { getCategories, getAllProducts } = require('../controllers/productController');

router.get('/categories', getCategories);
router.get('/', getAllProducts);

module.exports = router;
