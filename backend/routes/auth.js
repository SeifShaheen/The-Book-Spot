const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile/:username', authController.getProfile);
router.put('/profile/:username', authController.updateProfile);
router.get('/profile/admin/:username', authController.getAdminProfile);
router.put('/profile/admin/:username', authController.updateAdminProfile);

module.exports = router;
