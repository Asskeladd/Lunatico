import { renderDashboard } from '../components/dashboard.js';
import { renderOrders } from '../components/orders.js';
import { renderTracking } from '../components/tracking.js';
import { renderReports } from '../components/reports.js';
import { renderLogin } from '../components/login.js';
import { renderClientTracking } from '../components/client_tracking.js';
import { renderOperators } from '../components/operators.js';
import { requireAuth, logout } from './auth.js';

const routes = {
    'dashboard': { render: renderDashboard, title: 'Panel Principal' },
    'orders': { render: renderOrders, title: 'Órdenes de Trabajo' },
    'tracking': { render: renderTracking, title: 'Seguimiento de Máquinas' },
    'reports': { render: renderReports, title: 'Reportes de Productividad' },
    'operators': { render: renderOperators, title: 'Gestión de Operadores' },
    'client-tracking': { render: renderClientTracking, title: 'Rastreo de Pedidos' }
};

export const initRouter = () => {
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('page-title');
    const navLinks = document.querySelectorAll('.nav-item');

    const navigate = (route) => {
        if (route === 'logout') {
            logout();
            return;
        }

        // Public Routes (No Auth Required)
        const publicRoutes = ['client-tracking'];
        if (publicRoutes.includes(route)) {
            contentArea.innerHTML = '';
            contentArea.appendChild(routes[route].render());
            // Hide Shell for public routes
            if (pageTitle) pageTitle.textContent = routes[route].title;
            const sidebar = document.querySelector('.app-sidebar');
            const header = document.querySelector('.app-header');
            if (sidebar) sidebar.style.display = 'none';
            if (header) header.style.display = 'none';
            return;
        }

        if (!requireAuth(route)) {
            // Render Login overlay
            contentArea.innerHTML = '';
            contentArea.appendChild(renderLogin());

            // Hide shell elements
            if (pageTitle) pageTitle.textContent = 'Iniciar Sesión';
            const sidebar = document.querySelector('.app-sidebar');
            const header = document.querySelector('.app-header');
            if (sidebar) sidebar.style.display = 'none';
            if (header) header.style.display = 'none';
            return;
        }

        // Restore Shell if logged in
        const sidebar = document.querySelector('.app-sidebar');
        const header = document.querySelector('.app-header');
        if (sidebar && sidebar.style.display === 'none') {
            sidebar.style.display = 'flex';
            header.style.display = 'flex';
        }

        const routeConfig = routes[route] || routes['dashboard'];

        // Update Content
        contentArea.innerHTML = '';
        const view = routeConfig.render();

        if (typeof view === 'string') {
            contentArea.innerHTML = view;
        } else if (view instanceof Node) {
            contentArea.appendChild(view);
        }

        // Update Title
        if (pageTitle) pageTitle.textContent = routeConfig.title;

        // Update Navigation Active State
        navLinks.forEach(link => {
            const linkRoute = link.dataset.route;
            if (linkRoute === route) {
                link.style.backgroundColor = 'rgba(255,255,255,0.1)';
                link.style.color = 'var(--text-on-accent)';
            } else {
                link.style.backgroundColor = 'transparent';
                link.style.color = 'var(--color-primary-400)';
            }
        });
    };

    document.querySelectorAll('[data-route]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Handle click on child elements
            const target = e.target.closest('[data-route]');
            const route = target.dataset.route;
            navigate(route);
        });
    });

    // Listen for custom navigation events (from login etc)
    window.addEventListener('navigate', (e) => {
        navigate(e.detail);
    });

    // Initial load
    if (!requireAuth()) {
        navigate('login'); // virtual route
    } else {
        navigate('dashboard');
    }
};
