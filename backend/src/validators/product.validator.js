const { body, param } = require('express-validator');

const validarProducto = [
  body('codigo')
    .trim()
    .notEmpty().withMessage('El código es requerido.')
    .isAlphanumeric().withMessage('El código solo puede contener letras y números.')
    .isLength({ max: 50 }).withMessage('El código no puede superar 50 caracteres.'),

  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido.')
    .isLength({ max: 100 }).withMessage('El nombre no puede superar 100 caracteres.'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede superar 500 caracteres.'),

  body('cantidad')
    .notEmpty().withMessage('La cantidad es requerida.')
    .isInt({ min: 0 }).withMessage('La cantidad debe ser un número entero mayor o igual a 0.'),

  body('precio')
    .notEmpty().withMessage('El precio es requerido.')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0.'),
];

const validarId = [
  param('id')
    .isInt({ min: 1 }).withMessage('El ID debe ser un número entero válido.'),
];

module.exports = { validarProducto, validarId };