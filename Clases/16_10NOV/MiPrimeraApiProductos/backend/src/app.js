const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const express = require('express');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const corsMiddleware = require('./middlewares/corsMiddleware');
const sanitizerMiddleware = require('./middlewares/sanitizerMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const productosRoutes = require('./routes/productosRoutes');
const transaccionesRoutes = require('./routes/transaccionesRoutes');
const database = require('./config/databaseSingleton');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: '100kb' }));
app.use(sanitizerMiddleware);
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-8',
  legacyHeaders: false
}));
app.get('/health', async (req, res) => {
  try {
    await database.client.$queryRaw`SELECT 1`;
    return res.status(200).json({ status: 'ok' });
  } catch {
    return res.status(503).json({ status: 'unavailable' });
  }
});
app.use('/api/productos', productosRoutes);
app.use('/api/transacciones', transaccionesRoutes);

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada.' });
});

app.use(errorHandler);

module.exports = app;