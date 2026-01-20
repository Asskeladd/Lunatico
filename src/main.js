import './styles/global.css'
import { initRouter } from './utils/router.js'
import { getCurrentUser } from './utils/auth.js'

document.querySelector('#app').innerHTML = `
  <aside class="app-sidebar">
    <div style="padding: 1.5rem;">
      <h2 style="font-weight: 700; font-size: 1.25rem;">Taller<span style="color: var(--color-accent-400)">Zambrano</span></h2>
    </div>
    <nav style="padding: 0 1rem; margin-top: 1rem;">
      <ul style="display: flex; flex-direction: column; gap: 0.5rem;">
        <li><a href="#" class="nav-item" data-route="dashboard" style="display: block; padding: 0.75rem; border-radius: var(--radius-sm); background-color: rgba(255,255,255,0.1);">Panel Principal</a></li>
        <li><a href="#" class="nav-item" data-route="orders" style="display: block; padding: 0.75rem; border-radius: var(--radius-sm); color: var(--color-primary-400);">Órdenes de Trabajo</a></li>
        <li><a href="#" class="nav-item" data-route="tracking" style="display: block; padding: 0.75rem; border-radius: var(--radius-sm); color: var(--color-primary-400);">Seguimiento</a></li>
        <li><a href="#" class="nav-item" data-route="reports" style="display: block; padding: 0.75rem; border-radius: var(--radius-sm); color: var(--color-primary-400);">Reportes</a></li>
      </ul>
    </nav>
  </aside>
  <main class="app-main">
    <header class="app-header">
      <h3 id="page-title" style="font-weight: 600;">Panel Principal</h3>
      <div style="display: flex; align-items: center; gap: 1rem;">
         <div id="user-info" style="display: flex; align-items: center; gap: 1rem;">
            <!-- Injected via JS -->
         </div>
      </div>
    </header>
    <div id="content-area" class="app-content">
      <!-- Content will be injected by router -->
    </div>
  </main>
`

const user = getCurrentUser();
if (user) {
  const userInfo = document.getElementById('user-info');
  userInfo.innerHTML = `
         <span style="font-size: 0.875rem; color: var(--text-muted);">${user.role === 'admin' ? 'Administrador' : 'Operador'}: <strong>${user.name}</strong></span>
         <div style="width: 32px; height: 32px; background: var(--color-accent-100); color: var(--color-accent-600); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
            ${user.name.charAt(0)}
         </div>
         <button class="nav-item" data-route="logout" style="margin-left: 1rem; color: var(--color-danger); font-size: 0.875rem; font-weight: 500; background: none; border: none; cursor: pointer;">Salir</button>
    `;
}

initRouter();
