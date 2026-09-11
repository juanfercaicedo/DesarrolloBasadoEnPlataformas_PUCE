# Puntos críticos y mejoras

## Puntos críticos

- **El formulario no realiza un envío real y muestra un éxito falso.**
  - **Evidencia:** `preventDefault()` bloquea el envío, no existe un `action` ni un `method`, y aun así se muestra «Formulario enviado correctamente».
  - **Cómo mejorarlo:** configurar un endpoint real con `action` y `method`, o usar `fetch`.
  - **Cómo hacerlo:** mostrar el mensaje de éxito únicamente después de confirmar una respuesta correcta del servidor; mostrar un error cuando falle la red o el servidor.

- **La validación puede producir un error de JavaScript.**
  - **Evidencia:** se ejecuta `checkValidity()` sobre todos los elementos de `form.elements`, incluidos elementos que no son controles validables, como `fieldset`.
  - **Cómo mejorarlo:** validar solo controles compatibles y validables.
  - **Cómo hacerlo:** filtrar con `control.willValidate` y comprobar que `typeof control.checkValidity === 'function'` antes de llamar al método.

- **El archivo adjunto no tiene límites ni validación de seguridad reales.**
  - **Evidencia:** `accept` solo orienta al selector; el límite de 2 MB aparece como recomendado y no se comprueba el contenido.
  - **Cómo mejorarlo:** validar tipo, tamaño y contenido tanto en el navegador como en el servidor.
  - **Cómo hacerlo:** revisar `file.size` y `file.type` en JavaScript, repetir la validación del MIME y del contenido en el servidor, y guardar el archivo con un nombre seguro fuera de una carpeta ejecutable.

- **Se solicitan datos sensibles sin información de privacidad.**
  - **Evidencia:** se piden contraseña, correo, archivo y comentarios sin explicar finalidad, conservación ni responsable del tratamiento.
  - **Cómo mejorarlo:** reducir los datos solicitados e informar al usuario antes del envío.
  - **Cómo hacerlo:** agregar aviso de privacidad y consentimiento cuando corresponda, usar HTTPS y nunca almacenar contraseñas sin hash seguro en el servidor.

## Puntos a mejorar

- **Los errores no están asociados a cada campo.**
  - **Evidencia:** solo se agrega `aria-invalid`; el usuario recibe un mensaje general.
  - **Cómo mejorarlo:** indicar qué campo falló y cómo corregirlo.
  - **Cómo hacerlo:** crear un mensaje junto a cada control, asignarle un `id` y relacionarlo con `aria-describedby` o `aria-errormessage`.

- **`novalidate` elimina la ayuda nativa sin reemplazarla completamente.**
  - **Cómo mejorarlo:** implementar mensajes para `required`, formato inválido, longitud y rangos, o retirar `novalidate` si se desea conservar la validación nativa.
  - **Cómo hacerlo:** centralizar la función de validación y mostrar un mensaje específico por cada restricción incumplida.

- **El botón «Limpiar» deja desactualizado el valor visual del rango.**
  - **Evidencia:** el control vuelve a `5`, pero el elemento `output` conserva el valor anterior.
  - **Cómo mejorarlo:** sincronizar el `output` después de restablecer el formulario.
  - **Cómo hacerlo:** reutilizar una función `updateSatisfaction()` dentro del evento `reset`.

- **No se evita el doble envío ni se informa el estado de procesamiento.**
  - **Cómo mejorarlo:** controlar los estados de espera, éxito y error.
  - **Cómo hacerlo:** deshabilitar el botón de envío mientras se procesa la solicitud y volver a habilitarlo cuando termine.

## Observaciones

- El formulario tiene una estructura semántica adecuada: utiliza `label`, `fieldset`, `legend`, estados de foco y atributos ARIA básicos.
- La accesibilidad visual y la navegación por teclado están consideradas, pero los mensajes de error deben ser específicos para cada campo.
- La validación actual funciona como demostración local; no confirma que los datos hayan sido recibidos por un servidor.
- La contraseña, el archivo adjunto y los datos personales requieren controles adicionales de privacidad y seguridad antes de utilizar el formulario en producción.
- El atributo `accept` y la validación del navegador no sustituyen la validación del servidor.
