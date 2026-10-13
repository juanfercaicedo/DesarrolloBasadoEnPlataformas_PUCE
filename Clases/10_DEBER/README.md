# Aula sin señal

Página educativa offline sobre service workers, caché, almacenamiento local y accesibilidad. No carga bibliotecas, fuentes ni imágenes de Internet.

## Estructura

- `index.html`: punto de entrada de la página.
- `informe.md`: informe para transcribir a mano en el cuaderno.
- `assets/css/`: estilos de la página.
- `assets/js/`: lógica JavaScript de la aplicación.
- `assets/icon.svg`: icono local de la página.
- `sw.js`: service worker y estrategia de caché offline.
- `manifest.webmanifest`: metadatos para instalar la aplicación.

El informe del deber está separado de la web en [`informe.md`](./informe.md), con título, objetivos, resumen, introducción, metodología, resultados, conclusiones y bibliografía.

## Abrir la página

- Se puede abrir `Clases/10_DEBER/index.html` directamente para consultar la guía y usar sus actividades sin Internet.
- Para habilitar el service worker y guardar automáticamente los archivos para visitas futuras, sirve esta carpeta desde `localhost` o publícala con HTTPS. Por ejemplo, usa la extensión **Live Server** de VS Code y abre `index.html`.
- Una vez que el sitio haya cargado en línea mediante ese servidor, desconecta Internet y vuelve a cargarlo para comprobar el funcionamiento offline.

El resultado del cuestionario se guarda en `localStorage`; las notas se guardan en `IndexedDB`, con una alternativa local si el navegador no ofrece IndexedDB. El service worker precarga el sitio y responde con la copia guardada cuando no hay conexión.

La interfaz incluye navegación por teclado, regiones semánticas, mensajes anunciables para tecnologías de asistencia y un modo oscuro/claro. La preferencia de tema se guarda en `localStorage`.

Al publicar cambios, el navegador instala una nueva versión de la caché y elimina la anterior. Si el sitio estaba abierto durante la actualización, recárgalo con conexión para que el service worker nuevo reemplace los archivos offline antiguos.
