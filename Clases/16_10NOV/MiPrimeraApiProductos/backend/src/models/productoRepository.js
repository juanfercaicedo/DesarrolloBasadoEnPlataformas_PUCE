const database = require('../config/databaseSingleton');

const mapProduct = ({ id, nombre, categoria, pvp }) => ({
  id,
  nombre,
  categoria,
  pvp: Number(pvp)
});

const parseId = (id) => {
  const parsedId = Number(id);
  return Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null;
};

const obtenerTodos = async () => {
  const products = await database.client.producto.findMany({
    orderBy: { id: 'asc' }
  });
  return products.map(mapProduct);
};

const obtenerPorId = async (id) => {
  const parsedId = parseId(id);
  if (parsedId === null) {
    return null;
  }

  const product = await database.client.producto.findUnique({
    where: { id: parsedId }
  });
  return product ? mapProduct(product) : null;
};

const crear = async (product) => {
  const createdProduct = await database.client.producto.create({
    data: {
      nombre: product.nombre,
      categoria: product.categoria,
      pvp: product.pvp
    }
  });
  return mapProduct(createdProduct);
};

const actualizar = async (id, product) => {
  const parsedId = parseId(id);
  if (parsedId === null) {
    return null;
  }

  try {
    const updatedProduct = await database.client.producto.update({
      where: { id: parsedId },
      data: {
        nombre: product.nombre,
        categoria: product.categoria,
        pvp: product.pvp
      }
    });
    return mapProduct(updatedProduct);
  } catch (error) {
    if (error.code === 'P2025') {
      return null;
    }
    throw error;
  }
};

const eliminar = async (id) => {
  const parsedId = parseId(id);
  if (parsedId === null) {
    return false;
  }

  const result = await database.client.producto.deleteMany({
    where: { id: parsedId }
  });
  return result.count > 0;
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };