# Enlace: compartir y monitorear ubicación

Aplicación web con dos interfaces independientes:

- `index.html`: interfaz para que cada persona comparta su propia ubicación tras dar permiso al navegador.
- `admin.html`: panel privado para que administradores autenticados monitoreen las ubicaciones activas en una lista y un mapa.

## Estructura

- `assets/css/styles.css`: diseño adaptable a teléfono y computadora.
- `assets/js/share.js`: permisos GPS y publicación de la ubicación del dispositivo.
- `assets/js/admin.js`: inicio de sesión de administradores, lista en vivo y marcadores/trayectorias.
- `assets/js/firebase.js`: autenticación y acceso a Realtime Database.
- `assets/js/config.js`: claves y configuración de Firebase y Google Maps.
- `database.rules.json`: reglas que restringen la lectura de ubicaciones al correo administrador configurado.

## Configuración

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/), registra una aplicación web y copia su configuración en `assets/js/config.js`.
2. En Firebase Authentication, habilita los proveedores **Anónimo** y **Correo electrónico/contraseña**.
3. En Authentication, crea las cuentas de las personas administradoras. La página de administración no ofrece registro.
4. En `database.rules.json`, reemplaza `admin@example.com` por el correo exacto de la cuenta administradora. Para permitir más cuentas, añade comparaciones de correo con `||`.
5. Crea una base **Realtime Database** y copia su URL `databaseURL` a `assets/js/config.js`.
6. Publica las reglas para tu proyecto Firebase:

   ```sh
   firebase deploy --only database --project ID_DEL_PROYECTO
   ```

   Este directorio incluye `firebase.json` para desplegar `database.rules.json`. Necesitas tener Firebase CLI instalado y usar el ID del proyecto correcto.
7. En [Google Cloud Console](https://console.cloud.google.com/), habilita **Maps JavaScript API**, configura facturación si Google la solicita y coloca la clave en `MAPS_API_KEY`. Restringe la clave por sitios web (HTTP referrers) y limita las APIs autorizadas.

Las reglas permiten que cualquier sesión autenticada escriba únicamente bajo su propio UID; solo la cuenta cuyo correo está permitido puede leer las ubicaciones. La clave web de Firebase no sustituye las reglas de seguridad.

## Ejecutar

Sirve esta carpeta por HTTPS o ábrela con **Live Server** en VS Code (`localhost` también es origen seguro). No uses `file://`: los módulos JavaScript y la geolocalización requieren un origen seguro.

- Comparte `index.html` con los participantes; desde esa página pueden iniciar o detener el envío de su dispositivo.
- Comparte `admin.html` únicamente con administradores; deberán iniciar sesión con las cuentas creadas en Firebase.
- El mapa requiere que la clave de Google Maps esté configurada.

Al detener el envío se elimina de Firebase la ubicación del dispositivo. Firebase también la elimina al desconectarse normalmente. Algunos teléfonos limitan temporizadores y GPS cuando una pestaña queda en segundo plano, el dispositivo entra en reposo o pierde conexión.

## Privacidad

El panel requiere inicio de sesión y las reglas de Realtime Database son las que aplican el permiso de lectura en el servidor. No dejes las reglas de prueba abiertas: despliega `database.rules.json` con las direcciones correctas antes de compartir ubicaciones.
