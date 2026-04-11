const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/products.controller');
const { verificarToken } = require('../middleware/auth');
const { verificarPermiso } = require('../middleware/rbac');
const { validarProducto, validarId } = require('../validators/product.validator');
const { manejarValidacion } = require('../middleware/validationHandler');

router.get('/',
  verificarToken,
  verificarPermiso('VER_PRODUCTOS'),
  ctrl.listar
);

router.get('/:id',
  verificarToken,
  verificarPermiso('VER_PRODUCTOS'),
  validarId,
  manejarValidacion,
  ctrl.obtener
);

router.post('/',
  verificarToken,
  verificarPermiso('CRUD_PRODUCTOS'),
  validarProducto,
  manejarValidacion,
  ctrl.crear
);

router.put('/:id',
  verificarToken,
  verificarPermiso('CRUD_PRODUCTOS'),
  validarId,
  validarProducto,
  manejarValidacion,
  ctrl.editar
);

router.delete('/:id',
  verificarToken,
  verificarPermiso('CRUD_PRODUCTOS'),
  validarId,
  manejarValidacion,
  ctrl.eliminar
);

module.exports = router;