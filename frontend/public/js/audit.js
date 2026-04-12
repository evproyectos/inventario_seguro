const user = requireAuth();
const puedeEditar = user && (user.rol === 'SuperAdmin' || user.rol === 'Registrador');

if (user?.rol !== 'SuperAdmin') {
  window.location.href = '/dashboard.html';
}

async function cargarAudit() {
  const { ok, data } = await apiFetch('/audit');
  const tbody = document.getElementById('tbody-audit');
  tbody.innerHTML = '';

  if (!ok) return;

  data.forEach(log => {
    const tr = document.createElement('tr');
    const fecha = new Date(log.created_at).toLocaleString('es-CR');
    const badgeClass = log.resultado === 'OK' ? 'badge-success'
      : log.resultado === 'DENEGADO' || log.resultado === 'FALLIDO' ? 'badge-error'
      : 'badge-warning';

    tr.innerHTML = `
      <td>${escapeHtml(fecha)}</td>
      <td>${escapeHtml(log.username)}</td>
      <td>${escapeHtml(log.accion)}</td>
      <td>${escapeHtml(log.entidad)}</td>
      <td>${escapeHtml(log.detalle)}</td>
      <td>${escapeHtml(log.ip)}</td>
      <td><span class="badge ${badgeClass}">${escapeHtml(log.resultado)}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

cargarAudit();