const app = require('./src/app');
const database = require('./src/config/databaseSingleton');
const port = Number(process.env.PORT || 5051);

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});

const shutdown = () => {
  server.close(async () => {
    await database.client.$disconnect();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);