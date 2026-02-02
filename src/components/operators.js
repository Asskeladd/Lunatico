import { authApi } from '../utils/api.js';
import { isAdmin } from '../utils/auth.js';

export const renderOperators = () => {
    const container = document.createElement('div');
    let operators = [];

    const renderContent = () => {
        return `
            <div class="fade-in">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl);">
                    <div>
                        <h2>Gestión de Operarios</h2>
                        <p style="color: var(--text-muted); font-size: 0.875rem;">Administración de usuarios del sistema</p>
                    </div>
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
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}
                </div>

                <!-- Modal Form -->
                <div id="operator-modal" class="modal-backdrop" style="display: none;">
                    <div class="modal" onclick="event.stopPropagation()">
                        <div class="modal__header">
                            <h3 class="modal__title">Nuevo Operario</h3>
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
                                    <input type="password" class="form-input" name="password" required />
                                </div>
                            </div>
                            
                            <div class="grid grid-2">
                                <div class="form-group">
                                    <label class="form-label">Especialidad</label>
                                    <input type="text" class="form-input" name="especialidad" placeholder="Ej: Torneado, Fresado" />
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
                                    Crear Operario
                                </button>
                                <button type="button" class="btn btn-secondary" onclick="window.hideOperatorForm()">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
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
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);

            // Note: This would need a proper API endpoint
            alert('Funcionalidad de crear operarios requiere endpoint backend adicional');
            modal.style.display = 'none';
            form.reset();
        });
    };

    // Global functions
    window.showOperatorForm = () => {
        const modal = container.querySelector('#operator-modal');
        const form = container.querySelector('#operator-form');
        form.reset();
        modal.style.display = 'flex';
    };

    window.hideOperatorForm = () => {
        const modal = container.querySelector('#operator-modal');
        modal.style.display = 'none';
    };

    loadOperators();
    return container;
};
