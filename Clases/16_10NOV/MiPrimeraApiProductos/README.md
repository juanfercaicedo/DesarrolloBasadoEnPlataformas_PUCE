Guía: Instalación de Docker y Configuración de PostgreSQL

Este documento describe el paso a paso para instalar Docker, descargar la imagen oficial de PostgreSQL, ejecutar un contenedor y crear la relación (tabla) productos con los atributos solicitados.

1. Instalación de Docker

El proceso varía según el sistema operativo:

En Ubuntu / Debian:

# Actualizar el índice de paquetes
sudo apt-get update

# Dar soporte para HTTPS
sudo apt-get install -y ca-certificates curl gnupg

# Descargar e instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Iniciar y habilitar el servicio de Docker
sudo systemctl start docker
sudo systemctl enable docker


En Windows / macOS:

Descarga Docker Desktop desde el sitio oficial: https://www.docker.com/products/docker-desktop/

Sigue el asistente de instalación.

Inicia Docker Desktop y verifica que esté en ejecución.

2. Descargar la imagen de PostgreSQL

Abre tu terminal (o PowerShell / CMD) y descarga la versión más reciente de la imagen oficial de PostgreSQL:

docker pull postgres


3. Desplegar y ejecutar el contenedor de PostgreSQL

Ejecuta el siguiente comando para instanciar el contenedor de la base de datos:

docker run --name mi_postgres \
  -e POSTGRES_PASSWORD=mi_clave_segura \
  -p 5432:5432 \
  -d postgres


Explicación de los parámetros:

--name mi_postgres: Nombre personalizado para el contenedor.

-e POSTGRES_PASSWORD=mi_clave_segura: Define la contraseña para el usuario principal (postgres).

-p 5432:5432: Mapea el puerto 5432 del contenedor al puerto 5432 de tu máquina local.

-d postgres: Corre el contenedor en segundo plano (detached mode) usando la imagen de postgres.

4. Acceder al contenedor de PostgreSQL

Una vez que el contenedor está corriendo, conéctate a la consola interactiva de psql dentro del contenedor:

docker exec -it mi_postgres psql -U postgres


5. Creación de la Base de Datos y la Tabla productos

Dentro de la consola de PostgreSQL (psql), ejecuta las siguientes sentencias SQL:

a) Crear la Base de Datos (Opcional pero recomendado)

CREATE DATABASE mi_tienda;
\c mi_tienda;


b) Crear la tabla productos

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    pvp NUMERIC(10, 2) NOT NULL
);


Notas sobre los tipos de datos:

id: Generado automáticamete con SERIAL para funcionar como clave primaria incremental.

nombre: Almacena la denominación del producto.

categoria: Clasificación del producto.

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

### 10000 Registros
Para lograr esto con nombres de productos reales, lo más eficiente en SQL es precargar un catálogo de productos reales del mercado y, mediante el bucle, seleccionar elementos al azar para completar las 10,000 transacciones.
Aquí tienes el script completo optimizado para PostgreSQL, que incluye la creación de la tabla, la población de un catálogo de productos reales y el procedimiento que evalúa el estado mediante la cadena de responsabilidad.

1. Estructura de la Tabla

sql
CREATE TABLE transacciones_productos (
    id SERIAL PRIMARY KEY,
    producto VARCHAR(100),
    categoria VARCHAR(50),
    monto NUMERIC(10,2),
    estado VARCHAR(100),
    creado_en TIMESTAMP DEFAULT NOW()
);
Usa el código con precaución.

2. Procedimiento Almacenado (10,000 Registros)

