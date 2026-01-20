import { getReports } from '../mock_data/data.js';

export const renderReports = () => {
    const reports = getReports();
    const container = document.createElement('div');
    const maxVal = Math.max(...reports.productivity.map(d => d.value));

    container.innerHTML = `
        <h1 style="margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 600;">Reportes de Productividad</h1>
        
        <div class="card" style="padding: 2rem;">
            <h3 style="font-weight: 600; margin-bottom: 2rem;">Producción Semanal</h3>
            <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 300px; padding-bottom: 1rem; border-bottom: 1px solid var(--border-light);">
                ${reports.productivity.map(d => `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; width: 40px; height: 100%;">
                        <div style="
                            flex: 1; 
                            width: 100%; 
                            display: flex; 
                            align-items: flex-end;
                            position: relative;
                        ">
                             <div style="
                                width: 100%; 
                                height: ${(d.value / maxVal) * 100}%; 
                                background: var(--color-accent-500); 
                                border-radius: var(--radius-sm) var(--radius-sm) 0 0;
                                transition: height 0.3s ease;
                             " title="${d.value}%">
                             </div>
                        </div>
                        <span style="font-size: 0.875rem; color: var(--text-muted);">${d.day}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div style="margin-top: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div class="card">
                <h3 style="font-weight: 600; margin-bottom: 1rem;">Métricas Clave</h3>
                <ul style="display: flex; flex-direction: column; gap: 1rem;">
                    <li style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-light);">
                        <span style="color: var(--text-muted);">Producción Total</span>
                        <strong>450 unidades</strong>
                    </li>
                    <li style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-light);">
                        <span style="color: var(--text-muted);">Tasa de Defectos</span>
                        <strong style="color: var(--color-danger);">1.2%</strong>
                    </li>
                    <li style="display: flex; justify-content: space-between; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-light);">
                        <span style="color: var(--text-muted);">Entregas a Tiempo</span>
                        <strong style="color: var(--color-success);">98%</strong>
                    </li>
                </ul>
            </div>
            <div class="card" style="display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; gap: 1rem;">
                <div style="width: 64px; height: 64px; background: var(--color-accent-100); color: var(--color-accent-600); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </div>
                <h3 style="font-weight: 600;">Descargar Reporte</h3>
                <p style="color: var(--text-muted); font-size: 0.875rem;">Obtenga análisis detallados en formato PDF.</p>
                <button class="btn btn-primary">Descargar PDF</button>
            </div>
        </div>
    `;
    return container;
}
