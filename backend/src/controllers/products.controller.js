const Product = require('../models/Product');
const { registrarEvento } = require('../middleware/auditLogger');

const listar = async (req, res) => {
  try {
    const productos = await Product.findAll({
      where: { activo: true },
      order: [['created_at', 'DESC']],
    });
    return res.json(productos);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Error al obtener productos.' });
  }
};

const obtener = async (req, res) => {
  try {
    const producto = await Product.findOne({
      where: { id: req.params.id, activo: true },
    });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado.' });
    return res.json(producto);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener producto.' });
  }
};

const crear = async (req, res) => {
  try {
    const { codigo, nombre, descripcion, cantidad, precio } = req.body;
    const producto = await Product.create({ codigo, nombre, descripcion, cantidad, precio });

    await registrarEvento({
      usuario_id: req.user.id,
      username: req.user.username,
      accion: 'CREAR_PRODUCTO',
      entidad: 'products',
      entidad_id: producto.id,
      detalle: `Producto creado: ${nombre}`,
      ip: req.ip,
      resultado: 'OK',
    });

    return res.status(201).json(producto);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El código de producto ya existe.' });
    }
    return res.status(500).json({ error: 'Error al crear producto.' });
  }
};

const editar = async (req, res) => {
  try {
    const producto = await Product.findOne({
      where: { id: req.params.id, activo: true },
    });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado.' });

    const { codigo, nombre, descripcion, cantidad, precio } = req.body;
    await producto.update({ codigo, nombre, descripcion, cantidad, precio });

    await registrarEvento({
      usuario_id: req.user.id,
      username: req.user.username,
      accion: 'EDITAR_PRODUCTO',
      entidad: 'products',
      entidad_id: producto.id,
      detalle: `Producto editado: ${producto.nombre}`,
      ip: req.ip,
      resultado: 'OK',
    });

    return res.json(producto);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El código de producto ya existe.' });
    }
    return res.status(500).json({ error: 'Error al editar producto.' });
  }
};

const eliminar = async (req, res) => {
  try {
    const producto = await Product.findOne({
      where: { id: req.params.id, activo: true },
    });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado.' });

    await producto.update({ activo: false });

    await registrarEvento({
      usuario_id: req.user.id,
      username: req.user.username,
      accion: 'ELIMINAR_PRODUCTO',
      entidad: 'products',
      entidad_id: producto.id,
      detalle: `Producto eliminado: ${producto.nombre}`,
      ip: req.ip,
      resultado: 'OK',
    });

    return res.json({ mensaje: 'Producto eliminado correctamente.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar producto.' });
  }
};

module.exports = { listar, obtener, crear, editar, eliminar };