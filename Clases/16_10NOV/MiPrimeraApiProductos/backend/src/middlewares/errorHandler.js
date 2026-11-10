const errorHandler = (error, req, res, next) => {
  console.error(`[Error Log]: ${error.message}`);

  const candidateStatus = error.statusCode || error.status;
  const statusCode = Number.isInteger(candidateStatus)
      && candidateStatus >= 400 && candidateStatus <= 599
    ? candidateStatus
    : 500;

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: statusCode === 500
      ? 'Error interno del servidor.'
      : error.message
  });
};

module.exports = errorHandler;