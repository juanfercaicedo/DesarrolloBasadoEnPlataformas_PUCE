const cors = require('cors');

const isProduction = process.env.NODE_ENV === 'production';
const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const developmentOrigins = isProduction
  ? []
  : ['http://localhost:5052', 'http://localhost:2051'];
const pagesOrigin = 'https://juanfercaicedo.github.io';
const allowedOrigins = new Set([
  ...configuredOrigins,
  ...developmentOrigins,
  ...(isProduction ? [pagesOrigin] : [])
]);

module.exports = cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    const error = new Error('Origen no autorizado por la política CORS.');
    error.statusCode = 403;
    return callback(error);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
});