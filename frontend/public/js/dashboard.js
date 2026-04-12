document.addEventListener('DOMContentLoaded', () => {
  const user = requireAuth();
  if (user) {
    document.getElementById('nombre-usuario').textContent = escapeHtml(user.username);
    console.log('Usuario autenticado:', user);
    const badge = document.getElementById('rol-usuario');
    badge.textContent = escapeHtml(user.rol);
    badge.className = 'badge';

    if (user.rol === 'SuperAdmin') {
      document.getElementById('link-audit')?.classList.remove('hidden');
    }
  }
});