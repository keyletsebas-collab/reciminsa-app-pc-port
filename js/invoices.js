/* =============================================
   INVOICES.JS – Facturación (Local & Empresarial) con PDF
   Depends on: materials.js, i18n.js, html2pdf
   ============================================= */

// =============================================
// TAB NAVIGATION
// =============================================
function switchFacturacionTab(tabName) {
  document.querySelectorAll('.fac-tab').forEach(t_ => t_.classList.remove('active'));
  document.querySelectorAll('.fac-tab-content').forEach(c => c.classList.remove('active'));
  const btn = document.getElementById(`fac-tab-btn-${tabName}`);
  const content = document.getElementById(`fac-tab-${tabName}`);
  if (btn) btn.classList.add('active');
  if (content) content.classList.add('active');
}

// =============================================
// FACTURA LOCAL / EMPRESARIAL (Unified Form)
// =============================================
function renderFacturaForm(type) {
  const isEmpresa = type === 'empresa';
  return `
    <div class="card" style="max-width: 950px; margin: 0 auto;">
      <div class="card-header">
        <h3 class="card-title">${isEmpresa ? t('inv.biz_title') : 'Factura Local'}</h3>
        <p class="card-subtitle">${isEmpresa ? t('inv.biz_sub') : 'Para consumidores finales (Sin RNC)'}</p>
      </div>

      <div class="form-row" style="margin-bottom: 15px;">
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">Seleccionar Cliente Guardado (Opcional)</label>
          <select id="fac-client-select-${type}" class="form-select" onchange="autofillClient('${type}', this.value)">
            <option value="">-- Escribir datos manualmente --</option>
          </select>
        </div>
      </div>

      <div class="form-row" style="grid-template-columns: 1fr 1fr;">
        <div class="form-group">
          <label class="form-label">${isEmpresa ? t('inv.company_name') : 'Nombre del Cliente'} <span style="color: #ef4444; font-weight: bold;">*</span></label>
          <input id="fac-name-${type}" type="text" class="form-input" placeholder="Nombre completo" />
        </div>
        <div class="form-group">
          <label class="form-label">RNC o Cédula ${isEmpresa ? '<span style="color: #ef4444; font-weight: bold;">*</span>' : ''}</label>
          <div style="display:flex; gap: 8px;">
            <input id="fac-nit-${type}" type="text" class="form-input" placeholder="9 u 11 dígitos" maxlength="11" />
            <button class="btn-secondary" onclick="autoFillInvoiceDGII('${type}')" style="margin:0; padding: 0 15px;" title="Buscar en DGII" type="button">🔍</button>
          </div>
        </div>
      </div>

      ${isEmpresa ? `
      <div class="form-row" style="grid-template-columns: 1fr 1fr;">
        <div class="form-group">
          <label class="form-label">Tipo de Comprobante <span style="color: #ef4444; font-weight: bold;">*</span></label>
          <select id="fac-ncf-type-${type}" class="form-select" onchange="handleNcfTypeChange('${type}')">
            <option value="B01">B01 - Crédito Fiscal (18%)</option>
            <option value="B02">B02 - Consumo (Consumidor Final)</option>
            <option value="B14">B14 - Régimen Especial (0%)</option>
            <option value="B15">B15 - Gubernamental</option>
            <option value="">Sin comprobante</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">NCF Completo <span style="color: #ef4444; font-weight: bold;">*</span></label>
          <input id="fac-ncf-${type}" type="text" class="form-input" placeholder="Ej: B0100000001" maxlength="13" onchange="padNcf(this)" onkeyup="if(event.key==='Enter') padNcf(this)" />
        </div>
      </div>
      <div class="form-row" style="grid-template-columns: 1fr;">
        <div class="form-group">
          <label class="form-label">${t('inv.address')}</label>
          <input id="fac-address-${type}" type="text" class="form-input" placeholder="Dirección / Email" />
        </div>
      </div>
      ` : `
        <input type="hidden" id="fac-ncf-type-${type}" value="" />
        <input type="hidden" id="fac-ncf-${type}" value="" />
        <input type="hidden" id="fac-address-${type}" value="" />
      `}

      <div class="form-row" style="grid-template-columns: 1fr 1fr;">
        <div class="form-group">
          <label class="form-label">${t('lbl.invoice_date')} <span style="color: #ef4444; font-weight: bold;">*</span></label>
          <input id="fac-date-${type}" type="date" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">${t('inv.contact')}</label>
          <input id="fac-contact-${type}" type="text" class="form-input" placeholder="Teléfono o Contacto" />
        </div>
      </div>

      <div style="margin-top:20px;">
        <h4 style="margin-bottom: 10px; color: var(--clr-text-muted);">Ítems de Factura</h4>
        <div id="fac-items-${type}" style="display:flex; flex-direction:column; gap:10px;">
          <!-- Rows added dynamically -->
        </div>
      </div>

      <div style="margin-top:10px; display:flex; justify-content: space-between; align-items: center;">
         <button class="btn-secondary" onclick="addFacEntryRow('${type}')" style="margin-bottom:0;">
           ➕ ${t('inv.add_item')}
         </button>
         <div id="fac-totals-${type}" style="text-align:right;">
            <div style="font-size:0.9rem; color:var(--clr-text-muted);">Subtotal: RD$0.00</div>
            <div style="font-size:1.1rem; font-weight:700; color:var(--clr-primary-light);">Total: RD$0.00</div>
         </div>
      </div>

      <div class="form-row" style="margin-top:20px; grid-template-columns: repeat(4, 1fr);">
        <div class="form-group">
          <label class="form-label" title="Impuesto Selectivo al Consumo">ISC (%)</label>
          <input id="fac-isc-${type}" type="number" class="form-input" value="0" min="0" oninput="calcFacTotals('${type}')" />
        </div>
        <div class="form-group">
          <label class="form-label">ITBIS (%)</label>
          <input id="fac-tax-${type}" type="number" class="form-input" value="${isEmpresa ? '18' : '0'}" min="0" oninput="calcFacTotals('${type}')" />
        </div>
        <div class="form-group">
          <label class="form-label">Retención ISR (%)</label>
          <input id="fac-ret-isr-${type}" type="number" class="form-input" value="0" min="0" oninput="calcFacTotals('${type}')" />
        </div>
        <div class="form-group">
          <label class="form-label">Retención ITBIS (%)</label>
          <input id="fac-ret-itbis-${type}" type="number" class="form-input" value="0" min="0" oninput="calcFacTotals('${type}')" />
        </div>
      </div>
      
      <div class="form-row" style="grid-template-columns: 1fr;">
        <div class="form-group">
          <label class="form-label">${t('inv.pay_notes')}</label>
          <input id="fac-notes-${type}" type="text" class="form-input" placeholder="${t('inv.pay_notes_ph')}" />
        </div>
      </div>

      <div style="display:flex; gap:10px; margin-top:30px;">
        <button class="btn-primary" onclick="saveFactura('${type}')" style="flex:2;">${t('inv.save_invoice')}</button>
        <button class="btn-outline" onclick="initFacturaForm('${type}')" style="flex:1;">${t('inv.clear_form')}</button>
      </div>
    </div>
  `;
}

