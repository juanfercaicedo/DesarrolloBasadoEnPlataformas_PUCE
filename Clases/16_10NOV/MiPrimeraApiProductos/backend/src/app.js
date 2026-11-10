const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const express = require('express');
const corsMiddleware = require('./middlewares/corsMiddleware');
const sanitizerMiddleware = require('./middlewares/sanitizerMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const productosRoutes = require('./routes/productosRoutes');
const transaccionesRoutes = require('./routes/transaccionesRoutes');

const app = express();

app.use(corsMiddleware);
app.use(express.json({ limit: '100kb' }));
app.use(sanitizerMiddleware);
app.use('/api/productos', productosRoutes);
app.use('/api/transacciones', transaccionesRoutes);
app.use(express.static(path.resolve(__dirname, '../public')));

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada.' });
});

app.use(errorHandler);

module.exports = app;