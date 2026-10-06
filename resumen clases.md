# Resumen de clases

Recopilación de los temas, ejercicios y tareas que constan en las carpetas locales del curso. Las fechas se conservan según los nombres de las carpetas; el repositorio no indica el año de todas las sesiones.

## Índice

1. [1 de septiembre: plataformas y arquitectura web](#1-1-de-septiembre-plataformas-y-arquitectura-web)
2. [4 de septiembre: HTML semántico y accesibilidad](#2-4-de-septiembre-html-semántico-y-accesibilidad)
3. [8 de septiembre: CSS y diseño adaptable](#3-8-de-septiembre-css-y-diseño-adaptable)
4. [11 de septiembre: proyecto de sistema web](#4-11-de-septiembre-proyecto-de-sistema-web)
5. [15 de septiembre: frameworks CSS y galería](#5-15-de-septiembre-frameworks-css-y-galería)
6. [18 de septiembre: Bootstrap frente a Tailwind](#6-18-de-septiembre-bootstrap-frente-a-tailwind)
7. [22 de septiembre: fundamentos de JavaScript](#7-22-de-septiembre-fundamentos-de-javascript)
8. [25 de septiembre: DOM, formularios y asincronía](#8-25-de-septiembre-dom-formularios-y-asincronía)
9. [29 de septiembre: almacenamiento local y aplicaciones offline](#9-29-de-septiembre-almacenamiento-local-y-aplicaciones-offline)
10. [Conceptos integradores y buenas prácticas](#conceptos-integradores-y-buenas-prácticas)
11. [Tareas registradas](#tareas-registradas)
12. [Material consultado](#material-consultado)

## 1. 1 de septiembre: plataformas y arquitectura web

### Tipos de plataformas

- **Web:** se utiliza desde un navegador; tiene alta portabilidad, rendimiento medio y suele depender de Internet. Ejemplo anotado: Google Drive.
- **Escritorio:** se instala localmente; puede ofrecer alto rendimiento y trabajar sin Internet, pero su portabilidad es menor. Ejemplo anotado: AutoCAD.
- **Híbrida:** combina acceso web con una aplicación empaquetada; ofrece portabilidad y rendimiento intermedios o altos, y puede tener dependencia parcial de Internet. Ejemplo anotado: Visual Studio Code.

### Arquitectura cliente-servidor

- El **frontend** es la parte con la que interactúa el usuario y que se ejecuta en el cliente.
- El **backend** procesa lógica y datos en el servidor.
- Cliente y servidor intercambian solicitudes mediante protocolos como HTTP o HTTPS.
- Métodos HTTP mencionados: `GET` para consultar, `POST` para enviar o crear, `PATCH` para modificar parcialmente y `DELETE` para eliminar.

### Entrega y operación de software

El material también introduce **CI/CD**, **DevOps** y **DevSecOps** como temas de investigación y elaboración de un informe. En las notas disponibles no constan definiciones desarrolladas ni un ejercicio técnico de estos conceptos.

## 2. 4 de septiembre: HTML semántico y accesibilidad

### HTML y estructura

- HTML es un lenguaje de marcado que estructura el contenido de una página. Las etiquetas se abren y cierran de forma correspondiente.
- La **semántica** consiste en elegir elementos según el propósito del contenido, no solo por cómo se ven. Por ejemplo, usar regiones y encabezados que describan la estructura del documento.
- Atributos como `alt` describen imágenes para quienes no pueden percibirlas visualmente y también pueden servir cuando la imagen no carga.
- ARIA significa **Accessible Rich Internet Applications**. Sus atributos agregan información de accesibilidad cuando la semántica nativa de HTML no basta; conviene preferir primero los elementos HTML semánticos.

### Práctica de auditoría

Se revisó una página de perfil informativo y se documentaron recomendaciones sobre accesibilidad, validación, estilos, adaptación a pantallas y rendimiento. La revisión humana corrigió falsos positivos de un análisis automatizado: el documento sí tenía `DOCTYPE`, texto alternativo en la imagen y un contenido principal adaptable. La conclusión práctica es verificar cada hallazgo con evidencia antes de cambiar código.

También se recomendó validar el HTML y CSS con herramientas apropiadas, probar distintos tamaños de pantalla y no tratar las sugerencias automáticas como defectos confirmados.

### Formularios accesibles y análisis asistido

El ejemplo de formulario reúne etiquetas visibles, `fieldset`/`legend`, varios tipos de `input`, atributos ARIA, foco visible y mensajes de estado. La revisión crítica identificó que la validación del navegador no sustituye al servidor; `accept` no valida realmente un archivo; los errores deberían asociarse a cada campo; y un mensaje de éxito solo debe aparecer cuando el servidor confirme el envío. También se advierte sobre la recolección de contraseñas y datos personales: hacen falta minimización de datos, aviso de privacidad, HTTPS y almacenamiento seguro del lado del servidor.

En la carpeta hay un script Python que consulta un modelo local de Ollama (`qwen2.5-coder:3b`) para buscar únicamente problemas críticos o altos de accesibilidad WCAG 2.2 AA. No modifica el HTML; sus hallazgos requieren verificación humana.

## 3. 8 de septiembre: CSS y diseño adaptable

### Formas de aplicar CSS

Los estilos pueden escribirse en una hoja externa `.css`, dentro de un bloque `<style>` en el documento o en el atributo `style` de un elemento. Para enlazar una hoja externa se usa `<link rel="stylesheet" href="...">`. Separar el CSS suele facilitar el mantenimiento.

CSS permite definir presentación visual mediante módulos y reglas independientes. Entre los temas anotados están tipografía personalizada con `@font-face`, colores RGBA/HSLA, gradientes y animaciones con `transition` y `@keyframes`.

### Modelo de caja

Cada elemento se representa como una caja con:

- **Contenido (`content`):** texto, imagen u otro contenido.
- **Relleno (`padding`):** espacio entre el contenido y el borde.
- **Borde (`border`):** contorno de la caja.
- **Margen (`margin`):** espacio exterior que la separa de otros elementos.

La propiedad `box-sizing` ayuda a controlar cómo se calculan las dimensiones de las cajas.

### Flexbox, Grid y diseño adaptable

- **Flexbox** organiza elementos principalmente en una dimensión: una fila o una columna. Es útil para alinear componentes dentro de una región, como un encabezado.
- **CSS Grid** organiza elementos en filas y columnas, por lo que resulta apropiado para rejillas y estructuras bidimensionales.
- Ambos reemplazan muchos usos antiguos de `float` o tablas para maquetar.
- Enfoque **mobile-first:** comenzar con la presentación para pantallas pequeñas y ampliarla mediante media queries.
- Usar unidades relativas como `%`, `em`, `rem`, `vw` y `vh` cuando se necesite fluidez; evitar anchos rígidos que provoquen desbordamiento.
- Para imágenes y videos, `max-width: 100%` evita que excedan el ancho disponible.
- `clamp()` permite definir tamaños fluidos con límites mínimos y máximos.

### Responsive y adaptive

- **Responsive (responsivo):** una composición flexible cambia progresivamente con el espacio disponible, normalmente mediante unidades fluidas, Flexbox/Grid y media queries.
- **Adaptive (adaptable):** selecciona entre composiciones o puntos de diseño definidos para ciertos tamaños.
- En el uso cotidiano los términos se confunden, pero describen estrategias distintas.

### Media queries

Permiten aplicar CSS según características de la ventana o dispositivo: `min-width`, `max-width`, altura, orientación, resolución, preferencia de color, reducción de movimiento, capacidad de hover o tipo de puntero. Las notas incluyen rangos orientativos para móvil, tablet, laptop y escritorio; deben ajustarse al contenido en vez de usarse como reglas universales.

Buenas prácticas destacadas: mantener pocos puntos de quiebre, probar diferentes tamaños y orientaciones, usar imágenes flexibles, verificar legibilidad, foco y navegación, y preferir medidas flexibles a valores rígidos.

## 4. 11 de septiembre: proyecto de sistema web

La única nota disponible dice: **construir un sistema web para un negocio**. No hay en esta carpeta requisitos, tecnologías, diseño, código ni apuntes adicionales de la sesión, por lo que no es posible reconstruir el contenido técnico sin especular.

## 5. 15 de septiembre: frameworks CSS y galería

Un framework CSS reúne estilos, componentes o utilidades reutilizables para acelerar interfaces y mantener consistencia.

- **Bootstrap** ofrece componentes listos y un sistema de rejilla con puntos de quiebre. Es rápido de aplicar y tiene documentación amplia; puede sentirse rígido o añadir CSS que el proyecto no necesita si no se personaliza u optimiza.
- **Tailwind CSS** ofrece clases pequeñas de utilidad que se combinan directamente en el HTML. Favorece la personalización, aunque requiere aprender su vocabulario.
- La elección depende de las necesidades y restricciones del proyecto; no hay una regla fija que asigne un framework a un tipo de sitio.

La práctica fue una **galería de servicios** con tres tarjetas. El proyecto combina CSS propio, tarjetas organizadas con Grid, Flexbox dentro de cada tarjeta, enfoque mobile-first, una columna en móvil y tres en pantallas más amplias. También muestra tipografía fluida con `clamp()` y variantes de estilo según `prefers-color-scheme`.

## 6. 18 de septiembre: Bootstrap frente a Tailwind

Se compararon dos perfiles informativos sobre Lionel Messi para observar que se puede construir contenido similar con estructuras y lenguajes visuales distintos.

| Aspecto | Bootstrap | Tailwind CSS |
|---|---|---|
| Enfoque | Componentes y clases prediseñadas | Clases utilitarias pequeñas |
| Rejilla | Contenedores, filas y columnas como `row` y `col-md-4` | Utilidades como `grid` y `md:grid-cols-3` |
| Personalización | Componentes listos; se puede complementar con CSS | Estilos compuestos directamente en las clases |
| Interacciones vistas | Navbar colapsable, alertas, tarjetas y acordeón | Estados hover/focus, transiciones, rejillas y composición personalizada |
| Consideración | Hay que cargar el JavaScript del framework para componentes interactivos | Hay que conocer las utilidades y cuidar la legibilidad del HTML |

La conclusión del ejercicio es comparar rapidez de implementación, personalización, mantenimiento, dependencias y resultado visual en el contexto real del proyecto.

## 7. 22 de septiembre: fundamentos de JavaScript

JavaScript aporta interactividad, responde a eventos, manipula el DOM y permite comunicarse con servidores.

### Lenguaje y funciones

- JavaScript tiene tipado dinámico: el tipo se determina durante la ejecución a partir del valor.
- `let` declara variables que pueden cambiar; `const` declara referencias que no se reasignan; `var` tiene alcance de función o global y se recomienda evitarlo en código nuevo salvo necesidad de compatibilidad.
- Las funciones permiten modularizar el programa. Se revisaron funciones tradicionales y funciones flecha; las funciones tradicionales son útiles cuando se necesita el comportamiento propio de `this`.
- La desestructuración extrae propiedades de objetos o posiciones de arreglos.
- Los retornos anticipados pueden reducir anidación y hacer más claro el flujo.

### Asincronía

JavaScript ejecuta código en un hilo principal y coordina tareas asíncronas mediante el event loop. Una **Promise** representa una operación que puede completarse o fallar más adelante; sus resultados se manejan con `then`, `catch` y `finally`.

`async` y `await` permiten expresar secuencias asíncronas con una sintaxis más legible. Las funciones `async` devuelven promesas; `await` espera el resultado sin bloquear el hilo principal. Para manejar fallos se recomienda `try...catch`, mostrar estados de carga y tratar errores de servicios externos.

### Errores

- **Sintaxis:** el código no cumple las reglas del lenguaje.
- **Referencia:** se usa una variable o miembro no definido.
- **Ejecución:** el programa falla mientras se ejecuta aunque la sintaxis sea válida.
- `try...catch...finally` permite capturar errores y ejecutar tareas de limpieza; `throw` permite generarlos explícitamente.
- Se pueden crear clases de error personalizadas para comunicar fallos propios del dominio.
- El registro de errores (`console`, archivos de log o herramientas de monitoreo) ayuda a diagnosticar y rastrear problemas.

## 8. 25 de septiembre: DOM, formularios y asincronía

### DOM y eventos

El DOM representa la estructura del documento como objetos que JavaScript puede consultar y modificar. Métodos vistos:

- `getElementById(id)` busca un elemento por su identificador.
- `querySelector(selector)` devuelve la primera coincidencia.
- `querySelectorAll(selector)` devuelve todas las coincidencias.
- `getElementsByClassName(clase)` busca por clase.

Los eventos incluyen clics, entrada de texto, cambios, foco y carga. `addEventListener()` registra una función que reacciona a un evento. Con el DOM también se pueden crear o actualizar elementos según los datos recibidos.

### Validación de formularios

- Escuchar eventos como `input`, `change`, `blur` y `focus` permite responder mientras el usuario completa un campo.
- HTML ofrece validación nativa mediante restricciones como `required`, tipos de entrada y límites; JavaScript ofrece `validity`, `checkValidity()`, `setCustomValidity()` y `reportValidity()`.
- Las expresiones regulares permiten comprobar formatos específicos, como una cantidad de dígitos.
- La sanitización y validación deben considerar la entrada antes de procesarla o enviarla. La validación del cliente mejora la experiencia, pero el servidor también debe validar.
- Asociar cada error con su campo y explicar cómo corregirlo mejora la accesibilidad. No se debe presentar como exitoso un envío que no haya sido confirmado por un servidor.

### Fetch API y datos

`fetch()` realiza solicitudes HTTP y trabaja con promesas. Puede usarse con `GET`, `POST`, `PUT` o `DELETE`, según la operación. Para enviar JSON se serializan los datos, por ejemplo con `JSON.stringify()`, y se configura el encabezado `Content-Type: application/json`. Se deben gestionar respuestas fallidas y errores de red.

### Almacenamiento del lado del cliente

- **`localStorage`:** conserva pares clave-valor entre sesiones del navegador.
- **`sessionStorage`:** conserva datos mientras dure la sesión de esa pestaña.
- **IndexedDB:** base de datos local para mayores volúmenes de datos estructurados; admite object stores, índices, búsquedas y transacciones, y puede apoyar experiencias offline.
- La decisión entre almacenamiento local y servidor depende de la necesidad de sincronización, la privacidad, la sensibilidad de los datos y el control de acceso. No se deben guardar datos sensibles localmente sin analizar los riesgos.

### Accesibilidad

Se revisaron los principios **POUR**:

- **Perceptible:** la información debe poder percibirse.
- **Operable:** los controles y la navegación deben poder utilizarse, incluido el teclado.
- **Comprensible:** instrucciones y mensajes deben ser claros y previsibles.
- **Robusto:** el contenido debe funcionar con navegadores y tecnologías de asistencia.

## 9. 29 de septiembre: almacenamiento local y aplicaciones offline

La sesión retoma JavaScript del lado del cliente y la toma de decisiones sobre persistencia:

- Una interfaz debe reaccionar a las acciones del usuario y puede actualizarse con datos obtenidos en tiempo real.
- `localStorage` y `sessionStorage` guardan datos en el navegador; IndexedDB permite manejar colecciones estructuradas de mayor tamaño. La elección entre cliente y servidor es una decisión de diseño y seguridad.
- Se conectan solicitudes `fetch()` con almacenamiento local para conservar datos y apoyar el funcionamiento offline.

El ejemplo de la carpeta abre una base `MiBase` de IndexedDB, crea un object store `usuarios` con `id` como clave y obtiene usuarios de JSONPlaceholder con `fetch()` para guardarlos mediante `put()`. Es una demostración del flujo de lectura remota y persistencia local; una aplicación de producción también debe contemplar fallos de red, transacciones, actualizaciones de esquema, estados de carga y una estrategia explícita para mostrar datos offline.

En esta sesión también se vuelve sobre el DOM, eventos, validación de formularios, expresiones regulares, serialización JSON y Fetch API. Se anota como trabajo desarrollar una página web que funcione offline.

## Conceptos integradores y buenas prácticas

1. Estructurar el contenido con HTML semántico; utilizar ARIA cuando aporte información que no se pueda expresar adecuadamente con HTML nativo.
2. Diseñar primero para el espacio más limitado y adaptar con CSS flexible, Grid/Flexbox y media queries.
3. Mantener separados contenido, presentación y comportamiento cuando ayude a la claridad y el mantenimiento.
4. Tratar entradas, formularios y archivos con validación en cliente y servidor; los atributos HTML por sí solos no son controles de seguridad.
5. Comunicar estados de espera, éxito y error de manera accesible y veraz.
6. Manejar operaciones asíncronas y fallos con promesas o `async`/`await`, `try...catch` y mensajes útiles.
7. Elegir con cuidado dónde almacenar datos, especialmente si son personales o sensibles.
8. Verificar manualmente las recomendaciones de herramientas automáticas y probar con teclado, lectores de pantalla, varios tamaños de pantalla y validadores.

## Tareas registradas

- **4 de septiembre:** investigar CI/CD, DevOps y DevSecOps y elaborar un informe. El README general del proyecto también indica anotar ejercicios, dudas y soluciones consultadas, y analizar las partes críticas de las auditorías con un color distinto.
- **Material general del proyecto:** consultar la documentación de HTML de MDN y registrar lo aprendido y las dudas.
- **11 de septiembre:** construir un sistema web para un negocio; no se conservan más requisitos en la carpeta.
- **29 de septiembre:** traer/programar una página web offline. Las notas señalan fecha de entrega `13/10/2026` y solicitan un informe con título, objetivo general y específicos, resumen, introducción, metodología, resultados, conclusiones y bibliografía.

## Material consultado

- [Notas de la clase 1](Clases/1_SEP1/notas.md)
- [Ejercicio y auditoría de la clase 2](Clases/2_SEP4/deber.md) y [reporte de auditoría](Clases/2_SEP4/prueba/auditoria.md)
- [Notas y ejemplos de la clase 3](Clases/3_SEP8/notas.md) y [análisis del formulario](Clases/3_SEP8/ejemplo2/errores_criticos.md)
- [Consigna de la clase 4](Clases/4_SEP11/README)
- [Notas y proyecto de la clase 5](Clases/5_SEP15/notasClase.md) y [galería de servicios](Clases/5_SEP15/proyectoEnClase/README.md)
- [Notas de frameworks de la clase 6](Clases/6_SEP18/notas.md) y [comparación de Bootstrap y Tailwind](Clases/6_SEP18/pruebas/diferencias.md)
- [JavaScript de la clase 7](Clases/7_SEP22/README.md)
- [Taller asíncrono de la clase 8](Clases/8_25SEP/taller/index.html)
- [Notas y ejemplo IndexedDB de la clase 9](Clases/9_SEP29/notasClase.md) y [implementación](Clases/9_SEP29/index.html)