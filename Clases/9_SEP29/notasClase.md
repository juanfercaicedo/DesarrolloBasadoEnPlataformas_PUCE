- **Iteractivo:** Que obtenga datos en tiempo real, por ejemplo cuando jugamos videojuegos en línea o cuando ocupamos aplicaciones de mensajería como whatsapp.
- **Reaccionar:** Debe reaccionar a la acción que el usuario quiera
    - Por ejemplo un carrito de compras debe ser capaz de aumentar un artículo en específico que el usuario quiera
    - Por cada acción la página web debe reaccionar
- Elementos: 
    - `init`
    - `load`
    - `constructor`
- Con los *elementos* va a haber una reacción/método.
- `localStorage` -> Se utiliza para guardar los datos de una sesión dentro de la memoria del ordenador en el navegador.
- `sessionStorage` -> Almacena datos del lado del cliente, se van a eliminar una vez la sesión se cierre(cerremos la ventana de google).
- ¿Cómo determinamos que información guardamos localmente o en un servidor?
    - Por ejemplo en una tienda en linea(Amazon)
        - Los carritos de compras se van a guardar localmente ya que no es necesario compartirlos con otros usuarios y no es necesario saturar al servidor con peticiones que puede ser que el usuario no compre(esten jugando en el carrito de compras).
        - Mandaremos al servidor cuando se realice una compra y se tenga el pago.
    - El criterio de que almacenar localmente o en el servidor es nuestra responsabilidad.
    - Un error en este proceso puede ocasionar que terceros accedan a datos sensibles los cuales no deberían tener autorización para verlos o manipularlos.
    - `IndexDB` -> Base de datos NoSQL, se utiliza de forma local y tiene una capacidad de almacenamiento de**50% o 60%** del espacio libre en el disco del dispositivo.
    - localStorage, puede ser las cookies y el caché.
- Dentro del CSS:
    - Ocupamos:
        - `#` para id's
        - `.` para clases
## FUNCIONES PARA ACCEDER A LAS FUNCIONES DEL DOM
| Método | Descripción | Retorna |
|---|---|---|
| `getElementById(id)` | Busca por ID único | Elemento |
| `querySelector(sel)` | Primer elemento que cumple el selector | Elemento |
| `querySelectorAll(sel)` | Todos los elementos que cumplen el selector | NodeList |
| `getElementsByClassName(clase)` | Busca por clase CSS | HTMLCollection |

- JavaScript permite crear y modificar elementos de forma dinámica
    - Se pregunta al servidor la cantidad de elementos que nos va a enviar y dinámicamente creo la cantidad de elementos que el servidor nos diga.

## Eventos
- Con los que permiten que haya interacción con el usuario
    - Clics, movimientos, pulsaciones o cargas.
- Utiliza manejadores de eventos, `event listeners`
    - `addEventListener`
    ```javascript
    const buton = document.querySelector("button");
    boton.addEventListener("click", () => {
        alert("Has hecho clic en el botón");
    });
    ```
- Las funciones que no tienen nombre son funciones anónimas, son funciones que se disparan o se ejectuan en ese momento

## Rol del DOM API en validación
- Permite escuchar y reaccionar ante los cambios en los elementos de un formulario.
- Cada campo(input, select, textarea) genera eventos (input, change, blur, focus)
```html
<form id="registro">
    <input id="nombre" placeholder="Nombre completo" />
    <small id="errNombre" class="error"></small>
</form>
<script>
    const nombre = document.querySelector("#nombre");
    const errNombre = document.querySelector("#errNombre");
    nombre.addEventListener("input", () => {
        if (nombre.value.trim().length < 3) {
           errNombre.textContent = "El nombre debe tener al menos 3 caracteres.";
           nombre.classList.add("invalido");
        } else {
           errNombre.textContent = "";
           nombre.classList.remove("invalido");
        }
        }
    );
</script>
```
## API nativa HTML5
- `input.validity`
- `checkValidity()`
- `setCustomValidity(msg)`
- `reportValidity()`
```javascript
const email = document.querySelector("#email");
email.addEventListener("input", () => {
    if (!email.value.includes("@")) {
       email.setCustomValidity("Debe incluir un símbolo @");
    } else {
       email.setCustomValidity("");
    }
});
```

## Validación con expresiones regulares
- Se utilizan expresiones regulares que estan incluidas en el DOM
```javascript
const telefono = document.querySelector("#telefono");
const msg = document.querySelector("#errorTelefono");
const regex = /^\d{10}$/; // solo 10 dígitos -> EXPRESIONES REGULARES
telefono.addEventListener("input", () => {
    if (!regex.test(telefono.value)) {
        msg.textContent = "El teléfono debe tener 10 dígitos.";
    } else {
        msg.textContent = "";
    }
});
```

## Fetch API y comsumo de datos
- Construye métodos asincrónicos que me permite comunicarme con un servidor para un intercambio de datos.
- *Fetch API*: Es una interfaz moderna basada en en promesas que permite realizar solicitudes HTTP para recuperar(GET) o enviar(POST, PUT, DELETE) información
    - El tipo de solicitud que se haga depende del cliente

- **FETCH API**: También nos permite trabajar con métodos asincrónicos, pero en vez de ocupar el retunr, ocupamos `await`
```javascript
fetch("https://api.example.com/login", {
    method: "POST",
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify({ // -> Serializamos la información
    usuario: "damian",
    clave: "12345"
    })
})
    .then(r => r.json())
    .then(data => console.log("Respuesta:", data))
    .catch(err => console.error(err));
```

- **Serialización:** Es el roceso que convierte un objeto o estructura de datos a un formato que pueda generar o enviar un JSON
- Encabezados personalizados, {`Content-type`:`apllication/json`}

## Almacenamiento de datos con IndexDB
- Permite almacenar grande volumenes de datos estructurados
- Es ideal para aplicaciones offline(Páginas web progresivas)
- Permite índices, búsquedas y transacciones, lo que hace ideal para aplicaciones offline.
- Utiliza `objectStore`, que son las tablas.
    - Para crealo:
        - db.createObjectStore("usuarios", {keyPath: "id"})
- Sincronización entre FETCH e IndexDB
    - Primero me conecto a internet, traigo la información
    
- Cuando hablamos de accesibilidad nunca nos debemos olvidar de los 4 principios del POUR
    - Perceptible: La información debe ser visible o audible
    - Operable: El contenido debe ser navegable por teclado
    - Comprensible: Las instrucciones y mensajes deben ser claros
    - Robusto: Compatible con diferentes tecnologías asistidas(tecnologías que utilizan las personas no videntes).



- **DEBER**: Traer una página web offline(programarla). - [13/10/2026]
    - Informe a mano en el cuaderno(Título, objetivo general, objetivos especificos, resumen, introducción, metodología, resultados, conclusiones y bibliografía)