import { getOrders, addOrder, updateOrder, getUsers } from '../mock_data/data.js';
import { getCurrentUser } from '../utils/auth.js';

export const renderOrders = () => {
    const container = document.createElement('div');
    const user = getCurrentUser();
    const isAdmin = user && user.role === 'admin';
    const users = getUsers();
    const operators = users.filter(u => u.role === 'operator');

    const renderList = () => {
        const orders = getOrders();
        return `
      <div class="card">
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="text-align: left; border-bottom: 1px solid var(--border-light);">
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">ID</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Cliente</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Descripción</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Asignado A</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Cant.</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Fecha Límite</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Prioridad</th>
                    <th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Estado</th>
                    ${!isAdmin ? '<th style="padding: 1rem; color: var(--text-muted); font-weight: 500;">Acción</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr style="border-bottom: 1px solid var(--border-light);">
                        <td style="padding: 1rem;">${order.id}</td>
                        <td style="padding: 1rem;"><strong>${order.client}</strong></td>
                        <td style="padding: 1rem;">${order.description}</td>
                        <td style="padding: 1rem; font-size: 0.875rem; color: var(--text-muted);">
                            ${order.assignedTo ? users.find(u => u.username === order.assignedTo)?.name || order.assignedTo : 'Sin asignar'}
                        </td>
                        <td style="padding: 1rem;">${order.quantity}</td>
                        <td style="padding: 1rem;">${order.deadline}</td>
                        <td style="padding: 1rem;">
                             <span style="
                                padding: 0.25rem 0.5rem; 
                                border-radius: 4px; 
                                font-size: 0.75rem; 
                                background: ${order.priority === 'Alta' ? 'rgba(239, 68, 68, 0.1)' : order.priority === 'Media' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)'}; 
                                color: ${order.priority === 'Alta' ? 'var(--color-danger)' : order.priority === 'Media' ? 'var(--color-warning)' : 'var(--color-info)'};
                            ">${order.priority}</span>
                        </td>
                        <td style="padding: 1rem;">
                            <span style="
                                padding: 0.25rem 0.5rem; 
                                border-radius: var(--radius-full); 
                                font-size: 0.75rem; 
                                background: ${order.status === 'En Progreso' ? 'var(--color-accent-100)' : order.status === 'Completada' ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-primary-100)'}; 
                                color: ${order.status === 'En Progreso' ? 'var(--color-accent-600)' : order.status === 'Completada' ? 'var(--color-success)' : 'var(--color-primary-600)'};
                            ">${order.status}</span>
                            ${!isAdmin && order.status === 'En Progreso' ? `<span style="display:block; font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">${order.progress}%</span>` : ''}
                        </td>
                        ${!isAdmin ? `
                        <td style="padding: 1rem;">
                            ${order.status === 'Pendiente' ? `
                                <button class="btn-action-accept" data-id="${order.id}" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; background: var(--color-primary-100); border-radius: 4px; color: var(--color-primary-700); border: 1px solid var(--border-light); cursor: pointer;">Aceptar</button>
                            ` : order.status === 'En Progreso' ? `
                                <button class="btn-action-update" data-id="${order.id}" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; background: var(--color-accent-100); border-radius: 4px; color: var(--color-accent-700); border: none; cursor: pointer;">Actualizar</button>
                            ` : '-'}
                        </td>
                        ` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
      </div>
      `;
    };

    container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h1 style="font-size: 1.5rem; font-weight: 600;">Órdenes de Trabajo</h1>
        ${isAdmin ? '<button id="btn-new-order" class="btn btn-primary">+ Nueva Orden</button>' : ''}
    </div>
    <div id="orders-list">
        ${renderList()}
    </div>
    
    <!-- Modal -->
    <div id="order-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 50;">
        <div class="card" style="width: 100%; max-width: 500px; padding: 2rem;">
            <h2 style="margin-bottom: 1.5rem; font-weight: 600;">Crear Nueva Orden</h2>
            <form id="order-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <label style="font-size: 0.875rem; font-weight: 500;">Cliente</label>
                    <input name="client" required style="padding: 0.5rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm);">
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <label style="font-size: 0.875rem; font-weight: 500;">Descripción</label>
                    <input name="description" required style="padding: 0.5rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm);">
                </div>
                
                 <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <label style="font-size: 0.875rem; font-weight: 500;">Asignar Operador</label>
                        <select name="assignedTo" required style="padding: 0.5rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm);">
                            <option value="">Seleccione un operador...</option>
                            ${operators.map(op => `<option value="${op.username}">${op.name}</option>`).join('')}
                        </select>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <label style="font-size: 0.875rem; font-weight: 500;">Cantidad</label>
                        <input name="quantity" type="number" required style="padding: 0.5rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm);">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <label style="font-size: 0.875rem; font-weight: 500;">Fecha Límite</label>
                        <input name="deadline" type="date" required style="padding: 0.5rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm);">
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <label style="font-size: 0.875rem; font-weight: 500;">Prioridad</label>
                        <select name="priority" style="padding: 0.5rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm);">
                            <option value="Baja">Baja</option>
                            <option value="Media" selected>Media</option>
                            <option value="Alta">Alta</option>
                        </select>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <button type="button" id="btn-cancel" class="btn" style="flex: 1; border: 1px solid var(--border-light);">Cancelar</button>
                    <button type="submit" class="btn btn-primary" style="flex: 1;">Crear Orden</button>
                </div>
            </form>
        </div>
    </div>
  `;

    // Event Listeners
    if (isAdmin) {
        const modal = container.querySelector('#order-modal');
        const btnNew = container.querySelector('#btn-new-order');
        const btnCancel = container.querySelector('#btn-cancel');
        const form = container.querySelector('#order-form');

        btnNew.addEventListener('click', () => {
            modal.style.display = 'flex';
        });

        btnCancel.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const newOrder = {
                id: `ORD-${Math.floor(Math.random() * 10000)}`,
                client: formData.get('client'),
                description: formData.get('description'),
                assignedTo: formData.get('assignedTo'),
                quantity: parseInt(formData.get('quantity')),
                deadline: formData.get('deadline'),
                priority: formData.get('priority'),
                status: 'Pendiente',
                progress: 0
            };

            addOrder(newOrder);
            modal.style.display = 'none';
            form.reset();
            container.querySelector('#orders-list').innerHTML = renderList();
        });
    } else {
        // Operator Logic
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-action-accept')) {
                const id = e.target.dataset.id;
                if (confirm(`¿Aceptar Orden ${id}?`)) {
                    updateOrder(id, { status: 'En Progreso', progress: 0 });
                    container.querySelector('#orders-list').innerHTML = renderList();
                }
            } else if (e.target.classList.contains('btn-action-update')) {
                const id = e.target.dataset.id;
                const completion = prompt("Ingrese el porcentaje de avance (0-100):");
                if (completion !== null) {
                    const progress = parseInt(completion);
                    if (progress >= 0 && progress <= 100) {
                        const status = progress === 100 ? 'Completada' : 'En Progreso';
                        updateOrder(id, { progress, status });
                        container.querySelector('#orders-list').innerHTML = renderList();
                    } else {
                        alert("Por favor ingrese un número válido entre 0 y 100.");
                    }
                }
            }
        });
    }

    return container;
};