function initFacturaForm(type) {
  const container = document.getElementById(`fac-tab-${type}`);
  if (container) {
    container.innerHTML = renderFacturaForm(type);
    addFacEntryRow(type);
    const today = new Date().toISOString().split('T')[0];
    const el = document.getElementById(`fac-date-${type}`);
    if (el) el.value = today;
    initClientSelect(type);
  }
}

function initClientSelect(type) {
  const select = document.getElementById(`fac-client-select-${type}`);
  if (!select) return;

  const clients = JSON.parse(localStorage.getItem(userKey('recim_clients')) || '[]');
  
  // Filter clients by invoice type (empresa or local)
  const filtered = clients.filter(c => c.type === type);
  
  let options = `<option value="">-- Escribir datos manualmente --</option>`;
  filtered.forEach(c => {
    options += `<option value="${c.id}">${c.name} ${c.nit ? '('+c.nit+')' : ''}</option>`;
  });
  
  select.innerHTML = options;
}

function autofillClient(type, clientId) {
  if (!clientId) {
    document.getElementById(`fac-name-${type}`).value = '';
    const nitEl = document.getElementById(`fac-nit-${type}`);
    if(nitEl) nitEl.value = '';
    const addrEl = document.getElementById(`fac-address-${type}`);
    if(addrEl) addrEl.value = '';
    const contactEl = document.getElementById(`fac-contact-${type}`);
    if(contactEl) contactEl.value = '';
    return;
  }
  
  const clients = JSON.parse(localStorage.getItem(userKey('recim_clients')) || '[]');
  const client = clients.find(c => c.id === clientId);
  if (client) {
    document.getElementById(`fac-name-${type}`).value = client.name;
    const nitEl = document.getElementById(`fac-nit-${type}`);
    if(nitEl) nitEl.value = client.nit || '';
    const addrEl = document.getElementById(`fac-address-${type}`);
    if(addrEl) addrEl.value = client.address || '';
    const contactEl = document.getElementById(`fac-contact-${type}`);
    if(contactEl) contactEl.value = client.contact || client.phone || '';
  }
}

