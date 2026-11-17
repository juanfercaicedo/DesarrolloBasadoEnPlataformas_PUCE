Prompt: Implementación de CI/CD para Backend Node.js + Express en Render
1. Objetivo general

Implementar un flujo completo de integración continua y despliegue continuo (CI/CD) para el backend de este repositorio, utilizando GitHub Actions para automatizar las validaciones, pruebas y controles de seguridad, y Render como plataforma de despliegue.

El backend está desarrollado con:

Node.js.
Express.js.
PostgreSQL como motor de base de datos.
GitHub como repositorio y plataforma de control de versiones.
GitHub Actions para CI/CD.
Render para hosting y despliegue del backend.

El objetivo es garantizar que el backend sea estable, seguro, funcional y compatible con un entorno de producción antes de realizar cualquier despliegue.

2. Análisis inicial del proyecto

Antes de realizar cualquier modificación, analiza toda la estructura de la carpeta del backend y comprende su arquitectura.

Identifica:

Estructura de directorios y archivos.
Punto de entrada de la aplicación (server.js, app.js u otro).
Configuración de Express.
Configuración de CORS.
Conexión a PostgreSQL.
Variables de entorno utilizadas.
Rutas y controladores de la API.
Modelos y consultas a la base de datos.
Middlewares.
Dependencias y versiones de paquetes.
Scripts definidos en package.json.
Configuración actual de desarrollo y producción.

Importante: No modifiques archivos sin comprender primero su funcionamiento y sus dependencias.

Conserva la arquitectura existente siempre que sea posible. Evita reescribir funcionalidades que ya funcionan correctamente.

3. Configuración de GitHub Actions

Implementa un pipeline de CI/CD mediante GitHub Actions.

Crea los archivos de configuración necesarios dentro de:

.github/workflows/

El pipeline debe ejecutarse automáticamente cuando:

Se realice un push a la rama principal.
Se cree un Pull Request hacia la rama principal.
Se realicen cambios en los archivos del backend.

Organiza el pipeline en las siguientes etapas:

Etapa 1. Instalación y validación de dependencias
Configurar la versión de Node.js compatible con el proyecto.
Instalar las dependencias utilizando el archivo de bloqueo correspondiente (package-lock.json, yarn.lock o equivalente).
Validar que las dependencias se instalen correctamente.
Detectar dependencias incompatibles.
Identificar paquetes obsoletos.
Detectar conflictos entre versiones.
Verificar que no existan dependencias innecesarias o vulnerables.
Etapa 2. Validación del código

Realizar las siguientes comprobaciones:

Validar la sintaxis de JavaScript.
Identificar errores de importación y exportación.
Detectar variables no utilizadas.
Detectar posibles errores de ejecución.
Validar la estructura del proyecto.
Comprobar que el servidor pueda iniciar correctamente.
Ejecutar ESLint si está configurado o implementar una configuración compatible con el proyecto.

No introduzcas cambios de estilo que puedan afectar la funcionalidad existente.

Etapa 3. Pruebas de API

Implementar o ejecutar pruebas automatizadas para verificar el funcionamiento de los endpoints.

Validar:

Métodos HTTP: GET, POST, PUT, PATCH y DELETE, según corresponda.
Códigos de respuesta HTTP.
Estructura de las respuestas JSON.
Validación de parámetros.
Validación de datos enviados en el body.
Manejo de errores.
Respuestas ante datos inexistentes.
Comportamiento ante solicitudes incorrectas.
Funcionamiento de las rutas.
Integración con PostgreSQL.

Utilizar Jest, Supertest u otras herramientas compatibles con la arquitectura existente.

Las pruebas deben ejecutarse en un entorno controlado, sin afectar la base de datos de producción.

Etapa 4. Seguridad de la API

Realizar una auditoría de seguridad del backend.

Verificar:

Vulnerabilidades conocidas en dependencias.
Uso correcto de variables de entorno.
Ausencia de credenciales expuestas.
Protección de endpoints.
Validación y sanitización de entradas.
Prevención de inyección SQL.
Configuración segura de CORS.
Manejo adecuado de errores.
Ausencia de exposición de información sensible.
Configuración de Helmet.
Límites de solicitudes (Rate Limiting), cuando corresponda.
Validación de autenticación y autorización, si existen en el proyecto.

Ejecutar herramientas como:

