import axios from 'axios';
import { type FormField, type ChoiceOption, type FormData, type FormSubmissionResponse } from '../types/form';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const formApi = {
  // GET https://test.superhero.hu/form
  getFormDefinition: async (): Promise<FormField[]> => {
    const response = await api.get<FormField[]>('/form');
    return response.data;
  },

  // GET https://test.superhero.hu/choice/{key}
  getChoiceOptions: async (key: string): Promise<ChoiceOption[]> => {
    const response = await api.get<string[]>(`/choice/${key}`);
    return response.data;
  },

  // POST https://test.superhero.hu/save
  submitForm: async (data: FormData): Promise<FormSubmissionResponse> => {
    const response = await api.post<FormSubmissionResponse>('/save', data);
    return response.data;
  },
};

export default api;
