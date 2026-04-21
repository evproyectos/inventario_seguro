const express = require('express');
const router = express.Router();
const { loginLimiter } = require('../middleware/rateLimiter');
const { verificarToken } = require('../middleware/auth');
const { login, logout, me } = require('../controllers/auth.controller');

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


/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Verificar sesión activa
 *     tags: [Auth]
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200:
 *         description: Sesión válida, devuelve datos del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: superadmin
 *                 email:
 *                   type: string
 *                   example: superadmin@sistema.com
 *                 rol:
 *                   type: string
 *                   example: SuperAdmin
 *       401:
 *         description: No autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', verificarToken, me);

module.exports = router;