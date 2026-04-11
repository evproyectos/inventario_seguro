const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/users.controller');
const { verificarToken } = require('../middleware/auth');
const { verificarPermiso } = require('../middleware/rbac');
const { validarUsuario, validarUsuarioEdicion, validarId } = require('../validators/user.validator');
const { manejarValidacion } = require('../middleware/validationHandler');

router.get('/',
  verificarToken,
  verificarPermiso('VER_USUARIOS'),
  ctrl.listar
);

router.get('/:id',
  verificarToken,
  verificarPermiso('VER_USUARIOS'),
  validarId,
  manejarValidacion,
  ctrl.obtener
);

router.post('/',
  verificarToken,
  verificarPermiso('CRUD_USUARIOS'),
  validarUsuario,
  manejarValidacion,
  ctrl.crear
);

router.put('/:id',
  verificarToken,
  verificarPermiso('CRUD_USUARIOS'),
  validarUsuarioEdicion,
  validarId,
  manejarValidacion,
  ctrl.editar
);

router.delete('/:id',
  verificarToken,
  verificarPermiso('CRUD_USUARIOS'),
  validarId,
  manejarValidacion,
  ctrl.eliminar
);

module.exports = router;