npm audit
ESLint con reglas de seguridad.
Herramientas de análisis estático compatibles.

No corrijas vulnerabilidades actualizando indiscriminadamente paquetes que puedan generar incompatibilidades. Analiza cada caso antes de modificar versiones.

Etapa 5. Validación de PostgreSQL

Comprobar que la conexión con PostgreSQL funcione correctamente.

Verificar:

Configuración del cliente o driver utilizado.
Variables de entorno de conexión.
Host y puerto.
Nombre de la base de datos.
Usuario y contraseña.
Manejo del pool de conexiones.
Cierre adecuado de conexiones.
Compatibilidad con conexiones SSL.
Consultas utilizadas por los controladores.
Integridad de las operaciones CRUD.

La conexión debe funcionar tanto en desarrollo como en producción.

No incluir credenciales reales en el repositorio.

4. Adaptación del backend para Render

Preparar el proyecto para desplegarse correctamente en Render.

4.1. Configuración de server.js

Revisar el archivo server.js y realizar las modificaciones necesarias.

Actualmente, el servidor y CORS están configurados para trabajar con localhost.

Modificar la configuración para que funcione correctamente en Render.

Requisitos:

El servidor debe utilizar process.env.PORT.
No debe depender de un puerto fijo.
Debe escuchar en 0.0.0.0 cuando corresponda.
Debe permitir la ejecución en entornos de desarrollo y producción.
Debe conservar el comportamiento local del backend.

Adapta este ejemplo a la arquitectura real del proyecto.

4.2. Configuración de CORS

Eliminar las restricciones que permitan únicamente conexiones desde localhost.

Implementar una configuración flexible basada en variables de entorno.

Requisitos:

Permitir el dominio del frontend desplegado.
Permitir localhost únicamente para desarrollo.
Configurar correctamente los métodos HTTP permitidos.
Configurar los headers necesarios.
Permitir credenciales únicamente cuando sean necesarias.
Evitar utilizar origin: '*' cuando se utilicen credenciales.
Rechazar orígenes no autorizados en producción.

Utilizar una variable de entorno como:

FRONTEND_URL

Si existen varios dominios autorizados, implementar una lista configurable.

4.3. Variables de entorno

Revisar todas las variables de entorno necesarias para el despliegue.

Preparar un archivo .env.example sin credenciales reales.

Considerar variables como:

env
NODE_ENV=production
PORT=3000
DATABASE_URL=
FRONTEND_URL=


Agregar las variables adicionales que realmente necesite el proyecto.

No subir el archivo .env al repositorio.

5. Configuración de PostgreSQL en Render

Preparar la integración con PostgreSQL para producción.

Consideraciones:

Utilizar una instancia PostgreSQL compatible con Render.
Configurar la conexión mediante DATABASE_URL.
No escribir credenciales directamente en el código.
Configurar SSL según los requisitos de conexión de Render.
Evitar problemas con certificados y conexiones seguras.
Verificar que las consultas sean compatibles con PostgreSQL.
Validar las migraciones y la estructura de tablas.
Comprobar que las tablas y relaciones necesarias existan.

Si el proyecto utiliza migraciones, ejecutarlas de forma controlada.

Importante: No eliminar, recrear ni modificar destructivamente tablas o registros existentes sin autorización expresa.

No asumir que una base de datos local debe migrarse automáticamente a producción.

6. Condiciones para autorizar el despliegue

El despliegue en Render únicamente podrá ejecutarse cuando todas las validaciones críticas hayan finalizado correctamente.

Condiciones obligatorias:

Instalación de dependencias exitosa.
Validación de sintaxis exitosa.
Pruebas automatizadas aprobadas.
Pruebas de endpoints aprobadas.
Conexión con PostgreSQL validada.
Validaciones de seguridad completadas.
Configuración de producción revisada.
Variables de entorno documentadas.
Configuración de Render preparada.

Si alguna prueba crítica falla:

Detener el pipeline.
No desplegar.
Identificar el error.
Explicar la causa.
Proponer una solución.
Corregir el problema cuando sea seguro hacerlo.
Volver a ejecutar las pruebas.

No marcar como exitoso un proceso que presente errores críticos.

7. Despliegue en Render

Configurar Render para ejecutar el backend.

Definir:

Tipo de servicio: Web Service.
Runtime: Node.js.
Rama de despliegue: rama principal del repositorio.
Build Command: npm ci o el comando compatible con el gestor de paquetes utilizado.
Start Command: el script de producción definido en package.json.

