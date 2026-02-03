import { login } from '../utils/auth.js';

export const renderLogin = () => {
    const container = document.createElement('div');
    container.className = 'login-container';

    container.innerHTML = `
        <!-- Background Video -->
        <div class="login-background">
            <video autoplay muted loop playsinline class="login-video" poster="/assets/placeholder.jpg">
                <!-- User to place video at public/background.mp4 -->
                <source src="/background.mp4" type="video/mp4">
            </video>
            <div class="login-overlay"></div>
        </div>

        <!-- Login Card -->
        <div class="login-content">
            <div class="ui-card login-card animate-fade-in-up">
                <div class="text-center mb-6">
                    <!-- Updated Title Style -->
                    <h1 class="text-3xl font-bold text-gray-900 mb-2" style="letter-spacing: -0.025em;">
                        Taller<span style="color: var(--color-primary-600);">Zambrano</span>
                    </h1>
                    <p class="text-gray-500 text-sm">Ingresa tus credenciales</p>
                </div>
                
                <div id="login-error" class="badge badge--danger w-full justify-center mb-6 hidden p-3"></div>
                
                <form id="login-form">
                    <div class="form-group mb-4">
                        <label class="form-label">Usuario</label>
                        <input 
                            type="text" 
                            class="form-input" 
                            name="username" 
                            placeholder="admin o operator" 
                            required 
                            autocomplete="username"
                            autofocus
                        />
                    </div>
                    
                    <div class="form-group mb-6">
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
                    
                    <button type="submit" class="btn btn-primary w-full justify-center mt-2" style="display: flex;">
                        Iniciar Sesión
                    </button>
                </form>
                
                <div class="text-center mt-6 pt-6 border-t border-gray-100">
                    <a href="#client-tracking" class="text-sm font-medium text-primary-600 hover:text-primary-700">
                        ¿Eres cliente? Rastrear Pedido
                    </a>
                </div>
            </div>
        </div>

        <style>
            .login-container {
                position: relative;
                width: 100%;
                height: 100vh;
                overflow: hidden;
            }

            .login-background {
                position: absolute;
                inset: 0;
                z-index: 0;
            }

            .login-video {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            /* Vignette Effect: Dark edges, transparent center */
            .login-overlay {
                position: absolute;
                inset: 0;
                background: radial-gradient(circle at center, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.85) 100%);
                z-index: 1;
            }

            .login-content {
                position: relative;
                z-index: 10;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--space-lg);
            }

            .login-card {
                width: 100%;
                max-width: 400px;
                background: rgba(255, 255, 255, 0.95); /* Slight transparency */
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255, 255, 255, 0.5);
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* Deep shadow to pop */
            }

            .animate-fade-in-up {
                animation: fadeInUp 0.5s ease-out;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
    `;

    const form = container.querySelector('#login-form');
    const errorDiv = container.querySelector('#login-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.classList.add('hidden');
        errorDiv.style.display = 'none';

        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Ingresando...';

        try {
            await login(username, password);
            // Force standard reload to clear any state
            window.location.href = '/';
        } catch (error) {
            errorDiv.textContent = error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
            errorDiv.classList.remove('hidden');
            errorDiv.style.display = 'flex';
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    return container;
};
