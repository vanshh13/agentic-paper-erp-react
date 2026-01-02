import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const inquiryInteractionServiceApi = {
    /**
     * INTERACTION METHODS
     */
  
    /**
     * Get all interactions for a specific inquiry
     * API Route: GET /api/inquiries/:id/interactions
     */
    getInteractions: async (id) => {
      const response = await apiClient.get(`/inquiry-interactions-service/${id}`);
      return response.data;
    },
  
    /**
     * Add a new interaction to an inquiry
     * API Route: POST /api/inquiries/:id/interactions
     */
    addInteraction: async (interactionData) => {
      const response = await apiClient.post(`/inquiry-interactions-service/`, interactionData);
      return response.data;
    },
  
    /**
     * Delete a specific interaction
     * API Route: DELETE /api/interactions/:id
     */
    deleteInteraction: async (id) => {
      const response = await apiClient.delete(`/inquiry-interactions-service/${id}`);
      return response.data;
    }
};