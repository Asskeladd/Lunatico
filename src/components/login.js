import { login } from '../utils/auth.js';

export const renderLogin = () => {
    const container = document.createElement('div');
    container.style.cssText = `
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        overflow: hidden;
    `;

    container.innerHTML = `
        <video autoplay muted loop playsinline id="login-video" style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: -2;
        ">
            <source src="/login-background.mp4" type="video/mp4">
        </video>

        <div id="login-overlay" style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%);
            z-index: -1;
            pointer-events: none;
        "></div>

        <div class="card" style="width: 100%; max-width: 400px; padding: 2.5rem; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h1 style="font-weight: 700; font-size: 2rem; margin-bottom: 0.5rem;">Taller<span style="color: var(--color-accent-400)">Zambrano</span></h1>
                <p style="color: var(--text-muted);">Inicia sesión en tu cuenta</p>
            </div>
            
            <form id="login-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                     <label style="font-size: 0.875rem; font-weight: 500;">Usuario</label>
                     <input type="text" name="username" class="login-input" placeholder="admin o operator" required 
                        style="padding: 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); outline: none;">
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                     <label style="font-size: 0.875rem; font-weight: 500;">Contraseña</label>
                     <input type="password" name="password" class="login-input" placeholder="123" required 
                        style="padding: 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); outline: none;">
                </div>
                
                <p id="login-error" style="color: var(--color-danger); font-size: 0.875rem; min-height: 1.25em; text-align: center;"></p>
                
                <button type="submit" class="btn btn-primary" style="margin-top: 0.5rem; padding: 0.75rem; font-weight: 600;">Ingresar</button>
            </form>

            <div style="margin-top: 2rem;">
                 <button id="link-tracking" style="
                    width: 100%;
                    padding: 1rem;
                    background: var(--bg-body);
                    border: 2px dashed var(--color-accent-300);
                    color: var(--color-accent-700);
                    font-weight: 600;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                 " onmouseover="this.style.background='var(--color-accent-50)'; this.style.borderColor='var(--color-accent-500)'" onmouseout="this.style.background='var(--bg-body)'; this.style.borderColor='var(--color-accent-300)'">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    ¿Eres cliente? Rastrear Pedido
                 </button>
            </div>
            
          
    `;

    const form = container.querySelector('#login-form');
    const errorMsg = container.querySelector('#login-error');
    const linkTracking = container.querySelector('#link-tracking');

    linkTracking.addEventListener('click', (e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'client-tracking' }));
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const result = login(formData.get('username'), formData.get('password'));

        if (result.success) {
            location.reload();
        } else {
            errorMsg.textContent = 'Credenciales inválidas';
            container.querySelectorAll('input').forEach(i => i.style.borderColor = 'var(--color-danger)');
        }
    });

    container.querySelectorAll('.login-input').forEach(input => {
        input.addEventListener('focus', () => input.style.borderColor = 'var(--border-focus)');
        input.addEventListener('blur', () => input.style.borderColor = 'var(--border-light)');
    });

    return container;
};
