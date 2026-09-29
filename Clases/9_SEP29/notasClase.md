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