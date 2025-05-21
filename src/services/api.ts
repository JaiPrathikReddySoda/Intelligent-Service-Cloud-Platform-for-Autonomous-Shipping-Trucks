import axios from 'axios';

// ──────────────────────────────────────────────────── REAL API ──────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) config.headers!['Authorization'] = `Bearer ${token}`;
    return config;
  },
  err => Promise.reject(err)
);

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(err);
  }
);

export default api;

// ──────────────────────────────────────────────────── API WRAPPERS ──────
export const authAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  signup: (name: string, email: string, password: string) => api.post('/auth/signup', { name, email, password }),
  getProfile: () => api.get('/profile'),
  updateProfile: (u: any) => api.put('/profile', u),
};

export const trucksAPI = {
  getAll: () => api.get('/trucks'),
  getById: (id: string) => api.get(`/trucks/${id}`),
  create: (t: any) => api.post('/trucks', t),
  update: (id: string, t: any) => api.put(`/trucks/${id}`, t),
  delete: (id: string) => api.delete(`/trucks/${id}`),
  getStats: () => api.get('/trucks/stats'), 
};

export const scheduleAPI = {
  getAll: () => api.get('/schedule'),
  getById: (id: string) => api.get(`/schedule/${id}`),
  create: (data: Omit<Schedule, 'id'>) => api.post('/schedule', data),
  update: (id: string, data: Partial<Schedule>) => api.put(`/schedule/${id}`, data),
  delete: (id: string) => api.delete(`/schedule/${id}`),
  getStats: () => api.get('/schedule/stats'),
};

export const serviceRequestAPI = {
  getAll: () => api.get('/servicerequests'),
  getServiceRequestById: (id: string) => api.get(`/servicerequests/${id}`),
  create: (d: Omit<ServiceRequest, 'id'>) => api.post('/servicerequests', d),
  update: (id: string, r: Partial<ServiceRequest>) => api.put(`/servicerequests/${id}`, r), // ✅ Unified with trucks/schedule
  updateServiceRequest: (id: string, r: Partial<ServiceRequest>) => api.put(`/servicerequests/${id}`, r), // optional alias
  delete: (id: string) => api.delete(`/servicerequests/${id}`),
  getStats: () => api.get('/servicerequests/stats'),
};

export const simulationAPI = {
  start: () => api.post('/simulate'),
  getStatus: () => api.get('/simulation/status'),
};

export const aiAPI = {
  askQuestion: (q: string) => api.post('/ask-ai', { question: q }),
};

// ──────────────────────────────────────────────── TYPES ─────────────────
export type TruckStatus = 'active' | 'maintenance' | 'idle';
export type ServiceRequestStatus = 'pending' | 'in-progress' | 'completed';

export interface Truck {
  id: string;
  name: string;
  model: string;
  year: number;
  status: TruckStatus;
}

export interface Schedule {
  id: string;
  truckId: string;
  type: 'delivery' | 'maintenance';
  title: string;
  startDate: string;
  endDate: string;
  destination?: string;
  location?: string;
}

export interface ServiceRequest {
  id: string;
  truckId: string;
  title: string;
  description: string;
  status: ServiceRequestStatus;
  createdAt: string;
  priority?: 'low' | 'medium' | 'high';
}
