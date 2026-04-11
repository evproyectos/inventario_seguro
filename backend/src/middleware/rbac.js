const { registrarEvento } = require('./auditLogger');

const roles = {
  SuperAdmin:  ['CRUD_USUARIOS', 'CRUD_PRODUCTOS', 'VER_PRODUCTOS', 'VER_USUARIOS', 'CRUD_ROLES', 'VER_AUDIT', 'VER_REPORTES'],
  Auditor:     ['VER_USUARIOS', 'VER_PRODUCTOS'],
  Registrador: ['CRUD_PRODUCTOS', 'VER_PRODUCTOS', 'VER_USUARIOS'],
};

const verificarPermiso = (permisoRequerido) => {
  return async (req, res, next) => {
    const rolUsuario = req.user?.rol;
    const permisosDelRol = roles[rolUsuario] || [];

    if (!permisosDelRol.includes(permisoRequerido)) {
      await registrarEvento({
        usuario_id: req.user?.id,
        username: req.user?.username,
        accion: 'ACCESO_DENEGADO',
        detalle: `Permiso requerido: ${permisoRequerido} | Ruta: ${req.method} ${req.originalUrl}`,
        ip: req.ip,
        resultado: 'DENEGADO',
      });
      return res.status(403).json({ error: 'No tenés permiso para realizar esta acción.' });
    }

    next();
  };
};

module.exports = { verificarPermiso, roles };