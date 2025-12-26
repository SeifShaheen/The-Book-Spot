const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

// Customer Orders moved to /api/orders

// Admin Routes (Should be protected)
router.post('/register-admin', authController.registerAdmin);
router.post('/authors', adminController.addAuthor);
router.get('/authors', adminController.getAuthors);
router.post('/publishers', adminController.addPublisher);
router.get('/publishers', adminController.getPublishers);
router.get('/supply', adminController.getSupplyOrders);
router.post('/supply/confirm', adminController.confirmSupplyOrder);
router.post('/supply/cancel', adminController.cancelSupplyOrder);
router.get('/reports/sales', adminController.getSalesLastMonth);
router.get('/reports/sales-by-date', adminController.getSalesByDate);
router.get('/reports/customers', adminController.getTopCustomers);
router.get('/reports/books', adminController.getTopBooks);
router.get('/reports/reorders', adminController.getBookReorderCount);
router.get('/reports/low-stock', adminController.getLowStockBooks);
router.get('/database/:tableName', adminController.getDatabaseTable);

module.exports = router;
