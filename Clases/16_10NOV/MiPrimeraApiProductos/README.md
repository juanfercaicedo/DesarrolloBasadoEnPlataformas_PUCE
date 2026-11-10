Guía: PostgreSQL para MiPrimeraApiProductos

Este proyecto configura PostgreSQL con Docker Compose. Al iniciar por primera vez, crea la base `mi_tienda`, la tabla `productos` con datos de ejemplo y los objetos para generar y auditar 10.000 transacciones.

1. Instalación de Docker

El proceso varía según el sistema operativo:

En Ubuntu / Debian:

# Actualizar el índice de paquetes
2. Iniciar PostgreSQL

Desde esta carpeta, ejecuta:

```powershell
docker compose up -d
```

Compose descarga la imagen oficial si hace falta y crea el contenedor `mi_postgres`. La primera inicialización ejecuta automáticamente los scripts de `db/init/`.

Credenciales locales: base `mi_tienda`, usuario `postgres`, contraseña definida en `.env` y puerto publicado `5433` (variable `POSTGRES_PORT`).

Para abrir psql:

```powershell
docker exec -it mi_postgres psql -U postgres -d mi_tienda
```

La tabla `productos` contiene `id` autogenerado, `nombre`, `categoria` y `pvp` decimal. Para verificar los datos de ejemplo:

```sql
SELECT * FROM productos;
```
pvp (Precio de Venta al Público): Se define como NUMERIC(10, 2) para asegurar precisión decimal exacta en valores monetarios.

6. Verificación de Funcionamiento

Insertar datos de prueba:

INSERT INTO productos (nombre, categoria, pvp) 
VALUES 
  ('Teclado Mecánico', 'Electrónica', 59.99),
  ('Monitor 24 pulgadas', 'Pantallas', 149.50),
  ('Silla Ergonómica', 'Muebles', 210.00);


Consultar los datos:

SELECT * FROM productos;


Salir de psql:

\q

### Generar 10.000 transacciones

El script `db/init/02_transacciones.sql` crea la tabla `transacciones_productos` y el procedimiento `ingresar_10000_productos()`. El procedimiento selecciona productos del catálogo y asigna un estado según las reglas de monto inválido, sobreprecio de la cámara Canon y montos que requieren aprobación manual.

La generación es manual para evitar insertar 10.000 filas automáticamente al iniciar la base. En psql, ejecuta:

```sql
CALL ingresar_10000_productos();
```

Luego puedes auditar el resultado:

```sql
SELECT estado, COUNT(*), MIN(monto) as monto_minimo, MAX(monto) as monto_maximo
FROM transacciones_productos
GROUP BY estado;
```

Para detener el servicio, ejecuta `docker compose down`. Los datos se conservan en el volumen `postgres_data`; para volver a ejecutar los scripts de inicialización se requiere borrar ese volumen con `docker compose down -v`, lo cual elimina los datos guardados.

### API REST Node.js

La API especificada en `backend.md` se conecta a PostgreSQL y opera sobre la tabla `productos` creada por `db/init/01_productos.sql`.

Las variables compartidas están en `.env`. Al clonar el proyecto, copia `.env.example` como `.env` y cambia `POSTGRES_PASSWORD`. El archivo `.env` local está excluido de Git.

Desde la carpeta `backend`, instala dependencias e inicia la API:

```powershell
npm install
node server.js
```

La API queda disponible en `http://localhost:5051/api/productos`.

El cliente estático no usa frameworks y se sirve en un proceso separado. En otra terminal, desde la carpeta `frontend`, ejecuta:

```powershell
node server.js
```

Abre `http://localhost:5052/`. El cliente se conecta a la API en el puerto `5051`.

Rutas de la API:

- `GET /api/productos`: lista productos.
- `GET /api/productos/:id`: consulta un producto.
- `POST /api/productos`: crea un producto con `nombre`, `categoria` y `pvp`.
- `PUT /api/productos/:id`: reemplaza esos campos de un producto.
- `DELETE /api/productos/:id`: elimina un producto.
- `GET /api/transacciones`: lista 100 transacciones por página (`?page=1`, `?page=2`, etc.); la respuesta incluye `page`, `perPage`, `total` y `totalPages`.

Los datos que consulta o modifica la API son los mismos que puedes revisar con psql en la base `mi_tienda`.

