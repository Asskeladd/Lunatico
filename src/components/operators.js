import { addUser, getUsers } from '../mock_data/data.js';
import { getCurrentUser } from '../utils/auth.js';

export const renderOperators = () => {
    const container = document.createElement('div');
    const user = getCurrentUser();
    const isAdmin = user && user.role === 'admin';

    if (!isAdmin) {
        container.innerHTML = `
            <div class="card">
                <h2 style="font-weight: 600; margin-bottom: 0.5rem;">Acceso restringido</h2>
                <p style="color: var(--text-muted);">Solo el administrador puede gestionar operadores.</p>
            </div>
        `;
        return container;
    }

    const getOperators = () => (getUsers() || []).filter(u => u.role === 'operator');

    const renderList = () => {
        const operators = getOperators();
        return `
            <div class="card" style="margin-top: 1.5rem;">
                <div style="display:flex; justify-content: space-between; align-items: baseline; gap: 1rem;">
                    <h2 style="font-weight: 600;">Operadores registrados</h2>
                    <span style="color: var(--text-muted); font-size: 0.875rem;">Total: <strong>${operators.length}</strong></span>
                </div>
                <div style="overflow:auto; margin-top: 1rem;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 520px;">
                        <thead>
                            <tr style="text-align: left; border-bottom: 1px solid var(--border-light);">
                                <th style="padding: 0.75rem; color: var(--text-muted); font-weight: 500;">ID</th>
                                <th style="padding: 0.75rem; color: var(--text-muted); font-weight: 500;">Nombre</th>
                                <th style="padding: 0.75rem; color: var(--text-muted); font-weight: 500;">Usuario</th>
                                <th style="padding: 0.75rem; color: var(--text-muted); font-weight: 500;">Rol</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${operators.map(op => `
                                <tr style="border-bottom: 1px solid var(--border-light);">
                                    <td style="padding: 0.75rem;">${op.id || '-'}</td>
                                    <td style="padding: 0.75rem;"><strong>${op.name || '-'}</strong></td>
                                    <td style="padding: 0.75rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">${op.username}</td>
                                    <td style="padding: 0.75rem; color: var(--text-muted);">${op.role}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    };

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h1 style="font-size: 1.5rem; font-weight: 600;">Gestión de Operadores</h1>
        </div>

        <div class="card">
            <h2 style="font-weight: 600; margin-bottom: 1rem;">Registrar nuevo operador</h2>
            <form id="operator-form" style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 0.75rem; align-items: end;">
                <div style="grid-column: span 4; display:flex; flex-direction: column; gap: 0.25rem;">
                    <label style="font-size: 0.75rem; color: var(--text-muted);">Nombre</label>
                    <input name="name" required style="padding: 0.6rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm);" />
                </div>
                <div style="grid-column: span 4; display:flex; flex-direction: column; gap: 0.25rem;">
                    <label style="font-size: 0.75rem; color: var(--text-muted);">Usuario</label>
                    <input name="username" required style="padding: 0.6rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm);" />
                </div>
                <div style="grid-column: span 4; display:flex; flex-direction: column; gap: 0.25rem;">
                    <label style="font-size: 0.75rem; color: var(--text-muted);">Contraseña</label>
                    <input name="password" type="password" required style="padding: 0.6rem 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm);" />
                </div>
                <div style="grid-column: span 12; display:flex; justify-content: flex-end;">
                    <button type="submit" class="btn btn-primary">Registrar</button>
                </div>
            </form>
            <p id="operator-error" style="display:none; margin-top: 0.75rem; color: var(--color-danger); font-size: 0.875rem;"></p>
        </div>

        <div id="operators-list">
            ${renderList()}
        </div>
    `;

    const form = container.querySelector('#operator-form');
    const errorEl = container.querySelector('#operator-error');

    const setError = (msg) => {
        if (!errorEl) return;
        if (!msg) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
            return;
        }
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
    };

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            setError('');

            const formData = new FormData(form);
            const name = String(formData.get('name') || '').trim();
            const username = String(formData.get('username') || '').trim();
            const password = String(formData.get('password') || '').trim();

            if (!name || !username || !password) {
                setError('Completa todos los campos.');
                return;
            }

            const existing = getUsers() || [];
            const duplicated = existing.some(u => String(u.username).toLowerCase() === username.toLowerCase());
            if (duplicated) {
                setError(`El usuario "${username}" ya existe.`);
                return;
            }

            const newUser = {
                id: `u${Math.floor(Math.random() * 100000)}`,
                username,
                password,
                name,
                role: 'operator'
            };

            addUser(newUser);

            form.reset();
            const list = container.querySelector('#operators-list');
            if (list) list.innerHTML = renderList();
        });
    }

    return container;
};
