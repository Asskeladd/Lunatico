import { authApi, setToken } from '../utils/api.js';

export const getCurrentUser = () => {
    const sessionData = localStorage.getItem('lunatico_session_v1');
    if (!sessionData) return null;
    try {
        return JSON.parse(sessionData);
    } catch {
        return null;
    }
};

export const login = async (username, password) => {
    const response = await authApi.login(username, password);

    if (response.success && response.user) {
        const sessionData = {
            ...response.user,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('lunatico_session_v1', JSON.stringify(sessionData));
        return response.user;
    }

    throw new Error(response.message || 'Error al iniciar sesión');
};

export const logout = () => {
    authApi.logout();
    window.location.href = '/';
};

export const updateCurrentUser = (updates) => {
    const current = getCurrentUser();
    if (current) {
        const updated = { ...current, ...updates };
        localStorage.setItem('lunatico_session_v1', JSON.stringify(updated));
    }
};

export const requireAuth = () => {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/';
        return null;
    }
    return user;
};

export const isAdmin = () => {
    const user = getCurrentUser();
    return user?.role === 'admin';
};
