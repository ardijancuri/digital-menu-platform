import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

// Create axios instance with auth header
const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const posAPI = {
    // Tables
    getTables: () => api.get('/pos/tables'),
    createTable: (data) => api.post('/pos/tables', data),
    updateTableStatus: (id, status) => api.put(`/pos/tables/${id}/status`, { status }),
    deleteTable: (id) => api.delete(`/pos/tables/${id}`),

    // Staff
    getStaff: () => api.get('/pos/staff'),
    createStaff: (data) => api.post('/pos/staff', data),
    loginStaff: (pin_code) => api.post('/pos/staff/login', { pin_code }),
    verifyStaffPin: (staff_id, pin_code) => api.post('/pos/staff/verify-pin', { staff_id, pin_code }),
    deleteStaff: (id) => api.delete(`/pos/staff/${id}`),
    getStaffRevenue: () => api.get('/pos/staff/revenue'),
    resetStaffRevenue: () => api.post('/pos/staff/reset-revenue', {}, { responseType: 'blob' }),
    getStaffReport: (staffId) => api.get(`/pos/staff/${staffId}/report`, { responseType: 'blob' }),

    // Orders
    getOrders: (status) => api.get(`/pos/orders?status=${status || ''}`),
    createOrder: (data) => api.post('/pos/orders', data),
    addItemsToOrder: (orderId, data) => api.post(`/pos/orders/${orderId}/items`, data),
    updateOrderStatus: (id, data) => api.put(`/pos/orders/${id}/status`, data),
    updateOrderTable: (id, table_id) => api.put(`/pos/orders/${id}/table`, { table_id }),

    // Reports
    getDailyRevenue: () => api.get('/pos/reports/daily-revenue'),
};
