import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Inquiry Service - Handles CRUD operations for inquiries via Backend API
 */
export const inquiryServiceApi = {
  /**
   * Get all inquiries
   */
  getAll: async () => {
    const response = await apiClient.get('/inquiries-service/');
    console.log('Fetched Inquiries:', response.data);
    return response.data;
  },

  /**
   * Get inquiry by ID
   */
  getById: async (id) => {
    const response = await apiClient.get(`/inquiries-service/${id}`);
    return response.data;
  },

  /**
   * Create new inquiry
   */
  create: async (inquiryData) => {
    const response = await apiClient.post('/inquiries-service', inquiryData);
    return response.data;
  },

  /**
   * Update existing inquiry
   */
  update: async (id, updates) => {
    const response = await apiClient.put(`/inquiries-service/${id}`, updates);
    return response.data;
  },

  /**
   * Delete inquiry (Soft Delete)
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/inquiries-service/${id}`);
    return response.data;
  },
};