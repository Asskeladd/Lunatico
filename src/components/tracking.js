import { machinesApi } from '../utils/api.js';
import { getCurrentUser, isAdmin } from '../utils/auth.js';

export const renderTracking = () => {
    const container = document.createElement('div');
    const user = getCurrentUser();
    let machines = [];
    let editingId = null;

    const renderContent = () => {
        const statusColors = {
            'Activo': 'success',
            'En Mantenimiento': 'warning',
            'Inactivo': 'danger'
        };

        return `
            <div class="fade-in">

                <!-- Action Bar -->
                <div style="display: flex; justify-content: flex-end; margin-bottom: var(--space-lg);">
                    ${isAdmin() ? `
                        <button class="btn btn-primary" onclick="window.showMachineForm()">
                            + Nueva Máquina
                        </button>
                    ` : ''}
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-4" style="margin-bottom: var(--space-xl);">
                    <div class="kpi-card" style="background: var(--gradient-success, var(--color-success));">
                        <h3>Activas</h3>
                        <p class="kpi-value">${machines.filter(m => m.estado === 'Activo').length}</p>
                    </div>
                    <div class="kpi-card" style="background: var(--gradient-warning, var(--color-warning));">
                        <h3>Inactivas</h3>
                        <p class="kpi-value">${machines.filter(m => m.estado === 'Inactivo').length}</p>
                    </div>
                    <div class="kpi-card" style="background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);">
                        <h3>En Mantenimiento</h3>
                        <p class="kpi-value">${machines.filter(m => m.estado === 'En Mantenimiento').length}</p>
                    </div>
                    <div class="kpi-card" style="background: var(--bg-card); border: 1px solid var(--border-light); color: var(--text-primary);">
                        <h3 style="color: var(--text-primary);">Total Máquinas</h3>
                        <p class="kpi-value" style="color: var(--text-primary);">${machines.length}</p>
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
            </div>

            <!-- Modal Form -->
            <div id="machine-modal" class="modal-backdrop" style="display: none;">
                <div class="modal" onclick="event.stopPropagation()">
                    <div class="modal__header">
                        <h3 class="modal__title">${editingId ? 'Editar' : 'Nueva'} Máquina</h3>
                        <button class="modal__close" onclick="window.hideMachineForm()">×</button>
                    </div>
                    
                    <form id="machine-form">
                        <div class="form-group">
                            <label class="form-label">Tipo de Máquina *</label>
                            <select class="form-select" name="nombre" required>
                                <option value="" disabled selected>Seleccionar tipo...</option>
                                <option value="Cepilladora">Cepilladora</option>
                                <option value="Fresadora">Fresadora</option>
                                <option value="Mandrinadora">Mandrinadora</option>
                                <option value="Taladro de Bandera">Taladro de Bandera</option>
                                <option value="Taladro Radial">Taladro Radial</option>
                                <option value="Torno">Torno</option>
                                <option value="Torno CNC">Torno CNC</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Estado</label>
                            <select class="form-select" name="estado">
                                <option value="Inactivo">Inactivo</option>
                                <option value="Activo">Activo</option>
                                <option value="En Mantenimiento">En Mantenimiento</option>
                            </select>
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

            <!-- Delete Confirmation Modal -->
            <div id="delete-modal" class="modal-backdrop" style="display: none;">
                <div class="modal" onclick="event.stopPropagation()" style="max-width: 400px;">
                    <div class="modal__header">
                        <h3 class="modal__title">Confirmar Eliminación</h3>
                        <button class="modal__close" onclick="window.hideDeleteModal()">×</button>
                    </div>
                    
                    <div style="padding: var(--space-lg);">
                        <p id="delete-modal-text" style="margin-bottom: var(--space-lg);"></p>
                        
                        <div style="display: flex; gap: var(--space-md);">
                            <button id="confirm-delete-btn" class="btn" style="flex: 1; background: var(--color-danger); color: white;">
                                Eliminar
                            </button>
                            <button class="btn btn-secondary" onclick="window.hideDeleteModal()" style="flex: 1;">
                                Cancelar
                            </button>
                        </div>
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
        const deleteModal = container.querySelector('#delete-modal');

        if (!form || !modal) return;

        // Delete modal backdrop click
        if (deleteModal) {
            deleteModal.addEventListener('click', (e) => {
                if (e.target === deleteModal) {
                    deleteModal.style.display = 'none';
                }
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                editingId = null;
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            let baseName = formData.get('nombre');
            let finalName = baseName;

            // Auto-increment logic only for creation (not editing)
            if (!editingId) {
                // Find all machines that start with this name
                const similarMachines = machines.filter(m =>
                    m.nombre === baseName || m.nombre.startsWith(baseName + ' #')
                );

                if (similarMachines.length > 0) {
                    // Extract numbers to find the next available one
                    const numbers = similarMachines.map(m => {
                        if (m.nombre === baseName) return 1;
                        const match = m.nombre.match(/#(\d+)$/);
                        return match ? parseInt(match[1]) : 0;
                    });

                    const maxNum = Math.max(...numbers, 0);
                    finalName = `${baseName} #${maxNum + 1}`;
                }
            }

            const data = {
                nombre: editingId ? baseName : finalName, // Use original input if editing (name change allowed without auto-inc logic?) or strictly use finalName? If editing, we usually keep the name unless user changes it. The select is the "type". If user edits "Torno #2" to "Fresadora", it should probably become "Fresadora #N". But the current UI is a Select.
                // The prompt implies "agrego otra" (add another), so mainly for creation.
                // If editing, the user selects a Type from dropdown. If they change type, should it auto-increment?
                // "Simple" approach: Only on creation.
                estado: formData.get('estado'),
                // Removed efficiency
                tipo: null,
                operator: null,
                currentJob: null,
                efficiency: 0
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
        form.estado.value = machine.estado;
        // removed efficiency

        const modal = container.querySelector('#machine-modal');
        modal.style.display = 'flex';
    };

    window.showDeleteModal = (id, nombre) => {
        const deleteModal = container.querySelector('#delete-modal');
        const deleteText = container.querySelector('#delete-modal-text');
        const confirmBtn = container.querySelector('#confirm-delete-btn');

        deleteText.textContent = `¿Estás seguro de que deseas eliminar la máquina "${nombre}"? Esta acción no se puede deshacer.`;

        // Remove old event listeners by cloning
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        newConfirmBtn.addEventListener('click', async () => {
            try {
                await machinesApi.delete(id);
                deleteModal.style.display = 'none';
                await loadMachines();
            } catch (error) {
                alert('Error al eliminar: ' + error.message);
            }
        });

        deleteModal.style.display = 'flex';
    };

    window.hideDeleteModal = () => {
        const deleteModal = container.querySelector('#delete-modal');
        if (deleteModal) {
            deleteModal.style.display = 'none';
        }
    };

    window.deleteMachine = (id, nombre) => {
        window.showDeleteModal(id, nombre);
    };

    loadMachines();
    return container;
};
