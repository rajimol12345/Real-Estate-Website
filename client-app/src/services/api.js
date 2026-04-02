import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:5005/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Add a response interceptor to handle 401 errors
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        // Clear token/userInfo if unauthorized
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token'); // Some apps might store it separately
    }
    return Promise.reject(error);
});

export const propertyService = {
    getAll: (params) => api.get('/properties', { params }),
    getById: (id) => api.get(`/properties/${id}`),
    create: (data) => api.post('/properties', data),
    uploadImages: (formData) => api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    update: (id, data) => api.put(`/properties/${id}`, data),
    delete: (id) => api.delete(`/properties/${id}`),
};

export const blogService = {
    getAll: (params) => api.get('/blogs', { params }),
    getById: (id) => api.get(`/blogs/${id}`),
};

export const agentService = {
    getAll: (params) => api.get('/agents', { params }),
    getAgentById: (id) => api.get(`/agents/${id}`),
};

export const ratingService = {
    submitRating: (data) => api.post('/reviews', data),
    getUserRating: (propertyId) => api.get(`/reviews/user/${propertyId}`),
    getPropertyRatings: (propertyId) => api.get(`/reviews/property/${propertyId}`),
};

export const messageService = {
    send: (data) => api.post('/messages', data),
};

export const chatService = {
    sendMessage: (data) => api.post('/chat', data),
    getHistory: (threadId) => api.get(`/chat/history/${threadId}`),
};

export const appointmentService = {
    book: (data) => api.post('/appointments', data),
};

export const paymentService = {
    createOrder: (data) => api.post('/payments/create-order', data),
    verifyPayment: (data) => api.post('/payments/verify', data),
    getMyBookings: () => api.get('/payments'),
};

export const communicationService = {
    submitInquiry: (data) => api.post('/inquiries', data),
    requestCallback: (data) => api.post('/callbacks', data),
};

export default api;