function padNcf(input) {
  let val = input.value.trim().toUpperCase();
  if (!val) return;
  const match = val.match(/^([A-Z]\d{2})(\d+)$/);
  if (match) {
    const prefix = match[1];
    let seq = match[2];
    let totalLength = val.startsWith('E') ? 13 : 11;
    let seqLength = totalLength - 3;
    seq = seq.padStart(seqLength, '0');
    input.value = prefix + seq;
  } else {
    input.value = val; // auto-uppercase it
  }
}

function addFacEntryRow(type) {
  const tbody = document.getElementById(`fac-items-${type}`);
  if (!tbody) return;

  const rowId = `row-${Date.now()}`;
  const div = document.createElement('div');
  div.id = rowId;
  div.className = 'invoice-item-row';
  div.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; align-items: center; background: var(--bg-card); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);';
  div.innerHTML = `
    <div style="flex: 1 1 100%; min-width: 200px;">
      <input type="text" class="form-input row-desc" placeholder="Descripción del producto/servicio" style="margin:0;" />
    </div>
    <div style="flex: 1 1 80px;">
      <input type="number" class="form-input row-qty" placeholder="Cant." min="0.01" step="0.01" oninput="calcFacTotals('${type}')" style="margin:0;" />
    </div>
    <div style="flex: 1 1 100px;">
      <select class="form-select row-unit" style="margin:0;">
        <option value="lb" selected>libra</option>
        <option value="kg">kg</option>
        <option value="unidad">unidad</option>
      </select>
    </div>
    <div style="flex: 1 1 100px;">
      <input type="number" class="form-input row-uprice" placeholder="Precio" min="0" step="0.01" oninput="calcFacTotals('${type}')" style="margin:0;" />
    </div>
    <div style="flex: 1 1 120px; display:flex; align-items:center; justify-content:space-between;">
      <span class="row-total" style="font-weight:600; font-size:1rem; color: var(--clr-primary-light);">RD$0.00</span>
      <button class="btn-icon" onclick="removeFacEntryRow('${rowId}', '${type}')" style="color:#ff4d4d; margin:0; padding:4px 8px;">✕</button>
    </div>
  `;
  tbody.appendChild(div);
  calcFacTotals(type);
}

function removeFacEntryRow(id, type) {
  const row = document.getElementById(id);
  if (row) row.remove();
  calcFacTotals(type);
}

