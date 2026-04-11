const jwt = require('jsonwebtoken');
const { registrarEvento } = require('./auditLogger');

const verificarToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    await registrarEvento({
      accion: 'ACCESO_DENEGADO',
      detalle: `Sin token: ${req.method} ${req.originalUrl}`,
      ip: req.ip,
      resultado: 'DENEGADO',
    });
    return res.status(401).json({ error: 'Acceso no autorizado. Iniciá sesión.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });

    req.user = payload;
    next();
  } catch (error) {
    await registrarEvento({
      accion: 'TOKEN_INVALIDO',
      detalle: `Token inválido o expirado: ${req.method} ${req.originalUrl}`,
      ip: req.ip,
      resultado: 'DENEGADO',
    });
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

module.exports = { verificarToken };