const API = '/api';

function getUser() {
  const data = sessionStorage.getItem('user');
  return data ? JSON.parse(data) : null;
}

function requireAuth() {
  const user = getUser();
  if (!user) {
    window.location.href = '/login.html';
    return null;
  }
  return user;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}

function showSuccess(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3000);
}

function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

async function apiFetch(path, options = {}) {
  const res = await fetch(API + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

document.getElementById('btn-logout')?.addEventListener('click', async () => {
  await apiFetch('/auth/logout', { method: 'POST' });
  sessionStorage.clear();
  window.location.href = '/login.html';
});

function mostrarAuditLink() {
  const u = getUser();
  if (u?.rol === 'SuperAdmin') {
    document.getElementById('link-audit')?.classList.remove('hidden');
  }
}

mostrarAuditLink();

const INACTIVIDAD_MS = 5 * 60 * 1000;
let timerInactividad;

function resetearTimer() {
  clearTimeout(timerInactividad);
  timerInactividad = setTimeout(async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    sessionStorage.clear();
    alert('Sesión cerrada por inactividad.');
    window.location.href = '/login.html';
  }, INACTIVIDAD_MS);
}

const eventosActividad = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
eventosActividad.forEach(evento => {
  document.addEventListener(evento, resetearTimer, { passive: true });
});

if (getUser()) {
  resetearTimer();
}