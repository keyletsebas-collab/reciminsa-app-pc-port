/* =============================================
   FIREBASE-CONFIG.JS – Manual Initialization
   ============================================= */

// TODO: Reemplaza este objeto con tus propias credenciales de Firebase Console
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    databaseURL: "TU_DATABASE_URL",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

let db = null;
let isFirebaseActive = false;

try {
    // Inicialización manual para compatibilidad con Vercel/Local
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.database();
    isFirebaseActive = true;
    console.log("🚀 Firebase conectado manualmente");
} catch (err) {
    console.warn("ℹ️ Running in Local Mode. Please provide Firebase API keys in js/firebase-config.js");
}
