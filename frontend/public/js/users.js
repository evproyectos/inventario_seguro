const user = requireAuth();
const puedeEditar = user && user.rol === 'SuperAdmin';

if (puedeEditar) {
  document.getElementById('btn-nuevo').style.display = 'inline-block';
  document.getElementById('col-acciones').style.display = '';
}

async function cargarUsuarios() {
  const { ok, data } = await apiFetch('/users');
  const tbody = document.getElementById('tbody-usuarios');
  tbody.innerHTML = '';

  if (!ok) { showError('error-msg', data.error); return; }

  data.forEach(u => {
    const tr = document.createElement('tr');
    const ultimoLogin = u.ultimo_login
      ? new Date(u.ultimo_login).toLocaleString('es-CR')
      : 'Nunca';
    tr.innerHTML = `
      <td>${escapeHtml(u.username)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td><span class="badge">${escapeHtml(u.role?.nombre)}</span></td>
      <td>${escapeHtml(ultimoLogin)}</td>
      ${puedeEditar ? `<td>
        <button class="btn btn-outline" onclick="editar(${u.id})">Editar</button>
        <button class="btn btn-danger" onclick="eliminar(${u.id})">Eliminar</button>
      </td>` : ''}
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('btn-nuevo').addEventListener('click', () => {
  document.getElementById('form-titulo').textContent = 'Nuevo usuario';
  document.getElementById('usuario-form').reset();
  document.getElementById('usuario-id').value = '';
  document.getElementById('grupo-username').style.display = '';
  document.getElementById('form-usuario').classList.remove('hidden');
});

document.getElementById('btn-cancelar').addEventListener('click', () => {
  document.getElementById('form-usuario').classList.add('hidden');
});

document.getElementById('usuario-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  hideAlert('error-msg');

  const id = document.getElementById('usuario-id').value;
  const body = {
    email:    document.getElementById('email').value.trim(),
    password: document.getElementById('password').value,
    role_id:  parseInt(document.getElementById('role_id').value),
  };

  if (!id) body.username = document.getElementById('username').value.trim();

  const { ok, data } = id
    ? await apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) })
    : await apiFetch('/users', { method: 'POST', body: JSON.stringify(body) });

  if (ok) {
    document.getElementById('form-usuario').classList.add('hidden');
    showSuccess('success-msg', id ? 'Usuario actualizado.' : 'Usuario creado.');
    cargarUsuarios();
  } else {
    showError('error-msg', data.error || JSON.stringify(data.errores));
  }
});

async function editar(id) {
  const { ok, data } = await apiFetch(`/users/${id}`);
  if (!ok) return;
  document.getElementById('form-titulo').textContent = 'Editar usuario';
  document.getElementById('usuario-id').value = data.id;
  document.getElementById('email').value = data.email;
  document.getElementById('password').value = '';
  document.getElementById('role_id').value = data.role_id;
  document.getElementById('grupo-username').style.display = 'none';
  document.getElementById('form-usuario').classList.remove('hidden');
}

async function eliminar(id) {
  if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
  const { ok, data } = await apiFetch(`/users/${id}`, { method: 'DELETE' });
  if (ok) { showSuccess('success-msg', 'Usuario eliminado.'); cargarUsuarios(); }
  else showError('error-msg', data.error);
}

cargarUsuarios();