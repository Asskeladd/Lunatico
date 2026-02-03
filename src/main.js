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
  // SVG Icons (Heroicons style)
  const icons = {
    dashboard: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>`,
    orders: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>`,
    clients: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>`,
    machines: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.212 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
    materials: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>`,
    operators: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" /></svg>`,
    reports: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>`,
    bell: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>`
  };

  const menuItems = [
    { icon: icons.dashboard, label: 'Panel Principal', route: 'dashboard', roles: ['admin'] },
    { icon: icons.orders, label: 'Órdenes', route: 'orders', roles: ['admin', 'operator'] },
    { icon: icons.clients, label: 'Clientes', route: 'clientes', roles: ['admin'] },
    { icon: icons.machines, label: 'Máquinas', route: 'tracking', roles: ['admin', 'operator'] },
    { icon: icons.materials, label: 'Materiales', route: 'materiales', roles: ['admin', 'operator'] },
    { icon: icons.operators, label: 'Operarios', route: 'operators', roles: ['admin'] },
    { icon: icons.reports, label: 'Reportes', route: 'reports', roles: ['admin'] }
  ].filter(item => item.roles.includes(user.role));

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
                <h1 class="topbar__title" id="page-title">Panel Principal</h1>
                <div class="topbar__actions">
                    <div class="notification-badge">
                        <span style="font-size: 1.25rem; display: flex;">${icons.bell}</span>
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
    dashboard: 'Panel Principal',
    orders: 'Órdenes de Trabajo',
    clientes: 'Gestión de Clientes',
    tracking: 'Seguimiento de Máquinas',
    materiales: 'Gestión de Materiales',
    operators: 'Gestión de Operarios',
    reports: 'Reportes de Productividad'
  };

  const titleEl = document.getElementById('page-title');
  if (titleEl) {
    titleEl.textContent = titles[route] || 'Panel Principal';
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
  // modal-backdrop class handles the styling in layout.css
  modal.className = 'modal-backdrop';

  // Use the .modal class from layout.css which has the animation and styling
  modal.innerHTML = `
        <div class="modal" onclick="event.stopPropagation()">
            <div class="modal__header">
                <h3 class="modal__title">Mi Perfil</h3>
                <button class="modal__close" onclick="document.getElementById('profile-modal').style.display='none'">×</button>
            </div>
            
            <div class="text-center mb-3">
                <div style="width: 80px; height: 80px; margin: 0 auto var(--space-md); background: var(--color-primary-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px solid white; box-shadow: var(--shadow-sm);">
                    ${user.avatar ? `<img src="${user.avatar}" style="width: 100%; height: 100%; object-fit: cover;" />` : `<span style="font-size: 2rem; color: var(--color-primary-700); font-weight: 700;">${user.name.charAt(0)}</span>`}
                </div>
                <h4 style="color: var(--text-primary); margin-bottom: 0;">${user.name}</h4>
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
                    <button type="button" class="btn btn-danger" onclick="handleLogout()" style="background-color: var(--color-danger); border-color: var(--color-danger); color: white;">Cerrar Sesión</button>
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
