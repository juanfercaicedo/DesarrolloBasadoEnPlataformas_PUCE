import { FIREBASE_CONFIG } from "./config.js";

const placeholder = "PEGA_AQUI_";

function firebaseApp(name) {
    if (!Object.values(FIREBASE_CONFIG).every((value) => value && !value.startsWith(placeholder))) {
        throw new Error("Completa la configuración de Firebase en assets/js/config.js.");
    }
    if (!window.firebase) {
        throw new Error("No se pudo cargar el SDK de Firebase. Comprueba tu conexión a Internet.");
    }

    const existingApp = window.firebase.apps.find((app) => app.name === name);
    return existingApp || window.firebase.initializeApp(FIREBASE_CONFIG, name);
}

export async function connectToLocations() {
    const app = firebaseApp("enlace-sharing");
    const auth = window.firebase.auth(app);
    const database = window.firebase.database(app);
    const credentials = await auth.signInAnonymously();
    const uid = credentials.user.uid;
    const ownLocationRef = database.ref(`locations/${uid}`);

    await ownLocationRef.onDisconnect().remove();

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

export async function connectToAdmin(email, password, onLocations, onError) {
    const app = firebaseApp("enlace-admin");
    const auth = window.firebase.auth(app);
    const database = window.firebase.database(app);
    await auth.setPersistence(window.firebase.auth.Auth.Persistence.SESSION);
    const credentials = await auth.signInWithEmailAndPassword(email, password);
    const locationsRef = database.ref("locations");
    const onValue = (snapshot) => onLocations(snapshot.val() || {});
    locationsRef.on("value", onValue, onError);

    return {
        email: credentials.user.email,
        stop() {
            locationsRef.off("value", onValue);
            return auth.signOut();
        }
    };
}