function calcFacTotals(type) {
  let subtotal = 0;
  document.querySelectorAll(`#fac-items-${type} .invoice-item-row`).forEach(row => {
    const qty = parseFloat(row.querySelector('.row-qty').value) || 0;
    const uprice = parseFloat(row.querySelector('.row-uprice').value) || 0;
    const rowTotal = qty * uprice;
    subtotal += rowTotal;
    row.querySelector('.row-total').textContent = formatMoney(rowTotal);
  });

  const taxRate = parseFloat(document.getElementById(`fac-tax-${type}`).value) || 0;
  const iscRate = parseFloat(document.getElementById(`fac-isc-${type}`).value) || 0;
  const retIsrRate = parseFloat(document.getElementById(`fac-ret-isr-${type}`).value) || 0;
  const retItbisRate = parseFloat(document.getElementById(`fac-ret-itbis-${type}`).value) || 0;

  const iscAmount = subtotal * (iscRate / 100);
  const taxAmount = subtotal * (taxRate / 100);
  const retIsrAmount = subtotal * (retIsrRate / 100);
  const retItbisAmount = taxAmount * (retItbisRate / 100);
  
  const total = subtotal + iscAmount + taxAmount - retIsrAmount - retItbisAmount;

  const label = document.getElementById(`fac-totals-${type}`);
  if (label) {
    let html = `<div style="font-size:0.9rem; color:var(--clr-text-muted);">Subtotal: ${formatMoney(subtotal)}</div>`;
    if (iscAmount > 0) html += `<div style="font-size:0.85rem; color:var(--clr-text-muted);">ISC (${iscRate}%): +${formatMoney(iscAmount)}</div>`;
    if (taxAmount > 0) html += `<div style="font-size:0.85rem; color:var(--clr-text-muted);">ITBIS (${taxRate}%): +${formatMoney(taxAmount)}</div>`;
    if (retIsrAmount > 0) html += `<div style="font-size:0.85rem; color:var(--clr-danger);">Ret ISR (${retIsrRate}%): -${formatMoney(retIsrAmount)}</div>`;
    if (retItbisAmount > 0) html += `<div style="font-size:0.85rem; color:var(--clr-danger);">Ret ITBIS (${retItbisRate}%): -${formatMoney(retItbisAmount)}</div>`;
    html += `<div style="font-size:1.1rem; font-weight:700; color:var(--clr-primary-light); margin-top:4px;">Total: ${formatMoney(total)}</div>`;
    label.innerHTML = html;
  }
}

