import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || 'demo-token';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (payload) => api.post('/auth/login', payload);
export const registerUser = (payload) => api.post('/auth/register', payload);

export const listFarms = () => api.get('/farms');
export const getFarm = (id) => api.get(`/farms/${id}`);
export const createFarm = (payload) => api.post('/farms', payload);
export const updateFarm = (id, payload) => api.put(`/farms/${id}`, payload);
export const deleteFarm = (id) => api.delete(`/farms/${id}`);

export const createAnimal = (payload) => api.post('/animals', payload);
export const updateAnimal = (id, payload) => api.put(`/animals/${id}`, payload);
export const deleteAnimal = (id) => api.delete(`/animals/${id}`);
export const listAnimals = () => api.get('/animals');

export const listTreatments = () => api.get('/treatments');
export const createTreatment = (payload) => api.post('/treatments', payload);
export const updateTreatment = (id, payload) => api.put(`/treatments/${id}`, payload);
export const deleteTreatment = (id) => api.delete(`/treatments/${id}`);

export const listVaccinations = () => api.get('/vaccinations');
export const createVaccination = (payload) => api.post('/vaccinations', payload);
export const updateVaccination = (id, payload) => api.put(`/vaccinations/${id}`, payload);
export const deleteVaccination = (id) => api.delete(`/vaccinations/${id}`);

export const listDiseaseReports = () => api.get('/diseasereports');
export const createDiseaseReport = (payload) => api.post('/diseasereports', payload);
export const updateDiseaseReport = (id, payload) => api.put(`/diseasereports/${id}`, payload);
export const deleteDiseaseReport = (id) => api.delete(`/diseasereports/${id}`);

export const listNotifications = () => api.get('/notifications');
export const createNotification = (payload) => api.post('/notifications', payload);
export const markNotificationRead = (id) => api.patch(`/notifications/${id}`, { status: 'read' });
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

export const listBlockchainLogs = () => api.get('/blockchain');
export const logBlockchain = (payload) => api.post('/blockchain/log', payload);

export const getAnalyticsOverview = () => api.get('/analytics/overview');
export const getReports = () => api.get('/reports/summary');
export const predictRisk = (payload) => api.post('/ai/predict-risk', payload);
export const createVerification = (payload) => api.post('/verification', payload);
export const getVerification = (animalId) => api.get(`/verification/${animalId}`);
