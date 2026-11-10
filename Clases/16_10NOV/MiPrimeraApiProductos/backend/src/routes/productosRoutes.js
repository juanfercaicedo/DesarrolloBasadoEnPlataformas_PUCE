const express = require('express');
const productosController = require('../controllers/productosController');
const { validarProducto } = require('../middlewares/validatorMiddleware');

const router = express.Router();

router.get('/', productosController.obtenerTodos);
router.get('/:id', productosController.obtenerPorId);
router.post('/', validarProducto, productosController.crear);
router.put('/:id', validarProducto, productosController.actualizar);
router.delete('/:id', productosController.eliminar);

module.exports = router;