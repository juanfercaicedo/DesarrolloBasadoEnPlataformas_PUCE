import { MAPS_API_KEY } from "./config.js";
import { connectToAdmin } from "./firebase.js";

const elements = {
    connectionStatus: document.querySelector("#connectionStatus"),
    connectionText: document.querySelector("#connectionText"),
    localClock: document.querySelector("#localClock"),
    peopleCount: document.querySelector("#peopleCount"),
    deviceCount: document.querySelector("#deviceCount"),
    loginForm: document.querySelector("#loginForm"),
    adminEmail: document.querySelector("#adminEmail"),
    adminPassword: document.querySelector("#adminPassword"),
    loginStatus: document.querySelector("#loginStatus"),
    signIn: document.querySelector("#signIn"),
    signOut: document.querySelector("#signOut"),
    adminLogin: document.querySelector("#adminLogin"),
    adminDashboard: document.querySelector("#adminDashboard"),
    peopleList: document.querySelector("#peopleList"),
    mapStatus: document.querySelector("#mapStatus"),
    mapCanvas: document.querySelector("#mapCanvas"),
    mapPlaceholder: document.querySelector("#mapPlaceholder"),
    mapUpdated: document.querySelector("#mapUpdated")
};

const markerByUid = new Map();
const trailByUid = new Map();
const locationByUid = new Map();
let adminSession;
let map;
let mapInitialization;
let latestLocations = {};
let mapHasInitialView = false;

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

function locationColor(uid) {
    const palette = ["#e75b43", "#16856c", "#2874a6", "#bc7b20", "#a14470", "#526d28"];
    let hash = 0;
    for (const character of uid) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
    return palette[hash % palette.length];
}

function isSharingLocation(location) {
    return !!location && location.active !== false &&
        Number.isFinite(location.latitude) && Number.isFinite(location.longitude);
}

function removeMapEntry(uid) {
    markerByUid.get(uid)?.setMap(null);
    trailByUid.get(uid)?.setMap(null);
    markerByUid.delete(uid);
    trailByUid.delete(uid);
    locationByUid.delete(uid);
}

function updateMap(locations) {
    const shareableLocations = Object.fromEntries(
        Object.entries(locations).filter(([, location]) => isSharingLocation(location))
    );
    const visibleUids = new Set(Object.keys(shareableLocations));
    for (const uid of markerByUid.keys()) {
        if (!visibleUids.has(uid)) removeMapEntry(uid);
    }

    for (const [uid, location] of Object.entries(shareableLocations)) {
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
    const entries = Object.entries(locations)
        .filter(([, location]) => isSharingLocation(location))
        .sort(([, first], [, second]) => (second.updatedAt || 0) - (first.updatedAt || 0));
    elements.peopleList.replaceChildren();
    elements.peopleCount.textContent = String(entries.length).padStart(2, "0");
    elements.deviceCount.textContent = String(entries.length).padStart(2, "0");

    if (!entries.length) {
        const empty = document.createElement("li");
        empty.className = "empty-state";
        empty.textContent = "No hay personas compartiendo ubicación en este momento.";
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
            if (current && map) {
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
        window.initEnlaceAdminMap = resolve;
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(MAPS_API_KEY)}&callback=initEnlaceAdminMap&loading=async&v=weekly`;
        script.async = true;
        script.onerror = () => reject(new Error("No se pudo cargar Google Maps. Revisa la clave y la conexión."));
        document.head.append(script);
    });
}

function initializeMap() {
    if (!mapInitialization) mapInitialization = initializeMapContents();
    return mapInitialization;
}

async function initializeMapContents() {
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
        renderPeople(latestLocations);
    } catch (error) {
        elements.mapStatus.textContent = error.message;
        elements.mapPlaceholder.querySelector("p").textContent = "No se pudo cargar el mapa";
        elements.mapPlaceholder.querySelector("span:last-child").textContent = error.message;
    }
}

function showReadError(error) {
    showConnection("Sin permiso para leer datos", false, true);
    elements.loginStatus.textContent = `No se pudieron leer las ubicaciones: ${error.message}`;
    elements.mapStatus.textContent = "Firebase no permite leer las ubicaciones con esta cuenta.";
}

async function signIn(event) {
    event.preventDefault();
    elements.signIn.disabled = true;
    elements.loginStatus.textContent = "Verificando acceso…";
    showConnection("Autenticando");

    try {
        adminSession = await connectToAdmin(
            elements.adminEmail.value.trim(),
            elements.adminPassword.value,
            (locations) => {
                latestLocations = locations;
                renderPeople(locations);
                if (map) updateMap(locations);
                showConnection("Panel conectado", true);
            },
            showReadError
        );
        elements.adminLogin.hidden = true;
        elements.adminDashboard.hidden = false;
        elements.signOut.hidden = false;
        elements.loginStatus.textContent = "";
        elements.adminPassword.value = "";
        initializeMap();
    } catch (error) {
        showConnection("Acceso denegado", false, true);
        elements.loginStatus.textContent = `No se pudo iniciar sesión: ${error.message}`;
    } finally {
        elements.signIn.disabled = false;
    }
}

async function signOut() {
    elements.signOut.disabled = true;
    try {
        if (adminSession) await adminSession.stop();
        adminSession = undefined;
        latestLocations = {};
        for (const uid of markerByUid.keys()) removeMapEntry(uid);
        mapHasInitialView = false;
        elements.peopleList.replaceChildren();
        elements.adminDashboard.hidden = true;
        elements.adminLogin.hidden = false;
        elements.signOut.hidden = true;
        elements.loginStatus.textContent = "Sesión cerrada.";
        showConnection("Acceso requerido");
    } catch (error) {
        elements.loginStatus.textContent = `No se pudo cerrar la sesión: ${error.message}`;
        showConnection("Error al cerrar sesión", false, true);
    } finally {
        elements.signOut.disabled = false;
    }
}

elements.loginForm.addEventListener("submit", signIn);
elements.signOut.addEventListener("click", signOut);
elements.localClock.textContent = clockText();
window.setInterval(() => { elements.localClock.textContent = clockText(); }, 1000);
