/* =============================================
   HISTORY.JS – Historial de facturas
   ============================================= */

function renderHistoryPage(container) {
  const invoices = getAllInvoices();

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2 class="section-title">${t('hist.title')}</h2>
        <p class="section-subtitle">${t('hist.subtitle')}</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">${t('hist.total_inv')}</div>
        <div class="stat-value stat-value--blue">${invoices.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">${t('hist.basics')}</div>
        <div class="stat-value stat-value--green">${invoices.filter(i => i.type === 'basica').length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">${t('hist.business')}</div>
        <div class="stat-value stat-value--yellow">${invoices.filter(i => i.type === 'empresa').length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">${t('hist.total_val')}</div>
        <div class="stat-value stat-value--green">${formatMoney(invoices.reduce((s, i) => s + i.total, 0))}</div>
      </div>
    </div>

    <div class="history-filters">
      <select id="history-filter-type" class="form-select" style="width:auto;" onchange="filterHistory()">
        <option value="all">${t('hist.all_types')}</option>
        <option value="basica">${t('hist.only_basic')}</option>
        <option value="empresa">${t('hist.only_biz')}</option>
      </select>
      <input id="history-search" type="text" class="form-input" style="width:auto;min-width:200px;" placeholder="${t('hist.search')}" oninput="filterHistory()" />
      <button class="btn-secondary" onclick="clearHistory()">${t('hist.clear_all')}</button>
    </div>

    <div id="history-list">
      ${renderInvoiceCards(invoices)}
    </div>
  `;
}

function renderInvoiceCards(invoices) {
  if (invoices.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <p class="empty-state-text">${t('hist.no_inv')}<br>${t('hist.go_create')} <b>${t('nav.facturas')}</b>.</p>
      </div>`;
  }

  return invoices.map(inv => {
    const isBasica = inv.type === 'basica';
    const badge = isBasica
      ? `<span class="badge badge--green">${t('hist.basic_badge')}</span>`
      : `<span class="badge badge--yellow">${t('hist.biz_badge')}</span>`;
    const icon = isBasica ? '📦' : '🏢';

    const itemRows = isBasica
      ? (inv.items || []).map(item => `
          <tr>
            <td>${item.icon} ${item.name}</td>
            <td>${item.qty} ${item.unit}</td>
            <td>${formatMoney(item.price)}</td>
            <td><b>${formatMoney(item.subtotal)}</b></td>
          </tr>`).join('')
      : (inv.items || []).map(item => `
          <tr>
            <td>${item.desc}</td>
            <td>${item.qty}</td>
            <td>${formatMoney(item.uprice)}</td>
            <td><b>${formatMoney(item.subtotal)}</b></td>
          </tr>`).join('');

    const detailRows = isBasica ? `
      <p><b>${t('hist.client')}</b> ${inv.client || '—'}</p>
    ` : `
      <div class="form-row" style="margin-bottom:12px;">
        <p><b>${t('hist.company')}</b> ${inv.company || '—'}</p>
        <p><b>${t('hist.nit')}</b> ${inv.nit || '—'}</p>
        <p><b>${t('hist.contact')}</b> ${inv.contact || '—'}</p>
        <p><b>${t('hist.address')}</b> ${inv.address || '—'}</p>
      </div>`;

    const totalsSection = isBasica ? `
      <div class="invoice-summary" style="margin-top:12px;">
        ${inv.totalGanancia > 0 ? `
        <div class="invoice-summary-row">
          <span class="invoice-summary-label">${t('inv.gain')}</span>
          <span class="invoice-summary-value" style="color:var(--clr-primary-light);">+${formatMoney(inv.totalGanancia)}</span>
        </div>` : ''}
        ${inv.totalPerdida > 0 ? `
        <div class="invoice-summary-row">
          <span class="invoice-summary-label">${t('inv.loss')}</span>
          <span class="invoice-summary-value" style="color:#f87171;">-${formatMoney(inv.totalPerdida)}</span>
        </div>` : ''}
        <div class="invoice-summary-row total">
          <span class="invoice-summary-label">${t('lbl.total')}</span>
          <span class="invoice-summary-value">${formatMoney(inv.total)}</span>
        </div>
      </div>` : `
      <div class="invoice-summary" style="margin-top:12px;">
        <div class="invoice-summary-row">
          <span class="invoice-summary-label">${t('lbl.subtotal')}</span>
          <span class="invoice-summary-value">${formatMoney(inv.subtotal)}</span>
        </div>
        <div class="invoice-summary-row">
          <span class="invoice-summary-label">${t('inv.iva')} (${inv.taxRate}%)</span>
          <span class="invoice-summary-value">${formatMoney(inv.taxAmount)}</span>
        </div>
        <div class="invoice-summary-row total">
          <span class="invoice-summary-label">${t('lbl.total')}</span>
          <span class="invoice-summary-value">${formatMoney(inv.total)}</span>
        </div>
      </div>`;

    return `
    <div class="history-card" id="hcard-${inv.id}">
      <div class="history-card-header" onclick="toggleHistoryCard('${inv.id}')">
        <div class="history-card-icon">${icon}</div>
        <div class="history-card-info">
          <div class="history-card-title">${inv.id} &nbsp; ${badge}</div>
          <div class="history-card-meta">
            ${inv.client || inv.company || '—'} &bull; ${formatDate(inv.date)} &bull; ${t('hist.created')} ${formatDateTime(inv.createdAt)}
          </div>
        </div>
        <div class="history-card-total">${formatMoney(inv.total)}</div>
        <span class="history-card-chevron">▼</span>
      </div>
      <div class="history-card-body">
        ${detailRows}
        <div style="overflow-x:auto;margin-top:10px;">
          <table class="data-table">
            <thead><tr>
              <th>${t('hist.col_desc')}</th><th>${t('hist.col_qty')}</th><th>${t('hist.col_unit')}</th><th>${t('hist.col_total')}</th>
            </tr></thead>
            <tbody>${itemRows}</tbody>
          </table>
        </div>
        ${totalsSection}
        ${inv.notes ? `<p style="margin-top:12px;font-size:0.83rem;color:var(--clr-text-secondary);">📝 ${inv.notes}</p>` : ''}
        <div style="margin-top:14px;display:flex;justify-content:flex-end;">
          <button class="btn-danger" onclick="deleteInvoice('${inv.id}')">${t('hist.del_inv')}</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleHistoryCard(id) {
  const card = document.getElementById(`hcard-${id}`);
  if (card) card.classList.toggle('expanded');
}

function filterHistory() {
  const typeFilter = document.getElementById('history-filter-type')?.value || 'all';
  const searchQuery = (document.getElementById('history-search')?.value || '').toLowerCase().trim();
  let invoices = getAllInvoices();

  if (typeFilter !== 'all') invoices = invoices.filter(i => i.type === typeFilter);
  if (searchQuery) invoices = invoices.filter(i =>
    (i.id || '').toLowerCase().includes(searchQuery) ||
    (i.client || '').toLowerCase().includes(searchQuery) ||
    (i.company || '').toLowerCase().includes(searchQuery)
  );

  const list = document.getElementById('history-list');
  if (list) list.innerHTML = renderInvoiceCards(invoices);
}

function deleteInvoice(id) {
  if (!confirm(t('confirm.del_inv'))) return;
  const invoices = getAllInvoices().filter(i => i.id !== id);
  localStorage.setItem(userKey('recim_invoices'), JSON.stringify(invoices));
  showToast(t('toast.del_inv'), 'success');
  rerenderCurrentPage();
}

function clearHistory() {
  if (!confirm(t('confirm.clear_hist'))) return;
  localStorage.removeItem(userKey('recim_invoices'));
  showToast(t('toast.clear_hist'), 'success');
  rerenderCurrentPage();
}

// ---- Date formatters ----
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function formatDateTime(isoStr) {
  if (!isoStr) return '—';
  const lang = (getSettings().language) || 'es';
  const d = new Date(isoStr);
  return d.toLocaleDateString(lang, { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + d.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
}
