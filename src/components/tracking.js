import { getMachines, updateMachine, addMachine } from '../mock_data/data.js';
import { getCurrentUser } from '../utils/auth.js';

export const renderTracking = () => {
    const machines = getMachines();
    const user = getCurrentUser();
    const isOperator = user && user.role === 'operator';
    const isAdmin = user && user.role === 'admin';
    const container = document.createElement('div');
    container.className = 'tracking-view';

    const renderMachines = () => {
        const currentMachines = getMachines();
        // Remove 'Detenido' from view as requested
        const validMachines = currentMachines.filter(m => m.status !== 'Detenido');

        return validMachines.map(m => `
            <div class="card machine-card" style="border-left: 5px solid ${m.status === 'Operando' ? 'var(--color-success)' : m.status === 'Inactivo' ? 'var(--color-warning)' : 'var(--color-danger)'}">
                <div class="machine-card__header">
                    <h3 class="machine-card__title">${m.name}</h3>
                    <span class="machine-card__id">${m.id}</span>
                </div>
                <div class="machine-card__meta">
                    <div class="machine-card__row">
                        <span class="machine-card__label">Estado:</span>
                        <strong class="machine-card__status" style="color: ${m.status === 'Operando' ? 'var(--color-success)' : m.status === 'Inactivo' ? 'var(--color-warning)' : 'var(--color-danger)'}">${m.status}</strong>
                    </div>
                    <div class="machine-card__row">
                        <span class="machine-card__label">Operador:</span>
                        <span class="machine-card__value">${m.operator || '-'}</span>
                    </div>
                </div>
                
                ${isAdmin ? `
                <div class="machine-card__section">
                    <p class="machine-card__section-title">Editar Torno</p>
                    <form class="edit-machine-form form-grid" data-id="${m.id}">
                        <div class="form-field">
                            <label class="form-label">Nombre</label>
                            <input class="form-input" name="name" value="${String(m.name).replaceAll('"', '&quot;')}" required />
                        </div>
                        <div class="form-field">
                            <label class="form-label">Estado</label>
                            <select class="form-input" name="status">
                                <option value="Operando" ${m.status === 'Operando' ? 'selected' : ''}>Operando</option>
                                <option value="Inactivo" ${m.status === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                                <option value="Mantenimiento" ${m.status === 'Mantenimiento' ? 'selected' : ''}>Mantenimiento</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Guardar</button>
                        </div>
                    </form>
                </div>
                ` : ''}

                ${isOperator ? `
                <div class="machine-card__section">
                    <p class="machine-card__section-title">Cambiar Estado</p>
                    <div class="status-actions">
                        <button class="btn-status" data-id="${m.id}" data-status="Operando" style="background: var(--color-success); color: white; opacity: ${m.status === 'Operando' ? '1' : '0.5'};">Operando</button>
                        <button class="btn-status" data-id="${m.id}" data-status="Inactivo" style="background: var(--color-warning); color: black; opacity: ${m.status === 'Inactivo' ? '1' : '0.5'};">Inactivo</button>
                        <button class="btn-status" data-id="${m.id}" data-status="Mantenimiento" style="background: var(--color-danger); color: white; opacity: ${m.status === 'Mantenimiento' ? '1' : '0.5'};">Mant.</button>
                    </div>
                </div>
                ` : ''}
            </div>
        `).join('');
    };

    container.innerHTML = `
      <h1 class="tracking-title">Seguimiento en Tiempo Real</h1>
      ${isAdmin ? `
        <div class="card tracking-admin-card">
          <div class="tracking-admin-card__header">
            <h3 class="tracking-admin-card__title">Agregar nuevo torno</h3>
          </div>
          <form id="add-machine-form" class="form-grid">
            <div class="form-field">
              <label for="machine-id" class="form-label">ID</label>
              <input id="machine-id" class="form-input" name="id" placeholder="M-06" required />
            </div>
            <div class="form-field">
              <label for="machine-name" class="form-label">Nombre</label>
              <input id="machine-name" class="form-input" name="name" placeholder="Torno CNC 2" required />
            </div>
            <div class="form-field">
              <label for="machine-status" class="form-label">Estado</label>
              <select id="machine-status" class="form-input" name="status">
                <option value="Operando">Operando</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Agregar</button>
            </div>
          </form>
          <p id="add-machine-error" class="form-error" style="display:none;"></p>
        </div>
      ` : ''}
      <div id="machines-grid" class="machines-grid">
        ${renderMachines()}
      </div>
    `;

    // Event listener for status buttons
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-status')) {
            const id = e.target.dataset.id;
            const newStatus = e.target.dataset.status;

            // Optimistic update
            updateMachine(id, { status: newStatus });

            // Re-render
            const grid = container.querySelector('#machines-grid');
            if (grid) grid.innerHTML = renderMachines();
        }
    });

    container.addEventListener('submit', (e) => {
        const form = e.target.closest('.edit-machine-form');
        if (!form) return;

        e.preventDefault();
        const id = form.dataset.id;
        const formData = new FormData(form);
        const name = String(formData.get('name') || '').trim();
        const status = String(formData.get('status') || '').trim();

        if (!id || !name || !status) return;

        updateMachine(id, { name, status });

        const grid = container.querySelector('#machines-grid');
        if (grid) grid.innerHTML = renderMachines();
    });

    if (isAdmin) {
        const form = container.querySelector('#add-machine-form');
        const errorEl = container.querySelector('#add-machine-error');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                if (errorEl) {
                    errorEl.style.display = 'none';
                    errorEl.textContent = '';
                }

                const formData = new FormData(form);
                const id = String(formData.get('id') || '').trim();
                const name = String(formData.get('name') || '').trim();
                const status = String(formData.get('status') || 'Inactivo').trim();

                if (!id || !name) {
                    if (errorEl) {
                        errorEl.textContent = 'Completa ID y Nombre.';
                        errorEl.style.display = 'block';
                    }
                    return;
                }

                const existing = getMachines();
                const duplicated = existing.some(m => String(m.id).toLowerCase() === id.toLowerCase());
                if (duplicated) {
                    if (errorEl) {
                        errorEl.textContent = `Ya existe una máquina con ID ${id}.`;
                        errorEl.style.display = 'block';
                    }
                    return;
                }

                addMachine({
                    id,
                    name,
                    status,
                    operator: null,
                    currentJob: null,
                    efficiency: 0
                });

                form.reset();
                const statusSelect = form.querySelector('#machine-status');
                if (statusSelect) statusSelect.value = 'Operando';

                const grid = container.querySelector('#machines-grid');
                if (grid) grid.innerHTML = renderMachines();
            });
        }
    }

    return container;
};
