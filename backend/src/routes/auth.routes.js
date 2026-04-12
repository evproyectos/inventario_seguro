const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/auth.controller');
const { loginLimiter } = require('../middleware/rateLimiter');
const { verificarToken } = require('../middleware/auth');

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: superadmin
 *               password:
 *                 type: string
 *                 example: Admin1234!
 *     responses:
 *       200:
 *         description: Login exitoso. Retorna JWT en cookie HttpOnly.
 *       401:
 *         description: Credenciales inválidas.
 *       429:
 *         description: Demasiados intentos. IP bloqueada 5 minutos.
 */
router.post('/login', loginLimiter, login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente.
 *       401:
 *         description: No autenticado.
 */
router.post('/logout', verificarToken, logout);

module.exports = router;