async function saveFactura(type) {
  const rows = document.querySelectorAll(`#fac-items-${type} .invoice-item-row`);
  const items = [];

  rows.forEach(row => {
    const desc = row.querySelector('.row-desc').value.trim();
    const qty = parseFloat(row.querySelector('.row-qty').value) || 0;
    const unit = row.querySelector('.row-unit').value || '';
    const uprice = parseFloat(row.querySelector('.row-uprice').value) || 0;

    if (desc && qty > 0 && uprice > 0) {
      items.push({ id: Date.now() + Math.random(), desc, qty, unit, uprice, subtotal: qty * uprice });
    }
  });

  if (items.length === 0) {
    showToast('❌ Agrega al menos un artículo con descripción y precio', 'error');
    return;
  }

  // Validar correspondencia de tipo de cliente y tipo de factura
  const clientSelect = document.getElementById(`fac-client-select-${type}`);
  const selectedClientId = clientSelect ? clientSelect.value : '';
  if (selectedClientId) {
    const clients = JSON.parse(localStorage.getItem(userKey('recim_clients')) || '[]');
    const found = clients.find(c => c.id === selectedClientId);
    if (found) {
      if (type === 'empresa' && found.type !== 'empresa') {
        showToast('❌ El cliente seleccionado no es de tipo Empresa', 'error');
        return;
      }
      if (type === 'local' && found.type === 'empresa') {
        showToast('❌ El cliente seleccionado no es de tipo Local', 'error');
        return;
      }
    }
  }

  const company = document.getElementById(`fac-name-${type}`).value.trim();
  const date = document.getElementById(`fac-date-${type}`).value;

  if (!company) {
    showToast(type === 'empresa' ? '❌ El nombre de la empresa es obligatorio' : '❌ El nombre del cliente es obligatorio', 'error');
    return;
  }

  if (!date) {
    showToast('❌ La fecha de la factura es obligatoria', 'error');
    return;
  }

  const isEmpresa = type === 'empresa';
  const nit = document.getElementById(`fac-nit-${type}`).value.trim();
  const ncfType = document.getElementById(`fac-ncf-type-${type}`)?.value || '';
  const ncf = document.getElementById(`fac-ncf-${type}`).value.trim();

  if (isEmpresa) {
    if (!nit) {
      showToast('❌ El RNC o Cédula es obligatorio para facturas empresariales', 'error');
      return;
    }
    if (!ncfType) {
      showToast('❌ Selecciona un tipo de comprobante para facturas empresariales', 'error');
      return;
    }
    if (!ncf) {
      showToast('❌ El número NCF es obligatorio para facturas empresariales', 'error');
      return;
    }
  }
  
  if (ncf) {
    const existingInvoices = getAllInvoices();
    const isDuplicate = existingInvoices.some(inv => inv.ncf && inv.ncf.toUpperCase() === ncf.toUpperCase());
    if (isDuplicate) {
      showToast(`❌ Error: El NCF ${ncf} ya fue utilizado en otra factura.`, 'error');
      return;
    }
  }

  const address = document.getElementById(`fac-address-${type}`).value.trim();
  const contact = document.getElementById(`fac-contact-${type}`).value.trim();
  const notes = document.getElementById(`fac-notes-${type}`).value.trim();
  const taxRate = parseFloat(document.getElementById(`fac-tax-${type}`).value) || 0;
  const iscRate = parseFloat(document.getElementById(`fac-isc-${type}`).value) || 0;
  const retIsrRate = parseFloat(document.getElementById(`fac-ret-isr-${type}`).value) || 0;
  const retItbisRate = parseFloat(document.getElementById(`fac-ret-itbis-${type}`).value) || 0;

  const rawSubtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const iscAmount = rawSubtotal * (iscRate / 100);
  const taxAmount = rawSubtotal * (taxRate / 100);
  const retIsrAmount = rawSubtotal * (retIsrRate / 100);
  const retItbisAmount = taxAmount * (retItbisRate / 100);
  const total = rawSubtotal + iscAmount + taxAmount - retIsrAmount - retItbisAmount;

  const invType = isEmpresa ? 'empresa' : 'local';
  const typeName = isEmpresa ? 'Empresarial' : 'Local';

  const invoice = {
    id: `FAC-${isEmpresa?'E':'L'}-${Date.now()}`,
    type: invType, typeName: typeName,
    company, nit, ncfType, ncf, address, contact, date, notes,
    items, subtotal: rawSubtotal, taxRate, taxAmount, 
    iscRate, iscAmount, retIsrRate, retIsrAmount, retItbisRate, retItbisAmount, total,
    createdAt: new Date().toISOString()
  };

  saveInvoice(invoice);

  addFinanceEntry('ingreso', {
    concept: `Venta ${typeName}: ${invoice.id} – ${company}`,
    amount: total, date, category: 'Ventas', ref: invoice.id
  });

  showToast(`${t('toast.inv_saved')} ${invoice.id}`, 'success');
  initFacturaForm(type);

  if (confirm("¿Deseas descargar la factura en PDF?")) {
    generatePDFInvoice(invoice);
  }
}

