const database = require('../config/databaseSingleton');
const PAGE_SIZE = 100;

const obtenerPagina = async (page) => {
  const offset = (page - 1) * PAGE_SIZE;
  const [countResult, pageResult] = await Promise.all([
    database.query('SELECT COUNT(*)::int AS total FROM transacciones_productos'),
    database.query(
    `SELECT id, producto, categoria, monto, estado, creado_en
     FROM transacciones_productos
     ORDER BY id
     LIMIT $1 OFFSET $2`,
      [PAGE_SIZE, offset]
    )
  ]);

  return {
    total: countResult.rows[0].total,
    data: pageResult.rows.map((row) => ({
    ...row,
    monto: Number(row.monto)
    }))
  };
};

module.exports = { obtenerPagina, PAGE_SIZE };