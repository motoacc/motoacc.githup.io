// ============================================================
// Moto Addict Finance - App Configuration
// ค่าจะถูกโหลดจาก localStorage อัตโนมัติ หลังตั้งค่าผ่าน setup.html
// ============================================================

(function () {
  const _saved = JSON.parse(localStorage.getItem('motoFinanceConfig') || '{}');
  window.CONFIG = {
    API_URL:       _saved.apiUrl || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    TOKEN:         _saved.token  || 'MOTO_ADDICT_2024_SECRET',
    SHEET_ID:      _saved.sheetId || '',
    SAVED_AT:      _saved.savedAt || null,
    isConfigured:  !!((_saved.apiUrl || '').includes('script.google.com') && _saved.token),
    BRANCHES:      ['หาดใหญ่', 'ภูเก็ต', 'สุราษฎร์ธานี'],
    LOCALE:        'th-TH',
    TIMEZONE:      'Asia/Bangkok'
  };
})();

// ─── API Helper ────────────────────────────────────────────
async function apiGet(action, params = {}) {
  const url = new URL(CONFIG.API_URL);
  url.searchParams.set('token', CONFIG.TOKEN);
  url.searchParams.set('action', action);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  return res.json();
}

async function apiPost(action, body = {}) {
  const res = await fetch(CONFIG.API_URL + '?token=' + CONFIG.TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ ...body, action, token: CONFIG.TOKEN })
  });
  return res.json();
}

// ─── Format Helpers ────────────────────────────────────────
function fmtMoney(n) {
  return Number(n || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
}

function fmtDateInput(str) {
  if (!str) return '';
  return str.slice(0, 10); // yyyy-MM-dd for input[type=date]
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7); // yyyy-MM
}

function showAlert(msg, type = 'success') {
  const el = document.getElementById('alert');
  if (!el) return;
  el.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all ${
    type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  }`;
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 4000);
}

function showLoading(show) {
  const el = document.getElementById('loading');
  if (el) el.classList.toggle('hidden', !show);
}
