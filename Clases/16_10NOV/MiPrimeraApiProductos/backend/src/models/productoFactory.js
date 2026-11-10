const Producto = require('./productoModel');

class ProductoFactory {
  static crearProducto({ id, nombre, categoria, pvp }) {
    const nombreLimpio = nombre.trim();
    const categoriaLimpia = categoria.trim();
    const pvpNormalizado = Number(Number(pvp).toFixed(2));

    return new Producto(id, nombreLimpio, categoriaLimpia, pvpNormalizado);
  }
}

module.exports = ProductoFactory;