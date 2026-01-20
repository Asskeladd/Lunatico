import { getOrders, getMachines } from '../mock_data/data.js';
import { getCurrentUser } from '../utils/auth.js';

export const renderDashboard = () => {
    const orders = getOrders();
    const machines = getMachines();
    const user = getCurrentUser();

    // Check for new assignments for this operator (Simplified logic: All 'Pendiente' orders assigned to me)
    const myNewAssignments = user && user.role === 'operator'
        ? orders.filter(o => o.assignedTo === user.username && o.status === 'Pendiente')
        : [];

    const activeOrders = orders.filter(o => o.status === 'En Progreso' || o.status === 'Pendiente').length; // Adjusted for translated status later
    const runningMachines = machines.filter(m => m.status === 'Operando').length;
    const totalMachines = machines.length;
    const pendingReports = 2; // Mock


    return `
      ${myNewAssignments.length > 0 ? `
         <div style="background-color: var(--color-accent-50); border: 1px solid var(--color-accent-200); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 2rem; display: flex; align-items: start; gap: 1rem;">
             <span style="font-size: 1.5rem;">🔔</span>
             <div>
                 <h3 style="font-weight: 600; color: var(--color-accent-700); margin-bottom: 0.25rem;">¡Nueva Orden Asignada!</h3>
                 <p style="color: var(--color-accent-700); font-size: 0.875rem;">Se te ha asignado la orden <strong>${myNewAssignments[0].id}</strong> para <strong>${myNewAssignments[0].client}</strong>.</p>
                 <p style="color: var(--color-accent-600); font-size: 0.875rem; margin-top: 0.25rem;">${myNewAssignments[0].description}</p>
                 <button onclick="document.querySelector('[data-route=\\'orders\\']').click()" style="margin-top: 0.5rem; background: var(--color-accent-600); color: white; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">Ver Órdenes</button>
             </div>
         </div>
      ` : ''}

      <h1 style="margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 600;">Resumen General</h1>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
        <div class="card">
          <h4 style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;">Órdenes Activas</h4>
          <p style="font-size: 2rem; font-weight: 700;">${activeOrders}</p>
        </div>
        <div class="card">
          <h4 style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;">Máquinas Operando</h4>
          <p style="font-size: 2rem; font-weight: 700; color: var(--color-success);">${runningMachines}<span style="font-size: 1rem; color: var(--text-muted); font-weight: 400;">/${totalMachines}</span></p>
        </div>
        <div class="card">
           <h4 style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;">Reportes Generados esta Semana</h4>
           <p style="font-size: 2rem; font-weight: 700; color: var(--color-info);">5</p>
        </div>
      </div>
      
      <div style="margin-top: 2rem; display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
         <div class="card">
            <h3 style="font-weight: 600; margin-bottom: 1rem;">Órdenes Recientes</h3>
            <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="text-align: left; border-bottom: 1px solid var(--border-light);">
                        <th style="padding: 0.75rem 0; color: var(--text-muted); font-weight: 500; font-size: 0.875rem;">ID</th>
                        <th style="padding: 0.75rem 0; color: var(--text-muted); font-weight: 500; font-size: 0.875rem;">Cliente</th>
                        <th style="padding: 0.75rem 0; color: var(--text-muted); font-weight: 500; font-size: 0.875rem;">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.slice(-5).reverse().map(order => `
                        <tr style="border-bottom: 1px solid var(--border-light);">
                            <td style="padding: 0.75rem 0; font-size: 0.875rem;">${order.id}</td>
                            <td style="padding: 0.75rem 0; font-size: 0.875rem;">${order.client}</td>
                            <td style="padding: 0.75rem 0; font-size: 0.875rem;">
                                <span style="
                                    padding: 0.25rem 0.5rem; 
                                    border-radius: var(--radius-full); 
                                    font-size: 0.75rem; 
                                    background: ${order.status === 'En Progreso' ? 'var(--color-accent-100)' : order.status === 'Completada' ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-primary-100)'}; 
                                    color: ${order.status === 'En Progreso' ? 'var(--color-accent-600)' : order.status === 'Completada' ? 'var(--color-success)' : 'var(--color-primary-600)'};
                                ">${order.status}</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            </div>
         </div>
         <div class="card">
             <h3 style="font-weight: 600; margin-bottom: 1rem;">Estado de Máquinas</h3>
             ${(() => {
            const active = machines.filter(m => m.status === 'Operando').length;
            const idle = machines.filter(m => m.status === 'Inactivo').length;
            const maintenance = machines.filter(m => m.status === 'Mantenimiento').length;
            // Exclude 'Detenido' from total as requested
            const total = active + idle + maintenance;

            if (total === 0) return '<p>No hay datos suficientes.</p>';

            const pActive = (active / total) * 100;
            const pIdle = (idle / total) * 100;
            const pMaintenance = (maintenance / total) * 100;

            return `
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div style="
                        width: 120px; 
                        height: 120px; 
                        border-radius: 50%;
                        background: conic-gradient(
                            var(--color-success) 0% ${pActive}%, 
                            var(--color-warning) ${pActive}% ${pActive + pIdle}%, 
                            var(--color-danger) ${pActive + pIdle}% 100%
                        );
                    "></div>
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="width: 12px; height: 12px; background: var(--color-success); border-radius: 2px;"></span>
                            <span>Operando (${Math.round(pActive)}%)</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="width: 12px; height: 12px; background: var(--color-warning); border-radius: 2px;"></span>
                            <span>Inactivo (${Math.round(pIdle)}%)</span>
                        </div>
                         <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="width: 12px; height: 12px; background: var(--color-danger); border-radius: 2px;"></span>
                            <span>Mantenimiento (${Math.round(pMaintenance)}%)</span>
                        </div>
                    </div>
                </div>
                `;
        })()}
         </div>
      </div>
  `;
}
