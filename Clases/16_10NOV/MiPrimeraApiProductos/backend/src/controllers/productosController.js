const ProductoFactory = require('../models/productoFactory');
const productoRepository = require('../models/productoRepository');

const obtenerTodos = async (req, res, next) => {
  try {
    const products = await productoRepository.obtenerTodos();
    return res.status(200).json({ status: 'success', data: products });
  } catch (error) {
    return next(error);
  }
};

const obtenerPorId = async (req, res, next) => {
  try {
    const product = await productoRepository.obtenerPorId(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: `Producto con ID '${req.params.id}' no encontrado.`
      });
    }

    return res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    return next(error);
  }
};

const crear = async (req, res, next) => {
  try {
    const product = ProductoFactory.crearProducto(req.body);
    await productoRepository.crear(product);
    return res.status(201).json({
      status: 'success',
      message: 'Producto creado exitosamente.',
      data: product
    });
  } catch (error) {
    return next(error);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const product = ProductoFactory.crearProducto({ ...req.body, id: req.params.id });
    const updatedProduct = await productoRepository.actualizar(req.params.id, product);
    if (!updatedProduct) {
      return res.status(404).json({
        status: 'error',
        message: `Producto con ID '${req.params.id}' no encontrado.`
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Producto actualizado exitosamente.',
      data: updatedProduct
    });
  } catch (error) {
    return next(error);
  }
};

const eliminar = async (req, res, next) => {
  try {
    const deleted = await productoRepository.eliminar(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: `Producto con ID '${req.params.id}' no encontrado.`
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Producto con ID '${req.params.id}' eliminado exitosamente.`
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };