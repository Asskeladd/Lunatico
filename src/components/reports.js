import { reportsApi } from '../utils/api.js';

export const renderReports = () => {
    const container = document.createElement('div');
    let reports = [];
    let stats = {};
    let isGenerating = false;

    const renderContent = () => {
        return `
            <div class="fade-in">
                <div style="margin-bottom: var(--space-xl); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2>Reportes de Productividad</h2>
                        <p style="color: var(--text-muted); font-size: 0.875rem;">Análisis de rendimiento y métricas</p>
                    </div>
                    <button class="btn btn-primary" onclick="window.showPDFModal()" style="display: flex; align-items: center; gap: var(--space-sm);">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px;">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        Generar PDF
                    </button>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-3" style="margin-bottom: var(--space-xl);">
                    <div class="kpi-card" style="background: var(--gradient-pink);">
                        <h3>Total Piezas</h3>
                        <p class="kpi-value">${stats.totalPiezas || 0}</p>
                        <small style="opacity: 0.8;">${stats.totalOrdenes || 0} órdenes totales</small>
                    </div>
                    <div class="kpi-card" style="background: var(--gradient-blue);">
                        <h3>Órdenes Completadas</h3>
                        <p class="kpi-value">${stats.ordenesCompletadas || 0}</p>
                        <small style="opacity: 0.8;">${stats.ordenesPendientes || 0} pendientes, ${stats.ordenesEnProgreso || 0} en progreso</small>
                    </div>
                    <div class="kpi-card" style="background: var(--gradient-orange);">
                        <h3>Máquinas Activas</h3>
                        <p class="kpi-value">${stats.maquinasActivas || 0}</p>
                        <small style="opacity: 0.8;">${stats.totalMaquinas || 0} total (${stats.maquinasMantenimiento || 0} en mtto)</small>
                    </div>
                </div>

                <!-- Reports Table -->
                <div class="ui-card">
                    <h3 style="margin-bottom: var(--space-lg);">Reportes Mensuales</h3>
                    ${reports.length === 0 ? `
                        <div style="text-align: center; padding: var(--space-xl); color: var(--text-muted);">
                            <p>No hay reportes disponibles</p>
                        </div>
                    ` : `
                        <table class="modern-table">
                            <thead>
                                <tr>
                                    <th>Mes</th>
                                    <th>Año</th>
                                    <th>Total Piezas</th>
                                    <th>Total Horas</th>
                                    <th>Materiales</th>
                                    <th>Fecha Generación</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${reports.map(report => `
                                    <tr>
                                        <td><strong>${report.mes}</strong></td>
                                        <td>${report.anio}</td>
                                        <td>${report.total_piezas}</td>
                                        <td>${report.total_horas != null ? Number(report.total_horas).toFixed(2) : '0.00'}</td>
                                        <td>${report.total_materiales_utilizados}</td>
                                        <td>${report.fecha_generacion ? new Date(report.fecha_generacion).toLocaleDateString() : '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}
                </div>

                <!-- PDF Generation Modal -->
                <div id="pdf-modal" class="modal-backdrop" style="display: none;">
                    <div class="modal" onclick="event.stopPropagation()">
                        <div class="modal__header">
                            <h3 class="modal__title">🖨️ Generar Reporte PDF</h3>
                            <button class="modal__close" onclick="window.hidePDFModal()">×</button>
                        </div>
                        
                        <form id="pdf-form">
                            <div class="grid grid-2">
                                <div class="form-group">
                                    <label class="form-label">Mes *</label>
                                    <select class="form-select" name="mes" required>
                                        <option value="1">Enero</option>
                                        <option value="2">Febrero</option>
                                        <option value="3">Marzo</option>
                                        <option value="4">Abril</option>
                                        <option value="5">Mayo</option>
                                        <option value="6">Junio</option>
                                        <option value="7">Julio</option>
                                        <option value="8">Agosto</option>
                                        <option value="9">Septiembre</option>
                                        <option value="10">Octubre</option>
                                        <option value="11">Noviembre</option>
                                        <option value="12">Diciembre</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Año *</label>
                                    <input type="number" class="form-input" name="anio" min="2020" max="2100" value="${new Date().getFullYear()}" required />
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: var(--space-md); margin-top: var(--space-xl);">
                                <button type="submit" class="btn btn-primary" style="flex: 1;" id="generate-btn">
                                    Generar y Descargar
                                </button>
                                <button type="button" class="btn btn-secondary" onclick="window.hidePDFModal()">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    };

    const loadReports = async () => {
        container.innerHTML = '<div style="padding: var(--space-xl); text-align: center;"><p>Cargando reportes...</p></div>';

        try {
            reports = await reportsApi.getAll();
            stats = await reportsApi.getStats();
            container.innerHTML = renderContent();

            setupPDFModal();
        } catch (error) {
            console.error('Error loading reports:', error);
            container.innerHTML = '<div style="padding: var(--space-xl); text-align: center; color: var(--color-danger);">Error al cargar reportes: ' + error.message + '</div>';
        }
    };

    const setupPDFModal = () => {
        const form = container.querySelector('#pdf-form');
        const modal = container.querySelector('#pdf-modal');
        const generateBtn = container.querySelector('#generate-btn');

        if (!form || !modal) return;

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (isGenerating) return;

            const formData = new FormData(form);
            const mes = parseInt(formData.get('mes'));
            const anio = parseInt(formData.get('anio'));

            try {
                isGenerating = true;
                generateBtn.disabled = true;
                generateBtn.textContent = 'Generando PDF...';

                const result = await reportsApi.generatePDF(mes, anio);

                console.log('PDF Generation Result:', result);

                if (result.success && result.filename) {
                    // Descargar automáticamente
                    await reportsApi.downloadPDF(result.filename);

                    modal.style.display = 'none';
                    form.reset();
                    alert('✅ Reporte generado y descargado exitosamente');
                } else {
                    console.error('Invalid response format:', result);
                    throw new Error(result.error || result.message || 'Error al generar reporte');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('❌ Error al generar PDF: ' + error.message);
            } finally {
                isGenerating = false;
                generateBtn.disabled = false;
                generateBtn.textContent = 'Generar y Descargar';
            }
        });
    };

    window.showPDFModal = () => {
        const modal = container.querySelector('#pdf-modal');
        const form = container.querySelector('#pdf-form');
        if (modal && form) {
            // Set current month by default
            const currentMonth = new Date().getMonth() + 1;
            form.mes.value = currentMonth;
            modal.style.display = 'flex';
        }
    };

    window.hidePDFModal = () => {
        const modal = container.querySelector('#pdf-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    loadReports();
    return container;
};
