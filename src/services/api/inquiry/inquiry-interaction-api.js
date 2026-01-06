import Http from '../../http';

// Get all interactions for a specific inquiry

export const getInquiryInteractions = (id) => {
  return Http.get({
    url: `/inquiry-interactions-service/${id}`,
    messageSettings: {
      hideSuccessMessage: true, // usually no toast on fetch
    },
  });
};

// Add a new interaction to an inquiry

export const addInquiryInteraction = (interactionData) => {
  return Http.post({
    url: '/inquiry-interactions-service',
    data: interactionData,
    messageSettings: {
      successMessage: 'Interaction added successfully',
      errorMessage: 'Failed to add interaction',
    },
  });
};

// Update a specific interaction

export const updateInquiryInteraction = (id, interactionData) => {
  return Http.put({
    url: `/inquiry-interactions-service/${id}`,
    data: interactionData,
    messageSettings: {
      successMessage: 'Interaction updated successfully',
      errorMessage: 'Failed to update interaction',
    },
  });
};

// Delete a specific interaction

export const deleteInquiryInteraction = (id) => {
  return Http.delete({
    url: `/inquiry-interactions-service/${id}`,
    messageSettings: {
      successMessage: 'Interaction deleted successfully',
      errorMessage: 'Failed to delete interaction',
    },
  });
};
