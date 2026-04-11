const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
  },
  username: {
    type: DataTypes.STRING(50),
  },
  accion: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  entidad: {
    type: DataTypes.STRING(50),
  },
  entidad_id: {
    type: DataTypes.INTEGER,
  },
  detalle: {
    type: DataTypes.TEXT,
  },
  ip: {
    type: DataTypes.STRING(45),
  },
  resultado: {
    type: DataTypes.STRING(20),
  },
}, {
  tableName: 'audit_log',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = AuditLog;