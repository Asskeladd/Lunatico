import { authApi } from '../utils/api.js';
import { isAdmin } from '../utils/auth.js';

export const renderOperators = () => {
    const container = document.createElement('div');
    let operators = [];
    let editingId = null;

    const renderContent = () => {
        return `
            <div class="fade-in">

                <div style="display: flex; justify-content: flex-end; margin-bottom: var(--space-lg);">
                    <button class="btn btn-primary" onclick="window.showOperatorForm()">
                        + Nuevo Operario
                    </button>
                </div>

                <div class="ui-card">
                    ${operators.length === 0 ? `
                        <div style="text-align: center; padding: var(--space-xl); color: var(--text-muted);">
                            <p>No hay operarios registrados</p>
                        </div>
                    ` : `
                        <table class="modern-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Usuario</th>
                                    <th>Especialidad</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${operators.map(op => `
                                    <tr>
                                        <td><strong>#${op.id_operario}</strong></td>
                                        <td>${op.nombre}</td>
                                        <td>${op.username}</td>
                                        <td>${op.especialidad || '-'}</td>
                                        <td>
                                            <span class="badge badge--${op.role === 'admin' ? 'danger' : 'info'}">
                                                ${op.role === 'admin' ? 'Administrador' : 'Operador'}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="badge badge--${op.activo ? 'success' : 'danger'}">
                                                ${op.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style="display: flex; gap: var(--space-sm);">
                                                <button class="btn btn-sm btn-secondary" onclick="window.editOperator(${op.id_operario})">
                                                    Editar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}
                </div>
            </div>

            <!-- Modal Form -->
            <div id="operator-modal" class="modal-backdrop" style="display: none;">
                <div class="modal" onclick="event.stopPropagation()">
                    <div class="modal__header">
                        <h3 class="modal__title">${editingId ? 'Editar' : 'Nuevo'} Operario</h3>
                        <button class="modal__close" onclick="window.hideOperatorForm()">×</button>
                    </div>
                    
                    <form id="operator-form">
                        <div class="form-group">
                            <label class="form-label">Nombre Completo *</label>
                            <input type="text" class="form-input" name="nombre" required />
                        </div>
                        
                        <div class="grid grid-2">
                            <div class="form-group">
                                <label class="form-label">Usuario *</label>
                                <input type="text" class="form-input" name="username" required />
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Contraseña *</label>
                                <input type="password" class="form-input" name="password" ${editingId ? '' : 'required'} placeholder="${editingId ? 'Dejar en blanco para mantener' : ''}" />
                            </div>
                        </div>
                        
                        <div class="grid grid-2">
                            <div class="form-group">
                                <label class="form-label">Especialidad *</label>
                                <select class="form-select" name="especialidad" required>
                                    <option value="">Seleccionar especialidad...</option>
                                    <option value="Torneador">Torneador</option>
                                    <option value="Fresador">Fresador</option>
                                    <option value="Taladrador">Taladrador</option>
                                    <option value="Operador de máquinas">Operador de máquinas</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Rol *</label>
                                <select class="form-select" name="role" required>
                                    <option value="operator">Operador</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: var(--space-md); margin-top: var(--space-xl);">
                            <button type="submit" class="btn btn-primary" style="flex: 1;">
                                ${editingId ? 'Actualizar' : 'Crear'} Operario
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="window.hideOperatorForm()">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    };

    const loadOperators = async () => {
        container.innerHTML = '<div style="padding: var(--space-xl); text-align: center;"><p>Cargando operarios...</p></div>';

        try {
            // Note: Backend doesn't have operarios.getAll endpoint yet
            // This is a placeholder - you'll need to add it to backend
            operators = [
                { id_operario: 1, nombre: 'Admin User', username: 'admin', especialidad: 'Gestión', role: 'admin', activo: true },
                { id_operario: 2, nombre: 'Operator User', username: 'operator', especialidad: 'Torneado', role: 'operator', activo: true }
            ];

            container.innerHTML = renderContent();
            setupEventListeners();
        } catch (error) {
            container.innerHTML = '<div style="padding: var(--space-xl); text-align: center; color: var(--color-danger);">Error al cargar operarios</div>';
        }
    };

    const setupEventListeners = () => {
        const form = container.querySelector('#operator-form');
        const modal = container.querySelector('#operator-modal');

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                editingId = null;
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);

            if (editingId) {
                alert(`Simulación: Operario #${editingId} actualizado (Backend pendiente)`);
            } else {
                alert('Simulación: Nuevo operario creado (Backend pendiente)');
            }

            modal.style.display = 'none';
            editingId = null;
            form.reset();
            loadOperators(); // Re-render to clear editingId from template
        });
    };

    // Global functions
    window.showOperatorForm = () => {
        editingId = null;
        container.innerHTML = renderContent(); // Update title to "Nuevo"
        setupEventListeners();
        const modal = container.querySelector('#operator-modal');
        const form = container.querySelector('#operator-form');
        form.reset();
        modal.style.display = 'flex';
    };

    window.hideOperatorForm = () => {
        const modal = container.querySelector('#operator-modal');
        modal.style.display = 'none';
        editingId = null;
    };

    window.editOperator = (id) => {
        const op = operators.find(o => o.id_operario === id);
        if (!op) return;

        editingId = id;
        container.innerHTML = renderContent(); // Update title to "Editar"
        setupEventListeners();

        const form = container.querySelector('#operator-form');
        form.nombre.value = op.nombre;
        form.username.value = op.username;
        form.especialidad.value = op.especialidad || '';
        form.role.value = op.role;
        // Password is left blank for edits

        const modal = container.querySelector('#operator-modal');
        modal.style.display = 'flex';
    };

    loadOperators();
    return container;
};
