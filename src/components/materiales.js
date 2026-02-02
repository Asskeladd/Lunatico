import { materialesApi } from '../utils/api.js';
import { isAdmin } from '../utils/auth.js';

export const renderMateriales = () => {
    const container = document.createElement('div');
    let materiales = [];
    let editingId = null;

    const renderContent = () => {
        return `
            <div class="fade-in">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl);">
                    <div>
                        <h2>Gestión de Materiales</h2>
                        <p style="color: var(--text-muted); font-size: 0.875rem;">Control de inventario y materiales</p>
                    </div>
                    ${isAdmin() ? `
                        <button class="btn btn-primary" onclick="window.showMaterialForm()">
                            + Nuevo Material
                        </button>
                    ` : ''}
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-3" style="margin-bottom: var(--space-xl);">
                    <div class="kpi-card" style="background: var(--gradient-blue);">
                        <h3>Total Materiales</h3>
                        <p class="kpi-value">${materiales.length}</p>
                    </div>
                    <div class="kpi-card" style="background: var(--gradient-purple);">
                        <h3>Stock Total</h3>
                        <p class="kpi-value">${materiales.reduce((sum, m) => sum + (m.stock_actual || 0), 0)}</p>
                    </div>
                    <div class="kpi-card" style="background: var(--gradient-orange);">
                        <h3>Bajo Stock</h3>
                        <p class="kpi-value">${materiales.filter(m => m.stock_actual < 100).length}</p>
                    </div>
                </div>

                <div class="ui-card">
                    ${materiales.length === 0 ? `
                        <div style="text-align: center; padding: var(--space-xl); color: var(--text-muted);">
                            <p>No hay materiales registrados</p>
                        </div>
                    ` : `
                        <table class="modern-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Material</th>
                                    <th>Unidad</th>
                                    <th>Stock Actual</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${materiales.map(material => {
            const stockLevel = material.stock_actual;
            const badgeClass = stockLevel > 200 ? 'success' : stockLevel > 50 ? 'warning' : 'danger';
            const stockText = stockLevel > 200 ? 'Óptimo' : stockLevel > 50 ? 'Medio' : 'Bajo';

            return `
                                    <tr>
                                        <td><strong>#${material.id_material}</strong></td>
                                        <td><strong>${material.nombre}</strong></td>
                                        <td>${material.unidad}</td>
                                        <td><strong>${material.stock_actual}</strong></td>
                                        <td>
                                            <span class="badge badge--${badgeClass}">${stockText}</span>
                                        </td>
                                        <td>
                                            <div style="display: flex; gap: var(--space-sm);">
                                                ${isAdmin() ? `
                                                    <button class="btn btn-sm btn-secondary" onclick="window.editMaterial(${material.id_material})">
                                                        Editar
                                                    </button>
                                                    <button class="btn btn-sm" style="background: var(--color-danger); color: white;" onclick="window.deleteMaterial(${material.id_material}, '${material.nombre}')">
                                                        Eliminar
                                                    </button>
                                                ` : '-'}
                                            </div>
                                        </td>
                                    </tr>
                                `}).join('')}
                            </tbody>
                        </table>
                    `}
                </div>

                <!-- Modal Form -->
                <div id="material-modal" class="modal-backdrop" style="display: none;">
                    <div class="modal" onclick="event.stopPropagation()">
                        <div class="modal__header">
                            <h3 class="modal__title">${editingId ? 'Editar' : 'Nuevo'} Material</h3>
                            <button class="modal__close" onclick="window.hideMaterialForm()">×</button>
                        </div>
                        
                        <form id="material-form">
                            <div class="form-group">
                                <label class="form-label">Nombre del Material *</label>
                                <input type="text" class="form-input" name="nombre" required />
                            </div>
                            
                            <div class="grid grid-2">
                                <div class="form-group">
                                    <label class="form-label">Unidad *</label>
                                    <select class="form-select" name="unidad" required>
                                        <option value="">Seleccionar...</option>
                                        <option value="kg">Kilogramos (kg)</option>
                                        <option value="litros">Litros (L)</option>
                                        <option value="unidades">Unidades</option>
                                        <option value="metros">Metros (m)</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Stock Actual *</label>
                                    <input type="number" class="form-input" name="stock_actual" min="0" required />
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: var(--space-md); margin-top: var(--space-xl);">
                                <button type="submit" class="btn btn-primary" style="flex: 1;">
                                    ${editingId ? 'Actualizar' : 'Crear'}
                                </button>
                                <button type="button" class="btn btn-secondary" onclick="window.hideMaterialForm()">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    };

    const loadMateriales = async () => {
        try {
            materiales = await materialesApi.getAll();
            container.innerHTML = renderContent();
            setupEventListeners();
        } catch (error) {
            container.innerHTML = `<div style="padding: var(--space-xl); text-align: center; color: var(--color-danger);">Error al cargar materiales</div>`;
        }
    };

    const setupEventListeners = () => {
        const form = container.querySelector('#material-form');
        const modal = container.querySelector('#material-modal');

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
                unidad: formData.get('unidad'),
                stock_actual: parseInt(formData.get('stock_actual'))
            };

            try {
                if (editingId) {
                    await materialesApi.update(editingId, data);
                } else {
                    await materialesApi.create(data);
                }

                modal.style.display = 'none';
                editingId = null;
                form.reset();
                await loadMateriales();
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    };

    // Global functions
    window.showMaterialForm = () => {
        editingId = null;
        const modal = container.querySelector('#material-modal');
        const form = container.querySelector('#material-form');
        form.reset();
        modal.style.display = 'flex';
    };

    window.hideMaterialForm = () => {
        const modal = container.querySelector('#material-modal');
        modal.style.display = 'none';
        editingId = null;
    };

    window.editMaterial = async (id) => {
        try {
            const material = materiales.find(m => m.id_material === id);
            if (!material) return;

            editingId = id;

            const form = container.querySelector('#material-form');
            form.nombre.value = material.nombre;
            form.unidad.value = material.unidad;
            form.stock_actual.value = material.stock_actual;

            const modal = container.querySelector('#material-modal');
            modal.style.display = 'flex';
        } catch (error) {
            alert('Error al cargar material');
        }
    };

    window.deleteMaterial = async (id, nombre) => {
        if (!confirm(`¿Eliminar material "${nombre}"?`)) return;

        try {
            await materialesApi.delete(id);
            await loadMateriales();
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        }
    };

    loadMateriales();
    return container;
};
