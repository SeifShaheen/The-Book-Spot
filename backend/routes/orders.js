const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/history', orderController.getCustomerOrders);

module.exports = router;
