const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/audit.controller');
const { verificarToken } = require('../middleware/auth');
const { verificarPermiso } = require('../middleware/rbac');

/**
 * @openapi
 * /audit:
 *   get:
 *     summary: Obtener log de auditoría
 *     tags: [Auditoría]
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de eventos de auditoría. Solo accesible para SuperAdmin.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permiso.
 */
router.get('/',
  verificarToken,
  verificarPermiso('VER_AUDIT'),
  ctrl.listar
);

module.exports = router;