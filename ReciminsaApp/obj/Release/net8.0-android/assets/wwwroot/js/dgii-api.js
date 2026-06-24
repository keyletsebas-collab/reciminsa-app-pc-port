/* =============================================
   DGII-API.JS – Conexión con la API de la DGII
   Permite consultar RNC o Cédula para autocompletar.
   ============================================= */

// Token proporcionado por el usuario
const DGII_API_TOKEN = 'dgii_41346f9633e04c1287001ec8aa0fde4b';

// URL base de la API
const DGII_API_BASE_URL = 'https://api-dgii.dominicantechnology.com/api/v1';

/**
 * Consulta un RNC, Cédula o busca por Razón Social en la API de la DGII.
 * @param {string} query - RNC (9), Cédula (11) o Razón Social (texto)
 * @returns {Promise<Object|null>} - Retorna los datos o null si falla.
 */
async function fetchDGIIData(query) {
    const trimmed = query.trim();
    if (!trimmed) {
        showToast('⚠️ Ingresa un término de búsqueda', 'warning');
        return null;
    }

    const cleanId = trimmed.replace(/\D/g, ''); // Solo números

    // Determinar si es una consulta directa (RNC o Cédula) o una búsqueda por nombre
    const isDirect = cleanId.length === 9 || cleanId.length === 11;
    
    let url = '';
    if (isDirect) {
        // GET /api/v1/rnc/{rnc}: consulta directa por RNC o cedula sin guiones.
        url = `${DGII_API_BASE_URL}/rnc/${cleanId}`;
    } else {
        // GET /api/v1/buscar?q=texto: busqueda por razon social (minimo 3 caracteres).
        if (trimmed.length < 3) {
            showToast('⚠️ La búsqueda por nombre requiere al menos 3 caracteres', 'warning');
            return null;
        }
        
        // GET /api/v1/buscardgi?q=texto: busqueda por razon social (minimo 4 caracteres).
        if (trimmed.length >= 4) {
            url = `${DGII_API_BASE_URL}/buscardgi?q=${encodeURIComponent(trimmed)}`;
        } else {
            url = `${DGII_API_BASE_URL}/buscar?q=${encodeURIComponent(trimmed)}`;
        }
    }

    try {
        showToast('Buscando en DGII...', 'info');

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${DGII_API_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const jsonRes = await response.json();
        
        if (!jsonRes.exito) {
            showToast('⚠️ No se encontraron datos para este RNC/Cédula.', 'warning');
            return null;
        }

        let data = jsonRes.data;

        // Si es una búsqueda por nombre (retorna un array de resultados)
        if (Array.isArray(data)) {
            if (data.length === 0) {
                showToast('⚠️ No se encontraron resultados.', 'warning');
                return null;
            }
            // Tomamos el primer resultado
            data = data[0];
        }

        if (!data) {
            showToast('⚠️ No se encontraron datos.', 'warning');
            return null;
        }

        const rnc = data.rnc || cleanId || '';
        const name = data.razon_social || data.nombre || '';
        const activity = data.actividad_economica || '';
        const isRST = data.regimen_pago === 'RST' || data.regimen_pago === 'RST (Regimen Simplificado de Tributacion)' || false;
        const status = data.estado || 'ACTIVO';

        if (status.toUpperCase() !== 'ACTIVO' && status.toUpperCase() !== 'NORMAL') {
            showToast(`⚠️ El contribuyente está: ${status}`, 'warning');
        } else {
            showToast('✅ Datos recuperados de DGII', 'success');
        }

        return {
            rnc: rnc,
            name: name,
            address: '', // Esta API no devuelve dirección
            activity: activity,
            isRST: isRST,
            status: status
        };

    } catch (error) {
        console.error('Error consultando API DGII:', error);
        showToast('❌ Error de conexión con la API DGII. Intente manual.', 'error');
        return null;
    }
}

