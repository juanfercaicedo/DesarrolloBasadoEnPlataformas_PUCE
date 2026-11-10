const PeliculaModel = require('../models/Pelicula');

class CineService {
  async listarCartelera() {
    const peliculas = await PeliculaModel.obtenerTodas();
    return peliculas.map(p => ({
      ...p,
      destacada: true
    }));
  }

  async obtenerDetallePelicula(id) {
    const pelicula = await PeliculaModel.obtenerPorId(id);
    if (!pelicula) {
      throw new Error("La película solicitada no existe");
    }
    return pelicula;
  }
}

module.exports = new CineService();