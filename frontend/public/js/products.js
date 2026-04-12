const user = requireAuth();
const puedeEditar = user && (user.rol === 'SuperAdmin' || user.rol === 'Registrador');

if (puedeEditar) {
  document.getElementById('btn-nuevo').style.display = 'inline-block';
  document.getElementById('col-acciones').style.display = '';
}

async function cargarProductos() {
  const { ok, data } = await apiFetch('/products');
  const tbody = document.getElementById('tbody-productos');
  tbody.innerHTML = '';

  if (!ok) { showError('error-msg', data.error); return; }

  data.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(p.codigo)}</td>
      <td>${escapeHtml(p.nombre)}</td>
      <td>${escapeHtml(p.descripcion)}</td>
      <td>${escapeHtml(String(p.cantidad))}</td>
      <td>$${escapeHtml(String(p.precio))}</td>
      ${puedeEditar ? `<td>
        <button class="btn btn-outline" onclick="editar(${p.id})">Editar</button>
        <button class="btn btn-danger" onclick="eliminar(${p.id})">Eliminar</button>
      </td>` : ''}
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('btn-nuevo').addEventListener('click', () => {
  document.getElementById('form-titulo').textContent = 'Nuevo producto';
  document.getElementById('producto-form').reset();
  document.getElementById('producto-id').value = '';
  document.getElementById('form-producto').classList.remove('hidden');
});

document.getElementById('btn-cancelar').addEventListener('click', () => {
  document.getElementById('form-producto').classList.add('hidden');
});

document.getElementById('producto-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  hideAlert('error-msg');

  const id = document.getElementById('producto-id').value;
  const body = {
    codigo:      document.getElementById('codigo').value.trim(),
    nombre:      document.getElementById('nombre').value.trim(),
    descripcion: document.getElementById('descripcion').value.trim(),
    cantidad:    parseInt(document.getElementById('cantidad').value),
    precio:      parseFloat(document.getElementById('precio').value),
  };

  const { ok, data } = id
    ? await apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) })
    : await apiFetch('/products', { method: 'POST', body: JSON.stringify(body) });

  if (ok) {
    document.getElementById('form-producto').classList.add('hidden');
    showSuccess('success-msg', id ? 'Producto actualizado.' : 'Producto creado.');
    cargarProductos();
  } else {
    showError('error-msg', data.error || JSON.stringify(data.errores));
  }
});

async function editar(id) {
  const { ok, data } = await apiFetch(`/products/${id}`);
  if (!ok) return;
  document.getElementById('form-titulo').textContent = 'Editar producto';
  document.getElementById('producto-id').value = data.id;
  document.getElementById('codigo').value = data.codigo;
  document.getElementById('nombre').value = data.nombre;
  document.getElementById('descripcion').value = data.descripcion || '';
  document.getElementById('cantidad').value = data.cantidad;
  document.getElementById('precio').value = data.precio;
  document.getElementById('form-producto').classList.remove('hidden');
}

async function eliminar(id) {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return;
  const { ok, data } = await apiFetch(`/products/${id}`, { method: 'DELETE' });
  if (ok) { showSuccess('success-msg', 'Producto eliminado.'); cargarProductos(); }
  else showError('error-msg', data.error);
}

cargarProductos();