# MVC
- **Modelo-Vista-Controlador**

---

## Los 3 componentes principales

* **Modelo (Model):** Gestiona los datos, las reglas de negocio y la interacción con la base de datos. No sabe cómo se mostrarán los datos ni quién los solicitó; solo responde a peticiones de lectura, creación, actualización o borrado de información.
* **Vista (View):** Representa la interfaz visual que interactúa con el usuario (HTML, CSS, JSON, plantillas). Recibe los datos procesados y los maquetará para su visualización. No debe contener lógica de negocio pesada.
* **Controlador (Controller):** Actúa como intermediario y cerebro de la aplicación. Recibe las peticiones HTTP del cliente, interpreta lo que el usuario quiere hacer, solicita o actualiza información en el **Modelo** y finalmente selecciona la **Vista** correspondiente para enviar la respuesta.

---

## Flujo de una petición web paso a paso

1. **Petición del usuario:** El usuario realiza una acción en el navegador (por ejemplo, accede a `[https://mitienda.com/productos/10](https://mitienda.com/productos/10)`).
2. **Recepción por el Controlador:** El enrutador del servidor envía la petición al método correspondiente del **Controlador**.
3. **Consulta al Modelo:** El Controlador analiza el parámetro (`id = 10`) y le pide al **Modelo** que busque la información del producto número 10.
4. **Respuesta del Modelo:** El Modelo realiza la consulta a la base de datos y le devuelve los datos estructurados del producto al Controlador.
5. **Preparación de la Vista:** El Controlador toma esos datos y se los entrega a la **Vista** encargada de renderizar productos.
6. **Respuesta al navegador:** La Vista genera el HTML final (o la respuesta JSON/XML) y el Controlador la envía al cliente para que el navegador la muestre.

```
[ Usuario / Navegador ]
       |  ^
Petición |  | Respuesta (HTML / JSON)
       v  |
  [ Controlador ] ----Pide datos---> [ Modelo ]
       |                             |
Enva datos                        Consulta DB
       v                             |
    [ Vista ] <-----Devuelve datos---+

```

---

## Ventajas del modelo MVC

* **Separación de responsabilidades:** Permite cambiar la interfaz visual (Vista) sin tocar la lógica de negocio (Modelo) ni las rutas (Controlador).
* **Trabajo en equipo en paralelo:** Un desarrollador *frontend* puede diseñar las Vistas mientras un desarrollador *backend* trabaja en los Modelos y Controladores.
* **Reutilización de código:** Un mismo Modelo puede alimentar múltiples Vistas (por ejemplo, una página web en HTML y una API móvil en JSON).
* **Fácil mantenimiento y pruebas:** Al estar el código modularizado, la depuración y las pruebas unitarias se simplifican.

---

## Frameworks populares que usan MVC

* **Laravel** (PHP)
* **Ruby on Rails** (Ruby)
* **Django** (Python — implementa una variante muy similar llamada *MTV*: Model-Template-View)
* **ASP.NET Core MVC** (C#)
* **Spring MVC** (Java)
* **Express.js** (Node.js — comúnmente estructurado con patrón MVC)