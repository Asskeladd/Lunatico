import { machinesApi } from '../utils/api.js';
import { getCurrentUser, isAdmin } from '../utils/auth.js';

export const renderTracking = () => {
    const container = document.createElement('div');
    const user = getCurrentUser();
    let machines = [];
    let editingId = null;

    const renderContent = () => {
        const statusColors = {
            'Operando': 'success',
            'Mantenimiento': 'warning',
            'Inactivo': 'danger'
        };

        return `
            <div class="fade-in">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl);">
                    <div>
                        <h2>Seguimiento de Máquinas</h2>
                        <p style="color: var(--text-muted); font-size: 0.875rem;">Monitoreo en tiempo real del estado de las máquinas</p>
                    </div>
                    ${isAdmin() ? `
                        <button class="btn btn-primary" onclick="window.showMachineForm()">
                            + Nueva Máquina
                        </button>
                    ` : ''}
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-4" style="margin-bottom: var(--space-xl);">
                    <div class="kpi-card" style="background: var(--gradient-success, var(--color-success));">
                        <h3>Operando</h3>
                        <p class="kpi-value">${machines.filter(m => m.estado === 'Operando').length}</p>
                    </div>
                    <div class="kpi-card" style="background: var(--gradient-warning, var(--color-warning));">
                        <h3>Mantenimiento</h3>
                        <p class="kpi-value">${machines.filter(m => m.estado === 'Mantenimiento').length}</p>
                    </div>
                    <div class="kpi-card" style="background: var(--gradient-blue);">
                        <h3>Inactivo</h3>
                        <p class="kpi-value">${machines.filter(m => m.estado === 'Inactivo').length}</p>
                    </div>
                    <div class="kpi-card" style="background: var(--gradient-purple);">
                        <h3>Total Máquinas</h3>
                        <p class="kpi-value">${machines.length}</p>
                    </div>
                </div>

                <div class="grid grid-3">
                    ${machines.map(machine => `
                        <div class="ui-card" style="position: relative;">
                            <div style="position: absolute; top: var(--space-md); right: var(--space-md);">
                                <span class="badge badge--${statusColors[machine.estado] || 'info'}" style="font-size: 0.75rem;">
                                    ${machine.estado}
                                </span>
                            </div>
                            
                            <h3 style="margin-bottom: var(--space-sm);">${machine.nombre}</h3>
                            <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: var(--space-md);">
                                ${machine.tipo || 'Tipo no especificado'}
                            </p>
                            
                            ${machine.operator ? `
                                <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm); font-size: 0.875rem;">
                                    <span style="color: var(--text-muted);">Operador:</span>
                                    <strong>${machine.operator}</strong>
                                </div>
                            ` : ''}
                            
                            ${machine.currentJob ? `
                                <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-md); font-size: 0.875rem;">
                                    <span style="color: var(--text-muted);">Trabajo:</span>
                                    <strong>${machine.currentJob}</strong>
                                </div>
                            ` : ''}
                            
                            ${machine.efficiency ? `
                                <div style="margin-top: var(--space-md);">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-xs); font-size: 0.75rem;">
                                        <span style="color: var(--text-muted);">Eficiencia</span>
                                        <strong>${machine.efficiency}%</strong>
                                    </div>
                                    <div style="height: 6px; background: var(--border-light); border-radius: var(--radius-full); overflow: hidden;">
                                        <div style="width: ${machine.efficiency}%; height: 100%; background: var(--gradient-pink);"></div>
                                    </div>
                                </div>
                            ` : ''}
                            
                            <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-lg);">
                                <button class="btn btn-sm btn-secondary" onclick="window.editMachine(${machine.id_maquina})" style="flex: 1;">
                                    Editar
                                </button>
                                ${isAdmin() ? `
                                    <button class="btn btn-sm" style="background: var(--color-danger); color: white;" onclick="window.deleteMachine(${machine.id_maquina}, '${machine.nombre}')">
                                        Eliminar
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Modal Form -->
                <div id="machine-modal" class="modal-backdrop" style="display: none;">
                    <div class="modal" onclick="event.stopPropagation()">
                        <div class="modal__header">
                            <h3 class="modal__title">${editingId ? 'Editar' : 'Nueva'} Máquina</h3>
                            <button class="modal__close" onclick="window.hideMachineForm()">×</button>
                        </div>
                        
                        <form id="machine-form">
                            <div class="grid grid-2">
                                <div class="form-group">
                                    <label class="form-label">Nombre *</label>
                                    <input type="text" class="form-input" name="nombre" required />
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Tipo</label>
                                    <input type="text" class="form-input" name="tipo" placeholder="CNC, Manual, etc." />
                                </div>
                            </div>
                            
                            <div class="grid grid-2">
                                <div class="form-group">
                                    <label class="form-label">Estado</label>
                                    <select class="form-select" name="estado">
                                        <option value="Inactivo">Inactivo</option>
                                        <option value="Operando">Operando</option>
                                        <option value="Mantenimiento">Mantenimiento</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Eficiencia (%)</label>
                                    <input type="number" class="form-input" name="efficiency" min="0" max="100" value="0" />
                                </div>
                            </div>
                            
                            <div class="grid grid-2">
                                <div class="form-group">
                                    <label class="form-label">Operador</label>
                                    <input type="text" class="form-input" name="operator" />
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Trabajo Actual</label>
                                    <input type="text" class="form-input" name="currentJob" />
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: var(--space-md); margin-top: var(--space-xl);">
                                <button type="submit" class="btn btn-primary" style="flex: 1;">
                                    ${editingId ? 'Actualizar' : 'Crear'}
                                </button>
                                <button type="button" class="btn btn-secondary" onclick="window.hideMachineForm()">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    };

    const loadMachines = async () => {
        container.innerHTML = '<div style="padding: var(--space-xl); text-align: center;"><p>Cargando máquinas...</p></div>';

        try {
            machines = await machinesApi.getAll();
            container.innerHTML = renderContent();
            setupEventListeners();
        } catch (error) {
            container.innerHTML = '<div style="padding: var(--space-xl); text-align: center; color: var(--color-danger);">Error al cargar máquinas</div>';
        }
    };

    const setupEventListeners = () => {
        const form = container.querySelector('#machine-form');
        const modal = container.querySelector('#machine-modal');

        if (!form || !modal) return;

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
                nombre: formData.get('nombre'),
                tipo: formData.get('tipo') || null,
                estado: formData.get('estado'),
                operator: formData.get('operator') || null,
                currentJob: formData.get('currentJob') || null,
                efficiency: parseInt(formData.get('efficiency')) || 0
            };

            try {
                if (editingId) {
                    await machinesApi.update(editingId, data);
                } else {
                    await machinesApi.create(data);
                }

                modal.style.display = 'none';
                editingId = null;
                form.reset();
                await loadMachines();
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    };

    // Global functions
    window.showMachineForm = () => {
        editingId = null;
        container.innerHTML = renderContent();
        setupEventListeners();
        const modal = container.querySelector('#machine-modal');
        const form = container.querySelector('#machine-form');
        form.reset();
        modal.style.display = 'flex';
    };

    window.hideMachineForm = () => {
        const modal = container.querySelector('#machine-modal');
        if (modal) {
            modal.style.display = 'none';
            editingId = null;
        }
    };

    window.editMachine = async (id) => {
        const machine = machines.find(m => m.id_maquina === id);
        if (!machine) return;

        editingId = id;
        container.innerHTML = renderContent();
        setupEventListeners();

        const form = container.querySelector('#machine-form');
        form.nombre.value = machine.nombre;
        form.tipo.value = machine.tipo || '';
        form.estado.value = machine.estado;
        form.operator.value = machine.operator || '';
        form.currentJob.value = machine.currentJob || '';
        form.efficiency.value = machine.efficiency || 0;

        const modal = container.querySelector('#machine-modal');
        modal.style.display = 'flex';
    };

    window.deleteMachine = async (id, nombre) => {
        if (!confirm(`¿Eliminar máquina "${nombre}"?`)) return;

        try {
            await machinesApi.delete(id);
            await loadMachines();
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        }
    };

    loadMachines();
    return container;
};
