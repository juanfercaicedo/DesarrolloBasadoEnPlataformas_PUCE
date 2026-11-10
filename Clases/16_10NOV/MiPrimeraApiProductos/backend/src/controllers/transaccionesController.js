const transaccionRepository = require('../models/transaccionRepository');
const { PAGE_SIZE } = transaccionRepository;

const obtenerTodas = async (req, res, next) => {
  try {
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    if (!Number.isSafeInteger(page) || page < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'El parámetro page debe ser un entero mayor que cero.'
      });
    }

    const { total, data } = await transaccionRepository.obtenerPagina(page);
    return res.status(200).json({
      status: 'success',
      page,
      perPage: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
      data
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { obtenerTodas };