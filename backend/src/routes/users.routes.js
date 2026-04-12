const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/users.controller');
const { verificarToken } = require('../middleware/auth');
const { verificarPermiso } = require('../middleware/rbac');
const { validarUsuario, validarUsuarioEdicion, validarId } = require('../validators/user.validator');
const { manejarValidacion } = require('../middleware/validationHandler');

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Usuarios]
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de usuarios sin password_hash.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso.
 */
router.get('/',
  verificarToken,
  verificarPermiso('VER_USUARIOS'),
  ctrl.listar
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado.
 *       404:
 *         description: Usuario no encontrado.
 */
router.get('/:id',
  verificarToken,
  verificarPermiso('VER_USUARIOS'),
  validarId,
  manejarValidacion,
  ctrl.obtener
);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Crear un usuario
 *     tags: [Usuarios]
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password, role_id]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Usuario creado.
 *       400:
 *         description: Datos inválidos o usuario ya existe.
 *       403:
 *         description: Sin permiso.
 */
router.post('/',
  verificarToken,
  verificarPermiso('CRUD_USUARIOS'),
  validarUsuario,
  manejarValidacion,
  ctrl.crear
);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Editar un usuario
 *     tags: [Usuarios]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario actualizado.
 *       403:
 *         description: Sin permiso.
 *       404:
 *         description: Usuario no encontrado.
 */
router.put('/:id',
  verificarToken,
  verificarPermiso('CRUD_USUARIOS'),
  validarUsuarioEdicion,
  validarId,
  manejarValidacion,
  ctrl.editar
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado.
 *       400:
 *         description: No podés eliminar tu propio usuario.
 *       403:
 *         description: Sin permiso.
 *       404:
 *         description: Usuario no encontrado.
 */
router.delete('/:id',
  verificarToken,
  verificarPermiso('CRUD_USUARIOS'),
  validarId,
  manejarValidacion,
  ctrl.eliminar
);

module.exports = router;