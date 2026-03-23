import axios from 'axios';

// In production we reverse-proxy the backend under the same origin at `/api`
const API_URL = import.meta.env.VITE_API_URL ?? '/api';

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

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const fetchDashboardStats = async (days = 30) => {
    const response = await api.get(`/dashboard/stats?days=${days}`);
    return response.data;
};

export const fetchAnalyticsStats = async (days = 30) => {
  const response = await api.get(`/analytics?days=${days}`);
  return response.data;
};

export const fetchWorkflows = async () => {
    const response = await api.get('/workflows');
    return response.data;
};

export const submitRequest = async (requestData) => {
    const response = await api.post('/requests', requestData);
    return response.data;
};

export const fetchMyRequests = async () => {
    const response = await api.get('/requests');
    return response.data;
};

export const fetchPendingApprovals = async () => {
    const response = await api.get('/approvals');
    return response.data;
};

export const fetchApprovalStats = async () => {
    const response = await api.get('/approvals/stats');
    return response.data;
};

export const approveRequest = async (approvalId, comment) => {
    const response = await api.post(`/approvals/${approvalId}/approve`, { comment });
    return response.data;
};

export const rejectRequest = async (approvalId, comment) => {
    const response = await api.post(`/approvals/${approvalId}/reject`, { comment });
    return response.data;
};

export default api;
