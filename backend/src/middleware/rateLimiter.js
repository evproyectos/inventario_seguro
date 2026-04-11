const rateLimit = require('express-rate-limit');
const { registrarEvento } = require('./auditLogger');

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  handler: async (req, res) => {
    await registrarEvento({
      usuario_id: null,
      username: req.body.username || 'desconocido',
      accion: 'LOGIN_BLOQUEADO',
      entidad: 'auth',
      detalle: `IP bloqueada por exceder intentos fallidos`,
      ip: req.ip,
      resultado: 'BLOQUEADO',
    });

    res.status(429).json({
      error: 'Demasiados intentos fallidos. Bloqueado por 5 minutos.',
    });
  },
});

module.exports = { loginLimiter };