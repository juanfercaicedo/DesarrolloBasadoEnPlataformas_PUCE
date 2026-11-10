const express = require('express');
const router = express.Router();
const peliculaController = require('../controllers/peliculaController');

router.get('/', peliculaController.getCartelera);
router.get('/pelicula/:id', peliculaController.getDetallePelicula);

module.exports = router;