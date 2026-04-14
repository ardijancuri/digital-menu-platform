import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Only redirect to home if we're not on a login page
            // This allows login pages to handle their own authentication errors
            const currentPath = window.location.pathname;
            const isLoginPage = currentPath === '/login' || currentPath === '/admin/login';

            if (!isLoginPage) {
                // Token expired or invalid - redirect to home
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    adminLogin: (credentials) => api.post('/auth/admin-login', credentials),
    userLogin: (credentials) => api.post('/auth/user-login', credentials),
};

// Application API
export const applicationAPI = {
    submit: (data) => api.post('/applications/apply', data),
};

// Admin API
export const adminAPI = {
    getApplications: (status) => api.get('/admin/applications', { params: { status } }),
    approveApplication: (id) => api.post(`/admin/applications/${id}/approve`),
    rejectApplication: (id) => api.post(`/admin/applications/${id}/reject`),
    updateApplicationPayment: (id, data) => api.put(`/admin/applications/${id}/payment`, data),
    getUsers: () => api.get('/admin/users'),
    toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle`),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getMapListings: () => api.get('/admin/map-listings'),
    getUnlinkedPlatformUsers: () => api.get('/admin/map-listings/unlinked-users'),
    createMapListing: (data) => api.post('/admin/map-listings', data),
    updateMapListing: (id, data) => api.put(`/admin/map-listings/${id}`, data),
    deleteMapListing: (id) => api.delete(`/admin/map-listings/${id}`),
};

// User API
export const userAPI = {
    getSettings: () => api.get('/user/settings'),
    updateSettings: (data) => api.put('/user/settings', data),
    uploadLogo: (file) => {
        const formData = new FormData();
        formData.append('logo', file);
        return api.post('/user/upload-logo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    getCategories: () => api.get('/user/categories'),
    createCategory: (data) => api.post('/user/categories', data),
    updateCategory: (id, data) => api.put(`/user/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/user/categories/${id}`),
    getMenuItems: () => api.get('/user/menu-items'),
    createMenuItem: (data) => api.post('/user/menu-items', data),
    updateMenuItem: (id, data) => api.put(`/user/menu-items/${id}`, data),
    deleteMenuItem: (id) => api.delete(`/user/menu-items/${id}`),
    uploadItemImage: (file, itemId) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('itemId', itemId);
        return api.post('/user/upload-item-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    deleteItemImage: (itemId, imageUrl) => api.post('/user/delete-item-image', { itemId, imageUrl }),
    uploadBannerImage: (file) => {
        const formData = new FormData();
        formData.append('banner', file);
        return api.post('/user/upload-banner', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    deleteBannerImage: (imageUrl) => api.post('/user/delete-banner', { imageUrl }),
    createManager: (data) => api.post('/user/managers', data),
    getManagers: () => api.get('/user/managers'),
    deleteManager: (id) => api.delete(`/user/managers/${id}`),
};

// Public API
export const publicAPI = {
    getMenu: (slug) => api.get(`/public/menu/${slug}`),
    getMapListings: (params) => api.get('/public/map-listings', { params }),
};

export default api;
