// server.js
// ============================
// Punto de entrada del servidor Express
// - Usa módulos ES (import/export) gracias a "type":"module" en package.json
// - Expone un health-check y monta el router de productos
// - Incluye un manejador de errores global para capturar excepciones de controladores
// ============================
import express from "express";
import productosRouter from "./routes/productos.js";

const app = express();
// Log inicial para confirmar que este archivo realmente se está ejecutando
console.log("Iniciando servidor…");
// Middleware para parsear JSON en requests (por si envías/recibes JSON en el body)
app.use(express.json());
// Endpoint de verificación rápida (útil para saber si el server está arriba)
app.get("/health", (req, res) => {
 res.status(200).send("OK");
});
// Monta el router de productos bajo el prefijo /api/productos
// GET http://localhost:3001/api/productos
app.use("/api/productos", productosRouter);
// Manejador de errores global:
// Si en algún controlador llamas next(err) o se lanza una excepción no atrapada,
// caerá aquí. Centralizamos el log y respondemos con un JSON consistente.
app.use((err, req, res, next) => {
 console.error("Error no controlado:", err);
 // Construimos un objeto de error "amigable" para el cliente
 const status = err.statusCode || 500;
 const payload = {
 error: err.name || "ErrorInterno",
 message: err.message || "Error interno del servidor"
 };
 // En desarrollo podrías incluir err.stack si lo necesitas
 // payload.stack = err.stack;
 res.status(status).json(payload);
});
// Levanta el servidor en el puerto indicado
const PORT = 3001;
app
 .listen(PORT, () => {
 console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
 })
 .on("error", (err) => {
 // Si el puerto está ocupado u ocurre otro error al iniciar el server, lo verás aquí
 console.error("Error en listen:", err);
 });
