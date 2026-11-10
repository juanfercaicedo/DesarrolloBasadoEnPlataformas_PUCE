class Producto {
  constructor(id, nombre, categoria, pvp) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.pvp = Number(pvp);
  }
}

module.exports = Producto;