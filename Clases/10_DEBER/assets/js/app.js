const PROGRESS_KEY = "aula-sin-senal-progreso";
const NOTES_KEY = "aula-sin-senal-notas";
const THEME_KEY = "aula-sin-senal-tema";
const DATABASE_NAME = "aula-sin-senal";
const DATABASE_VERSION = 1;
const NOTES_STORE = "notas";
const answers = { q1: "b", q2: "a", q3: "c" };

const connectionStatus = document.getElementById("connectionStatus");
const connectionText = document.getElementById("connectionText");
const quizForm = document.getElementById("quizForm");
const quizFeedback = document.getElementById("quizFeedback");
const noteForm = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
const noteFeedback = document.getElementById("noteFeedback");
const characterCount = document.getElementById("characterCount");
const notesList = document.getElementById("notesList");
const notesCount = document.getElementById("notesCount");
const storageStatus = document.getElementById("storageStatus");
const themeToggle = document.getElementById("themeToggle");
const themeToggleText = document.getElementById("themeToggleText");
const themeStatus = document.getElementById("themeStatus");

let database;
let notesBackend = "indexeddb";
let memoryNotes = [];

function applyTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", `Activar modo ${isDark ? "claro" : "oscuro"}`);
    themeToggleText.textContent = `Modo ${isDark ? "claro" : "oscuro"}`;
    document.querySelector('meta[name="theme-color"]').content = isDark ? "#142321" : "#102a2a";
}

function loadSavedTheme() {
    try {
        applyTheme(localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light");
    } catch (error) {
        applyTheme("light");
        themeStatus.textContent = "No se pudo leer tu preferencia de tema; se usará el modo claro.";
        console.error("No se pudo leer el tema guardado.", error);
    }
}

function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);

    try {
        localStorage.setItem(THEME_KEY, nextTheme);
        themeStatus.textContent = `Modo ${nextTheme === "dark" ? "oscuro" : "claro"} activado y guardado.`;
    } catch (error) {
        themeStatus.textContent = `Modo ${nextTheme === "dark" ? "oscuro" : "claro"} activado, pero no se pudo guardar la preferencia.`;
        console.error("No se pudo guardar la preferencia de tema.", error);
    }
}

function handleThemeToggleClick(event) {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest("#themeToggle")) return;

    toggleTheme();
}

function updateConnectionStatus() {
    const online = navigator.onLine;
    connectionStatus.classList.toggle("is-offline", !online);
    connectionText.textContent = online ? "Con conexión" : "Sin conexión";
}

function loadSavedProgress() {
    try {
        const savedProgress = localStorage.getItem(PROGRESS_KEY);
        if (!savedProgress) return;

        const { score, total } = JSON.parse(savedProgress);
        quizFeedback.textContent = `Tu último resultado fue ${score} de ${total}. ¡Puedes intentarlo de nuevo!`;
    } catch (error) {
        quizFeedback.textContent = "No se pudo recuperar el resultado anterior.";
        console.error("No se pudo leer el avance guardado.", error);
    }
}

function openDatabase() {
    return new Promise((resolve, reject) => {
        if (!("indexedDB" in window)) {
            reject(new Error("IndexedDB no está disponible en este navegador."));
            return;
        }

        const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(NOTES_STORE)) {
                db.createObjectStore(NOTES_STORE, { keyPath: "id", autoIncrement: true });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("No se pudo abrir IndexedDB."));
    });
}

function runTransaction(storeName, mode, operation) {
    return new Promise((resolve, reject) => {
        let transaction;
        try {
            transaction = database.transaction(storeName, mode);
            const request = operation(transaction.objectStore(storeName));
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error ?? new Error("Falló una operación de almacenamiento."));
            transaction.onabort = () => reject(transaction.error ?? new Error("Se canceló la operación de almacenamiento."));
        } catch (error) {
            reject(error);
        }
    });
}

function readFallbackNotes() {
    try {
        const storedNotes = localStorage.getItem(NOTES_KEY);
        return storedNotes ? JSON.parse(storedNotes) : [];
    } catch (error) {
        throw new Error(`No se pudieron leer las notas guardadas: ${error.message}`);
    }
}

function writeFallbackNotes(notes) {
    try {
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
        memoryNotes = notes;
        notesBackend = "memory";
        storageStatus.textContent = "El almacenamiento está bloqueado; las notas solo se conservarán mientras esta página permanezca abierta.";
        console.error("No se pudieron guardar las notas en localStorage.", error);
    }
}

async function getNotes() {
    if (notesBackend === "indexeddb") {
        const notes = await runTransaction(NOTES_STORE, "readonly", store => store.getAll());
        return notes.sort((first, second) => second.createdAt - first.createdAt);
    }
    if (notesBackend === "localstorage") return readFallbackNotes();
    return memoryNotes;
}

