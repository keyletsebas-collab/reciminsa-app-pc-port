/* =============================================
   SUPABASE-CONFIG.JS – Client Initialization
   ============================================= */

function _dec(str) {
    try {
        return atob(str);
    } catch (e) {
        return "";
    }
}

const DEFAULT_URL = _dec("aHR0cHM6Ly9xY3VkeW1leHNzdmZkZXBwa2hqcy5zdXBhYmFzZS5jbw==");
const DEFAULT_KEY = _dec("c2JfcHVibGlzaGFibGVfeTFXai01UFNIT0lOLV9wSXZYNVhlZ182U2pwdmpwRg==");

const supabaseUrl = localStorage.getItem('recim_db_url') || DEFAULT_URL;
const supabaseKey = localStorage.getItem('recim_db_key') || DEFAULT_KEY;


let supabaseClient = null;
let isSupabaseActive = false;

try {
    if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
        supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
        isSupabaseActive = true;
        console.log("🚀 SupabaseClient inicializado correctamente.");
    } else {
        console.warn("⚠️ SDK de Supabase no cargado aún. Se esperará la carga de la biblioteca.");
        window.addEventListener('DOMContentLoaded', () => {
            if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
                supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
                isSupabaseActive = true;
                console.log("🚀 SupabaseClient inicializado en DOMContentLoaded.");
            }
        });
    }
} catch (err) {
    console.error("❌ Error CRÍTICO conectando a Supabase:", err);
}
