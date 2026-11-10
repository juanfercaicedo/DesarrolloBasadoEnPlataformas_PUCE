const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
require('dotenv').config();

const peliculaRoutes = require('./src/routes/peliculaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración del motor de plantillas (Capa de Presentación)
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Rutas
app.use('/', peliculaRoutes);

app.listen(PORT, () => {
  console.log(`Servidor de Cine ejecutándose en http://localhost:${PORT}`);
});