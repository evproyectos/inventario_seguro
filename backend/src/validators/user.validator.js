const { body, param } = require('express-validator');

const validarUsuario = [
  body('username')
    .trim()
    .notEmpty().withMessage('El username es requerido.')
    .isAlphanumeric().withMessage('El username solo puede contener letras y números.')
    .isLength({ min: 3, max: 50 }).withMessage('El username debe tener entre 3 y 50 caracteres.'),

  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido.')
    .isEmail().withMessage('El email no tiene un formato válido.')
    .isLength({ max: 100 }).withMessage('El email no puede superar 100 caracteres.'),

  body('password')
    .notEmpty().withMessage('La contraseña es requerida.')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
    .matches(/[A-Z]/).withMessage('La contraseña debe tener al menos una mayúscula.')
    .matches(/[0-9]/).withMessage('La contraseña debe tener al menos un número.'),

  body('role_id')
    .notEmpty().withMessage('El rol es requerido.')
    .isInt({ min: 1 }).withMessage('El rol debe ser un ID válido.'),
];

const validarUsuarioEdicion = [
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('El email no tiene un formato válido.')
    .isLength({ max: 100 }).withMessage('El email no puede superar 100 caracteres.'),

  body('password')
    .optional()
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
    .matches(/[A-Z]/).withMessage('La contraseña debe tener al menos una mayúscula.')
    .matches(/[0-9]/).withMessage('La contraseña debe tener al menos un número.'),

  body('role_id')
    .optional()
    .isInt({ min: 1 }).withMessage('El rol debe ser un ID válido.'),
];

const validarId = [
  param('id')
    .isInt({ min: 1 }).withMessage('El ID debe ser un número entero válido.'),
];

module.exports = { validarUsuario, validarUsuarioEdicion, validarId };