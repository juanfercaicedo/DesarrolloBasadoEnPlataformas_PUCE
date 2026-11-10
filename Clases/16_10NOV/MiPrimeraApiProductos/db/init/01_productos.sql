CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    pvp NUMERIC(10, 2) NOT NULL
);

INSERT INTO productos (nombre, categoria, pvp)
VALUES
    ('Teclado Mecánico', 'Electrónica', 59.99),
    ('Monitor 24 pulgadas', 'Pantallas', 149.50),
    ('Silla Ergonómica', 'Muebles', 210.00);