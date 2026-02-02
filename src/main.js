import './styles/global.css'
import { initRouter } from './utils/router.js'
import { getCurrentUser, logout } from './utils/auth.js'
import { renderLogin } from './components/login.js'

// Check authentication first
const user = getCurrentUser();

if (!user) {
  // No user, show login directly
  document.querySelector('#app').appendChild(renderLogin());
} else {
  // Render main app layout with modern sidebar and topbar
  const menuItems = [
    { icon: '📊', label: 'Dashboard', route: 'dashboard' },
    { icon: '📦', label: 'Órdenes', route: 'orders' },
    { icon: '👥', label: 'Clientes', route: 'clientes' },
    { icon: '🔧', label: 'Máquinas', route: 'tracking' },
    { icon: '📦', label: 'Materiales', route: 'materiales' },
    ...(user.role === 'admin' ? [{ icon: '👷', label: 'Operarios', route: 'operators' }] : []),
    { icon: '📈', label: 'Reportes', route: 'reports' }
  ];

  document.querySelector('#app').innerHTML = `
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar__header">
                <h2>Taller<span class="highlight">Zambrano</span></h2>
            </div>
            <nav class="sidebar__nav">
                ${menuItems.map(item => `
                    <a href="#${item.route}" 
                       class="sidebar__item" 
                       data-route="${item.route}">
                        <span class="sidebar__icon">${item.icon}</span>
                        <span class="sidebar__label">${item.label}</span>
                    </a>
                `).join('')}
            </nav>
        </aside>

        <!-- Main Content Area -->
        <div class="main-content">
            <!-- Topbar -->
            <div class="topbar">
                <h1 class="topbar__title" id="page-title">Dashboard</h1>
                <div class="topbar__actions">
                    <div class="notification-badge">
                        <span style="font-size: 1.25rem;">🔔</span>
                        <span class="notification-badge__count">3</span>
                    </div>
                    
                    <div class="topbar__user" id="user-dropdown-trigger">
                        <div>
                            <div class="topbar__user-name">${user.name}</div>
                            <div class="topbar__user-role">${user.role === 'admin' ? 'Administrador' : 'Operador'}</div>
                        </div>
                        <div class="topbar__avatar" id="user-avatar">
                            ${user.avatar ? `<img src="${user.avatar}" style="width: 100%; height: 100%; object-fit: cover;" />` : user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Area -->
            <div id="content-area">
                <!-- Dynamic content loaded here -->
            </div>
        </div>

        <!-- Profile Modal (hidden by default) -->
        <div id="profile-modal" style="display: none;"></div>
    `;

  // Setup user dropdown
  setupUserDropdown(user);

  // Initialize router
  initRouter();

  // Update active nav item
  window.addEventListener('hashchange', updateActiveNav);
  updateActiveNav();
}

function updateActiveNav() {
  const route = window.location.hash.slice(1) || 'dashboard';

  // Update page title
  const titles = {
    dashboard: 'Dashboard',
    orders: 'Órdenes de Trabajo',
    clientes: 'Gestión de Clientes',
    tracking: 'Seguimiento de Máquinas',
    materiales: 'Gestión de Materiales',
    operators: 'Gestión de Operarios',
    reports: 'Reportes de Productividad'
  };

  const titleEl = document.getElementById('page-title');
  if (titleEl) {
    titleEl.textContent = titles[route] || 'Dashboard';
  }

  // Update active nav item
  document.querySelectorAll('.sidebar__item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.route === route) {
      item.classList.add('active');
    }
  });
}

function setupUserDropdown(user) {
  const trigger = document.getElementById('user-dropdown-trigger');
  const modal = document.getElementById('profile-modal');
  const avatar = document.getElementById('user-avatar');

  if (!trigger || !modal) return;

  // Click avatar to open profile modal
  trigger.addEventListener('click', () => showProfileModal(user, modal, avatar));
}

function showProfileModal(user, modal, avatar) {
  modal.style.display = 'flex';
  modal.className = 'modal-backdrop';

  modal.innerHTML = `
        <div class="modal" onclick="event.stopPropagation()">
            <div class="modal__header">
                <h3 class="modal__title">Mi Perfil</h3>
                <button class="modal__close" onclick="document.getElementById('profile-modal').style.display='none'">×</button>
            </div>
            
            <div style="text-align: center; margin-bottom: var(--space-lg);">
                <div style="width: 80px; height: 80px; margin: 0 auto var(--space-md); background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    ${user.avatar ? `<img src="${user.avatar}" style="width: 100%; height: 100%; object-fit: cover;" />` : `<span style="font-size: 2rem; color: white; font-weight: 700;">${user.name.charAt(0)}</span>`}
                </div>
                <h4>${user.name}</h4>
                <p style="color: var(--text-muted); font-size: 0.875rem;">${user.role === 'admin' ? 'Administrador' : 'Operador'}</p>
            </div>
            
            <form id="profile-form">
                <div class="form-group">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-input" name="name" value="${user.name}" />
                </div>
                
                <div class="form-group">
                    <label class="form-label">Nueva Contraseña (opcional)</label>
                    <input type="password" class="form-input" name="password" placeholder="Dejar vacío para no cambiar" />
                </div>
                
                <div class="form-group">
                    <label class="form-label">Avatar (URL de imagen)</label>
                    <input type="text" class="form-input" name="avatar" value="${user.avatar || ''}" placeholder="https://..." />
                </div>
                
                <div style="display: flex; gap: var(--space-md); margin-top: var(--space-xl);">
                    <button type="submit" class="btn btn-primary" style="flex: 1;">Guardar Cambios</button>
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('profile-modal').style.display='none'">Cancelar</button>
                    <button type="button" class="btn btn-secondary" onclick="handleLogout()" style="background: var(--color-danger); color: white;">Cerrar Sesión</button>
                </div>
            </form>
        </div>
    `;

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Handle form submission
  const form = modal.querySelector('#profile-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const updates = {
      name: formData.get('name'),
      avatar: formData.get('avatar') || null
    };

    if (formData.get('password')) {
      updates.password = formData.get('password');
    }

    try {
      const { authApi } = await import('./utils/api.js');
      const { updateCurrentUser } = await import('./utils/auth.js');

      await authApi.updateProfile(updates);
      updateCurrentUser(updates);

      // Update avatar in topbar
      if (updates.avatar) {
        avatar.innerHTML = `<img src="${updates.avatar}" style="width: 100%; height: 100%; object-fit: cover;" />`;
      } else {
        avatar.textContent = updates.name.charAt(0).toUpperCase();
      }

      alert('Perfil actualizado correctamente');
      modal.style.display = 'none';

      window.location.reload();
    } catch (error) {
      alert('Error al actualizar perfil: ' + error.message);
    }
  });
}

// Global function for logout
window.handleLogout = () => {
  logout();
  window.location.reload();
};
