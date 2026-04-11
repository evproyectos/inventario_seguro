const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const { registrarEvento } = require('../middleware/auditLogger');

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username y password son requeridos.' });
  }

  try {
    const user = await User.findOne({
      where: { username, activo: true },
      include: [{ model: Role, as: 'role' }],
    });

    if (!user) {
      await registrarEvento({
        username,
        accion: 'LOGIN_FALLIDO',
        detalle: 'Usuario no encontrado',
        ip: req.ip,
        resultado: 'FALLIDO',
      });
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const passwordValida = await bcrypt.compare(password, user.password_hash);

    if (!passwordValida) {
      await registrarEvento({
        usuario_id: user.id,
        username: user.username,
        accion: 'LOGIN_FALLIDO',
        detalle: 'Contraseña incorrecta',
        ip: req.ip,
        resultado: 'FALLIDO',
      });
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    await user.update({ ultimo_login: new Date() });

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      rol: user.role.nombre,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: parseInt(process.env.JWT_EXPIRES_IN),
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: parseInt(process.env.JWT_EXPIRES_IN) * 1000,
    });

    await registrarEvento({
      usuario_id: user.id,
      username: user.username,
      accion: 'LOGIN_EXITOSO',
      ip: req.ip,
      resultado: 'OK',
    });

    return res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: user.id,
        username: user.username,
        email: user.email,
        rol: user.role.nombre,
      },
    });
  } catch (error) {
    console.error('Error en login:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const logout = async (req, res) => {
  await registrarEvento({
    usuario_id: req.user?.id,
    username: req.user?.username,
    accion: 'LOGOUT',
    ip: req.ip,
    resultado: 'OK',
  });

  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return res.json({ mensaje: 'Sesión cerrada correctamente.' });
};

module.exports = { login, logout };