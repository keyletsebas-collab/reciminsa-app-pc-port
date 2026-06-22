/* =============================================
   EXCEL-UTILS.JS – Exportación a XLSX (SheetJS / xlsx-js-style)
   Modelo: Registro de Residuos, Finanzas y Materiales
   ============================================= */

/**
 * Aplica estilos premium, alineación, formato de moneda y auto-ajuste de columnas a una hoja de cálculo.
 * @param {Worksheet} ws - La hoja de cálculo de SheetJS a formatear.
 * @returns {Worksheet} La hoja formateada.
 */
function formatAndStyleWorksheet(ws) {
    if (!ws || !ws['!ref']) return ws;

    const range = XLSX.utils.decode_range(ws['!ref']);
    const cur = (typeof getCurrency === 'function') ? getCurrency() : { symbol: 'RD$', code: 'DOP' };
    const curSymbol = cur.symbol.replace(/"/g, '""');
    const currencyFormat = `"${curSymbol}"#,##0.00`;
    
    // Obtener las cabeceras en minúsculas para identificar columnas
    const headers = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const headerCell = ws[XLSX.utils.encode_cell({ r: range.s.r, c: C })];
        headers.push(headerCell ? String(headerCell.v).toLowerCase().trim() : '');
    }

    // Inicializar el arreglo de anchos mínimos de columna
    const colWidths = Array(headers.length).fill(10);

    // Definición de estilos premium
    const headerStyle = {
        font: { name: 'Segoe UI', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '1B4A3E' } }, // Color verde bosque ecológico
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: {
            top: { style: 'medium', color: { rgb: '11382F' } },
            bottom: { style: 'medium', color: { rgb: '11382F' } },
            left: { style: 'thin', color: { rgb: '4D7C6F' } },
            right: { style: 'thin', color: { rgb: '4D7C6F' } }
        }
    };

    const borderStyle = {
        top: { style: 'thin', color: { rgb: 'E5E7EB' } },
        bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
        left: { style: 'thin', color: { rgb: 'E5E7EB' } },
        right: { style: 'thin', color: { rgb: 'E5E7EB' } }
    };

    // Recorrer todas las celdas
    for (let R = range.s.r; R <= range.e.r; ++R) {
        const isHeader = (R === range.s.r);
        // Zebra striping: alternar blanco y gris verdoso muy sutil
        const zebraFill = { fgColor: { rgb: (R % 2 === 0) ? 'FFFFFF' : 'F3F7F5' } };

        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
            let cell = ws[cellRef];
            
            // Si la celda está vacía pero es fila de datos, le damos borde y estilo zebra
            if (!cell) {
                if (!isHeader) {
                    ws[cellRef] = { t: 's', v: '', s: { fill: zebraFill, border: borderStyle } };
                }
                continue;
            }

            // Convertir texto numérico a número real para que funcionen los formatos y sumas en Excel
            if (cell.t === 's' && cell.v !== '' && !isNaN(cell.v) && isFinite(cell.v)) {
                cell.t = 'n';
                cell.v = Number(cell.v);
            }

            if (isHeader) {
                cell.s = headerStyle;
            } else {
                const headerText = headers[C] || '';
                
                // Alineación por defecto
                let align = 'left';
                if (cell.t === 'n') {
                    align = 'right';
                }
                
                // Identificadores, fechas, códigos, tipos y unidades van centrados
                if (headerText.includes('id') || 
                    headerText.includes('fecha') || 
                    headerText.includes('código') || 
                    headerText.includes('codigo') || 
                    headerText.includes('tipo') || 
                    headerText.includes('unidad') ||
                    headerText.includes('hora')) {
                    align = 'center';
                }

                // Detectar si la columna o la clave de resumen requiere formato de moneda
                let isCurrency = false;
                if (headerText.includes('monto') || 
                    headerText.includes('precio') || 
                    headerText.includes('subtotal') || 
                    headerText.includes('total') || 
                    headerText.includes('ganancia') || 
                    headerText.includes('costo') || 
                    headerText.includes('balance') || 
                    headerText.includes('inversión') ||
                    headerText.includes('inversion')) {
                    isCurrency = true;
                }

                // Regla especial para tablas de clave-valor (ej: Resúmenes en Columna B, con etiqueta en Columna A)
                if (C === 1) { 
                    const labelCell = ws[XLSX.utils.encode_cell({ r: R, c: 0 })];
                    if (labelCell && typeof labelCell.v === 'string') {
                        const labelLower = labelCell.v.toLowerCase();
                        if (labelLower.includes('total') || 
                            labelLower.includes('ganancia') || 
                            labelLower.includes('costo') || 
                            labelLower.includes('monto') || 
                            labelLower.includes('precio') || 
                            labelLower.includes('inversión') || 
                            labelLower.includes('inversion') || 
                            labelLower.includes('balance')) {
                            isCurrency = true;
                        }
                    }
                }

                if (isCurrency && cell.t === 'n') {
                    cell.z = currencyFormat;
                }

                // Aplicar estilo de celda
                cell.s = {
                    font: { name: 'Segoe UI', sz: 10, color: { rgb: '374151' } },
                    fill: zebraFill,
                    alignment: { horizontal: align, vertical: 'center' },
                    border: borderStyle
                };
            }

            // Calcular el ancho óptimo de la columna
            let valStr = '';
            if (cell.f) {
                // Si es fórmula, proveer ancho estimado de número formateado
                valStr = '   $999,999.00   '; 
            } else if (cell.v !== null && cell.v !== undefined) {
                valStr = String(cell.v);
                // Si tiene formato de moneda, agregar espacio para el símbolo y decimales
                const headerText = headers[C] || '';
                if (cell.t === 'n' && (headerText.includes('monto') || headerText.includes('precio') || headerText.includes('subtotal') || headerText.includes('total') || headerText.includes('ganancia') || headerText.includes('costo') || headerText.includes('balance'))) {
                    valStr = cur.symbol + valStr + '.00';
                }
            }
            colWidths[C] = Math.max(colWidths[C], valStr.length + 3);
        }
    }

    // Aplicar anchos de columna (tope en 40 caracteres para evitar columnas gigantestas)
    ws['!cols'] = colWidths.map(w => ({ wch: Math.min(w, 40) }));

    // Aplicar alturas de filas espaciosas
    const rowHeights = [];
    for (let R = range.s.r; R <= range.e.r; ++R) {
        rowHeights.push({ hpt: (R === range.s.r) ? 26 : 20 });
    }
    ws['!rows'] = rowHeights;

    // Congelar la fila de cabecera
    ws['!freeze'] = { xSplit: 0, ySplit: range.s.r + 1 };

    return ws;
}

