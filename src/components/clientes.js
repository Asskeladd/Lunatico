import { clientesApi } from '../utils/api.js';
import { isAdmin } from '../utils/auth.js';

export const renderClientes = () => {
    const container = document.createElement('div');
    let clientes = [];
    let editingId = null;

    const renderContent = () => {
        return `
            <div class="fade-in">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl);">
                    <div>
                        <h2>Gestión de Clientes</h2>
                        <p style="color: var(--text-muted); font-size: 0.875rem;">Administra la base de datos de clientes</p>
                    </div>
                    ${isAdmin() ? `
                        <button class="btn btn-primary" onclick="window.showClienteForm()">
                            + Nuevo Cliente
                        </button>
                    ` : ''}
                </div>

                <div class="ui-card">
                    ${clientes.length === 0 ? `
                        <div style="text-align: center; padding: var(--space-xl); color: var(--text-muted);">
                            <p>No hay clientes registrados</p>
                        </div>
                    ` : `
                        <table class="modern-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Teléfono</th>
                                    <th>Email</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${clientes.map(cliente => `
                                    <tr>
                                        <td><strong>#${cliente.id_cliente}</strong></td>
                                        <td>${cliente.nombre}</td>
                                        <td>${cliente.telefono || '-'}</td>
                                        <td>${cliente.email || '-'}</td>
                                        <td>
                                            <div style="display: flex; gap: var(--space-sm);">
                                                <button class="btn btn-sm btn-secondary" onclick="window.editCliente(${cliente.id_cliente})">
                                                    Editar
                                                </button>
                                                ${isAdmin() ? `
                                                    <button class="btn btn-sm" style="background: var(--color-danger); color: white;" onclick="window.deleteCliente(${cliente.id_cliente}, '${cliente.nombre}')">
                                                        Eliminar
                                                    </button>
                                                ` : ''}
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}
                </div>

                <!-- Modal Form -->
                <div id="cliente-modal" class="modal-backdrop" style="display: none;">
                    <div class="modal" onclick="event.stopPropagation()">
                        <div class="modal__header">
                            <h3 class="modal__title">${editingId ? 'Editar' : 'Nuevo'} Cliente</h3>
                            <button class="modal__close" onclick="window.hideClienteForm()">×</button>
                        </div>
                        
                        <form id="cliente-form">
                            <div class="form-group">
                                <label class="form-label">Nombre *</label>
                                <input type="text" class="form-input" name="nombre" required />
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Teléfono</label>
                                <input type="tel" class="form-input" name="telefono" />
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-input" name="email" />
                            </div>
                            
                            <div style="display: flex; gap: var(--space-md); margin-top: var(--space-xl);">
                                <button type="submit" class="btn btn-primary" style="flex: 1;">
                                    ${editingId ? 'Actualizar' : 'Crear'}
                                </button>
                                <button type="button" class="btn btn-secondary" onclick="window.hideClienteForm()">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    };

    const loadClientes = async () => {
        try {
            clientes = await clientesApi.getAll();
            container.innerHTML = renderContent();
            setupEventListeners();
        } catch (error) {
            container.innerHTML = `<div style="padding: var(--space-xl); text-align: center; color: var(--color-danger);">Error al cargar clientes</div>`;
        }
    };

    const setupEventListeners = () => {
        const form = container.querySelector('#cliente-form');
        const modal = container.querySelector('#cliente-modal');

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                editingId = null;
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = {
                nombre: formData.get('nombre'),
                telefono: formData.get('telefono') || null,
                email: formData.get('email') || null
            };

            try {
                if (editingId) {
                    await clientesApi.update(editingId, data);
                } else {
                    await clientesApi.create(data);
                }

                modal.style.display = 'none';
                editingId = null;
                form.reset();
                await loadClientes();
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    };

    // Global functions
    window.showClienteForm = () => {
        editingId = null;
        const modal = container.querySelector('#cliente-modal');
        const form = container.querySelector('#cliente-form');
        form.reset();
        modal.style.display = 'flex';
    };

    window.hideClienteForm = () => {
        const modal = container.querySelector('#cliente-modal');
        modal.style.display = 'none';
        editingId = null;
    };

    window.editCliente = async (id) => {
        try {
            const cliente = await clientesApi.getById(id);
            editingId = id;

            const form = container.querySelector('#cliente-form');
            form.nombre.value = cliente.nombre;
            form.telefono.value = cliente.telefono || '';
            form.email.value = cliente.email || '';

            const modal = container.querySelector('#cliente-modal');
            modal.style.display = 'flex';
        } catch (error) {
            alert('Error al cargar cliente');
        }
    };

    window.deleteCliente = async (id, nombre) => {
        if (!confirm(`¿Eliminar cliente "${nombre}"?`)) return;

        try {
            await clientesApi.delete(id);
            await loadClientes();
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        }
    };

    loadClientes();
    return container;
};
