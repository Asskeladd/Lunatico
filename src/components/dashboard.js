import { ordersApi, machinesApi, reportsApi } from '../utils/api.js';
import { getCurrentUser } from '../utils/auth.js';

export const renderDashboard = () => {
    const container = document.createElement('div');
    const user = getCurrentUser();
    let orders = [];
    let machines = [];

    const renderContent = () => {
        const activeOrders = orders.filter(o => o.estado === 'En Progreso' || o.estado === 'Pendiente');
        const completedOrders = orders.filter(o => o.estado === 'Completada');
        const runningMachines = machines.filter(m => m.estado === 'Operando');
        const totalMachines = machines.length;

        return `
            <div style="padding: var(--space-lg);">
                <!-- Welcome Section -->
                <div style="margin-bottom: var(--space-xl);">
                    <h1 style="margin-bottom: var(--space-xs);">Bienvenido, ${user.name}</h1>
                    <p style="color: var(--text-muted); font-size: 0.9375rem;">Aquí está el resumen del taller</p>
                </div>
                
                <!-- Stats Cards -->
                <div class="grid grid-4" style="margin-bottom: var(--space-xl);">
                    <div class="ui-card" style="text-align: center;">
                        <div style="font-size: 2.5rem; color: var(--color-primary); margin-bottom: var(--space-sm);">📋</div>
                        <div style="font-size: 2rem; font-weight: 700; margin-bottom: var(--space-xs);">${activeOrders.length}</div>
                        <div style="color: var(--text-muted); font-size: 0.875rem;">Órdenes Activas</div>
                    </div>
                    
                    <div class="ui-card" style="text-align: center;">
                        <div style="font-size: 2.5rem; color: var(--color-success); margin-bottom: var(--space-sm);">✅</div>
                        <div style="font-size: 2rem; font-weight: 700; margin-bottom: var(--space-xs);">${completedOrders.length}</div>
                        <div style="color: var(--text-muted); font-size: 0.875rem;">Órdenes Completadas</div>
                    </div>
                    
                    <div class="ui-card" style="text-align: center;">
                        <div style="font-size: 2.5rem; color: var(--color-info); margin-bottom: var(--space-sm);">⚙️</div>
                        <div style="font-size: 2rem; font-weight: 700; margin-bottom: var(--space-xs);">${runningMachines.length}/${totalMachines}</div>
                        <div style="color: var(--text-muted); font-size: 0.875rem;">Máquinas Operando</div>
                    </div>
                    
                    <div class="ui-card" style="text-align: center;">
                        <div style="font-size: 2.5rem; color: var(--color-warning); margin-bottom: var(--space-sm);">📊</div>
                        <div style="font-size: 2rem; font-weight: 700; margin-bottom: var(--space-xs);">${orders.length}</div>
                        <div style="color: var(--text-muted); font-size: 0.875rem;">Total Órdenes</div>
                    </div>
                </div>

                <!-- Recent Orders -->
                <div class="ui-card" style="margin-bottom: var(--space-xl);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg); padding-bottom: var(--space-md); border-bottom: 1px solid var(--border-light);">
                        <h3 style="margin: 0;">Órdenes Recientes</h3>
                        <a href="#orders" style="color: var(--color-primary); text-decoration: none; font-size: 0.875rem; font-weight: 500;">
                            Ver todas →
                        </a>
                    </div>
                    
                    ${orders.length === 0 ? `
                        <div style="text-align: center; padding: var(--space-xl); color: var(--text-muted);">
                            <p>No hay órdenes para mostrar</p>
                        </div>
                    ` : `
                        <table class="modern-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Tipo Pieza</th>
                                    <th>Cantidad</th>
                                    <th>Estado</th>
                                    <th>Fecha Entrega</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orders.slice(0, 5).map(order => `
                                    <tr>
                                        <td><strong>#${order.id_orden}</strong></td>
                                        <td>${order.cliente_nombre || 'N/A'}</td>
                                        <td>${order.tipo_pieza || '-'}</td>
                                        <td>${order.cantidad}</td>
                                        <td>
                                            <span class="badge badge--${order.estado === 'Completada' ? 'success' : order.estado === 'En Progreso' ? 'info' : 'warning'}">
                                                ${order.estado}
                                            </span>
                                        </td>
                                        <td>${order.fecha_entrega ? new Date(order.fecha_entrega).toLocaleDateString() : '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}
                </div>

                <!-- Machines Status -->
                <div class="ui-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg); padding-bottom: var(--space-md); border-bottom: 1px solid var(--border-light);">
                        <h3 style="margin: 0;">Estado de Máquinas</h3>
                        <a href="#tracking" style="color: var(--color-primary); text-decoration: none; font-size: 0.875rem; font-weight: 500;">
                            Ver todas →
                        </a>
                    </div>
                    
                    ${machines.length === 0 ? `
                        <div style="text-align: center; padding: var(--space-xl); color: var(--text-muted);">
                            <p>No hay máquinas registradas</p>
                        </div>
                    ` : `
                        <div class="grid grid-3">
                            ${machines.slice(0, 6).map(machine => `
                                <div style="padding: var(--space-md); border: 1px solid var(--border-light); border-radius: var(--radius-sm);">
                                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-sm);">
                                        <strong>${machine.nombre}</strong>
                                        <span class="badge badge--${machine.estado === 'Operando' ? 'success' : machine.estado === 'Mantenimiento' ? 'warning' : 'danger'}" style="font-size: 0.75rem;">
                                            ${machine.estado}
                                        </span>
                                    </div>
                                    <div style="color: var(--text-muted); font-size: 0.875rem;">
                                        ${machine.tipo || 'Sin especificar'}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
    };

    const loadData = async () => {
        container.innerHTML = '<div style="padding: var(--space-xl); text-align: center;"><p>Cargando...</p></div>';

        try {
            [orders, machines] = await Promise.all([
                ordersApi.getAll(),
                machinesApi.getAll()
            ]);

            container.innerHTML = renderContent();
        } catch (error) {
            container.innerHTML = '<div style="padding: var(--space-xl); text-align: center;"><p style="color: var(--color-danger);">Error al cargar datos</p></div>';
        }
    };

    loadData();
    return container;
};
