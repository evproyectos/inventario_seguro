document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  hideAlert('error-msg');

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const btn = document.getElementById('btn-login');

  btn.disabled = true;
  btn.textContent = 'Ingresando...';

  const { ok, data } = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  if (ok) {
    sessionStorage.setItem('user', JSON.stringify(data.usuario));
    window.location.href = '/dashboard.html';
  } else {
    showError('error-msg', data.error || 'Error al iniciar sesión.');
    btn.disabled = false;
    btn.textContent = 'Iniciar sesión';
  }
});