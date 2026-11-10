const express = require('express');
const transaccionesController = require('../controllers/transaccionesController');

const router = express.Router();

router.get('/', transaccionesController.obtenerTodas);

module.exports = router;