import { renderDashboard } from '../components/dashboard.js';
import { renderOrders } from '../components/orders.js';
import { renderTracking } from '../components/tracking.js';
import { renderReports } from '../components/reports.js';
import { renderLogin } from '../components/login.js';
import { renderClientTracking } from '../components/client_tracking.js';
import { renderOperators } from '../components/operators.js';
import { renderClientes } from '../components/clientes.js';
import { renderMateriales } from '../components/materiales.js';
import { requireAuth } from './auth.js';

const routes = {
    'dashboard': { render: renderDashboard, title: 'Dashboard' },
    'orders': { render: renderOrders, title: 'Órdenes de Trabajo' },
    'clientes': { render: renderClientes, title: 'Gestión de Clientes' },
    'tracking': { render: renderTracking, title: 'Seguimiento de Máquinas' },
    'materiales': { render: renderMateriales, title: 'Gestión de Materiales' },
    'operators': { render: renderOperators, title: 'Gestión de Operarios' },
    'reports': { render: renderReports, title: 'Reportes de Productividad' },
    'client-tracking': { render: renderClientTracking, title: 'Rastreo de Pedidos' }
};

export const initRouter = () => {
    const contentArea = document.getElementById('content-area');

    const navigate = (route) => {
        // Public routes (no auth required)
        const publicRoutes = ['client-tracking'];

        if (publicRoutes.includes(route)) {
            const routeConfig = routes[route];
            contentArea.innerHTML = '';
            contentArea.appendChild(routeConfig.render());

            // Hide sidebar/topbar for public routes
            const sidebar = document.querySelector('.sidebar');
            const topbar = document.querySelector('.topbar');
            if (sidebar) sidebar.style.display = 'none';
            if (topbar) topbar.style.display = 'none';
            return;
        }

        // Check auth for protected routes
        const user = requireAuth();
        if (!user) {
            // Show login
            contentArea.innerHTML = '';
            contentArea.appendChild(renderLogin());

            // Hide sidebar/topbar
            const sidebar = document.querySelector('.sidebar');
            const topbar = document.querySelector('.topbar');
            if (sidebar) sidebar.style.display = 'none';
            if (topbar) topbar.style.display = 'none';
            return;
        }

        // Restore sidebar/topbar if hidden
        const sidebar = document.querySelector('.sidebar');
        const topbar = document.querySelector('.topbar');
        if (sidebar && sidebar.style.display === 'none') {
            sidebar.style.display = 'block';
            topbar.style.display = 'flex';
        }

        // Render route
        const routeConfig = routes[route] || routes['dashboard'];
        contentArea.innerHTML = '';
        contentArea.appendChild(routeConfig.render());
    };

    // Handle hash navigation
    const handleHashChange = () => {
        const hash = window.location.hash.slice(1);
        navigate(hash || 'dashboard');
    };

    window.addEventListener('hashchange', handleHashChange);

    // Initial load
    handleHashChange();
};