/**
 * Exporta un registro de factura/residuos a un archivo .xlsx
 * con 3 hojas: Registros_Diarios, Resumen_Diario, Catalogo_Codigos
 * @param {Object} invoice  - objeto de factura guardado en invoices.js
 */
function exportarExcelResiduos(invoice) {
    if (!invoice) return;
    if (typeof XLSX === 'undefined') {
        showToast('❌ Librería Excel no disponible', 'error');
        return;
    }

    try {
        showToast('📊 Generando Excel...', 'info');

        const wb = XLSX.utils.book_new();

        /* ─────────────────────────────────────────
           HOJA 1: Registros_Diarios
        ───────────────────────────────────────── */
        const encabezados = [
            'Fecha', 'Hora', 'Código', 'Nombre del residuo',
            'Proveedor / Procedencia', 'Cantidad', 'Unidad de medida',
            'Precio de compra', 'Precio de venta',
            'Total compra', 'Total venta', 'Ganancia',
            'Usuario', 'Observaciones'
        ];

        // Obtener datos del usuario actual
        const currentUser = firebase && firebase.auth && firebase.auth().currentUser;
        const usuarioNombre = currentUser
            ? (currentUser.displayName || currentUser.email || 'Usuario')
            : 'Usuario';

        // Convertir fecha ISO → DD/MM/YYYY
        function fmtFecha(dateStr) {
            if (!dateStr) return '';
            const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        }

        // Hora actual del registro
        const horaActual = (() => {
            const d = new Date(invoice.createdAt || Date.now());
            const hh = String(d.getHours()).padStart(2, '0');
            const min = String(d.getMinutes()).padStart(2, '0');
            return `${hh}:${min}`;
        })();

        // Construir filas de datos (una fila por material)
        const items = invoice.items || [];
        const dataRows = items.map((item, idx) => {
            // Fila en Excel empieza en 2 (1 = encabezados)
            const rowNum = idx + 2;
            const codigo = item.matId || item.code || '';

            // Usamos fórmulas para Total compra, Total venta y Ganancia
            return [
                fmtFecha(invoice.date),                           // A – Fecha
                horaActual,                                        // B – Hora
                codigo,                                            // C – Código
                item.name || item.desc || '',                      // D – Nombre del residuo
                invoice.client || invoice.company || '—',          // E – Proveedor / Procedencia
                item.qty || 0,                                     // F – Cantidad
                item.unit || 'kg',                                 // G – Unidad de medida
                item.priceBuy || item.uprice || 0,                 // H – Precio de compra
                item.priceSell || 0,                               // I – Precio de venta
                { f: `F${rowNum}*H${rowNum}` },                   // J – Total compra (fórmula)
                { f: `F${rowNum}*I${rowNum}` },                   // K – Total venta (fórmula)
                { f: `K${rowNum}-J${rowNum}` },                   // L – Ganancia (fórmula)
                usuarioNombre,                                     // M – Usuario
                invoice.notes || ''                                // N – Observaciones
            ];
        });

        const ws1Data = [encabezados, ...dataRows];
        const ws1 = XLSX.utils.aoa_to_sheet(ws1Data);
        
        // Aplicar formato premium a la hoja 1
        formatAndStyleWorksheet(ws1);

        XLSX.utils.book_append_sheet(wb, ws1, 'Registros_Diarios');

        /* ─────────────────────────────────────────
           HOJA 2: Resumen_Diario
        ───────────────────────────────────────── */
        const totalKg = items.reduce((s, i) => s + (parseFloat(i.qty) || 0), 0);
        const totalCompra = items.reduce((s, i) => s + ((i.qty || 0) * (i.priceBuy || i.uprice || 0)), 0);
        const totalVenta = items.reduce((s, i) => s + ((i.qty || 0) * (i.priceSell || 0)), 0);
        const gananciaTotal = totalVenta - totalCompra;

        // Residuo principal (el de mayor cantidad)
        const principal = items.reduce((max, i) => {
            return (parseFloat(i.qty) || 0) > (parseFloat(max.qty) || 0) ? i : max;
        }, items[0] || {});

        const cur = (typeof getCurrency === 'function') ? getCurrency() : { symbol: 'RD$', code: 'DOP' };

        const ws2Data = [
            ['Campo', 'Valor'],
            ['Fecha', fmtFecha(invoice.date)],
            ['ID Factura', invoice.id],
            ['Proveedor', invoice.client || invoice.company || '—'],
            ['Total cantidad recibida', totalKg],
            [`Total comprado ${cur.code}`, totalCompra],
            [`Total vendido ${cur.code}`, totalVenta],
            [`Ganancia total ${cur.code}`, gananciaTotal],
            ['Residuo principal', principal.name || '—'],
            ['Usuario', usuarioNombre],
        ];

        const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
        
        // Aplicar formato premium a la hoja 2
        formatAndStyleWorksheet(ws2);

        XLSX.utils.book_append_sheet(wb, ws2, 'Resumen_Diario');

        /* ─────────────────────────────────────────
           HOJA 3: Catalogo_Codigos
        ───────────────────────────────────────── */
        const catalogoHeader = ['Código', 'Residuo', 'Unidad'];
        const mats = (typeof getMaterialCodes === 'function') ? getMaterialCodes() : [];
        const catalogoRows = mats.map(m => [m.id || m.code || '', m.name || '', m.unit || 'kg']);

        const ws3Data = [catalogoHeader, ...catalogoRows];
        const ws3 = XLSX.utils.aoa_to_sheet(ws3Data);
        
        // Aplicar formato premium a la hoja 3
        formatAndStyleWorksheet(ws3);

        XLSX.utils.book_append_sheet(wb, ws3, 'Catalogo_Codigos');

        /* ─────────────────────────────────────────
           DESCARGAR ARCHIVO
        ───────────────────────────────────────── */
        const fileName = `Residuos_${invoice.id}_${(invoice.date || '').replace(/-/g, '')}.xlsx`;
        XLSX.writeFile(wb, fileName);

        showToast('✅ Excel descargado correctamente', 'success');

    } catch (err) {
        console.error('Excel Export Error:', err);
        showToast('❌ Error al generar Excel', 'error');
    }
}

