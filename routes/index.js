// routes/index.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const qrController = require('../controllers/qrController');

router.get('/', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/qr/:userId', qrController.getQR);
router.get('/check-qr/:userId', qrController.checkQR);
router.post('/add-user', authController.addUser);
router.post('/update-messages', authController.updateMessages);
router.get('/gestaoADM', authController.getGestaoADM);
router.get('/admin/users', authController.getAdminUsers);
router.get('/admin/users/edit/:userId', authController.getEditUserMessages);
router.post('/admin/update-user-messages', authController.updateUserMessages);
router.get('/logout', authController.logout);

module.exports = router;