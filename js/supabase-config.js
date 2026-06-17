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

const DEFAULT_URL = _dec("aHR0cHM6Ly93a3Fnc3ByZ3p0cXhtb3ZvamV3dS5zdXBhYmFzZS5jbw==");
const DEFAULT_KEY = _dec("c2JfcHVibGlzaGFibGVfTXE2bUV4NXFTSXh2Nm12dF9ETmFFd19OVGVVSUZQdg==");

const supabaseUrl = localStorage.getItem('recim_db_url') || DEFAULT_URL;
const supabaseKey = localStorage.getItem('recim_db_key') || DEFAULT_KEY;

const APP_SECURITY_TOKEN = DEFAULT_KEY;
const DEFAULT_GEMINI_KEY = "AQ.Ab8RN6K4NjZIvssqDBnWYwOKyWHulGfFcpqPlEhaesrEn5mfxg";
const geminiApiKey = localStorage.getItem('recim_gemini_key') || DEFAULT_GEMINI_KEY;


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
