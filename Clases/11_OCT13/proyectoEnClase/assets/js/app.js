import { MAPS_API_KEY } from "./config.js";
import { connectToLocations } from "./firebase.js";

const elements = {
    connectionStatus: document.querySelector("#connectionStatus"),
    connectionText: document.querySelector("#connectionText"),
    localClock: document.querySelector("#localClock"),
    peopleCount: document.querySelector("#peopleCount"),
    deviceCount: document.querySelector("#deviceCount"),
    deviceName: document.querySelector("#deviceName"),
    startSharing: document.querySelector("#startSharing"),
    stopSharing: document.querySelector("#stopSharing"),
    shareStatus: document.querySelector("#shareStatus"),
    latitudeValue: document.querySelector("#latitudeValue"),
    longitudeValue: document.querySelector("#longitudeValue"),
    accuracyValue: document.querySelector("#accuracyValue"),
    updatedValue: document.querySelector("#updatedValue"),
    peopleList: document.querySelector("#peopleList"),
    mapStatus: document.querySelector("#mapStatus"),
    mapCanvas: document.querySelector("#mapCanvas"),
    mapPlaceholder: document.querySelector("#mapPlaceholder"),
    mapUpdated: document.querySelector("#mapUpdated")
};

const markerByUid = new Map();
const trailByUid = new Map();
const locationByUid = new Map();
let firebaseSession;
let map;
let watchId;
let publishTimer;
let latestPosition;
let latestLocations = {};
let publishInProgress = false;
let mapHasInitialView = false;

function showConnection(message, isConnected = false, isError = false) {
    elements.connectionText.textContent = message;
    elements.connectionStatus.classList.toggle("is-connected", isConnected);
    elements.connectionStatus.classList.toggle("is-error", isError);
}

function firebaseErrorText(error) {
    const code = String(error?.code || "").toLowerCase();
    if (code.includes("api-key-not-valid")) {
        return "Firebase rechazó la apiKey. Copia la clave web desde la configuración de la app en el mismo proyecto Firebase; revisa también las restricciones de clave en Google Cloud.";
    }
    if (code.includes("operation-not-allowed")) {
        return "Firebase Authentication no tiene habilitado el proveedor Anónimo.";
    }
    if (code.includes("unauthorized-domain")) {
        return "Este dominio no está autorizado en Firebase Authentication. Añádelo en Configuración > Dominios autorizados.";
    }
    return `Firebase: ${error?.message || "No se pudo conectar."}`;
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

function locationColor(uid) {
    const palette = ["#e75b43", "#16856c", "#2874a6", "#bc7b20", "#a14470", "#526d28"];
    let hash = 0;
    for (const character of uid) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
    return palette[hash % palette.length];
}

function setName(name) {
    localStorage.setItem("enlace-device-name", name);
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
    setName(name);
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
        if (firebaseSession) firebaseSession.stop().catch(() => {});
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

function removeMapEntry(uid) {
    markerByUid.get(uid)?.setMap(null);
    trailByUid.get(uid)?.setMap(null);
    markerByUid.delete(uid);
    trailByUid.delete(uid);
    locationByUid.delete(uid);
}

function updateMap(locations) {
    const visibleUids = new Set(Object.keys(locations));
    for (const uid of markerByUid.keys()) {
        if (!visibleUids.has(uid)) removeMapEntry(uid);
    }

    for (const [uid, location] of Object.entries(locations)) {
        if (!Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) continue;
        const point = { lat: location.latitude, lng: location.longitude };
        const color = locationColor(uid);
        let marker = markerByUid.get(uid);
        if (!marker) {
            marker = new google.maps.Marker({
                map,
                position: point,
                title: escapeName(location.name),
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: color,
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 3,
                    scale: 9
                }
            });
            markerByUid.set(uid, marker);
            trailByUid.set(uid, new google.maps.Polyline({
                map,
                path: [point],
                strokeColor: color,
                strokeOpacity: 0.72,
                strokeWeight: 3
            }));
        } else {
            marker.setPosition(point);
            marker.setTitle(escapeName(location.name));
            const trail = trailByUid.get(uid);
            const path = trail.getPath();
            const previous = path.getAt(path.getLength() - 1);
            if (previous.lat() !== point.lat || previous.lng() !== point.lng) {
                path.push(point);
                if (path.getLength() > 100) path.removeAt(0);
            }
        }
        locationByUid.set(uid, { ...location, point });
    }

    if (!mapHasInitialView && locationByUid.size) {
        const bounds = new google.maps.LatLngBounds();
        for (const location of locationByUid.values()) bounds.extend(location.point);
        map.fitBounds(bounds);
        mapHasInitialView = true;
    }
    elements.mapUpdated.textContent = locationByUid.size
        ? `ÚLTIMO DATO ${clockText()}`
        : "SIN UBICACIONES RECIBIDAS";
}

function renderPeople(locations) {
    const entries = Object.entries(locations).sort(([, first], [, second]) =>
        (second.updatedAt || 0) - (first.updatedAt || 0)
    );
    elements.peopleList.replaceChildren();
    elements.peopleCount.textContent = String(entries.length).padStart(2, "0");
    elements.deviceCount.textContent = String(entries.length).padStart(2, "0");

    if (!entries.length) {
        const empty = document.createElement("li");
        empty.className = "empty-state";
        empty.textContent = "Esperando dispositivos que compartan ubicación.";
        elements.peopleList.append(empty);
        return;
    }

    for (const [uid, location] of entries) {
        const item = document.createElement("li");
        const button = document.createElement("button");
        button.className = "person-button";
        button.type = "button";
        button.disabled = !locationByUid.has(uid);
        button.addEventListener("click", () => {
            const current = locationByUid.get(uid);
            if (current) {
                map.panTo(current.point);
                map.setZoom(Math.max(map.getZoom() || 14, 15));
            }
        });

        const avatar = document.createElement("span");
        avatar.className = "person-avatar";
        avatar.style.setProperty("--person-color", locationColor(uid));
        avatar.textContent = escapeName(location.name).slice(0, 1).toUpperCase();

        const details = document.createElement("span");
        details.className = "person-details";
        const name = document.createElement("strong");
        name.textContent = escapeName(location.name);
        const coordinates = document.createElement("span");
        coordinates.textContent = `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
        details.append(name, coordinates);

        const status = document.createElement("span");
        status.className = "person-status";
        status.setAttribute("aria-label", "Compartiendo ubicación");
        button.append(avatar, details, status);
        item.append(button);
        elements.peopleList.append(item);
    }
}

function loadGoogleMaps() {
    return new Promise((resolve, reject) => {
        window.initEnlaceMap = resolve;
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(MAPS_API_KEY)}&callback=initEnlaceMap&loading=async&v=weekly`;
        script.async = true;
        script.onerror = () => reject(new Error("No se pudo cargar Google Maps. Revisa la clave y la conexión."));
        document.head.append(script);
    });
}

