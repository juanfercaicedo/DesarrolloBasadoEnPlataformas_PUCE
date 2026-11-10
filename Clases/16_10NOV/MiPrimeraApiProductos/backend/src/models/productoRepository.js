const database = require('../config/databaseSingleton');

const productColumns = 'id, nombre, categoria, pvp';
const mapProduct = (row) => ({
  id: row.id,
  nombre: row.nombre,
  categoria: row.categoria,
  pvp: Number(row.pvp)
});

const parseId = (id) => {
  const parsedId = Number(id);
  return Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null;
};

const obtenerTodos = async () => {
  const { rows } = await database.query(
    `SELECT ${productColumns} FROM productos ORDER BY id`
  );
  return rows.map(mapProduct);
};

const obtenerPorId = async (id) => {
  const parsedId = parseId(id);
  if (parsedId === null) {
    return null;
  }

  const { rows } = await database.query(
    `SELECT ${productColumns} FROM productos WHERE id = $1`,
    [parsedId]
  );
  return rows[0] ? mapProduct(rows[0]) : null;
};

const crear = async (product) => {
  const { rows } = await database.query(
    `INSERT INTO productos (nombre, categoria, pvp)
     VALUES ($1, $2, $3)
     RETURNING ${productColumns}`,
    [product.nombre, product.categoria, product.pvp]
  );
  return mapProduct(rows[0]);
};

const actualizar = async (id, product) => {
  const parsedId = parseId(id);
  if (parsedId === null) {
    return null;
  }

  const { rows } = await database.query(
    `UPDATE productos
     SET nombre = $1, categoria = $2, pvp = $3
     WHERE id = $4
     RETURNING ${productColumns}`,
    [product.nombre, product.categoria, product.pvp, parsedId]
  );
  return rows[0] ? mapProduct(rows[0]) : null;
};

const eliminar = async (id) => {
  const parsedId = parseId(id);
  if (parsedId === null) {
    return false;
  }

  const { rowCount } = await database.query(
    'DELETE FROM productos WHERE id = $1',
    [parsedId]
  );
  return rowCount > 0;
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };