# Informe: Desarrollo de una página web que funciona sin conexión a Internet

## Objetivo general

Crear una página web interactiva capaz de presentar información y conservar datos del usuario sin depender de una conexión a Internet.

## Objetivos específicos

- Explicar el almacenamiento local y el uso de una caché para acceder al contenido offline.
- Aplicar HTML semántico, CSS adaptable y JavaScript para responder a las acciones del usuario.
- Considerar la accesibilidad, la privacidad y las limitaciones de la sincronización con un servidor.

## Resumen

Se programó una página educativa que presenta conceptos de aplicaciones offline, permite responder un cuestionario y guardar notas en el navegador. Sus archivos pueden almacenarse en caché mediante un service worker para que la experiencia continúe sin Internet.

## Introducción

Muchas páginas dependen de una conexión para mostrar sus recursos. Una aplicación offline prepara previamente sus archivos y puede guardar información en el dispositivo. Esto mejora la continuidad de uso, aunque los cambios que deban compartirse con un servidor solo se podrán sincronizar cuando haya conexión.

## Metodología

Se organizó el contenido con elementos semánticos de HTML, se creó un diseño adaptable con CSS y se programaron las interacciones con JavaScript y eventos del DOM. El navegador conserva el resultado del cuestionario en `localStorage` y las notas en `IndexedDB`, con una alternativa local si esa base de datos no está disponible. Un service worker guarda los archivos de la página para reutilizarlos offline.

## Resultados

La guía se puede consultar sin hacer solicitudes a servicios externos. El cuestionario valida las respuestas y el usuario puede crear y eliminar notas. La caché permite abrir el sitio sin conexión después de que sus archivos se hayan cargado al menos una vez desde un servidor compatible, como localhost o HTTPS.

## Conclusiones

Es posible crear una experiencia web útil sin conexión al combinar archivos locales, almacenamiento del navegador y una estrategia de caché. La información local debe manejarse con cuidado y no sustituye la copia de seguridad ni la validación del servidor. Además, la navegación por teclado, los mensajes claros y el diseño adaptable hacen que la aplicación sea más accesible.

## Bibliografía

- Material de clase, *Resumen de clases: Desarrollo Basado en Plataformas*, PUCE, 2026.
- MDN Web Docs. “Service Worker API”. https://developer.mozilla.org/docs/Web/API/Service_Worker_API
- MDN Web Docs. “IndexedDB API”. https://developer.mozilla.org/docs/Web/API/IndexedDB_API
- MDN Web Docs. “Progressive web apps”. https://developer.mozilla.org/docs/Web/Progressive_web_apps
