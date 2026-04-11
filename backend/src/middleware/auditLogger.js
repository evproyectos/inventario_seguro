const AuditLog = require('../models/AuditLog');

const registrarEvento = async ({
  usuario_id = null,
  username = null,
  accion,
  entidad = null,
  entidad_id = null,
  detalle = null,
  ip = null,
  resultado = 'OK',
}) => {
  try {
    await AuditLog.create({
      usuario_id,
      username,
      accion,
      entidad,
      entidad_id,
      detalle,
      ip,
      resultado,
    });
  } catch (error) {
    console.error('Error al registrar en auditoría:', error.message);
  }
};

module.exports = { registrarEvento };