const app = require('./src/app');
const port = process.env.PORT || 5051;

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});