import { getStore } from '../mock_data/data.js';

const SESSION_KEY = 'lunatico_session_v1';

export const login = (username, password) => {
    const users = getStore().users || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Don't store password in session
        const { password, ...safeUser } = user;
        localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
        return { success: true, user: safeUser };
    }

    return { success: false, message: 'Invalid credentials' };
};

export const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.reload();
};

export const getCurrentUser = () => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
};

export const requireAuth = (route) => {
    const user = getCurrentUser();
    if (!user) return false;
    return true; // Simple check for now, can extend for specific role guards
};

export const hasPermission = (permission) => {
    const user = getCurrentUser();
    if (!user) return false;

    if (user.role === 'admin') return true;

    // Operator permissions
    if (user.role === 'operator') {
        const allowed = ['orders:read', 'orders:update', 'tracking:read'];
        return allowed.includes(permission);
    }

    return false;
};

import { updateUser } from '../mock_data/data.js';

export const updateCurrentUser = (updates) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return { success: false, message: 'No active session' };

    // Update in DB
    updateUser(currentUser.id, updates);

    // Update in Session
    const updatedUser = { ...currentUser, ...updates };
    // Remove password from session if it was part of updates (though it shouldn't be stored in session anyway)
    if (updatedUser.password) delete updatedUser.password;

    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

    return { success: true, user: updatedUser };
};
