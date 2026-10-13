import { FIREBASE_CONFIG } from "./config.js";

const placeholder = "PEGA_AQUI_";

function isConfigured() {
    return Object.values(FIREBASE_CONFIG).every((value) => value && !value.startsWith(placeholder));
}

export async function connectToLocations(onLocations, onError) {
    if (!isConfigured()) {
        throw new Error("Completa la configuración de Firebase en assets/js/config.js.");
    }
    if (!window.firebase) {
        throw new Error("No se pudo cargar el SDK de Firebase. Comprueba tu conexión a Internet.");
    }

    const app = window.firebase.apps.length
        ? window.firebase.app()
        : window.firebase.initializeApp(FIREBASE_CONFIG);
    const auth = window.firebase.auth(app);
    const database = window.firebase.database(app);
    const credentials = await auth.signInAnonymously();
    const uid = credentials.user.uid;
    const ownLocationRef = database.ref(`locations/${uid}`);

    await ownLocationRef.onDisconnect().remove();
    database.ref("locations").on("value", (snapshot) => {
        onLocations(snapshot.val() || {});
    }, onError);

    return {
        uid,
        publish(location) {
            return ownLocationRef.set({
                ...location,
                updatedAt: window.firebase.database.ServerValue.TIMESTAMP
            });
        },
        stop() {
            return ownLocationRef.remove();
        }
    };
}