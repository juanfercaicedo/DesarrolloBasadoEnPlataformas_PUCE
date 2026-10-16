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
            - 