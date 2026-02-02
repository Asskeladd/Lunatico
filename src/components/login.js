import { login } from '../utils/auth.js';

export const renderLogin = () => {
    const container = document.createElement('div');

    container.innerHTML = `
        <style>
            .login-wrapper {
                min-height: 100vh;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #f8fafc; /* Solid light gray background */
                padding: var(--space-lg);
            }
            
            .login-box {
                background: #ffffff;
                padding: 3rem;
                border-radius: 8px; /* Simple radius */
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Subtle shadow */
                width: 100%;
                max-width: 450px;
                border: 1px solid #e2e8f0;
            }
            
            .login-header {
                text-align: center;
                margin-bottom: 2.5rem;
            }
            
            .login-logo {
                font-size: 3.5rem;
                margin-bottom: 1rem;
                display: block;
            }
            
            .login-title {
                font-size: 1.875rem;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 0.5rem;
                font-family: inherit;
            }
            
            .login-subtitle {
                color: #64748b;
                font-size: 1rem;
            }
            
            .login-error {
                background-color: #fef2f2;
                color: #dc2626;
                padding: 1rem;
                border-radius: 6px;
                margin-bottom: 1.5rem;
                font-size: 0.875rem;
                display: none;
                border: 1px solid #fee2e2;
                text-align: center;
            }
            
            .form-group {
                margin-bottom: 1.5rem;
            }
            
            .form-label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
                color: #334155;
                font-size: 0.9375rem;
                text-align: left;
            }
            
            .form-input {
                width: 100%;
                padding: 0.75rem 1rem;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                font-size: 1rem;
                color: #0f172a;
                background-color: #fff;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            
            .form-input:focus {
                outline: none;
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }
            
            .btn-login {
                width: 100%;
                padding: 0.875rem;
                background-color: #0f172a; /* Solid dark color - professional */
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 0.2s;
                margin-top: 1rem;
            }
            
            .btn-login:hover {
                background-color: #1e293b;
            }
            
            .btn-login:disabled {
                background-color: #94a3b8;
                cursor: not-allowed;
            }
            
            .login-footer {
                text-align: center;
                margin-top: 2rem;
                padding-top: 1.5rem;
                border-top: 1px solid #e2e8f0;
            }
            
            .login-footer a {
                color: #2563eb; /* Simple blue link */
                text-decoration: none;
                font-size: 0.9375rem;
                font-weight: 500;
            }
            
            .login-footer a:hover {
                text-decoration: underline;
                color: #1d4ed8;
            }
        </style>
        
        <div class="login-wrapper">
            <div class="login-box">
                <div class="login-header">
                    <div class="login-logo">🏭</div>
                    <h1 class="login-title">Taller Zambrano</h1>
                    <p class="login-subtitle">Ingresa tus credenciales</p>
                </div>
                
                <div id="login-error" class="login-error"></div>
                
                <form id="login-form">
                    <div class="form-group">
                        <label class="form-label">Usuario</label>
                        <input 
                            type="text" 
                            class="form-input" 
                            name="username" 
                            placeholder="Ej. admin" 
                            required 
                            autocomplete="username"
                            autofocus
                        />
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Contraseña</label>
                        <input 
                            type="password" 
                            class="form-input" 
                            name="password" 
                            placeholder="••••••••" 
                            required
                            autocomplete="current-password"
                        />
                    </div>
                    
                    <button type="submit" class="btn-login">
                        Iniciar Sesión
                    </button>
                </form>
                
                <div class="login-footer">
                    <a href="#client-tracking">Seguimiento de Pedidos →</a>
                </div>
            </div>
        </div>
    `;

    const form = container.querySelector('#login-form');
    const errorDiv = container.querySelector('#login-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.style.display = 'none';

        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Ingresando...';

        try {
            await login(username, password);
            window.location.reload();
        } catch (error) {
            errorDiv.textContent = error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
            errorDiv.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar Sesión';
        }
    });

    return container;
};
