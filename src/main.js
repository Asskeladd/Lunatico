import './styles/global.css'
import { initRouter } from './utils/router.js'
import { getCurrentUser, updateCurrentUser } from './utils/auth.js'

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

  if (user.role === 'admin') {
    const navList = document.querySelector('.app-sidebar nav ul');
    if (navList && !navList.querySelector('[data-route="operators"]')) {
      const li = document.createElement('li');
      li.innerHTML = '<a href="#" class="nav-item" data-route="operators" style="display: block; padding: 0.75rem; border-radius: var(--radius-sm); color: var(--color-primary-400);">Operadores</a>';

      const reportsItem = navList.querySelector('[data-route="reports"]')?.closest('li');
      if (reportsItem) {
        navList.insertBefore(li, reportsItem);
      } else {
        navList.appendChild(li);
      }
    }
  }

  // --- Profile Dropdown Logic ---
  const userInfoContainer = document.getElementById('user-info');

  // Clear existing content to allow full rebuild
  userInfoContainer.innerHTML = '';

  // Create Main Container for Profile
  const profileContainer = document.createElement('div');
  profileContainer.style.cssText = `
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 2rem;
      transition: background 0.2s;
  `;
  profileContainer.onmouseover = () => profileContainer.style.background = 'rgba(0,0,0,0.05)';
  profileContainer.onmouseout = () => profileContainer.style.background = 'transparent';

  // Name
  const nameSpan = document.createElement('span');
  nameSpan.style.cssText = 'font-size: 0.875rem; color: var(--text-muted); user-select: none;';
  nameSpan.innerHTML = `<strong>${user.name}</strong>`;

  // Avatar
  const avatarDiv = document.createElement('div');
  avatarDiv.style.cssText = `
      width: 40px; 
      height: 40px; 
      background: var(--color-accent-100); 
      color: var(--color-accent-600); 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-weight: bold;
      overflow: hidden;
      border: 2px solid var(--border-light);
  `;
  if (user.avatar) {
    avatarDiv.innerHTML = `<img src="${user.avatar}" style="width: 100%; height: 100%; object-fit: cover;">`;
  } else {
    avatarDiv.textContent = user.name.charAt(0);
  }

  profileContainer.appendChild(nameSpan);
  profileContainer.appendChild(avatarDiv);
  userInfoContainer.appendChild(profileContainer);

  // Dropdown Menu
  const dropdown = document.createElement('div');
  dropdown.id = 'user-dropdown';
  dropdown.style.cssText = `
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      width: 200px;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid var(--border-light);
      display: none;
      flex-direction: column;
      padding: 0.5rem;
      z-index: 100;
  `;

  dropdown.innerHTML = `
      <button id="menu-edit-profile" style="
          display: flex; align-items: center; gap: 0.75rem;
          width: 100%; padding: 0.75rem;
          background: none; border: none;
          text-align: left; cursor: pointer;
          border-radius: 0.25rem;
          color: var(--text-main);
          font-size: 0.875rem;
          transition: background 0.1s;
      " onmouseover="this.style.background='var(--bg-app)'" onmouseout="this.style.background='white'">
          <span>✏️</span> Editar Perfil
      </button>
      <div style="height: 1px; background: var(--border-light); margin: 0.25rem 0;"></div>
      <button id="menu-logout" style="
          display: flex; align-items: center; gap: 0.75rem;
          width: 100%; padding: 0.75rem;
          background: none; border: none;
          text-align: left; cursor: pointer;
          border-radius: 0.25rem;
          color: var(--color-danger);
          font-size: 0.875rem;
          transition: background 0.1s;
      " onmouseover="this.style.background='var(--color-danger)'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='var(--color-danger)'">
          <span>🚪</span> Cerrar sesión
      </button>
  `;

  userInfoContainer.style.position = 'relative'; // Anchor for absolute dropdown
  userInfoContainer.appendChild(dropdown);

  // Toggle Dropdown
  profileContainer.onclick = (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
  };

  // Close when clicking outside
  document.addEventListener('click', () => {
    dropdown.style.display = 'none';
  });

  dropdown.onclick = (e) => e.stopPropagation(); // Don't close when clicking inside dropdown logic (buttons handle actions)

  // LOGOUT Logic
  dropdown.querySelector('#menu-logout').onclick = () => {
    const btn = document.createElement('button');
    btn.dataset.route = 'logout'; // Reuse router logic or direct import
    document.body.appendChild(btn); // Virtual click or logic
    import('./utils/auth.js').then(auth => {
      auth.logout();
    });
  };



  // Create Modal
  const modal = document.createElement('div');
  modal.id = 'profile-modal';
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.5);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        backdrop-filter: blur(4px);
    `;

  modal.innerHTML = `
        <div class="card" style="width: 100%; max-width: 400px; padding: 2rem; position: relative;">
            <button id="close-profile-modal" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem;">Editar Perfil</h2>
            
            <form id="profile-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: center; margin-bottom: 1rem;">
                    <div id="profile-preview" style="
                        width: 80px; height: 80px; 
                        border-radius: 50%; 
                        background: var(--color-accent-100); 
                        display: flex; align-items: center; justify-content: center;
                        overflow: hidden;
                        border: 2px solid var(--color-accent-300);
                    ">
                        ${user.avatar ? `<img src="${user.avatar}" style="width: 100%; height: 100%; object-fit: cover;">` : `<span style="font-size: 2rem; color: var(--color-accent-600); font-weight: bold;">${user.name.charAt(0)}</span>`}
                    </div>
                    <label for="avatar-input" style="color: var(--color-accent-600); cursor: pointer; font-size: 0.875rem; text-decoration: underline;">Cambiar Foto</label>
                    <input type="file" id="avatar-input" accept="image/*" style="display: none;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                     <label style="font-size: 0.875rem; font-weight: 500;">Nombre</label>
                     <input type="text" name="name" value="${user.name}" required 
                        style="padding: 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); outline: none;">
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                     <label style="font-size: 0.875rem; font-weight: 500;">Nueva Contraseña <span style="color: var(--text-muted); font-weight: 400;">(opcional)</span></label>
                     <input type="password" name="password" placeholder="Dejar en blanco para mantener" 
                        style="padding: 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); outline: none;">
                </div>

                <button type="submit" class="btn btn-primary" style="margin-top: 1rem; padding: 0.75rem; font-weight: 600;">Guardar Cambios</button>
            </form>
        </div>
    `;

  document.body.appendChild(modal);

  // Modal Logic
  const closeBtn = modal.querySelector('#close-profile-modal');
  const form = modal.querySelector('#profile-form');
  const avatarInput = modal.querySelector('#avatar-input');
  const preview = modal.querySelector('#profile-preview');
  let newAvatar = null;

  // Trigger from Dropdown
  const menuEditBtn = document.getElementById('menu-edit-profile');
  if (menuEditBtn) {
    menuEditBtn.onclick = () => {
      dropdown.style.display = 'none'; // Close dropdown
      modal.style.display = 'flex';
    };
  }


  closeBtn.onclick = () => {
    modal.style.display = 'none';
    form.reset();
    newAvatar = null;
    // Reset preview
    preview.innerHTML = user.avatar ? `<img src="${user.avatar}" style="width: 100%; height: 100%; object-fit: cover;">` : `<span style="font-size: 2rem; color: var(--color-accent-600); font-weight: bold;">${user.name.charAt(0)}</span>`;
  };

  avatarInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) { // 500KB limit
        alert('La imagen es muy pesada. Máximo 500KB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        newAvatar = e.target.result;
        preview.innerHTML = `<img src="${newAvatar}" style="width: 100%; height: 100%; object-fit: cover;">`;
      };
      reader.readAsDataURL(file);
    }
  };



  form.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const password = formData.get('password');

    const updates = { name };
    if (password) updates.password = password;
    if (newAvatar) updates.avatar = newAvatar;

    const result = updateCurrentUser(updates);
    if (result.success) {
      alert('Perfil actualizado correctamente');
      location.reload();
    } else {
      alert('Error al actualizar: ' + result.message);
    }
  };


}

initRouter();
