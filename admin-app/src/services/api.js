import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://real-estate-website-4z9x.onrender.com';
const API_URL = `${API_BASE_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add a response interceptor to handle 401 errors
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        // Clear token and redirect to login if unauthorized
        localStorage.removeItem('adminToken');
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});

export const propertyService = {
    getAll: (params) => api.get('/properties', { params }),
    getById: (id) => api.get(`/properties/${id}`),
    create: (data) => api.post('/properties', data),
    update: (id, data) => api.put(`/properties/${id}`, data),
    delete: (id) => api.delete(`/properties/${id}`)
};

export const userService = {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`)
};

export const agentService = {
    getAll: (params) => api.get('/agents', { params }),
    getById: (id) => api.get(`/agents/${id}`),
    create: (data) => api.post('/agents', data),
    update: (id, data) => api.put(`/agents/${id}`, data),
    delete: (id) => api.delete(`/agents/${id}`)
};

export const blogService = {
    getAll: (params) => api.get('/blogs', { params }),
    getById: (id) => api.get(`/blogs/${id}`),
    create: (data) => api.post('/blogs', data),
    update: (id, data) => api.put(`/blogs/${id}`, data),
    delete: (id) => api.delete(`/blogs/${id}`)
};

export const messageService = {
    getAll: (params) => api.get('/messages', { params }),
    getById: (id) => api.get(`/messages/${id}`),
    update: (id, data) => api.put(`/messages/${id}`, data),
    delete: (id) => api.delete(`/messages/${id}`)
};


export const authService = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    getMe: () => api.get('/auth/me'),
};

export const leadService = {
    getAll: (params) => api.get('/leads', { params }),
    update: (id, data) => api.put(`/leads/${id}`, data),
    delete: (id) => api.delete(`/leads/${id}`)
};

export const botService = {
    getSettings: () => api.get('/bot-settings'),
    updateSettings: (data) => api.put('/bot-settings', data)
};

export const notificationService = {
    getAll: () => api.get('/notifications'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`)
};

export const uploadService = {
    uploadSingle: (formData) => api.post('/upload/single', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    uploadMultiple: (formData) => api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};

export const chatService = {
    getAnalytics: () => api.get('/chat/analytics'),
    getHistory: (threadId) => api.get(`/chat/history/${threadId}`),
};

export const appointmentService = {
    getAll: () => api.get('/appointments'),
    update: (id, data) => api.put(`/appointments/${id}`, data),
    delete: (id) => api.delete(`/appointments/${id}`),
};

export const locationService = {
    getCities: () => api.get('/admin/cities'),
    createCity: (data) => api.post('/admin/cities', data),
    updateCity: (id, data) => api.put(`/admin/cities/${id}`, data),
    deleteCity: (id) => api.delete(`/admin/cities/${id}`),
    getAreas: (cityId) => api.get('/admin/areas', { params: { cityId } }),
    createArea: (data) => api.post('/admin/areas', data),
    updateArea: (id, data) => api.put(`/admin/areas/${id}`, data),
    deleteArea: (id) => api.delete(`/admin/areas/${id}`),
};

export default api;