/**
 * Exporta todos los datos de la app (Facturas, Ingresos, Egresos, Materiales) 
 * en un solo archivo Excel con múltiples pestañas.
 */
function exportAllDataToExcel() {
    exportSelectedDataToExcel({
        invoices: true,
        income: true,
        expenses: true,
        materials: true
    });
}

/**
 * Exporta datos seleccionados de la app en un solo archivo Excel.
 * @param {Object} selection - { invoices: bool, income: bool, expenses: bool, materials: bool }
 */
function exportSelectedDataToExcel(selection = {}) {
    if (typeof XLSX === 'undefined') {
        showToast('❌ Librería Excel no disponible', 'error');
        return;
    }

    try {
        showToast('📊 Generando Excel...', 'info');
        const wb = XLSX.utils.book_new();
        let sheetsAdded = 0;

        // 1. Facturas
        if (selection.invoices) {
            const invoices = JSON.parse(localStorage.getItem(userKey('recim_invoices')) || '[]');
            if (invoices.length > 0) {
                const headers = [
                    'ID', 'Fecha', 'Cliente', 'Tipo', 'Material', 
                    'Cantidad', 'Unidad', 'Precio Compra', 'Precio Venta', 
                    'Total Compra', 'Total Venta', 'Ganancia', 'Notas'
                ];
                const invRows = [];
                let rowNum = 2; // Fila 1 es cabecera

                invoices.forEach(inv => {
                    const items = inv.items || [];
                    items.forEach(item => {
                        invRows.push([
                            inv.id,
                            inv.date,
                            inv.client || inv.company || '—',
                            inv.type || 'basic',
                            item.name || item.desc || '',
                            item.qty || 0,
                            item.unit || 'kg',
                            item.priceBuy || item.uprice || 0,
                            item.priceSell || 0,
                            { f: `F${rowNum}*H${rowNum}` }, // J - Total Compra (Fórmula)
                            { f: `F${rowNum}*I${rowNum}` }, // K - Total Venta (Fórmula)
                            { f: `K${rowNum}-J${rowNum}` }, // L - Ganancia (Fórmula)
                            inv.notes || ''
                        ]);
                        rowNum++;
                    });
                });

                if (invRows.length > 0) {
                    const wsInv = XLSX.utils.aoa_to_sheet([headers, ...invRows]);
                    formatAndStyleWorksheet(wsInv);
                    XLSX.utils.book_append_sheet(wb, wsInv, 'Facturas');
                    sheetsAdded++;
                }
            }
        }

        // 2. Ingresos
        if (selection.income) {
            const ingresos = JSON.parse(localStorage.getItem(userKey('recim_ingresos')) || '[]');
            if (ingresos.length > 0) {
                const headers = ['ID', 'Fecha', 'Concepto', 'Monto', 'Categoría', 'Notas'];
                const incRows = ingresos.map(i => [
                    i.id,
                    i.date,
                    i.concept,
                    i.amount,
                    i.category || 'General',
                    i.notes || ''
                ]);
                const wsInc = XLSX.utils.aoa_to_sheet([headers, ...incRows]);
                formatAndStyleWorksheet(wsInc);
                XLSX.utils.book_append_sheet(wb, wsInc, 'Ingresos');
                sheetsAdded++;
            }
        }

        // 3. Egresos
        if (selection.expenses) {
            const egresos = JSON.parse(localStorage.getItem(userKey('recim_egresos')) || '[]');
            if (egresos.length > 0) {
                const headers = ['ID', 'Fecha', 'Concepto', 'Monto', 'Categoría', 'Notas'];
                const expRows = egresos.map(e => [
                    e.id,
                    e.date,
                    e.concept,
                    e.amount,
                    e.category || 'General',
                    e.notes || ''
                ]);
                const wsExp = XLSX.utils.aoa_to_sheet([headers, ...expRows]);
                formatAndStyleWorksheet(wsExp);
                XLSX.utils.book_append_sheet(wb, wsExp, 'Egresos');
                sheetsAdded++;
            }
        }

        // 4. Materiales
        if (selection.materials) {
            const mats = (typeof getMaterialCodes === 'function') ? getMaterialCodes() : [];
            if (mats.length > 0) {
                const headers = ['Código', 'Nombre', 'Unidad'];
                const matRows = mats.map(m => [
                    m.id || m.code || '',
                    m.name || '',
                    m.unit || 'kg'
                ]);
                const wsMat = XLSX.utils.aoa_to_sheet([headers, ...matRows]);
                formatAndStyleWorksheet(wsMat);
                XLSX.utils.book_append_sheet(wb, wsMat, 'Catálogo_Materiales');
                sheetsAdded++;
            }
        }

        if (sheetsAdded === 0) {
            showToast('⚠️ No hay datos para exportar en las categorías seleccionadas', 'warning');
            return;
        }

        const fileName = `Reciminsa_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
        showToast('✅ Excel generado correctamente', 'success');

    } catch (err) {
        console.error('Custom Export Error:', err);
        showToast('❌ Error al exportar datos', 'error');
    }
}

/**
 * Importa datos desde un archivo Excel y los guarda en la app.
 * Utiliza Inteligencia Artificial (Gemini) para mapear y clasificar columnas automáticamente
 * si la clave API está configurada. Cuenta con fallback manual clásico si la IA no está disponible.
 * @param {File} file - El archivo subido por el usuario.
 */
function importExcelData(file) {
    if (!file) return;

    let uniqueCounter = 0;
    function generateUniqueId(prefix) {
        uniqueCounter++;
        return `${prefix}-${Date.now()}-${uniqueCounter}-${Math.floor(Math.random() * 1000000)}`;
    }

    function isIdInRawData(id, rawData) {
        if (!id || !rawData) return false;
        const idStr = String(id).toLowerCase().trim();
        for (const sheetName in rawData) {
            const rows = rawData[sheetName];
            if (Array.isArray(rows)) {
                for (const row of rows) {
                    for (const key in row) {
                        const val = row[key];
                        if (val !== undefined && val !== null && String(val).toLowerCase().trim() === idStr) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // 1. Convertir datos de hojas Excel a JSON crudo estructurado
            const rawWorkbookData = {};
            for (const sheetName of workbook.SheetNames) {
                const sheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json(sheet);
                if (rows.length > 0) {
                    rawWorkbookData[sheetName] = rows;
                }
            }

            if (Object.keys(rawWorkbookData).length === 0) {
                showToast('⚠️ El archivo Excel está vacío o no contiene filas válidas', 'warning');
                return;
            }

            // 2. Si la clave API de Gemini está disponible, ejecutar Importación Inteligente con IA
            if (typeof geminiApiKey !== 'undefined' && geminiApiKey) {
                showToast('🤖 IA: Analizando y estructurando Excel con Inteligencia Artificial...', 'info', 8000);
                
                try {
                    const matsRef = typeof getMaterialCodes === 'function' ? getMaterialCodes() : [];
                    const materialsReference = matsRef.map(m => ({ id: m.id, code: m.code, name: m.name, unit: m.unit }));

                    // Endpoint oficial de la API de Gemini
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
                    
                    const systemPrompt = `Eres un asistente de inteligencia artificial experto en migración y limpieza de datos para la aplicación Reciminsaap (gestión de reciclaje y finanzas).
Tu tarea es analizar los datos crudos extraídos de un archivo Excel importado y mapearlos de forma inteligente a nuestra estructura de datos de base de datos.

Nuestra estructura de datos consta de 3 colecciones:
1. "invoices" (Facturas/Bitácoras):
   Cada factura/bitácora debe tener la siguiente estructura:
   {
     "id": "BIT-xxxx" (si es tipo "basica") o "INV-xxxx" (si es tipo "normal"),
     "date": "YYYY-MM-DD",
     "client": "Nombre del cliente/proveedor",
     "type": "basica" o "normal",
     "notes": "Notas adicionales",
     "items": [
       {
         "matId": "Código del material (ej: mat-xxxx o código corto)",
         "name": "Nombre legible del material",
         "qty": número (cantidad),
         "unit": "kg", "lb" o "unidad",
         "priceBuy": número (precio de compra),
         "priceSell": número (precio de venta),
         "peso": número (peso convertido a kg. Nota: 1 lb = 0.453592 kg. Si la unidad es kg, peso = qty),
         "totalCompra": número (qty * priceBuy),
         "totalVenta": número (qty * priceSell),
         "balance": número (totalVenta - totalCompra)
       }
     ],
     "totalCompra": número (suma de totalCompra de los items),
     "totalVenta": número (suma de totalVenta de los items),
     "balance": número (totalVenta - totalCompra),
     "createdAt": "Fecha en formato ISO"
   }

2. "ingresos" (Ingresos financieros):
   {
     "id": "ING-xxxx",
     "date": "YYYY-MM-DD",
     "concept": "Concepto o descripción",
     "amount": número (monto total),
     "category": "Materiales", "Otros", etc.,
     "notes": "Notas",
     "createdAt": "Fecha en formato ISO"
   }

3. "egresos" (Egresos/Gastos financieros):
   {
     "id": "EGR-xxxx",
     "date": "YYYY-MM-DD",
     "concept": "Concepto o descripción",
     "amount": número (monto total),
     "category": "Materiales", "Otros", "Comida", etc.,
     "notes": "Notas",
     "createdAt": "Fecha en formato ISO"
   }

Reglas importantes:
- Si una fila representa una compra o recogida de materiales reciclables (tiene campos como peso/cantidad y precio de compra de residuos), debes mapearla a "invoices" de tipo "basica".
- Si es una factura empresarial de venta o servicio completo, mapearla a "invoices" de tipo "normal".
- Si solo son transacciones de dinero sueltas (ej: "pago de luz", "venta de cobre", "comida", "sueldo"), mapealas a "ingresos" o "egresos" según corresponda.
- Intenta emparejar los nombres de los materiales de los items con este catálogo existente de códigos de materiales de la app:
${JSON.stringify(materialsReference)}
- Si no coinciden exactamente, asígnales el matId correspondiente si es obvio (ej: "cartón" o "cartones" -> "carton") o conserva el nombre original.
- IMPORTANTE SOBRE LOS IDs: Si el registro original del Excel tiene una columna de ID (o identificador) y tiene un valor, debes conservar ese ID exacto en el campo "id". Si el registro no tiene un ID en el Excel, NO inventes un ID; deja el campo "id" vacío, null o no lo incluyes, ya que el sistema cliente le asignará un ID único de forma automática.
- Devuelve únicamente el objeto JSON solicitado con las 3 listas: { "invoices": [...], "ingresos": [...], "egresos": [...] }. No incluyas explicaciones de texto, código de formateo markdown (sin \`\`\`json ni \`\`\`), solo el JSON limpio listo para ser parseado por JSON.parse().`;

                    const prompt = `${systemPrompt}\n\nAquí están los datos del archivo Excel crudo:\n${JSON.stringify(rawWorkbookData)}`;

                    const apiResponse = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: {
                                responseMimeType: "application/json"
                            }
                        })
                    });

                    if (!apiResponse.ok) {
                        throw new Error(`Error en API Gemini: ${apiResponse.statusText}`);
                    }

                    const jsonResp = await apiResponse.json();
                    const aiText = jsonResp.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (!aiText) {
                        throw new Error("La IA no devolvió contenido válido.");
                    }

                    // Parsear el JSON retornado por Gemini
                    const parsedData = JSON.parse(aiText.trim());

                    let importedInvoicesCount = 0;
                    let importedIngresosCount = 0;
                    let importedEgresosCount = 0;

                    // Fusionar Facturas
                    if (parsedData.invoices && Array.isArray(parsedData.invoices)) {
                        const localInvoicesKey = userKey('recim_invoices');
                        const localInvoices = JSON.parse(localStorage.getItem(localInvoicesKey) || '[]');
                        parsedData.invoices.forEach(inv => {
                            if (!inv.id || !isIdInRawData(inv.id, rawWorkbookData)) {
                                const prefix = inv.type === 'normal' ? 'INV' : 'BIT';
                                inv.id = generateUniqueId(prefix);
                            }
                            const idx = localInvoices.findIndex(item => item.id === inv.id);
                            if (idx !== -1) {
                                localInvoices[idx] = inv;
                            } else {
                                localInvoices.push(inv);
                            }
                            importedInvoicesCount++;
                        });
                        localStorage.setItem(localInvoicesKey, JSON.stringify(localInvoices));
                    }

                    // Fusionar Ingresos
                    if (parsedData.ingresos && Array.isArray(parsedData.ingresos)) {
                        const localIngresosKey = userKey('recim_ingresos');
                        const localIngresos = JSON.parse(localStorage.getItem(localIngresosKey) || '[]');
                        parsedData.ingresos.forEach(ing => {
                            if (!ing.id || !isIdInRawData(ing.id, rawWorkbookData)) {
                                ing.id = generateUniqueId('ING');
                            }
                            const idx = localIngresos.findIndex(item => item.id === ing.id);
                            if (idx !== -1) {
                                localIngresos[idx] = ing;
                            } else {
                                localIngresos.push(ing);
                            }
                            importedIngresosCount++;
                        });
                        localStorage.setItem(localIngresosKey, JSON.stringify(localIngresos));
                    }

                    // Fusionar Egresos
                    if (parsedData.egresos && Array.isArray(parsedData.egresos)) {
                        const localEgresosKey = userKey('recim_egresos');
                        const localEgresos = JSON.parse(localStorage.getItem(localEgresosKey) || '[]');
                        parsedData.egresos.forEach(egr => {
                            if (!egr.id || !isIdInRawData(egr.id, rawWorkbookData)) {
                                egr.id = generateUniqueId('EGR');
                            }
                            const idx = localEgresos.findIndex(item => item.id === egr.id);
                            if (idx !== -1) {
                                localEgresos[idx] = egr;
                            } else {
                                localEgresos.push(egr);
                            }
                            importedEgresosCount++;
                        });
                        localStorage.setItem(localEgresosKey, JSON.stringify(localEgresos));
                    }

                    // Forzar sincronización en la nube Supabase inmediatamente
                    if (window.forceSync) {
                        await window.forceSync();
                    }

                    showToast(`🤖 ¡Importación por IA completada! (${importedInvoicesCount} facturas/bitácoras, ${importedIngresosCount} ingresos, ${importedEgresosCount} egresos)`, 'success', 6000);
                    
                    if (typeof rerenderCurrentPage === 'function') {
                        rerenderCurrentPage();
                    }
                    return;

                } catch (aiErr) {
                    console.warn("🤖 Error en importación inteligente por IA. Ejecutando fallback manual...", aiErr);
                    showToast('⚠️ IA no disponible, ejecutando importación manual estándar...', 'warning');
                }
            }

            // 3. Fallback Manual Clásico si no hay IA disponible o si falló
            let importedCount = 0;
            for (const sheetName of workbook.SheetNames) {
                const sheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json(sheet);

                if (sheetName === 'Facturas') {
                    const localInvoicesKey = userKey('recim_invoices');
                    const localInvoices = JSON.parse(localStorage.getItem(localInvoicesKey) || '[]');
                    const invMap = {};
                    rows.forEach(r => {
                        const rawId = r.ID || r.id;
                        const groupKey = rawId || `group_${r.Fecha || 'nofecha'}_${r.Cliente || 'nocliente'}_${r.Notas || ''}`;

                        if (!invMap[groupKey]) {
                            invMap[groupKey] = {
                                id: rawId ? String(rawId) : null,
                                date: r.Fecha || r.fecha,
                                client: r.Cliente || r.cliente,
                                type: r.Tipo || r.tipo,
                                notes: r.Notas || r.notas || '',
                                items: [],
                                createdAt: new Date().toISOString()
                            };
                        }

                        const pBuy = parseFloat(r['Precio Compra'] !== undefined ? r['Precio Compra'] : (r.Precio_Compra !== undefined ? r.Precio_Compra : 0));
                        const pSell = parseFloat(r['Precio Venta'] !== undefined ? r['Precio Venta'] : (r.Precio_Venta !== undefined ? r.Precio_Venta : 0));

                        invMap[groupKey].items.push({
                            name: r.Material || r.material || '',
                            qty: parseFloat(r.Cantidad || r.cantidad || 0),
                            unit: r.Unidad || r.unidad || 'kg',
                            priceBuy: pBuy,
                            priceSell: pSell
                        });
                    });
                    
                    // Merge invMap values into localInvoices
                    Object.values(invMap).forEach(newInv => {
                        if (!newInv.id) {
                            const prefix = newInv.type === 'normal' ? 'INV' : 'BIT';
                            newInv.id = generateUniqueId(prefix);
                        }
                        const idx = localInvoices.findIndex(item => item.id === newInv.id);
                        if (idx !== -1) {
                            localInvoices[idx] = newInv;
                        } else {
                            localInvoices.push(newInv);
                        }
                    });
                    localStorage.setItem(localInvoicesKey, JSON.stringify(localInvoices));
                    importedCount++;
                }

                if (sheetName === 'Ingresos') {
                    const localIngresosKey = userKey('recim_ingresos');
                    const localIngresos = JSON.parse(localStorage.getItem(localIngresosKey) || '[]');
                    const mapped = rows.map(r => {
                        const rawId = r.ID || r.id;
                        return {
                            id: rawId ? String(rawId) : generateUniqueId('ING'),
                            date: r.Fecha || r.fecha,
                            concept: r.Concepto || r.concepto,
                            amount: parseFloat(r.Monto || r.monto || 0),
                            category: r.Categoría || r.Categoria || r.categoría || r.categoria || 'Importado',
                            notes: r.Notas || r.notas || ''
                        };
                    });
                    mapped.forEach(newIng => {
                        const idx = localIngresos.findIndex(item => item.id === newIng.id);
                        if (idx !== -1) {
                            localIngresos[idx] = newIng;
                        } else {
                            localIngresos.push(newIng);
                        }
                    });
                    localStorage.setItem(localIngresosKey, JSON.stringify(localIngresos));
                    importedCount++;
                }

                if (sheetName === 'Egresos') {
                    const localEgresosKey = userKey('recim_egresos');
                    const localEgresos = JSON.parse(localStorage.getItem(localEgresosKey) || '[]');
                    const mapped = rows.map(r => {
                        const rawId = r.ID || r.id;
                        return {
                            id: rawId ? String(rawId) : generateUniqueId('EGR'),
                            date: r.Fecha || r.fecha,
                            concept: r.Concepto || r.concepto,
                            amount: parseFloat(r.Monto || r.monto || 0),
                            category: r.Categoría || r.Categoria || r.categoría || r.categoria || 'Importado',
                            notes: r.Notas || r.notas || ''
                        };
                    });
                    mapped.forEach(newEgr => {
                        const idx = localEgresos.findIndex(item => item.id === newEgr.id);
                        if (idx !== -1) {
                            localEgresos[idx] = newEgr;
                        } else {
                            localEgresos.push(newEgr);
                        }
                    });
                    localStorage.setItem(localEgresosKey, JSON.stringify(localEgresos));
                    importedCount++;
                }
            }

            if (importedCount > 0) {
                if (window.forceSync) await window.forceSync();
                showToast(t('toast.import_success'), 'success');
                if (typeof rerenderCurrentPage === 'function') rerenderCurrentPage();
            } else {
                showToast('⚠️ No se encontraron pestañas válidas para importar', 'warning');
            }

        } catch (err) {
            console.error('Import Error:', err);
            showToast(t('toast.import_error'), 'error');
        }
    };
    reader.readAsArrayBuffer(file);
}

