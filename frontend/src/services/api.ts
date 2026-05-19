import axios from 'axios';
import { Student, StudentFormData, StudentUpdateData } from '../types/student';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token
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

export const studentApi = {
  // Получить всех студентов
  getAll: async (status?: string): Promise<Student[]> => {
    const response = await api.get('/students/', { params: status ? { status } : {} });
    return response.data;
  },

  // Одобрить заявку
  approve: async (id: number): Promise<Student> => {
    const response = await api.post(`/students/${id}/approve`);
    return response.data;
  },

  // Отклонить заявку
  reject: async (id: number): Promise<void> => {
    await api.post(`/students/${id}/reject`);
  },

  // Получить студента по ID
  getById: async (id: number): Promise<Student> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  // Создать студента
  create: async (data: StudentFormData): Promise<Student> => {
    const response = await api.post('/students/', data);
    return response.data;
  },

  // Обновить студента
  update: async (id: number, data: StudentUpdateData): Promise<Student> => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  // Удалить студента
  delete: async (id: number): Promise<void> => {
    await api.delete(`/students/${id}`);
  },

  // Получить количество студентов
  getCount: async (): Promise<{ total_students: number }> => {
    const response = await api.get('/students-count/');
    return response.data;
  },

  // Поиск студентов
  search: async (params: { name?: string; iin?: string }): Promise<Student[]> => {
    const response = await api.get('/students/search/', { params });
    return response.data;
  },
};