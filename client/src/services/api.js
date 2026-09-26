import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect if needed
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me')
};

// Trip Services
export const tripService = {
  getTrips: () => API.get('/trips'),
  getTripById: (id) => API.get(`/trips/${id}`),
  createTrip: (data) => API.post('/trips', data),
  updateTrip: (id, data) => API.put(`/trips/${id}`, data),
  deleteTrip: (id) => API.delete(`/trips/${id}`),
  getSettlement: (id) => API.get(`/trips/${id}/settlement`),
  
  // Members
  addMember: (tripId, data) => API.post(`/trips/${tripId}/members`, data),
  deleteMember: (tripId, memberId) => API.delete(`/trips/${tripId}/members/${memberId}`),

  // Expenses
  addExpense: (tripId, data) => API.post(`/trips/${tripId}/expenses`, data),
  getExpenses: (tripId) => API.get(`/trips/${tripId}/expenses`)
};

// Standalone Expense Services
export const expenseService = {
  updateExpense: (id, data) => API.put(`/expenses/${id}`, data),
  deleteExpense: (id) => API.delete(`/expenses/${id}`)
};

export default API;
