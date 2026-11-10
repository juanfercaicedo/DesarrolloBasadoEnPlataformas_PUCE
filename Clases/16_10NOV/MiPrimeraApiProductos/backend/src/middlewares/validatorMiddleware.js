const validarProducto = (req, res, next) => {
  const { nombre, categoria, pvp } = req.body || {};

  if (typeof nombre !== 'string' || !nombre.trim()
      || typeof categoria !== 'string' || !categoria.trim()
      || pvp === undefined || pvp === null || pvp === '') {
    return res.status(400).json({
      status: 'error',
      message: 'Faltan campos obligatorios: nombre, categoria, pvp.'
    });
  }

  const price = Number(pvp);
  if (!Number.isFinite(price) || price <= 0) {
    return res.status(400).json({
      status: 'error',
      message: 'El campo pvp debe ser un número mayor a cero.'
    });
  }

  next();
};

module.exports = { validarProducto };