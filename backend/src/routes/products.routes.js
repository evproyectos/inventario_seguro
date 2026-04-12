const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/products.controller');
const { verificarToken } = require('../middleware/auth');
const { verificarPermiso } = require('../middleware/rbac');
const { validarProducto, validarId } = require('../validators/product.validator');
const { manejarValidacion } = require('../middleware/validationHandler');

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Listar todos los productos
 *     tags: [Productos]
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de productos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso.
 */
router.get('/',
  verificarToken,
  verificarPermiso('VER_PRODUCTOS'),
  ctrl.listar
);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado.
 *       404:
 *         description: Producto no encontrado.
 */
router.get('/:id',
  verificarToken,
  verificarPermiso('VER_PRODUCTOS'),
  validarId,
  manejarValidacion,
  ctrl.obtener
);

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Crear un producto
 *     tags: [Productos]
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto creado.
 *       400:
 *         description: Datos inválidos.
 *       403:
 *         description: Sin permiso.
 */
router.post('/',
  verificarToken,
  verificarPermiso('CRUD_PRODUCTOS'),
  validarProducto,
  manejarValidacion,
  ctrl.crear
);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Editar un producto
 *     tags: [Productos]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado.
 *       403:
 *         description: Sin permiso.
 *       404:
 *         description: Producto no encontrado.
 */
router.put('/:id',
  verificarToken,
  verificarPermiso('CRUD_PRODUCTOS'),
  validarId,
  validarProducto,
  manejarValidacion,
  ctrl.editar
);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado.
 *       403:
 *         description: Sin permiso.
 *       404:
 *         description: Producto no encontrado.
 */
router.delete('/:id',
  verificarToken,
  verificarPermiso('CRUD_PRODUCTOS'),
  validarId,
  manejarValidacion,
  ctrl.eliminar
);

module.exports = router;