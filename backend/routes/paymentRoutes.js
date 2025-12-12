const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

// Procesar pago (requiere autenticación)
router.post('/charge', authMiddleware, paymentController.processPayment);

// Webhook de Culqi (NO requiere autenticación)
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