// =============================================
// PDF GENERATION (html2pdf)
// =============================================
function generatePDFInvoice(invoice) {
  if (typeof html2pdf === 'undefined') {
    showToast('Error: html2pdf.js no está cargado', 'error');
    return;
  }

  const isEmpresa = invoice.type === 'empresa';
  const title = isEmpresa && invoice.ncf ? 'FACTURA DE CRÉDITO FISCAL' : 'FACTURA COMERCIAL';
  const c = getCurrency().symbol;

  const itemsHtml = invoice.items.map(item => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 10px; color: #374151;">${item.qty} ${item.unit || ''}</td>
      <td style="padding: 10px; color: #111827; font-weight: 500;">${item.desc}</td>
      <td style="padding: 10px; text-align:right; color: #374151;">${formatMoney(item.uprice)}</td>
      <td style="padding: 10px; text-align:right; color: #111827; font-weight: 600;">${formatMoney(item.subtotal)}</td>
    </tr>
  `).join('');

  // Leer configuraciones de marca blanca
  const settings = JSON.parse(localStorage.getItem('recim_settings') || '{}');
  const customCompanyName = settings.companyName || 'RECIMINSA';
  const customCompanyRNC = settings.companyRNC ? `<p style="margin:2px 0; font-size: 14px; color: #666;"><strong>RNC:</strong> ${settings.companyRNC}</p>` : '';
  const customCompanyLogo = settings.companyLogo 
    ? `<img src="${settings.companyLogo}" style="max-width: 180px; max-height: 70px; object-fit: contain;" />` 
    : `<img src="logo-no-white-lines.png" style="max-width: 180px; max-height: 70px; object-fit: contain; border-radius: 6px;" />`;

  const htmlContent = `
    <div style="box-sizing: border-box; width: 100%; font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px 30px; color: #333; background: #fff;">
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border-bottom: 2px solid #22c55e; padding-bottom: 20px;">
        <tr>
          <td style="vertical-align: middle; text-align: left; padding-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 20px;">
              ${customCompanyLogo}
              <div>
                <h1 style="margin: 0; font-size: 28px; color: #15803d; font-weight: 700; line-height: 1.2;">${customCompanyName}</h1>
                ${customCompanyRNC}
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #666; font-weight: 500;">Gestión de Reciclaje</p>
              </div>
            </div>
          </td>
          <td style="vertical-align: middle; text-align: right; padding-bottom: 20px; width: 350px;">
            <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #333; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${title}</h2>
            <p style="margin: 4px 0; font-size: 14px; color: #444;"><strong>Factura N°:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: 600;">${invoice.id}</span></p>
            <p style="margin: 4px 0; font-size: 14px; color: #444;"><strong>Fecha:</strong> ${invoice.date}</p>
            ${invoice.ncf ? `<p style="margin: 4px 0; font-size: 14px; color: #444;"><strong>NCF:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: 600;">${invoice.ncf}</span></p>` : ''}
          </td>
        </tr>
      </table>

      <div style="margin-bottom: 30px; background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">INFORMACIÓN DEL CLIENTE / PROVEEDOR</h3>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.5;">
          <tr>
            <td style="padding: 4px 0; width: 180px; color: #6b7280; font-weight: 600;">Nombre / Razón Social:</td>
            <td style="padding: 4px 0; color: #111827; font-weight: 500;">${invoice.company}</td>
          </tr>
          ${invoice.nit ? `
          <tr>
            <td style="padding: 4px 0; color: #6b7280; font-weight: 600;">RNC / Cédula:</td>
            <td style="padding: 4px 0; color: #111827; font-family: monospace; font-size: 14px; font-weight: 600;">${invoice.nit}</td>
          </tr>` : ''}
          ${invoice.address ? `
          <tr>
            <td style="padding: 4px 0; color: #6b7280; font-weight: 600;">Dirección:</td>
            <td style="padding: 4px 0; color: #111827;">${invoice.address}</td>
          </tr>` : ''}
          ${invoice.contact ? `
          <tr>
            <td style="padding: 4px 0; color: #6b7280; font-weight: 600;">Representante / Teléfono:</td>
            <td style="padding: 4px 0; color: #111827;">${invoice.contact}</td>
          </tr>` : ''}
        </table>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
        <thead>
          <tr style="background: #22c55e; color: #fff;">
            <th style="padding: 12px 10px; text-align: left; font-weight: 600; border-top-left-radius: 6px; border-bottom-left-radius: 6px; width: 120px;">CANTIDAD</th>
            <th style="padding: 12px 10px; text-align: left; font-weight: 600;">DESCRIPCIÓN</th>
            <th style="padding: 12px 10px; text-align: right; font-weight: 600; width: 150px;">PRECIO UNITARIO</th>
            <th style="padding: 12px 10px; text-align: right; font-weight: 600; border-top-right-radius: 6px; border-bottom-right-radius: 6px; width: 150px;">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
        <div style="width: 350px; background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; text-align: left; color: #4b5563;">Subtotal:</td>
              <td style="padding: 6px 0; text-align: right; color: #111827; font-weight: 600;">${formatMoney(invoice.subtotal)}</td>
            </tr>
            ${invoice.iscAmount > 0 ? `
            <tr>
              <td style="padding: 6px 0; text-align: left; color: #4b5563;">ISC (${invoice.iscRate || 0}%):</td>
              <td style="padding: 6px 0; text-align: right; color: #111827; font-weight: 600;">+${formatMoney(invoice.iscAmount)}</td>
            </tr>
            ` : ''}
            ${invoice.taxAmount > 0 ? `
            <tr>
              <td style="padding: 6px 0; text-align: left; color: #4b5563;">ITBIS (${invoice.taxRate || 0}%):</td>
              <td style="padding: 6px 0; text-align: right; color: #111827; font-weight: 600;">+${formatMoney(invoice.taxAmount)}</td>
            </tr>
            ` : ''}
            ${invoice.retIsrAmount > 0 ? `
            <tr>
              <td style="padding: 6px 0; text-align: left; color: #dc2626;">Retención ISR (${invoice.retIsrRate || 0}%):</td>
              <td style="padding: 6px 0; text-align: right; color: #dc2626; font-weight: 600;">-${formatMoney(invoice.retIsrAmount)}</td>
            </tr>
            ` : ''}
            ${invoice.retItbisAmount > 0 ? `
            <tr>
              <td style="padding: 6px 0; text-align: left; color: #dc2626;">Retención ITBIS (${invoice.retItbisRate || 0}%):</td>
              <td style="padding: 6px 0; text-align: right; color: #dc2626; font-weight: 600;">-${formatMoney(invoice.retItbisAmount)}</td>
            </tr>
            ` : ''}
            <tr style="border-top: 1.5px solid #e5e7eb;">
              <td style="padding: 10px 0 0 0; text-align: left; font-size: 18px; font-weight: 700; color: #111827;">TOTAL:</td>
              <td style="padding: 10px 0 0 0; text-align: right; font-size: 20px; font-weight: 700; color: #15803d;">${formatMoney(invoice.total)}</td>
            </tr>
          </table>
        </div>
      </div>

      ${invoice.notes ? `
      <div style="margin-top: 30px; font-size: 13px; color: #4b5563; border-top: 1px solid #e5e7eb; padding-top: 12px; line-height: 1.5;">
        <strong style="color: #1f2937; display: block; margin-bottom: 4px;">Notas / Condiciones:</strong>
        ${invoice.notes}
      </div>
      ` : ''}
    </div>
  `;

  const opt = {
    margin:       10,
    filename:     `Factura_${invoice.id}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, windowWidth: 1000, scrollX: 0, scrollY: 0 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
  };

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '1000px';
  container.style.height = '0';
  container.style.overflow = 'hidden';
  container.style.zIndex = '-9999';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);

  const wrapper = document.createElement('div');
  wrapper.style.width = '1000px';
  wrapper.style.background = '#fff';
  wrapper.innerHTML = htmlContent;
  container.appendChild(wrapper);
  
  html2pdf().set(opt).from(wrapper).output('datauristring').then(async function (pdfBase64) {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }

    if (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform()) {
      try {
        // Remover el encabezado de data URI
        const base64Data = pdfBase64.split(',')[1];
        const fileName = `Factura_${invoice.id}.pdf`;
        
        // Guardar el archivo físicamente en la carpeta de Documentos usando el plugin nativo
        const result = await Capacitor.Plugins.Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Capacitor.Plugins.Filesystem.Directory.Documents
        });
        
        // Abrir el menú de Compartir nativo
        await Capacitor.Plugins.Share.share({
          title: 'Factura',
          text: 'Adjunto factura generada.',
          url: result.uri,
          dialogTitle: 'Compartir Factura'
        });
        showToast('📄 Factura lista', 'success');
      } catch (err) {
        console.error('Error guardando PDF en Android', err);
        showToast('❌ Error guardando el PDF en tu móvil', 'error');
      }
    } else {
      // Descarga tradicional en navegador (PC / Web)
      const link = document.createElement('a');
      link.href = pdfBase64;
      link.download = opt.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('📄 PDF generado correctamente', 'success');
    }
  }).catch(err => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    console.error('PDF error', err);
    showToast('❌ Error al generar PDF', 'error');
  });
}

