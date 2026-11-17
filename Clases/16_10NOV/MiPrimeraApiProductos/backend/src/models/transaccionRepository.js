const database = require('../config/databaseSingleton');
const PAGE_SIZE = 100;

const obtenerPagina = async (page) => {
  const [total, transactions] = await Promise.all([
    database.client.transaccionProducto.count(),
    database.client.transaccionProducto.findMany({
      orderBy: { id: 'asc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    })
  ]);

  return {
    total,
    data: transactions.map((transaction) => ({
      id: transaction.id,
      producto: transaction.producto,
      categoria: transaction.categoria,
      monto: transaction.monto === null ? null : Number(transaction.monto),
      estado: transaction.estado,
      creado_en: transaction.creadoEn
    }))
  };
};

module.exports = { obtenerPagina, PAGE_SIZE };