# Enlace: ubicación en tiempo real

Aplicación web para compartir la ubicación GPS de un teléfono con permiso explícito y observar los dispositivos activos en un mapa de Google Maps. La vista y los estilos forman la Vista; `app.js` coordina la interacción (Controlador); `firebase.js` gestiona autenticación y persistencia en Firebase (Modelo).

## Estructura

- `index.html`: interfaz del panel y carga de los SDK web.
- `assets/css/styles.css`: diseño adaptable a teléfono y computadora.
- `assets/js/app.js`: permisos de GPS, controles, lista en vivo y marcadores/trayectorias.
- `assets/js/firebase.js`: autenticación anónima y lecturas/escrituras en Realtime Database.
- `assets/js/config.js`: claves y configuración que debes completar.

## Configuración

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/), registra una aplicación web y copia su configuración en `assets/js/config.js`.
2. En Firebase Authentication, habilita el proveedor **Anónimo**.
3. Crea una base de datos **Realtime Database**. Copia su URL `databaseURL` (por ejemplo, `https://<proyecto>-default-rtdb.firebaseio.com`) a la configuración.
4. En **Reglas** de Realtime Database, usa estas reglas para la práctica. Los usuarios autenticados anónimamente pueden leer ubicaciones; cada dispositivo solo puede escribir o borrar la suya:

   ```json
   {
     "rules": {
       "locations": {
         ".read": "auth != null",
         "$uid": {
           ".write": "auth != null && auth.uid === $uid"
         }
       }
     }
   }
   ```

5. En [Google Cloud Console](https://console.cloud.google.com/), habilita **Maps JavaScript API**, configura facturación si Google la solicita y crea una clave de API. Pega la clave en `MAPS_API_KEY`.
6. Restringe la clave de Google Maps por sitios web (HTTP referrers) y limita las APIs autorizadas. No publiques las reglas abiertas de prueba de Firebase.

Las claves web de Firebase y Google Maps se envían al navegador; no son contraseñas. La seguridad depende de las reglas de Firebase, las restricciones de la clave de Maps y los proveedores de autenticación habilitados.

## Ejecutar

Abre `index.html` con **Live Server** desde VS Code o sirve esta carpeta por HTTPS. No abras el archivo directamente con `file://`: los módulos y la geolocalización necesitan un origen seguro (`localhost` también sirve). Abre la página en el teléfono y en la computadora; en el teléfono pulsa **Empezar a compartir** y concede permiso. La computadora mostrará los registros de Firebase y el mapa se centrará en las ubicaciones recibidas.

El GPS y la escritura a Firebase se solicitan cada 1000 ms mientras la página está activa. Algunos teléfonos limitan temporizadores y GPS cuando una pestaña queda en segundo plano, el dispositivo entra en reposo o pierde conexión. Al pulsar **Dejar de compartir** se borra la ubicación de ese dispositivo; Firebase también la elimina al desconectarse normalmente.

## Privacidad y uso real

La autorización del navegador controla el acceso al GPS, no quién puede ver las ubicaciones. Con las reglas de práctica, cualquier usuario que inicie sesión anónimamente en este proyecto puede leer los datos compartidos. Úsalo solo con personas que hayan aceptado participar; para producción, añade cuentas, autorización por grupos o invitaciones, retención limitada y una política de privacidad. El acceso anónimo identifica el navegador, no verifica la identidad de la persona.