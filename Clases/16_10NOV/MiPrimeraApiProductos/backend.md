Documentación y Guía de Arquitectura Backend (REST, N-Capas, MVC)Esta guía detalla la especificación y estructura para construir un servicio Backend robusto en Node.js y Express, aplicando el estilo arquitectónico N-Capas y REST, el patrón MVC, y patrones de diseño orientados a objetos.1. Arquitectura del SistemaEstilo Arquitectónico: N-Capas y RESTCapa de Presentación / Ruteo (Routes & Express): Expone los endpoints HTTP siguiendo los principios RESTful en el puerto 5051.Capa de Control / Aplicación (Controllers): Orquesta el flujo de las peticiones, gestiona las respuestas con los códigos de estado HTTP adecuados y procesa los archivos .json.Capa Middleware / Transversal (Middlewares): Implementa validaciones, sanitizaciones, políticas CORS y manejo centralizado de errores.Capa de Dominio y Persistencia (Models): Abstrae la entidad del negocio y maneja el acceso al almacenamiento (archivo JSON).Estructura de Directoriosbackend/
```
├── data/
│   └── productos.json              # Almacenamiento persistente en JSON
├── src/
│   ├── config/
│   │   └── databaseSingleton.js    # Singleton para gestión del archivo JSON
│   ├── models/
│   │   ├── productoModel.js        # Estructura del objeto Producto
│   │   └── productoFactory.js      # Patrón Factory para creación de Productos
│   ├── middlewares/
│   │   ├── corsMiddleware.js       # Configuración de CORS
│   │   ├── sanitizerMiddleware.js  # Sanitización de datos de entrada
│   │   ├── validatorMiddleware.js  # Validación de atributos de Producto
│   │   └── errorHandler.js        # Manejador global de errores
│   ├── controllers/
│   │   └── productosController.js  # Controlador de productos (Manejo de HTTP y JSON)
│   ├── routes/
│   │   └── productosRoutes.js      # Definición de rutas Express
│   └── app.js                      # Punto de entrada principal
├── package.json
└── README.md
```


2. Patrones de Diseño ImplementadosSingleton (Creacional):Uso: Implementado en databaseSingleton.js.Propósito: Ofrecer un único punto de acceso global y controlled a la lectura/escritura del archivo productos.json, evitando condiciones de carrera e inconsistencias al acceder al disco.Factory Method (Creacional):Uso: Implementado en productoFactory.js dentro de la capa models.Propósito: Encapsula la lógica de instanciación de objetos Producto, evitando el uso directo del operador new en los controladores o capas superiores y facilitando la asignación automática de IDs y timestamps.Chain of Responsibility (Comportamental):Uso: Implementado mediante el pipeline de Middlewares de Express (CORS $\rightarrow$ Sanitizer $\rightarrow$ Validator $\rightarrow$ Controller $\rightarrow$ ErrorHandler).Propósito: Cada solicitud atraviesa una cadena de manejadores donde cada uno procesa la petición o la desvía hacia el manejador de errores si falla alguna condición.Repository Pattern (Estructural / Adicional):Uso: Abstracción dentro de los modelos para desacoplar el origen de datos (JSON) de la lógica del controlador.3. Prompts de Diseño para la IA / DesarrolladoresCapa 1: Base de Datos y Estilo ArquitectónicoPROMPT CAPA 1:
"Diseña la arquitectura base de un servicio RESTful en Node.js y Express (puerto 5051) utilizando la arquitectura N-Capas y el patrón MVC. El sistema debe persistir datos directamente en un archivo local llamado `productos.json`. Asegura que la API exponga las operaciones CRUD (GET, POST, PUT, DELETE) para el recurso 'productos' con las respuestas y códigos de estado HTTP estándar (200, 201, 400, 404, 500)."

Capa 2: Patrones de DiseñoPROMPT CAPA 2:
"Aplica los siguientes patrones de diseño al proyecto Node.js:
1. Singleton: Para la clase encargada de leer y escribir en el archivo `productos.json`.
2. Factory Method: En la capa de modelos (`productoFactory.js`) para abstraer la instanciación de entidades 'Producto' (id, nombre, categoría, pvp).
3. Chain of Responsibility: En Express uniendo middlewares de CORS, sanitización, validación y un gestor de errores centralizado mediante next(err)."

4. Código Fuente de la Implementación4.1. Singleton para Acceso al Archivo JSON (src/config/databaseSingleton.js)const fs = require('fs/promises');
const path = require('path');

class JsonDatabaseSingleton {
  constructor() {
    if (JsonDatabaseSingleton.instance) {
      return JsonDatabaseSingleton.instance;
    }
    this.filePath = path.join(__dirname, '../../data/productos.json');
    JsonDatabaseSingleton.instance = this;
  }

  async readData() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this.writeData([]);
        return [];
      }
      throw new Error('Error al leer el archivo de base de datos.');
    }
  }

  async writeData(data) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      throw new Error('Error al escribir en el archivo de base de datos.');
    }
  }
}

module.exports = new JsonDatabaseSingleton();

4.2. Factory Method para Modelos (src/models/productoFactory.js)class Producto {
  constructor(id, nombre, categoria, pvp) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.pvp = Number(pvp);
  }
}

