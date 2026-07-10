import axios, { AxiosInstance, AxiosError } from 'axios';
import { APP_CONFIG } from '../../constants/config';
import type { ApiError } from '../../types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${APP_CONFIG.apiUrl}${APP_CONFIG.apiPrefix}`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    // Request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        const tokens = localStorage.getItem('auth_tokens');
        if (tokens) {
          const { accessToken } = JSON.parse(tokens);
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: 'An unexpected error occurred',
          status: error.response?.status || 500,
          details: error.response?.data,
        };

        if (error.response?.status === 401) {
          localStorage.removeItem('auth_tokens');
          window.location.href = '/login';
        }

        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  async uploadFile<T>(url: string, file: File | Blob, fieldName = 'audio_file'): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for uploads
    });
    
    return response.data;
  }
}

export const apiClient = new ApiClient();
