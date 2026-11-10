// Simulación de repositorio de base de datos
const cartelerasDB = [
  {
    id: 1,
    titulo: "Dune: Parte Dos",
    genero: "Ciencia Ficción",
    duracion: "166 min",
    sipnosis: "Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.",
    imagen: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500"
  },
  {
    id: 2,
    titulo: "Oppenheimer",
    genero: "Drama / Historia",
    duracion: "180 min",
    sipnosis: "La historia del físico estadounidense J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica.",
    imagen: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500"
  }
];

class PeliculaModel {
  static async obtenerTodas() {
    return cartelerasDB;
  }

  static async obtenerPorId(id) {
    return cartelerasDB.find(p => p.id === parseInt(id));
  }
}

module.exports = PeliculaModel;