El script utiliza un array interno con productos reales de tecnología y consumo. Cada ciclo del bucle selecciona un producto al azar, define su precio base aproximado y le aplica una variación aleatoria (incluyendo montos negativos o excesivos) para que se disparen todos los eslabones de la cadena de responsabilidad.
sql
CREATE OR REPLACE PROCEDURE ingresar_10000_productos()
LANGUAGE plpgsql
AS $$
DECLARE
    i INT := 1;
    v_producto VARCHAR(100);
    v_categoria VARCHAR(50);
    v_monto NUMERIC(10,2);
    v_estado VARCHAR(100);
    
    -- Catálogo de productos reales indexados (Nombre, Categoría, Precio Base)
    v_productos TEXT[][] := ARRAY[
        ['iPhone 15 Pro Max', 'Tecnología', '1200'],
        ['Samsung Galaxy S24 Ultra', 'Tecnología', '1300'],
        ['MacBook Pro M3', 'Tecnología', '2000'],
        ['PlayStation 5 Slim', 'Videojuegos', '500'],
        ['Nintendo Switch OLED', 'Videojuegos', '350'],
        ['Audífonos Sony WH-1000XM5', 'Audio', '380'],
        ['Televisor LG OLED 65"', 'Hogar', '1500'],
        ['Zapatillas Nike Air Max', 'Moda', '140'],
        ['Cafetera Nespresso Vertuo', 'Hogar', '220'],
        ['Reloj Garmin Fenix 7', 'Deportes', '700'],
        ['Silla Gamer Secretlab', 'Muebles', '450'],
        ['Teclado Mecánico Logitech G915', 'Tecnología', '230'],
        ['Monitor Asus ROG 32"', 'Tecnología', '850'],
        ['Cámara Canon EOS R6', 'Fotografía', '2500'],
        ['Drone DJI Mini 4 Pro', 'Tecnología', '750']
    ];
    
    v_total_productos INT := array_length(v_productos, 1);
    v_index INT;
BEGIN
    WHILE i <= 10000 LOOP
        -- 1. SELECCIÓN ALEATORIA DEL PRODUCTO REAL
        v_index := floor(random() * v_total_productos) + 1;
        v_producto := v_productos[v_index][1];
        v_categoria := v_productos[v_index][2];
        
        -- 2. GENERACIÓN DEL MONTO CON VARIACIONES AUTOMÁTICAS
        -- Un 3% de las veces genera un precio negativo (Filtro 1)
        -- Un 4% de las veces multiplica el precio de forma fraudulenta/excesiva (Filtro 3)
        IF random() < 0.03 THEN
            v_monto := round((random() * -150)::numeric, 2);
        ELSIF random() < 0.04 THEN
            v_monto := round((v_productos[v_index][3]::numeric * (10 + random() * 5))::numeric, 2);
        ELSE
            v_monto := round((v_productos[v_index][3]::numeric * (0.8 + random() * 0.4))::numeric, 2);
        END IF;

        -- 3. CADENA DE RESPONSABILIDAD (Evaluación de Reglas)
        
        -- Eslabón 1: Filtro de Formato (Montos incorrectos)
        IF v_monto <= 0 THEN
            v_estado := 'Rechazada: Error de formato o monto inválido';
        
        -- Eslabón 2: Filtro Antifraude (Categorías / Productos restringidos simulados)
        -- Bloqueamos cámaras Canon si el monto se desfasa de forma sospechosa
        ELSIF v_producto = 'Cámara Canon EOS R6' AND v_monto > 3500 THEN
            v_estado := 'Rechazada: Alerta de Fraude por sobreprecio';
        
        -- Eslabón 3: Filtro de Fondos / Montos Altos
        ELSIF v_monto > 9000 THEN
            v_estado := 'Retenida: Requiere aprobación manual (Monto VIP muy alto)';
        
        -- Fin de la cadena: Pasa los filtros con éxito
        ELSE
            v_estado := 'Aprobada';
        END IF;

        -- 4. INSERCIÓN
        INSERT INTO transacciones_productos (producto, categoria, monto, estado)
        VALUES (v_producto, v_categoria, v_monto, v_estado);

        i := i + 1;
    END LOOP;

    COMMIT;
END;
$$;
Usa el código con precaución.

3. Ejecución y Auditoría

Para procesar e insertar los 10,000 registros reales de inmediato:
sql
CALL ingresar_10000_productos();
Usa el código con precaución.
Una vez ejecutado, puedes agrupar tus datos para ver cómo se comportaron los filtros de la cadena analizando la relación entre los productos reales y sus estados:
sql
SELECT estado, COUNT(*), MIN(monto) as monto_minimo, MAX(monto) as monto_maximo
FROM transacciones_productos
GROUP BY estado;

