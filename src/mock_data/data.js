const DB_KEY = 'lunatico_db_v2';

const initialData = {
    orders: [
        { id: 'ORD-001', client: 'Industrias A', description: 'Eje Principal', quantity: 50, deadline: '2026-02-10', status: 'En Progreso', priority: 'Alta', progress: 65 },
        { id: 'ORD-002', client: 'Metalmecánica B', description: 'Buje de Bronce', quantity: 200, deadline: '2026-02-15', status: 'Pendiente', priority: 'Media', progress: 0 },
        { id: 'ORD-003', client: 'AgroParts', description: 'Engranaje Cónico', quantity: 20, deadline: '2026-02-05', status: 'Completada', priority: 'Baja', progress: 100 },
        { id: 'ORD-004', client: 'AutoFix', description: 'Disco de Freno', quantity: 10, deadline: '2026-01-20', status: 'Retrasada', priority: 'Alta', progress: 80 }
    ],
    machines: [
        { id: 'M-01', name: 'Torno CNC 1', status: 'Operando', operator: 'Luis G.', currentJob: 'ORD-001', efficiency: 92 },
        { id: 'M-02', name: 'Torno Convencional A', status: 'Inactivo', operator: 'Ana M.', currentJob: null, efficiency: 0 },
        { id: 'M-03', name: 'Torno Convencional B', status: 'Mantenimiento', operator: null, currentJob: null, efficiency: 0 },
        { id: 'M-04', name: 'Fresadora 1', status: 'Operando', operator: 'Carlos R.', currentJob: 'ORD-002', efficiency: 88 },
        { id: 'M-05', name: 'Taladro Radial', status: 'Detenido', operator: null, currentJob: null, efficiency: 0 }
    ],
    reports: {
        productivity: [
            { day: 'Lun', value: 85 },
            { day: 'Mar', value: 92 },
            { day: 'Mié', value: 78 },
            { day: 'Jue', value: 88 },
            { day: 'Vie', value: 95 }
        ]
    },
    users: [
        { id: 'u1', username: 'admin', password: '123', name: 'Juan Admin', role: 'admin' },
        { id: 'u2', username: 'operator', password: '123', name: 'Carlos Operador', role: 'operator' }
    ]
};

export const getStore = () => {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
        localStorage.setItem(DB_KEY, JSON.stringify(initialData));
        return initialData;
    }
    return JSON.parse(data);
};

export const saveStore = (data) => {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    const event = new CustomEvent('store-updated');
    window.dispatchEvent(event);
};

export const getOrders = () => getStore().orders;
export const getMachines = () => getStore().machines;
export const getReports = () => getStore().reports;
export const getUsers = () => getStore().users;

export const addOrder = (order) => {
    const store = getStore();
    store.orders.push(order);
    saveStore(store);
}

export const updateOrder = (id, updates) => {
    const store = getStore();
    const index = store.orders.findIndex(o => o.id === id);
    if (index !== -1) {
        store.orders[index] = { ...store.orders[index], ...updates };
        saveStore(store);
    }
}

export const updateMachine = (id, updates) => {
    const store = getStore();
    const index = store.machines.findIndex(m => m.id === id);
    if (index !== -1) {
        store.machines[index] = { ...store.machines[index], ...updates };
        saveStore(store);
    }
}
