const cineService = require('../services/cineService');

exports.getCartelera = async (req, res) => {
  try {
    const peliculas = await cineService.listarCartelera();
    res.render('peliculas/index', { 
      tituloPagina: 'Cartelera Principal',
      peliculas 
    });
  } catch (error) {
    res.status(500).send("Error al cargar la cartelera");
  }
};

exports.getDetallePelicula = async (req, res) => {
  try {
    const { id } = req.params;
    const pelicula = await cineService.obtenerDetallePelicula(id);
    res.render('peliculas/detalle', { 
      tituloPagina: pelicula.titulo,
      pelicula 
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
};