class ProductoFactory {
  static crearProducto({ id, nombre, categoria, pvp }) {
    // Generar un ID simple si no se provee
    const productoId = id || Date.now().toString();
    
    // Normalización de datos
    const nombreLimpio = nombre.trim();
    const categoriaLimpia = categoria.trim();
    const pvpNormalizado = parseFloat(pvp).toFixed(2);

    return new Producto(productoId, nombreLimpio, categoriaLimpia, pvpNormalizado);
  }
}

module.exports = ProductoFactory;

4.3. Cadena de Middlewares (Chain of Responsibility)a) CORS Middleware (src/middlewares/corsMiddleware.js)const cors = require('cors');

const corsOptions = {
  origin: '*', // Ajustar según requerimientos de seguridad
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);

b) Sanitizador (src/middlewares/sanitizerMiddleware.js)// Sanitización básica para limpiar espacios extra o inyecciones de código sencillas
const sanitize = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/<[^>]*>?/gm, '').trim();
      }
    });
  }
  next();
};

module.exports = sanitize;

c) Validador (src/middlewares/validatorMiddleware.js)const validarProducto = (req, res, next) => {
  const { nombre, categoria, pvp } = req.body;

  if (req.method === 'POST' || req.method === 'PUT') {
    if (!nombre || !categoria || pvp === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Faltan campos obligatorios: nombre, categoria, pvp.'
      });
    }

    if (isNaN(pvp) || Number(pvp) <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'El campo pvp debe ser un número mayor a cero.'
      });
    }
  }

  next();
};

module.exports = { validarProducto };

d) Gestor de Errores Global (src/middlewares/errorHandler.js)const errorHandler = (err, req, res, next) => {
  console.error(`[Error Log]: ${err.message}`);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message || 'Error interno del servidor.'
  });
};

module.exports = errorHandler;

4.4. Controlador productos (src/controllers/productosController.js)const dbSingleton = require('../config/databaseSingleton');
const ProductoFactory = require('../models/productoFactory');

// GET - Obtener todos los productos
const obtenerTodos = async (req, res, next) => {
  try {
    const productos = await dbSingleton.readData();
    return res.status(200).json({
      status: 'success',
      data: productos
    });
  } catch (error) {
    next(error);
  }
};

// GET BY ID - Obtener un producto por ID
const obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productos = await dbSingleton.readData();
    const producto = productos.find((p) => p.id === id);

    if (!producto) {
      return res.status(404).json({
        status: 'error',
        message: `Producto con ID '${id}' no encontrado.`
      });
    }

    return res.status(200).json({
      status: 'success',
      data: producto
    });
  } catch (error) {
    next(error);
  }
};

// POST - Crear producto
const crear = async (req, res, next) => {
  try {
    const nuevoProducto = ProductoFactory.crearProducto(req.body);
    const productos = await dbSingleton.readData();

    productos.push(nuevoProducto);
    await dbSingleton.writeData(productos);

    return res.status(201).json({
      status: 'success',
      message: 'Producto creado exitosamente.',
      data: nuevoProducto
    });
  } catch (error) {
    next(error);
  }
};

// PUT - Actualizar producto
const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productos = await dbSingleton.readData();
    const index = productos.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({
        status: 'error',
        message: `Producto con ID '${id}' no encontrado.`
      });
    }

    const productoActualizado = ProductoFactory.crearProducto({
      ...req.body,
      id
    });

    productos[index] = productoActualizado;
    await dbSingleton.writeData(productos);

    return res.status(200).json({
      status: 'success',
      message: 'Producto actualizado exitosamente.',
      data: productoActualizado
    });
  } catch (error) {
    next(error);
  }
};

// DELETE - Eliminar producto
const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productos = await dbSingleton.readData();
    const productosFiltrados = productos.filter((p) => p.id !== id);

    if (productos.length === productosFiltrados.length) {
      return res.status(404).json({
        status: 'error',
        message: `Producto con ID '${id}' no encontrado.`
      });
    }

    await dbSingleton.writeData(productosFiltrados);

    return res.status(200).json({
      status: 'success',
      message: `Producto con ID '${id}' eliminado exitosamente.`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};

4.5. Rutas (src/routes/productosRoutes.js)const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { validarProducto } = require('../middlewares/validatorMiddleware');

// Cadena de middleware para las rutas
router.get('/', productosController.obtenerTodos);
router.get('/:id', productosController.obtenerPorId);
router.post('/', validarProducto, productosController.crear);
router.put('/:id', validarProducto, productosController.actualizar);
router.delete('/:id', productosController.eliminar);

module.exports = router;

4.6. Configuración Principal del Servidor Express (src/app.js)const express = require('express');
const corsMiddleware = require('./middlewares/corsMiddleware');
const sanitizeMiddleware = require('./middlewares/sanitizerMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const productosRoutes = require('./routes/productosRoutes');

const app = express();
const PORT = process.env.PORT || 5051;

// 1. Cadena de Responsabilidad global (Middlewares iniciales)
app.use(corsMiddleware);
app.use(express.json());
app.use(sanitizeMiddleware);

// 2. Rutas del sistema (MVC)
app.use('/api/productos', productosRoutes);

// 3. Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada.'
  });
});

// 4. Gestor final de la Cadena de Responsabilidad (Error Handler)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

module.exports = app;