async function initializeMap() {
    if (!MAPS_API_KEY || MAPS_API_KEY.startsWith("PEGA_AQUI_")) {
        elements.mapStatus.textContent = "Falta configurar la clave de Google Maps";
        return;
    }
    try {
        await loadGoogleMaps();
        map = new google.maps.Map(elements.mapCanvas, {
            center: { lat: -0.1807, lng: -78.4678 },
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            clickableIcons: false
        });
        elements.mapPlaceholder.hidden = true;
        elements.mapStatus.textContent = "Esperando ubicaciones";
        updateMap(latestLocations);
    } catch (error) {
        elements.mapStatus.textContent = error.message;
        elements.mapPlaceholder.querySelector("p").textContent = "No se pudo cargar el mapa";
        elements.mapPlaceholder.querySelector("span:last-child").textContent = error.message;
    }
}

async function initializeFirebase() {
    try {
        firebaseSession = await connectToLocations((locations) => {
            latestLocations = locations;
            renderPeople(locations);
            if (map) updateMap(locations);
            showConnection("Firebase conectado", true);
            elements.startSharing.disabled = false;
        }, (error) => {
            showConnection("Error de Firebase", false, true);
            elements.shareStatus.textContent = firebaseErrorText(error);
        });
        elements.deviceName.value = localStorage.getItem("enlace-device-name") || "";
        showConnection("Firebase conectado", true);
        elements.startSharing.disabled = false;
    } catch (error) {
        showConnection("Sin conexión a Firebase", false, true);
        elements.shareStatus.textContent = firebaseErrorText(error);
        elements.deviceName.value = localStorage.getItem("enlace-device-name") || "";
    }
}

elements.startSharing.addEventListener("click", startSharing);
elements.stopSharing.addEventListener("click", stopSharing);
elements.deviceName.addEventListener("change", () => setName(escapeName(elements.deviceName.value)));
elements.localClock.textContent = clockText();
window.setInterval(() => { elements.localClock.textContent = clockText(); }, 1000);

initializeMap();
initializeFirebase();