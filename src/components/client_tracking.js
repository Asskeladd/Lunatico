import { trackingApi } from '../utils/api.js';

export const renderClientTracking = () => {
    const container = document.createElement('div');
    container.style.cssText = `
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-app);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
    `;

    container.innerHTML = `
        <div class="card" style="width: 100%; max-width: 500px; padding: 2.5rem; position: relative;">
            <button id="btn-back" style="position: absolute; top: 1.5rem; left: 1.5rem; color: var(--text-muted); font-size: 0.875rem; display: flex; align-items: center; gap: 0.25rem;">
                ← Volver
            </button>
            
            <div style="text-align: center; margin-bottom: 2rem; margin-top: 1rem;">
                <h1 style="font-weight: 700; font-size: 1.75rem; margin-bottom: 0.5rem;">Rastreo de Pedidos</h1>
                <p style="color: var(--text-muted);">Ingrese su código de orden para ver el estado</p>
            </div>
            
            <form id="tracking-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: flex; gap: 0.5rem;">
                     <input type="text" name="orderId" placeholder="Ej: ORD-001" required 
                        style="flex: 1; padding: 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); outline: none;">
                     <button type="submit" id="search-btn" class="btn btn-primary">Buscar</button>
                </div>
            </form>
            
            <div id="result-area" style="margin-top: 2rem; display: none;">
                <!-- Result injected here -->
            </div>
        </div>
    `;

    const form = container.querySelector('#tracking-form');
    const resultArea = container.querySelector('#result-area');
    const btnBack = container.querySelector('#btn-back');
    const searchBtn = container.querySelector('#search-btn');

    btnBack.addEventListener('click', () => {
        window.location.reload();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const orderId = formData.get('orderId').trim();

        searchBtn.disabled = true;
        searchBtn.textContent = 'Buscando...';
        resultArea.style.display = 'none';

        try {
            const result = await trackingApi.getOrder(orderId);

            resultArea.style.display = 'block';

            if (result.success && result.order) {
                const order = result.order;
                resultArea.innerHTML = `
                    <div style="background: var(--color-primary-50); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                            <span style="font-weight: 600;">Pedido #${order.id}</span>
                            <span style="
                                 padding: 0.25rem 0.5rem; 
                                 border-radius: var(--radius-full); 
                                 font-size: 0.75rem; 
                                 background: ${order.status === 'En Progreso' ? 'var(--color-accent-100)' : order.status === 'Completada' ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-primary-100)'}; 
                                 color: ${order.status === 'En Progreso' ? 'var(--color-accent-600)' : order.status === 'Completada' ? 'var(--color-success)' : 'var(--color-primary-600)'};
                            ">${order.status}</span>
                        </div>
                        <p style="margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.875rem;">Descripción: <strong style="color: var(--text-main);">${order.description}</strong></p>
                        <p style="margin-bottom: 1rem; color: var(--text-muted); font-size: 0.875rem;">Fecha Estimada: <strong style="color: var(--text-main);">${order.deadline}</strong></p>
                        
                        ${order.status === 'En Progreso' ? `
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.75rem; color: var(--text-muted);">
                                <span>Progreso</span>
                                <span>${order.progress}%</span>
                            </div>
                            <div style="height: 6px; background: var(--color-primary-200); border-radius: var(--radius-full); overflow: hidden;">
                                <div style="width: ${order.progress}%; height: 100%; background: var(--color-accent-500);"></div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                `;
            } else {
                resultArea.innerHTML = `
                    <div style="text-align: center; color: var(--color-danger); padding: 1rem;">
                        ${result.message || 'Pedido no encontrado. Verifique el código.'}
                    </div>
                `;
            }
        } catch (error) {
            resultArea.style.display = 'block';
            resultArea.innerHTML = `
                <div style="text-align: center; color: var(--color-danger); padding: 1rem;">
                    Error de conexión con el servidor
                </div>
            `;
        }

        searchBtn.disabled = false;
        searchBtn.textContent = 'Buscar';
    });

    return container;
};
