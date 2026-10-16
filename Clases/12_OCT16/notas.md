# Backend
- **Capas de datos:** son la parte de una aplicación que se encarga de guardar, consultar y actualizar información. Por ejemplo, puede comunicarse con una base de datos, leer archivos o consumir una API.
    - SPA(Single Page Application)
- Los clientes y los servidores se van a conectar através del internet, por lo tanto cuando trabajamos en el esquema cliente-servidor ocupamos protocolos TCP/IP
    - Pero cuando necesito comunicarme mandar paquetes/mensajes, se utiliza HTTP o HTTPS
        - En HTTPS o HTTP podemos mandar tráfico (TCP(Transfer Control Protocol) o UDP(User Diagram Protocol) forma en la que van y regresan los carros)
            - Vamos a utilizar TCP o UDP en función de lo que necesitemos
            - En donde tengamos que manipular datos debemos utilizar TCP
            - Utilizamos UDP cuando utilizamos streamings(videos, llamadas, música, etc)
            - **Se van a utilizar ambos protocolos**
    - HTTP/HTTPS: Es el transporte (carretera)
    - HTTP y HTTPS: 
        - HTTP envía la información sin cifrar. En una red compartida, alguien podría interceptar o leer datos como contraseñas.
        - HTTP**S** usa HTTP protegido con cifrado TLS(Transport Layer Security). Esto ayuda a evitar que terceros lean o modifiquen los datos durante el envío y permite verificar que el sitio corresponde al dominio esperado.
        - Encripta en la capa de transporte
            - Capas: 
            1. Red
            2. Internet
            3. Transporte -> HTTPS encripta el mensaje/trama en este nivel.
            4. Aplicación
- La arquitectura cliente-servidor moderna es una mala práctica de seguridad que un cliente se conecte directamente a una base de datos.
    - Por lo tanto el cliente se debe conectar a una capa (backend)
    - Server applications(backend)
        - Tiene dos lados:
            - Aquella que se conecta a internet
                - Todo lo que se conecta a internet funciona con el protocolo HTTPS
            - Aquella que se conecta a la base de datos.
                - Con la base de datos puede ser una conexión LAN, MAN, WAN.
            - Se va a tener la lógica MVC, models, controllers, middelware, errores, etc. (Lógica del negocio y de la aplicación).
    - Cuando se trabaja con bases de datos debemos trabajar con CRUD
        - **C**reate
        - **R**ead
        - **U**pdate
        - **D**elete
    - API(Application Programming Interface)
        - Es una interfaz que conecta programas o sistemas y les permite comunicarse mediante solicitudes y respuestas.
        - El estilo arquitectónico se llama REST(Representational State Transfer), se usa para diseñar API's web.
        -  La API al devolver la respuesta, deserializa la información en un formato **JSON**
            - Una vez lleguen los archivos a mi aplicación se renderiza para que el usuario pueda visualizar la información.
    - URL/URI(Uniform Resource Indentifier)
        - URI -> Sirve para identificar un recurso. Por ejemplo: `https://quinto.com/api/clientes`
            - Se forma por protocolo, almacenamiento, dominio 
        - URL -> serve para indicar donde está un recurso y como acceder a el. Por ejemplo: `https://ejemplo.com/productos/42`
- **Estilo arquitectónico:** organización general de un sistema y reglas sobre cómo se relacionan sus partes. Ejemplos: cliente-servidor, capas y microservicios.
    - Diagrama de estilo cliente-servidor:
      ```mermaid
      flowchart LR
          Cliente -->|solicitud| Servidor
          Servidor -->|respuesta| Cliente
      ```
- **Patrón arquitectónico:** una solución reutilizable para organizar un sistema y resolver un problema arquitectónico frecuente. MVC (Modelo-Vista-Controlador) es un ejemplo; separa datos, interfaz y control de las acciones.
    - Diagrama del patrón MVC:
      ```mermaid
      flowchart LR
          Usuario --> Vista
          Vista --> Controlador
          Controlador --> Modelo
          Modelo --> Vista
          Vista --> Usuario
      ```
- **Patrones de diseño:** soluciones reutilizables para problemas comunes dentro del diseño del código; tienen un alcance menor que los patrones arquitectónicos.
    - **Factory (fábrica):** centraliza la creación de objetos.
    - **Observer (observador):** permite avisar a varios objetos cuando cambia otro objeto.
    - **Strategy (estrategia):** permite intercambiar distintas maneras de realizar una tarea.
- Al programar el sistema, debemos considerar la seguridad en el frontend, backend y en las bases de datos.
     - En backend se pone seguridad HTTPS, 
        - cors(quién puede entrar y qué puede hacer), 
        - autorización(determinar el rol del usuario), 
        - autenticación(verificar que los usuarios y contraseñas sean correctos antes de iniciar al sistema), 
        - JWT(JSON web Token) es un formato de token que permite transmitir información entre sistemas, normalmente para identificar a un usuario después de iniciar sesión. En una autenticación típica, el servidor valida las credenciales y entrega un JWT. El cliente lo envía en solicitudes posteriores, a menudo en el encabezado Authorization: Bearer <token>, y el servidor lo valida para decidir si autoriza la acción.
        - sanitización, para evitar las injecciones, valida los caracteres, se hace en el backend, fronted y bases de datos
        - hash es un tipo de encriptación, se utiliza para todos los datos sensibles
            - Aplicar una función a unos datos para obtener una cadena de longitud fija, llamada valor hash o resumen. Por ejemplo, se puede calcular el hash de un archivo y compararlo después para detectar si cambió.
        - (Se debe poner en las API's antes de desplegar la web).
## Aplicación vs Sistema vs Plataforma Digital
- Aplicación: programa que permite realizar tareas concretas. Ejemplo: una app para pedir comida.
- Sistema: conjunto de componentes que colaboran para cumplir un objetivo. Puede incluir la aplicación, el backend, la base de datos, usuarios y procesos.
- Plataforma digital: entorno que ofrece servicios o herramientas para que varios usuarios, empresas o aplicaciones interactúen o construyan sobre él. Puede conectar distintos grupos y permitirles intercambiar valor.
