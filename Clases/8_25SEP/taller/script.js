class ServicioError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = "ServicioError";
  }
}

function obtenerDatosUsuario() {
  return new Promise((resolve, reject) => { // Un resultado que puede estar disponble al instante, en un futuro o nunca
    setTimeout(() => {
      const exito = Math.random() > 0.3;
      if (exito) {
        resolve({ usuario: "Ana", rol: "estudiante" });
      } else {
        reject(new ServicioError("No se pudo conectar con el servicio"));
      }
    }, 800); // establecemos un tiempo de espera de 800 milsegundos para que se complete el servicio
  });
}

const boton = document.getElementById("btnCargar"); // Obtenemos el DOM por el ID
const resultado = document.getElementById("resultado");

boton.addEventListener("click", async () => { // Cuando demos click en el botón mostrará un cargando
  resultado.textContent = "Cargando...";
  try {
    const datos = await obtenerDatosUsuario();
    resultado.textContent = `Bienvenido, ${datos.usuario} (${datos.rol})`;
  } catch (error) {
    resultado.textContent = `Error: ${error.message}`;
  } finally {
    console.log("Intento de carga finalizado");
  }
});
    