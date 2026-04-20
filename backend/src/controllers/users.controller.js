const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const { registrarEvento } = require('../middleware/auditLogger');

const listar = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      where: { activo: true },
      attributes: { exclude: ['password_hash'] },
      include: [{ model: Role, as: 'role', attributes: ['id', 'nombre'] }],
      order: [['created_at', 'DESC']],
    });

    const { QueryTypes } = require('sequelize');
    const { sequelize } = require('../config/database');

    const ipsUltimosLogins = await sequelize.query(`
      SELECT DISTINCT ON (username) username, ip, created_at
      FROM audit_log
      WHERE accion = 'LOGIN_EXITOSO'
      ORDER BY username, created_at DESC
    `, { type: QueryTypes.SELECT });

    const ipMap = {};
    ipsUltimosLogins.forEach(row => {
      ipMap[row.username] = row.ip;
    });

    const resultado = usuarios.map(u => ({
      ...u.toJSON(),
      ultimo_login_ip: ipMap[u.username] || null,
    }));

    return res.json(resultado);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Error al obtener usuarios.' });
  }
};

const obtener = async (req, res) => {
  try {
    const usuario = await User.findOne({
      where: { id: req.params.id, activo: true },
      attributes: { exclude: ['password_hash'] },
      include: [{ model: Role, as: 'role', attributes: ['id', 'nombre'] }],
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado.' });
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener usuario.' });
  }
};

const crear = async (req, res) => {
  try {
    const { username, email, password, role_id } = req.body;
    const password_hash = await bcrypt.hash(password, 12);
    const usuario = await User.create({ username, email, password_hash, role_id });

    await registrarEvento({
      usuario_id: req.user.id,
      username: req.user.username,
      accion: 'CREAR_USUARIO',
      entidad: 'users',
      entidad_id: usuario.id,
      detalle: `Usuario creado: ${username}`,
      ip: req.ip,
      resultado: 'OK',
    });

    return res.status(201).json({
      id: usuario.id,
      username: usuario.username,
      email: usuario.email,
      role_id: usuario.role_id,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El username o email ya existe.' });
    }
    return res.status(500).json({ error: 'Error al crear usuario.' });
  }
};

const editar = async (req, res) => {
  try {
    const usuario = await User.findOne({
      where: { id: req.params.id, activo: true },
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado.' });

    const { email, password, role_id } = req.body;
    const cambios = {};

    if (email) cambios.email = email;
    if (role_id) cambios.role_id = role_id;
    if (password) cambios.password_hash = await bcrypt.hash(password, 12);

    await usuario.update(cambios);

    await registrarEvento({
      usuario_id: req.user.id,
      username: req.user.username,
      accion: 'EDITAR_USUARIO',
      entidad: 'users',
      entidad_id: usuario.id,
      detalle: `Usuario editado: ${usuario.username}${role_id ? ' (cambio de rol)' : ''}`,
      ip: req.ip,
      resultado: 'OK',
    });

    return res.json({ mensaje: 'Usuario actualizado correctamente.' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El email ya existe.' });
    }
    return res.status(500).json({ error: 'Error al editar usuario.' });
  }
};

const eliminar = async (req, res) => {
  try {
    const usuario = await User.findOne({
      where: { id: req.params.id, activo: true },
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado.' });

    if (usuario.id === req.user.id) {
      return res.status(400).json({ error: 'No podés eliminar tu propio usuario.' });
    }

    await usuario.update({ activo: false });

    await registrarEvento({
      usuario_id: req.user.id,
      username: req.user.username,
      accion: 'ELIMINAR_USUARIO',
      entidad: 'users',
      entidad_id: usuario.id,
      detalle: `Usuario eliminado: ${usuario.username}`,
      ip: req.ip,
      resultado: 'OK',
    });

    return res.json({ mensaje: 'Usuario eliminado correctamente.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar usuario.' });
  }
};

module.exports = { listar, obtener, crear, editar, eliminar };