/**
 * Exporta una lista de bitácoras (invoices tipo basica) a Excel
 * @param {Array} bitacoras - Arreglo de facturas tipo 'basica'
 */
function exportBitacorasListToExcel(bitacoras) {
    if (!bitacoras || bitacoras.length === 0) {
        showToast('⚠️ No hay bitácoras para exportar', 'warning');
        return;
    }
    if (typeof XLSX === 'undefined') {
        showToast('❌ Librería Excel no disponible', 'error');
        return;
    }

    try {
        showToast('📊 Generando Excel de Bitácoras...', 'info');
        const wb = XLSX.utils.book_new();

        // 1. Hoja de Registros Detallados (AOA con fórmulas dinámicas)
        const detHeaders = [
            'ID Bitácora', 'Fecha', 'Cliente/Procedencia', 'Material', 
            'Cantidad', 'Unidad', 'Peso (kg)', 'Costo Compra', 'Precio Venta', 
            'Total Compra', 'Total Venta', 'Balance', 'Notas'
        ];
        const detRows = [];
        let rowNum = 2; // Cabecera es 1

        bitacoras.forEach(b => {
            (b.items || []).forEach(item => {
                detRows.push([
                    b.id,
                    b.date,
                    b.client || '—',
                    item.name || '',
                    item.qty || 0,
                    item.unit || 'lb',
                    item.peso || 0,
                    item.priceBuy || 0,
                    item.priceSell || 0,
                    { f: `E${rowNum}*H${rowNum}` }, // J - Total Compra (Fórmula)
                    { f: `E${rowNum}*I${rowNum}` }, // K - Total Venta (Fórmula)
                    { f: `K${rowNum}-J${rowNum}` }, // L - Balance (Fórmula)
                    b.notes || ''
                ]);
                rowNum++;
            });
        });

        const wsDet = XLSX.utils.aoa_to_sheet([detHeaders, ...detRows]);
        formatAndStyleWorksheet(wsDet);
        XLSX.utils.book_append_sheet(wb, wsDet, 'Registros_Detallados');

        // 2. Hoja de Resumen por Material (AOA con fórmulas)
        const matSummary = {};
        bitacoras.forEach(b => {
            (b.items || []).forEach(item => {
                const mid = item.matId || item.name;
                if (!matSummary[mid]) {
                    matSummary[mid] = { 'Material': item.name, 'Cant. Total': 0, 'Peso Total (kg)': 0, 'Inversión Total': 0, 'Venta Est.': 0 };
                }
                matSummary[mid]['Cant. Total'] += (item.qty || 0);
                matSummary[mid]['Peso Total (kg)'] += (item.peso || 0);
                matSummary[mid]['Inversión Total'] += (item.totalCompra || 0);
                matSummary[mid]['Venta Est.'] += (item.totalVenta || 0);
            });
        });

        const sumHeaders = ['Material', 'Cant. Total', 'Peso Total (kg)', 'Inversión Total', 'Venta Est.', 'Balance'];
        const sumRows = [];
        let sumRowNum = 2;

        Object.values(matSummary).forEach(s => {
            sumRows.push([
                s.Material,
                s['Cant. Total'],
                s['Peso Total (kg)'],
                s['Inversión Total'],
                s['Venta Est.'],
                { f: `E${sumRowNum}-D${sumRowNum}` } // F - Balance (Fórmula)
            ]);
            sumRowNum++;
        });

        const wsSum = XLSX.utils.aoa_to_sheet([sumHeaders, ...sumRows]);
        formatAndStyleWorksheet(wsSum);
        XLSX.utils.book_append_sheet(wb, wsSum, 'Resumen_Materiales');

        const fileName = `Bitacora_Recogida_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
        showToast('✅ Excel de bitácora generado', 'success');

    } catch (err) {
        console.error('Export Bitacoras Error:', err);
        showToast('❌ Error al exportar bitácoras', 'error');
    }
}