Configurar las variables de entorno directamente en Render.

Verificar:

Que el servicio se construya correctamente.
Que el servidor inicie sin errores.
Que PostgreSQL acepte conexiones.
Que las rutas de la API respondan.
Que CORS permita las solicitudes desde el frontend.
Que no existan errores críticos en los logs.

El despliegue debe realizarse únicamente después de superar las validaciones de CI.

8. Pruebas posteriores al despliegue

Una vez desplegado el backend, ejecutar pruebas de funcionamiento sobre la URL pública de Render.

Validar:

Disponibilidad del servidor.
Endpoint de health check.
Respuestas HTTP.
Funcionamiento de los endpoints principales.
Conexión con PostgreSQL.
CORS desde el dominio del frontend.
Manejo de errores.
Logs de producción.

Si el proyecto no dispone de un endpoint de salud, implementar uno apropiado, por ejemplo:

GET /health

Este endpoint debe permitir verificar el estado del servicio sin exponer información sensible.

No exponer credenciales, información interna de la base de datos ni detalles técnicos sensibles en sus respuestas.

9. Seguridad y buenas prácticas

Durante todo el proceso:

No eliminar funcionalidades existentes.
No modificar reglas de negocio sin autorización.
No sobrescribir configuraciones importantes sin analizarlas.
No exponer contraseñas, tokens o claves privadas.
No subir archivos .env.
No utilizar credenciales de producción en pruebas.
No ejecutar migraciones destructivas.
No actualizar dependencias principales sin evaluar su compatibilidad.
No desplegar si existen pruebas críticas fallidas.
Mantener compatibilidad con el entorno local.

Antes de realizar cambios importantes, explicar qué se modificará y por qué.

10. Entregables finales

Al terminar el trabajo, entregar:

Backend adaptado para producción en Render.
Archivo server.js corregido.
Configuración de CORS adaptada.
Archivo .env.example.
Workflow de GitHub Actions.
Pruebas automatizadas de API.
Validaciones de seguridad.
Configuración de PostgreSQL para producción.
Configuración necesaria para Render.
Documentación de despliegue.

Crear también un archivo:

DEPLOYMENT.md

Este documento debe explicar cómo configurar las variables de entorno, conectar PostgreSQL, ejecutar GitHub Actions y desplegar el servicio en Render.

11. Informe final obligatorio

Al finalizar, presentar un informe con los siguientes apartados:

A. Diagnóstico inicial
Estado inicial del backend.
Problemas encontrados.
Configuraciones incompatibles con producción.
B. Modificaciones realizadas
Archivos modificados.
Archivos creados.
Cambios en server.js.
Cambios en CORS.
Cambios en PostgreSQL.
Cambios en dependencias.
C. Resultados de CI/CD
Instalación de dependencias.
Validación de código.
Pruebas de API.
Pruebas de integración.
Auditoría de seguridad.
Validación de PostgreSQL.

Indicar el resultado real de cada prueba. No inventar resultados ni marcar pruebas no ejecutadas como aprobadas.

D. Despliegue
Estado del servicio en Render.
URL pública del backend.
Estado de conexión con PostgreSQL.
Resultado de las pruebas posteriores al despliegue.
E. Pendientes
Errores que no pudieron solucionarse.
Configuraciones que requieren intervención manual.
Variables de entorno que deben configurarse.
Riesgos o recomendaciones adicionales.
12. Instrucción de ejecución

Trabaja directamente sobre el repositorio y la carpeta del backend proporcionada.

Sigue este orden de ejecución:

Analizar todo el backend.
Identificar problemas y dependencias.
Preparar las modificaciones necesarias.
Adaptar la configuración para producción.
Implementar GitHub Actions.
Implementar y ejecutar las pruebas.
Validar seguridad y dependencias.
Validar PostgreSQL.
Corregir los errores encontrados.
Ejecutar nuevamente todas las validaciones.
Desplegar en Render cuando se cumplan las condiciones.
Ejecutar pruebas sobre el servicio desplegado.
Generar la documentación e informe final.

Regla principal: Prioriza la estabilidad, seguridad e integridad de los datos. No des por finalizado el trabajo hasta comprobar que el backend funciona correctamente en producción o documentar claramente cualquier bloqueo que impida conseguirlo.