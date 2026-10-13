import { connectToLocations } from "./firebase.js";

const elements = {
    connectionStatus: document.querySelector("#connectionStatus"),
    connectionText: document.querySelector("#connectionText"),
    localClock: document.querySelector("#localClock"),
    deviceName: document.querySelector("#deviceName"),
    startSharing: document.querySelector("#startSharing"),
    stopSharing: document.querySelector("#stopSharing"),
    shareStatus: document.querySelector("#shareStatus"),
    latitudeValue: document.querySelector("#latitudeValue"),
    longitudeValue: document.querySelector("#longitudeValue"),
    accuracyValue: document.querySelector("#accuracyValue"),
    updatedValue: document.querySelector("#updatedValue")
};

let firebaseSession;
let watchId;
let publishTimer;
let latestPosition;
let publishInProgress = false;

function showConnection(message, isConnected = false, isError = false) {
    elements.connectionText.textContent = message;
    elements.connectionStatus.classList.toggle("is-connected", isConnected);
    elements.connectionStatus.classList.toggle("is-error", isError);
}

function clockText(timestamp = Date.now()) {
    return new Intl.DateTimeFormat("es-EC", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(timestamp);
}

function escapeName(name) {
    return String(name || "Dispositivo").trim().slice(0, 32) || "Dispositivo";
}

function onLocationUpdate(position) {
    latestPosition = position;
    const { latitude, longitude, accuracy } = position.coords;
    elements.latitudeValue.textContent = latitude.toFixed(6);
    elements.longitudeValue.textContent = longitude.toFixed(6);
    elements.accuracyValue.textContent = `±${Math.round(accuracy)} m`;
    elements.updatedValue.textContent = clockText(position.timestamp);
    elements.shareStatus.textContent = "GPS activo · sincronizando cada segundo";
    elements.shareStatus.classList.add("is-sharing");
    publishLocation();
}

async function publishLocation() {
    if (!firebaseSession || !latestPosition || publishInProgress) return;
    publishInProgress = true;
    const { latitude, longitude, accuracy, speed, heading } = latestPosition.coords;
    try {
        await firebaseSession.publish({
            uid: firebaseSession.uid,
            name: escapeName(elements.deviceName.value),
            latitude,
            longitude,
            accuracy,
            speed,
            heading,
            active: true
        });
    } catch (error) {
        elements.shareStatus.textContent = `Error al enviar ubicación: ${error.message}`;
        elements.shareStatus.classList.remove("is-sharing");
    } finally {
        publishInProgress = false;
    }
}

function startSharing() {
    if (!firebaseSession) {
        elements.shareStatus.textContent = "Firebase no está conectado. Revisa la configuración.";
        return;
    }
    if (!navigator.geolocation) {
        elements.shareStatus.textContent = "Este navegador no ofrece acceso a GPS.";
        return;
    }

    const name = escapeName(elements.deviceName.value);
    elements.deviceName.value = name;
    localStorage.setItem("enlace-device-name", name);
    elements.startSharing.hidden = true;
    elements.stopSharing.hidden = false;
    elements.shareStatus.textContent = "Solicitando permiso de ubicación…";

    watchId = navigator.geolocation.watchPosition(onLocationUpdate, (error) => {
        const messages = {
            1: "Permiso de ubicación denegado. Actívalo en los ajustes del navegador.",
            2: "No se pudo determinar la ubicación. Comprueba el GPS del dispositivo.",
            3: "El GPS tardó demasiado en responder. Intenta de nuevo."
        };
        const message = messages[error.code] || "No se pudo obtener la ubicación.";
        navigator.geolocation.clearWatch(watchId);
        window.clearInterval(publishTimer);
        watchId = undefined;
        publishTimer = undefined;
        latestPosition = undefined;
        elements.startSharing.hidden = false;
        elements.stopSharing.hidden = true;
        elements.shareStatus.textContent = message;
        elements.shareStatus.classList.remove("is-sharing");
        if (firebaseSession) firebaseSession.stop().catch((stopError) => {
            elements.shareStatus.textContent = `${message} No se pudo eliminar el registro: ${stopError.message}`;
        });
    }, { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 });

    publishTimer = window.setInterval(publishLocation, 1000);
}

async function stopSharing() {
    if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
    window.clearInterval(publishTimer);
    watchId = undefined;
    publishTimer = undefined;
    latestPosition = undefined;
    elements.startSharing.hidden = false;
    elements.stopSharing.hidden = true;
    elements.shareStatus.textContent = "Ubicación detenida y eliminada de Firebase.";
    elements.shareStatus.classList.remove("is-sharing");
    elements.latitudeValue.textContent = "--.------";
    elements.longitudeValue.textContent = "--.------";
    elements.accuracyValue.textContent = "--";
    elements.updatedValue.textContent = "--:--:--";
    if (firebaseSession) {
        try {
            await firebaseSession.stop();
        } catch (error) {
            elements.shareStatus.textContent = `No se pudo eliminar la ubicación: ${error.message}`;
        }
    }
}

async function initializeFirebase() {
    try {
        firebaseSession = await connectToLocations();
        elements.deviceName.value = localStorage.getItem("enlace-device-name") || "";
        showConnection("Firebase conectado", true);
        elements.startSharing.disabled = false;
    } catch (error) {
        showConnection("Sin conexión a Firebase", false, true);
        elements.shareStatus.textContent = error.message;
        elements.deviceName.value = localStorage.getItem("enlace-device-name") || "";
    }
}

elements.startSharing.addEventListener("click", startSharing);
elements.stopSharing.addEventListener("click", stopSharing);
elements.deviceName.addEventListener("change", () => {
    localStorage.setItem("enlace-device-name", escapeName(elements.deviceName.value));
});
elements.localClock.textContent = clockText();
window.setInterval(() => { elements.localClock.textContent = clockText(); }, 1000);

initializeFirebase();