function handleNcfTypeChange(type) {
  const ncfType = document.getElementById(`fac-ncf-type-${type}`).value;
  const taxInput = document.getElementById(`fac-tax-${type}`);
  const ncfInput = document.getElementById(`fac-ncf-${type}`);
  
  if (ncfType === 'B01') {
    taxInput.value = '18';
    if (!ncfInput.value) ncfInput.value = 'B01';
  } else if (ncfType === 'B14') {
    taxInput.value = '0';
    if (!ncfInput.value) ncfInput.value = 'B14';
  } else if (ncfType === 'B02') {
    if (!ncfInput.value) ncfInput.value = 'B02';
  } else if (ncfType === 'B15') {
    if (!ncfInput.value) ncfInput.value = 'B15';
  }
  
  calcFacTotals(type);
}

async function autoFillInvoiceDGII(type) {
  const nitInput = document.getElementById(`fac-nit-${type}`);
  if (!nitInput) return;
  const val = nitInput.value.trim();
  if (!val) {
    showToast('Ingresa un RNC o Cédula primero', 'warning');
    return;
  }
  const data = await fetchDGIIData(val);
  if (data) {
    // Si se buscó por nombre y la API devolvió el RNC resolved, lo actualizamos
    if (data.rnc) {
      nitInput.value = data.rnc;
    }
    
    document.getElementById(`fac-name-${type}`).value = data.name;
    const addrEl = document.getElementById(`fac-address-${type}`);
    const contactEl = document.getElementById(`fac-contact-${type}`);
    
    // Intentar buscar localmente en clientes guardados para halar dirección y teléfono/contacto
    const clients = JSON.parse(localStorage.getItem(userKey('recim_clients')) || '[]');
    const rncToFind = (data.rnc || val).replace(/\D/g, '');
    const localClient = clients.find(c => c.nit && c.nit.replace(/\D/g, '') === rncToFind);
    
    if (localClient) {
      if (addrEl) addrEl.value = localClient.address || '';
      if (contactEl) contactEl.value = localClient.contact || localClient.phone || '';
      showToast('✅ RNC verificado. Datos de dirección y teléfono cargados de la base de datos local.', 'success');
    } else {
      if (addrEl) addrEl.value = data.address || '';
      if (contactEl) contactEl.value = ''; // limpiar si no hay datos locales
    }
  }
}

