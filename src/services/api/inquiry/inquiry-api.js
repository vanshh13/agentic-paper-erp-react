import axios from 'axios';
import  { API_BASE_URL }  from '../config'; // Ensure path is correct

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
    const response = await apiClient.get('/inquiries');
    console.log('Fetched Inquiries:', response.data);
    return response.data;
  },

  /**
   * Get inquiry by ID
   */
  getById: async (id) => {
    const response = await apiClient.get(`/inquiries/${id}`);
    return response.data;
  },

  /**
   * Create new inquiry
   */
  create: async (inquiryData) => {
    const response = await apiClient.post('/inquiries', inquiryData);
    return response.data;
  },

  /**
   * Update existing inquiry
   */
  update: async (id, updates) => {
    const response = await apiClient.put(`/inquiries/${id}`, updates);
    return response.data;
  },

  /**
   * Delete inquiry (Soft Delete)
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/inquiries/${id}`);
    return response.data;
  },

  /**
   * INTERACTION METHODS
   */

  /**
   * Get all interactions for a specific inquiry
   * API Route: GET /api/inquiries/:id/interactions
   */
  getInteractions: async (inquiryId) => {
    const response = await apiClient.get(`/inquiries/${inquiryId}/interactions`);
    return response.data;
  },

  /**
   * Add a new interaction to an inquiry
   * API Route: POST /api/inquiries/:id/interactions
   */
  addInteraction: async (inquiryId, interactionData) => {
    const response = await apiClient.post(`/inquiries/${inquiryId}/interactions`, interactionData);
    return response.data;
  },

  /**
   * Delete a specific interaction
   * API Route: DELETE /api/interactions/:id
   */
  deleteInteraction: async (interactionId) => {
    const response = await apiClient.delete(`/interactions/${interactionId}`);
    return response.data;
  }
};