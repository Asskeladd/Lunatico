import { ordersApi, machinesApi, reportsApi } from '../utils/api.js';
import { getCurrentUser } from '../utils/auth.js';

export const renderDashboard = () => {
    const container = document.createElement('div');
    const user = getCurrentUser();
    let orders = [];
    let machines = [];

    const renderContent = () => {
        const activeOrders = orders.filter(o => o.estado === 'En Progreso');
        const completedOrders = orders.filter(o => o.estado === 'Completada');
        const runningMachines = machines.filter(m => m.estado === 'Activo');
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
                        <div style="margin-bottom: var(--space-sm); color: var(--color-primary); display: flex; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 48px; height: 48px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                        </div>
                        <div style="font-size: 2rem; font-weight: 700; margin-bottom: var(--space-xs);">${activeOrders.length}</div>
                        <div style="color: var(--text-muted); font-size: 0.875rem;">Órdenes Activas</div>
                    </div>
                    
                    <div class="ui-card" style="text-align: center;">
                        <div style="margin-bottom: var(--space-sm); color: var(--color-success); display: flex; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 48px; height: 48px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div style="font-size: 2rem; font-weight: 700; margin-bottom: var(--space-xs);">${completedOrders.length}</div>
                        <div style="color: var(--text-muted); font-size: 0.875rem;">Órdenes Completadas Esta Semana</div>
                    </div>
                    
                    <div class="ui-card" style="text-align: center;">
                        <div style="margin-bottom: var(--space-sm); color: var(--color-info); display: flex; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 48px; height: 48px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.212 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div style="font-size: 2rem; font-weight: 700; margin-bottom: var(--space-xs);">${runningMachines.length}/${totalMachines}</div>
                        <div style="color: var(--text-muted); font-size: 0.875rem;">Máquinas Operando</div>
                    </div>
                    
                    <div class="ui-card" style="text-align: center;">
                        <div style="margin-bottom: var(--space-sm); color: var(--color-warning); display: flex; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 48px; height: 48px;"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                        </div>
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
                                        <span class="badge badge--${machine.estado === 'Activo' ? 'success' : machine.estado === 'En Mantenimiento' ? 'danger' : 'warning'}" style="font-size: 0.75rem;">
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
