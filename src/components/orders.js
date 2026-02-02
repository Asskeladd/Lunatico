import { ordersApi, clientesApi } from '../utils/api.js';
import { getCurrentUser, isAdmin } from '../utils/auth.js';

export const renderOrders = () => {
    const container = document.createElement('div');
    const user = getCurrentUser();
    let orders = [];
    let clientes = [];
    let editingId = null;

    const renderContent = () => {
        return `
            <div class="fade-in">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl);">
                    <div>
                        <h2>Órdenes de Trabajo</h2>
                        <p style="color: var(--text-muted); font-size: 0.875rem;">Gestión de órdenes de producción</p>
                    </div>
                    ${isAdmin() ? `
                        <button class="btn btn-primary" onclick="window.showOrderForm()">
                            + Nueva Orden
                        </button>
                    ` : ''}
                </div>

                <div class="ui-card">
                    ${orders.length === 0 ? `
                        <div style="text-align: center; padding: var(--space-xl); color: var(--text-muted);">
                            <p>No hay órdenes registradas</p>
                        </div>
                    ` : `
                        <table class="modern-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Tipo Pieza</th>
                                    <th>Cantidad</th>
                                    <th>Fecha Entrega</th>
                                    <th>Prioridad</th>
                                    <th>Estado</th>
                                    <th>Progreso</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orders.map(order => `
                                    <tr>
                                        <td><strong>#${order.id_orden}</strong></td>
                                        <td>${order.cliente_nombre || 'N/A'}</td>
                                        <td>${order.tipo_pieza || '-'}</td>
                                        <td>${order.cantidad}</td>
                                        <td>${order.fecha_entrega ? new Date(order.fecha_entrega).toLocaleDateString() : '-'}</td>
                                        <td>
                                            <span class="badge badge--${order.prioridad === 'Alta' ? 'danger' : order.prioridad === 'Media' ? 'warning' : 'info'}">
                                                ${order.prioridad}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="badge badge--${order.estado === 'Completada' ? 'success' : order.estado === 'En Progreso' ? 'info' : 'warning'}">
                                                ${order.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <div style="display: flex; align-items: center; gap: var(--space-sm);">
                                                <div style="flex: 1; height: 6px; background: var(--border-light); border-radius: var(--radius-full); overflow: hidden;">
                                                    <div style="width: ${order.progress || 0}%; height: 100%; background: var(--gradient-primary);"></div>
                                                </div>
                                                <span style="font-size: 0.75rem; color: var(--text-muted); min-width: 35px;">${order.progress || 0}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style="display: flex; gap: var(--space-sm);">
                                                <button class="btn btn-sm btn-secondary" onclick="window.editOrder(${order.id_orden})">
                                                    Editar
                                                </button>
                                                ${isAdmin() ? `
                                                    <button class="btn btn-sm" style="background: var(--color-danger); color: white;" onclick="window.deleteOrder(${order.id_orden})">
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
                <div id="order-modal" class="modal-backdrop" style="display: none;">
                    <div class="modal" onclick="event.stopPropagation()">
                        <div class="modal__header">
                            <h3 class="modal__title">${editingId ? 'Editar' : 'Nueva'} Orden</h3>
                            <button class="modal__close" onclick="window.hideOrderForm()">×</button>
                        </div>
                        
                        <form id="order-form">
                            <div class="grid grid-2">
                                <div class="form-group">
                                    <label class="form-label">Cliente *</label>
                                    <select class="form-select" name="id_cliente" required>
                                        <option value="">Seleccionar cliente...</option>
                                        ${clientes.map(c => `<option value="${c.id_cliente}">${c.nombre}</option>`).join('')}
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Tipo de Pieza</label>
                                    <input type="text" class="form-input" name="tipo_pieza" />
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Descripción</label>
                                <textarea class="form-textarea" name="description" rows="3"></textarea>
                            </div>
                            
                            <div class="grid grid-3">
                                <div class="form-group">
                                    <label class="form-label">Cantidad *</label>
                                    <input type="number" class="form-input" name="cantidad" min="1" required />
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Fecha Entrega</label>
                                    <input type="date" class="form-input" name="fecha_entrega" />
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Prioridad *</label>
                                    <select class="form-select" name="prioridad" required>
                                        <option value="Baja">Baja</option>
                                        <option value="Media" selected>Media</option>
                                        <option value="Alta">Alta</option>
                                    </select>
                                </div>
                            </div>
                            
                            ${editingId ? `
                                <div class="grid grid-2">
                                    <div class="form-group">
                                        <label class="form-label">Estado</label>
                                        <select class="form-select" name="estado">
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="En Progreso">En Progreso</option>
                                            <option value="Completada">Completada</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label">Progreso (%)</label>
                                        <input type="number" class="form-input" name="progress" min="0" max="100" />
                                    </div>
                                </div>
                            ` : ''}
                            
                            <div style="display: flex; gap: var(--space-md); margin-top: var(--space-xl);">
                                <button type="submit" class="btn btn-primary" style="flex: 1;">
                                    ${editingId ? 'Actualizar' : 'Crear'}
                                </button>
                                <button type="button" class="btn btn-secondary" onclick="window.hideOrderForm()">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    };

    const loadData = async () => {
        container.innerHTML = '<div style="padding: var(--space-xl); text-align: center;"><p>Cargando órdenes...</p></div>';

        try {
            [orders, clientes] = await Promise.all([
                ordersApi.getAll(),
                clientesApi.getAll()
            ]);

            container.innerHTML = renderContent();
            setupEventListeners();
        } catch (error) {
            container.innerHTML = '<div style="padding: var(--space-xl); text-align: center; color: var(--color-danger);">Error al cargar órdenes</div>';
        }
    };

    const setupEventListeners = () => {
        const form = container.querySelector('#order-form');
        const modal = container.querySelector('#order-modal');

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
                id_cliente: parseInt(formData.get('id_cliente')),
                tipo_pieza: formData.get('tipo_pieza') || null,
                description: formData.get('description') || null,
                cantidad: parseInt(formData.get('cantidad')),
                fecha_entrega: formData.get('fecha_entrega') || null,
                prioridad: formData.get('prioridad')
            };

            if (editingId) {
                data.estado = formData.get('estado');
                data.progress = parseInt(formData.get('progress')) || 0;
            }

            try {
                if (editingId) {
                    await ordersApi.update(editingId, data);
                } else {
                    await ordersApi.create(data);
                }

                modal.style.display = 'none';
                editingId = null;
                form.reset();
                await loadData();
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    };

    // Global functions
    window.showOrderForm = () => {
        editingId = null;
        const modal = container.querySelector('#order-modal');
        const form = container.querySelector('#order-form');
        form.reset();
        modal.style.display = 'flex';
        container.innerHTML = renderContent();
        setupEventListeners();
    };

    window.hideOrderForm = () => {
        const modal = container.querySelector('#order-modal');
        modal.style.display = 'none';
        editingId = null;
    };

    window.editOrder = async (id) => {
        try {
            const order = orders.find(o => o.id_orden === id);
            if (!order) return;

            editingId = id;
            container.innerHTML = renderContent();
            setupEventListeners();

            const form = container.querySelector('#order-form');
            form.id_cliente.value = order.id_cliente;
            form.tipo_pieza.value = order.tipo_pieza || '';
            form.description.value = order.description || '';
            form.cantidad.value = order.cantidad;
            form.fecha_entrega.value = order.fecha_entrega ? order.fecha_entrega.split('T')[0] : '';
            form.prioridad.value = order.prioridad;

            if (form.estado) {
                form.estado.value = order.estado;
                form.progress.value = order.progress || 0;
            }

            const modal = container.querySelector('#order-modal');
            modal.style.display = 'flex';
        } catch (error) {
            alert('Error al cargar orden');
        }
    };

    window.deleteOrder = async (id) => {
        if (!confirm('¿Eliminar esta orden?')) return;

        try {
            await ordersApi.delete(id);
            await loadData();
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        }
    };

    loadData();
    return container;
};
