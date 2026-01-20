import { getMachines, updateMachine } from '../mock_data/data.js';
import { getCurrentUser } from '../utils/auth.js';

export const renderTracking = () => {
    const machines = getMachines();
    const user = getCurrentUser();
    const isOperator = user && user.role === 'operator';
    const container = document.createElement('div');

    const renderMachines = () => {
        const currentMachines = getMachines();
        // Remove 'Detenido' from view as requested
        const validMachines = currentMachines.filter(m => m.status !== 'Detenido');

        return validMachines.map(m => `
            <div class="card" style="border-left: 5px solid ${m.status === 'Operando' ? 'var(--color-success)' : m.status === 'Inactivo' ? 'var(--color-warning)' : 'var(--color-danger)'}">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <h3 style="font-weight: 600; font-size: 1.125rem;">${m.name}</h3>
                    <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: var(--radius-full); background: var(--color-primary-100);">${m.id}</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <span style="color: var(--text-muted);">Estado:</span>
                        <strong style="color: ${m.status === 'Operando' ? 'var(--color-success)' : m.status === 'Inactivo' ? 'var(--color-warning)' : 'var(--color-danger)'}">${m.status}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <span style="color: var(--text-muted);">Operador:</span>
                        <span>${m.operator || '-'}</span>
                    </div>
                </div>
                
                ${isOperator ? `
                <div style="margin-top: 1rem; border-top: 1px solid var(--border-light); padding-top: 0.5rem;">
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem;">Cambiar Estado:</p>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn-status" data-id="${m.id}" data-status="Operando" style="flex: 1; font-size: 0.75rem; padding: 0.25rem; background: var(--color-success); color: white; border: none; border-radius: 4px; opacity: ${m.status === 'Operando' ? '1' : '0.5'}; cursor: pointer;">Operando</button>
                        <button class="btn-status" data-id="${m.id}" data-status="Inactivo" style="flex: 1; font-size: 0.75rem; padding: 0.25rem; background: var(--color-warning); color: black; border: none; border-radius: 4px; opacity: ${m.status === 'Inactivo' ? '1' : '0.5'}; cursor: pointer;">Inactivo</button>
                        <button class="btn-status" data-id="${m.id}" data-status="Mantenimiento" style="flex: 1; font-size: 0.75rem; padding: 0.25rem; background: var(--color-danger); color: white; border: none; border-radius: 4px; opacity: ${m.status === 'Mantenimiento' ? '1' : '0.5'}; cursor: pointer;">Mant.</button>
                    </div>
                </div>
                ` : ''}
            </div>
        `).join('');
    };

    container.innerHTML = `
      <h1 style="margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 600;">Seguimiento en Tiempo Real</h1>
      <div id="machines-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
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

    return container;
};
