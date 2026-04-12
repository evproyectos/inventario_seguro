const user = requireAuth();
if (user) {
  document.getElementById('nombre-usuario').textContent = escapeHtml(user.username);
  const badge = document.getElementById('rol-usuario');
  badge.textContent = escapeHtml(user.rol);
  badge.className = 'badge';
}