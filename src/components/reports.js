import { reportsApi } from '../utils/api.js';

export const renderReports = () => {
    const container = document.createElement('div');
    let reports = [];

    const renderContent = () => {
        return `
            <div class="fade-in">
                <div style="margin-bottom: var(--space-xl);">
                    <h2>Reportes de Productividad</h2>
                    <p style="color: var(--text-muted); font-size: 0.875rem;">Análisis de rendimiento y métricas</p>
                </div>

                <!-- Chart Container -->
                <div class="ui-card" style="margin-bottom: var(--space-xl);">
                    <h3 style="margin-bottom: var(--space-lg);">Productividad Mensual</h3>
                    <canvas id="productivity-chart" height="300"></canvas>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-3" style="margin-bottom: var(--space-xl);">
                    <div class="kpi-card" style="background: var(--gradient-pink);">
                        <h3>Total Piezas</h3>
                        <p class="kpi-value">${reports.reduce((sum, r) => sum + (r.total_piezas || 0), 0)}</p>
                    </div>
                    <div class="kpi-card" style="background: var(--gradient-blue);">
                        <h3>Total Horas</h3>
                        <p class="kpi-value">${reports.reduce((sum, r) => sum + (r.total_horas || 0), 0).toFixed(1)}</p>
                    </div>
                    <div class="kpi-card" style="background: var(--gradient-orange);">
                        <h3>Materiales Usados</h3>
                        <p class="kpi-value">${reports.reduce((sum, r) => sum + (r.total_materiales_utilizados || 0), 0)}</p>
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
                                        <td>${report.total_horas?.toFixed(2) || 0}</td>
                                        <td>${report.total_materiales_utilizados}</td>
                                        <td>${report.fecha_generacion ? new Date(report.fecha_generacion).toLocaleDateString() : '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}
                </div>
            </div>
        `;
    };

    const loadReports = async () => {
        container.innerHTML = '<div style="padding: var(--space-xl); text-align: center;"><p>Cargando reportes...</p></div>';

        try {
            reports = await reportsApi.getAll();
            container.innerHTML = renderContent();
            initChart();
        } catch (error) {
            container.innerHTML = '<div style="padding: var(--space-xl); text-align: center; color: var(--color-danger);">Error al cargar reportes</div>';
        }
    };

    const initChart = () => {
        const ctx = container.querySelector('#productivity-chart');
        if (!ctx || !window.Chart) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: reports.map(r => `${r.mes} ${r.anio}`),
                datasets: [
                    {
                        label: 'Piezas Producidas',
                        data: reports.map(r => r.total_piezas),
                        backgroundColor: 'rgba(233, 30, 99, 0.8)',
                        borderColor: '#E91E63',
                        borderWidth: 1
                    },
                    {
                        label: 'Horas Trabajadas',
                        data: reports.map(r => r.total_horas),
                        backgroundColor: 'rgba(3, 169, 244, 0.8)',
                        borderColor: '#03A9F4',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    };

    loadReports();
    return container;
};
