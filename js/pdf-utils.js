/* =============================================
   PDF-UTILS.JS – Generación de PDF Global
   ============================================= */

async function downloadInvoicePDF(invoice) {
    if (!invoice) return;

    // 1. Crear contenedor temporal oculto
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.className = 'pdf-export-container';
    document.body.appendChild(tempDiv);

    // 2. Renderizar contenido (igual que en history.js)
    const isBasica = invoice.type === 'basica';

    const itemRows = isBasica
        ? (invoice.items || []).map(item => `
        <tr>
          <td>${item.icon || '📦'} ${item.name}</td>
          <td>${item.qty} ${item.unit}</td>
          <td>${formatMoney(item.priceBuy || 0)}</td>
          <td><b>${formatMoney(item.totalCompra || 0)}</b></td>
        </tr>`).join('')
        : (invoice.items || []).map(item => `
        <tr>
          <td>${item.desc}</td>
          <td>${item.qty}</td>
          <td>${formatMoney(item.uprice)}</td>
          <td><b>${formatMoney(item.subtotal)}</b></td>
        </tr>`).join('');

    const detailRows = isBasica ? `
    <p><b>Cliente:</b> ${invoice.client || '—'}</p>
  ` : `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom:12px;">
      <p><b>Empresa:</b> ${invoice.company || '—'}</p>
      <p><b>RNC/Comprobante:</b> ${invoice.nit || '—'}</p>
      <p><b>Contacto:</b> ${invoice.contact || '—'}</p>
      <p><b>Dirección:</b> ${invoice.address || '—'}</p>
    </div>`;

    const totalsSection = isBasica ? `
    <div class="invoice-summary" style="margin-top:12px;">
      <div class="invoice-summary-row">
        <span class="invoice-summary-label">Total Compra</span>
        <span class="invoice-summary-value" style="color:#f87171;">-${formatMoney(invoice.totalCompra)}</span>
      </div>
      <div class="invoice-summary-row total">
        <span class="invoice-summary-label">Balance Neto</span>
        <span class="invoice-summary-value" style="color:${invoice.balance >= 0 ? '#3b82f6' : '#f87171'}">${formatMoney(invoice.balance)}</span>
      </div>
    </div>` : `
    <div class="invoice-summary" style="margin-top:12px;">
      <div class="invoice-summary-row">
        <span>Subtotal</span>
        <span>${formatMoney(invoice.subtotal)}</span>
      </div>
      <div class="invoice-summary-row">
        <span>ITBIS (${invoice.taxRate}%)</span>
        <span>${formatMoney(invoice.taxAmount)}</span>
      </div>
      <div class="invoice-summary-row total">
        <span>TOTAL</span>
        <span>${formatMoney(invoice.total)}</span>
      </div>
    </div>`;

    tempDiv.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; color: #1e293b; background: white;">
      <div style="text-align:center; padding-bottom:20px; border-bottom:2px solid #3b82f6; margin-bottom:20px;">
         <h1 style="color:#3b82f6; margin:0;">RECIMINSA</h1>
         <p style="margin:5px 0;">Gestión de Materiales Reciclables</p>
         <h2 style="margin:15px 0 5px 0;">FACTURA ${invoice.typeName.toUpperCase()}</h2>
         <p>ID: ${invoice.id} | Fecha: ${invoice.date}</p>
      </div>
      ${detailRows}
      <div style="margin-top:10px;">
        <table style="width:100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <th style="text-align:left; padding:10px;">Descripción</th>
              <th style="padding:10px;">Cant.</th>
              <th style="padding:10px;">P.Unit</th>
              <th style="text-align:right; padding:10px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows.replace(/<tr>/g, '<tr style="border-bottom: 1px solid #f1f5f9;">').replace(/<td>/g, '<td style="padding:10px;">').replace(/<td style="padding:10px;"><b>/g, '<td style="padding:10px; text-align:right; font-weight:bold;">')}
          </tbody>
        </table>
      </div>
      ${totalsSection.replace(/class="invoice-summary"/g, 'style="border-top: 2px solid #e2e8f0; padding-top:10px;"').replace(/class="invoice-summary-row"/g, 'style="display:flex; justify-content:space-between; padding:5px 0;"').replace(/class="invoice-summary-row total"/g, 'style="display:flex; justify-content:space-between; padding:10px 0; font-size:1.2rem; font-weight:bold; color:#3b82f6;"')}
      ${invoice.notes ? `<div style="margin-top:20px; padding:10px; background:#f8fafc; border-radius:4px; font-size:0.85rem;">📝 <b>Notas:</b> ${invoice.notes}</div>` : ''}
    </div>
  `;

    // 3. Generar PDF
    const opt = {
        margin: [10, 10],
        filename: `Factura_${invoice.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        showToast('Generando PDF...', 'info');
        await html2pdf().set(opt).from(tempDiv).save();
        showToast('PDF Descargado', 'success');
    } catch (err) {
        console.error('PDF Error:', err);
        showToast('Error al generar PDF', 'error');
    } finally {
        document.body.removeChild(tempDiv);
    }
}