// =============================================
// SHARED: Invoice storage
// =============================================
function saveInvoice(invoice) {
  const invoices = getAllInvoices();
  invoices.unshift(invoice);
  localStorage.setItem(userKey('recim_invoices'), JSON.stringify(invoices));
}

function getAllInvoices() {
  return JSON.parse(localStorage.getItem(userKey('recim_invoices')) || '[]');
}

// =============================================
// RENDER FACTURACIÓN PAGE
// =============================================
function renderInvoicesPage(container, initialTab = 'local') {
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="section-title">${t('inv.title')}</h2>
        <p class="section-subtitle">${t('inv.subtitle')}</p>
      </div>
    </div>

    <div class="invoice-tabs">
      <button class="invoice-tab fac-tab ${initialTab === 'local' ? 'active' : ''}" id="fac-tab-btn-local" onclick="switchFacturacionTab('local')">
        ${t('inv.tab_local')}
      </button>
      <button class="invoice-tab fac-tab ${initialTab === 'empresa' ? 'active' : ''}" id="fac-tab-btn-empresa" onclick="switchFacturacionTab('empresa')">
        ${t('inv.tab_biz')}
      </button>
    </div>

    <div id="fac-tab-local" class="invoice-tab-content fac-tab-content ${initialTab === 'local' ? 'active' : ''}"></div>
    <div id="fac-tab-empresa" class="invoice-tab-content fac-tab-content ${initialTab === 'empresa' ? 'active' : ''}"></div>
  `;

  initFacturaForm('local');
  initFacturaForm('empresa');
}
