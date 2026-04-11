const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/auth.controller');
const { loginLimiter } = require('../middleware/rateLimiter');
const { verificarToken } = require('../middleware/auth');

router.post('/login', loginLimiter, login);
router.post('/logout', verificarToken, logout);

module.exports = router;