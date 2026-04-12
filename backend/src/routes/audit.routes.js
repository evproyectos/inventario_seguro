const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/audit.controller');
const { verificarToken } = require('../middleware/auth');
const { verificarPermiso } = require('../middleware/rbac');

router.get('/',
  verificarToken,
  verificarPermiso('VER_AUDIT'),
  ctrl.listar
);

module.exports = router;