// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Token management
const getToken = () => localStorage.getItem('auth_token');
const setToken = (token) => localStorage.setItem('auth_token', token);
const removeToken = () => localStorage.removeItem('auth_token');

// Generic fetch wrapper with auth
const apiFetch = async (endpoint, options = {}) => {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    // Handle 401 unauthorized (Global handler)
    // Don't trigger for login endpoint to allow handling wrong credentials properly
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
        removeToken();
        localStorage.removeItem('lunatico_session_v1');

        // Only reload if we are not already on the login screen (to prevent loops)
        // Since we are SPA, we redirect to login 'virtual route' or reload
        const currentPage = window.location.hash;
        if (currentPage && currentPage !== '#login') {
            window.location.reload();
        }

        throw new Error('Sesión expirada');
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud');
    }

    return data;
};

// ============ AUTH API ============
export const authApi = {
    login: async (username, password) => {
        // Note: apiFetch will handle the request. If it returns 401, it will throw error with message from server
        // We need to ensure apiFetch doesn't reload page for this specific call
        const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        if (data.success && data.token) {
            setToken(data.token);
        }
        return data;
    },

    logout: () => {
        removeToken();
        localStorage.removeItem('lunatico_session_v1');
    },

    getProfile: () => apiFetch('/auth/profile'),

    updateProfile: (updates) => apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates)
    })
};

// ============ CLIENTES API ============
export const clientesApi = {
    getAll: async () => {
        const res = await apiFetch('/clientes');
        return res.data || [];
    },
    getById: async (id) => {
        const res = await apiFetch(`/clientes/${id}`);
        return res.data;
    },
    create: async (data) => {
        const res = await apiFetch('/clientes', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return res.data;
    },
    update: async (id, data) => {
        const res = await apiFetch(`/clientes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return res.data;
    },
    delete: (id) => apiFetch(`/clientes/${id}`, { method: 'DELETE' })
};

// ============ ORDERS API ============
export const ordersApi = {
    getAll: async () => {
        const res = await apiFetch('/orders');
        return res.data || [];
    },
    getById: async (id) => {
        const res = await apiFetch(`/orders/${id}`);
        return res.data;
    },
    create: async (order) => {
        const res = await apiFetch('/orders', {
            method: 'POST',
            body: JSON.stringify(order)
        });
        return res.data;
    },
    update: async (id, updates) => {
        const res = await apiFetch(`/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
        return res.data;
    },
    delete: (id) => apiFetch(`/orders/${id}`, { method: 'DELETE' })
};

// ============ MACHINES API ============
export const machinesApi = {
    getAll: async () => {
        const res = await apiFetch('/machines');
        return res.data || [];
    },
    getById: async (id) => {
        const res = await apiFetch(`/machines/${id}`);
        return res.data;
    },
    create: async (machine) => {
        const res = await apiFetch('/machines', {
            method: 'POST',
            body: JSON.stringify(machine)
        });
        return res.data;
    },
    update: async (id, updates) => {
        const res = await apiFetch(`/machines/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
        return res.data;
    },
    delete: (id) => apiFetch(`/machines/${id}`, { method: 'DELETE' })
};

// ============ MATERIALES API ============
export const materialesApi = {
    getAll: async () => {
        const res = await apiFetch('/materiales');
        return res.data || [];
    },
    create: async (data) => {
        const res = await apiFetch('/materiales', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return res.data;
    },
    update: async (id, data) => {
        const res = await apiFetch(`/materiales/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return res.data;
    },
    delete: (id) => apiFetch(`/materiales/${id}`, { method: 'DELETE' })
};

// ============ REPORTS API ============
export const reportsApi = {
    getAll: async () => {
        const res = await apiFetch('/reports');
        return res.data || [];
    },

    getStats: async () => {
        const res = await apiFetch('/reports/stats');
        return res.data || {};
    },

    generatePDF: async (mes, anio) => {
        const res = await apiFetch('/reports/generate-pdf', {
            method: 'POST',
            body: JSON.stringify({ mes, anio })
        });
        return res;
    },

    downloadPDF: async (filename) => {
        const token = getToken();
        const url = `${API_BASE_URL}/reports/download-pdf/${filename}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al descargar PDF');
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
    }
};

// ============ TRACKING API (Public) ============
export const trackingApi = {
    getOrder: async (orderId) => {
        const response = await fetch(`${API_BASE_URL}/tracking/${orderId}`);
        return response.json();
    }
};

// Export token utilities
export { getToken, setToken, removeToken };