async function saveNote(text) {
    const note = { text, createdAt: Date.now() };
    if (notesBackend === "indexeddb") {
        await runTransaction(NOTES_STORE, "readwrite", store => store.add(note));
        return;
    }
    if (notesBackend === "localstorage") {
        const notes = readFallbackNotes();
        notes.unshift({ ...note, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` });
        writeFallbackNotes(notes);
        return;
    }
    memoryNotes.unshift({ ...note, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` });
}

async function deleteNote(id) {
    if (notesBackend === "indexeddb") {
        await runTransaction(NOTES_STORE, "readwrite", store => store.delete(id));
        return;
    }
    if (notesBackend === "localstorage") {
        writeFallbackNotes(readFallbackNotes().filter(note => note.id !== id));
        return;
    }
    memoryNotes = memoryNotes.filter(note => note.id !== id);
}

function renderNotes(notes) {
    notesList.replaceChildren();
    notesCount.textContent = String(notes.length);
    notesCount.setAttribute("aria-label", `${notes.length} ${notes.length === 1 ? "nota guardada" : "notas guardadas"}`);

    if (notes.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.className = "empty-note";
        emptyMessage.textContent = "Tus ideas aparecerán aquí.";
        notesList.append(emptyMessage);
        return;
    }

    for (const note of notes) {
        const item = document.createElement("li");
        const text = document.createElement("p");
        const deleteButton = document.createElement("button");

        text.className = "note-text";
        text.textContent = note.text;
        deleteButton.className = "delete-note";
        deleteButton.type = "button";
        deleteButton.textContent = "Eliminar";
        deleteButton.setAttribute("aria-label", `Eliminar nota: ${note.text}`);
        deleteButton.addEventListener("click", async () => {
            deleteButton.disabled = true;
            try {
                await deleteNote(note.id);
                await refreshNotes();
                noteFeedback.textContent = "Nota eliminada.";
            } catch (error) {
                deleteButton.disabled = false;
                noteFeedback.textContent = "No se pudo eliminar la nota.";
                console.error("No se pudo eliminar la nota.", error);
            }
        });

        item.append(text, deleteButton);
        notesList.append(item);
    }
}

async function refreshNotes() {
    renderNotes(await getNotes());
}

async function initializeNotes() {
    try {
        database = await openDatabase();
        database.onversionchange = () => database.close();
        storageStatus.textContent = "Guardado local activo: notas en IndexedDB.";
    } catch (error) {
        notesBackend = "localstorage";
        console.warn("IndexedDB no está disponible; se usará almacenamiento alternativo.", error);
        try {
            memoryNotes = readFallbackNotes();
            storageStatus.textContent = "IndexedDB no está disponible; las notas se guardan en localStorage.";
        } catch (fallbackError) {
            notesBackend = "memory";
            memoryNotes = [];
            storageStatus.textContent = "El almacenamiento del navegador no está disponible; las notas durarán hasta cerrar esta página.";
            console.error(fallbackError);
        }
    }

    try {
        await refreshNotes();
    } catch (error) {
        storageStatus.textContent = "No se pudieron cargar las notas. Vuelve a intentarlo o revisa el almacenamiento del navegador.";
        console.error("No se pudieron cargar las notas.", error);
    }
}

quizForm.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(quizForm);
    const score = Object.entries(answers).reduce(
        (total, [question, answer]) => total + Number(formData.get(question) === answer),
        0
    );
    const message = score === 3
        ? "¡Excelente! Respondiste correctamente las 3 preguntas."
        : `Obtuviste ${score} de 3. Revisa la guía e inténtalo otra vez.`;

    quizFeedback.textContent = message;
    try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify({ score, total: 3 }));
    } catch (error) {
        quizFeedback.textContent += " El navegador no permitió guardar tu avance.";
        console.error("No se pudo guardar el resultado.", error);
    }
});

noteInput.addEventListener("input", () => {
    characterCount.textContent = `${noteInput.value.length} / 240`;
});

noteForm.addEventListener("submit", async event => {
    event.preventDefault();
    const text = noteInput.value.trim();
    if (!text) {
        noteInput.setCustomValidity("Escribe una idea antes de guardarla.");
        noteInput.reportValidity();
        noteInput.setCustomValidity("");
        return;
    }

    const submitButton = noteForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    try {
        await saveNote(text);
        await refreshNotes();
        noteForm.reset();
        characterCount.textContent = "0 / 240";
        noteFeedback.textContent = "Nota guardada en este dispositivo.";
    } catch (error) {
        noteFeedback.textContent = "No se pudo guardar la nota. Revisa el espacio y permisos del navegador.";
        console.error("No se pudo guardar la nota.", error);
    } finally {
        submitButton.disabled = false;
    }
});

window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);
document.addEventListener("click", handleThemeToggleClick, true);
loadSavedTheme();
updateConnectionStatus();
loadSavedProgress();
initializeNotes();

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", async () => {
        try {
            await navigator.serviceWorker.register("./sw.js");
        } catch (error) {
            console.error("No se pudo registrar el service worker.", error);
        }
    });
}
