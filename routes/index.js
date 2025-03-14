// routes/index.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const qrController = require('../controllers/qrController');

// Rotas públicas
router.get('/', authController.getLogin);
router.post('/login', authController.postLogin);

// Rotas protegidas
router.get('/qr/:userId', qrController.getQR);
router.get('/check-qr/:userId', qrController.checkQR);
router.post('/add-user', authController.addUser);
router.get('/logout', authController.logout);

module.exports = router;