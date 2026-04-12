const AuditLog = require('../models/AuditLog');

const listar = async (req, res) => {
  try {
    const logs = await AuditLog.findAll({
      order: [['created_at', 'DESC']],
      limit: 200,
    });
    return res.json(logs);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Error al obtener logs de auditoría.' });
  }
};

module.exports = { listar };