CREATE TABLE transacciones_productos (
    id SERIAL PRIMARY KEY,
    producto VARCHAR(100),
    categoria VARCHAR(50),
    monto NUMERIC(10, 2),
    estado VARCHAR(100),
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE PROCEDURE ingresar_10000_productos()
LANGUAGE plpgsql
AS $$
DECLARE
    i INT := 1;
    v_producto VARCHAR(100);
    v_categoria VARCHAR(50);
    v_monto NUMERIC(10, 2);
    v_estado VARCHAR(100);
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
        v_index := floor(random() * v_total_productos)::INT + 1;
        v_producto := v_productos[v_index][1];
        v_categoria := v_productos[v_index][2];

        IF random() < 0.03 THEN
            v_monto := round((random() * -150)::NUMERIC, 2);
        ELSIF random() < 0.04 THEN
            v_monto := round((v_productos[v_index][3]::NUMERIC * (10 + random() * 5))::NUMERIC, 2);
        ELSE
            v_monto := round((v_productos[v_index][3]::NUMERIC * (0.8 + random() * 0.4))::NUMERIC, 2);
        END IF;

        IF v_monto <= 0 THEN
            v_estado := 'Rechazada: Error de formato o monto inválido';
        ELSIF v_producto = 'Cámara Canon EOS R6' AND v_monto > 3500 THEN
            v_estado := 'Rechazada: Alerta de Fraude por sobreprecio';
        ELSIF v_monto > 9000 THEN
            v_estado := 'Retenida: Requiere aprobación manual (Monto VIP muy alto)';
        ELSE
            v_estado := 'Aprobada';
        END IF;

        INSERT INTO transacciones_productos (producto, categoria, monto, estado)
        VALUES (v_producto, v_categoria, v_monto, v_estado);

        i := i + 1;
    END LOOP;

    COMMIT;
END;
$$;