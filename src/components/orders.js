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
                        <table class="modern-table" style="table-layout: fixed; width: 100%;">
                            <colgroup>
                                <col style="width: 70px;">
                                <col style="width: 70px;">
                                <col style="width: 130px;">
                                <col style="width: 70px;">
                                <col style="width: 105px;">
                                <col style="width: 105px;">
                                <col style="width: 85px;">
                                <col style="width: 95px;">
                                <col style="width: 150px;">
                                <col style="width: 160px;">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>ID Orden</th>
                                    <th>ID Cliente</th>
                                    <th>Tipo de Pieza</th>
                                    <th>Cantidad</th>
                                    <th>Fecha Recepción</th>
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
                                        <td>#${order.id_cliente}</td>
                                        <td>${order.tipo_pieza || '-'}</td>
                                        <td>${order.cantidad}</td>
                                        <td>${order.fecha_recepcion ? new Date(order.fecha_recepcion).toLocaleDateString() : '-'}</td>
                                        <td>${order.fecha_entrega ? new Date(order.fecha_entrega).toLocaleDateString() : '-'}</td>
                                        <td>
                                            <span class="badge badge--${order.prioridad === 'Alta' ? 'danger' : order.prioridad === 'Media' ? 'warning' : 'info'}">
                                                ${order.prioridad}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="badge badge--${order.estado === 'Completada' ? 'success' : order.estado === 'En Progreso' ? 'info' : 'warning'}" style="white-space: nowrap;">
                                                ${order.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <div style="display: flex; align-items: center; gap: 8px;">
                                                <div style="flex: 1; height: 6px; background: var(--border-light); border-radius: var(--radius-full); overflow: hidden; min-width: 60px;">
                                                    <div style="width: ${order.progress || 0}%; height: 100%; background: ${(order.progress || 0) >= 80 ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' :
                (order.progress || 0) >= 40 ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)' :
                    'linear-gradient(90deg, #ef4444 0%, #f87171 100%)'
            };"></div>
                                                </div>
                                                <span style="font-size: 0.7rem; color: var(--text-muted); white-space: nowrap;">${order.progress || 0}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style="display: flex; gap: 8px; justify-content: flex-start;">
                                                <button class="btn btn-sm btn-secondary" onclick="window.editOrder(${order.id_orden})" style="padding: 6px 12px; font-size: 0.8rem;">
                                                    Editar
                                                </button>
                                                ${isAdmin() ? `
                                                    <button class="btn btn-sm" style="background: var(--color-danger); color: white; padding: 6px 12px; font-size: 0.8rem;" onclick="window.deleteOrder(${order.id_orden})">
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
                                    <label class="form-label">Tipo de Pieza *</label>
                                    <select class="form-select" name="tipo_pieza" required>
                                        <option value="">Seleccionar tipo...</option>
                                        <option value="Acoples">Acoples</option>
                                        <option value="Bridas">Bridas</option>
                                        <option value="Bujes">Bujes</option>
                                        <option value="Cantilever">Cantilever</option>
                                        <option value="Chaveteros">Chaveteros</option>
                                        <option value="Cuerpo de Bomba">Cuerpo de Bomba</option>
                                        <option value="Distanciadores">Distanciadores</option>
                                        <option value="Ejes">Ejes</option>
                                        <option value="Impulsores">Impulsores</option>
                                        <option value="Machones">Machones</option>
                                        <option value="Pernos">Pernos</option>
                                        <option value="Poleas">Poleas</option>
                                        <option value="Rodillos">Rodillos</option>
                                        <option value="Soportes de Motor">Soportes de Motor</option>
                                        <option value="Tornillos">Tornillos</option>
                                    </select>
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
                                    <input type="number" class="form-input" name="progress" min="0" max="100" value="0" />
                                </div>
                            </div>
                            
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

            // Include estado and progress for both create and edit
            data.estado = formData.get('estado') || 'Pendiente';
            data.progress = parseInt(formData.get('progress')) || 0;

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
        if (form && modal) {
            form.reset();
            modal.style.display = 'flex';
        }
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
