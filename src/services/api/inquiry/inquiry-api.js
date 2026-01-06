import Http from '../../http'

// Get all inquiries
export const getAllInquiries = () =>
  Http.get({
    url: '/inquiries-service',
    messageSettings: {
      hideSuccessMessage: true,
      errorMessage: 'Failed to fetch inquiries',
    },
  })

// Get inquiry by ID
export const getInquiryById = (id) =>
  Http.get({
    url: `/inquiries-service/${id}`,
    messageSettings: {
      hideSuccessMessage: true,
      errorMessage: 'Failed to fetch inquiry details',
    },
  })

// Create new inquiry
export const createInquiry = (inquiryData) =>
  Http.post({
    url: '/inquiries-service',
    data: inquiryData,
    messageSettings: {
      successMessage: 'Inquiry created successfully',
      errorMessage: 'Failed to create inquiry',
    },
  })

// Update inquiry
export const updateInquiry = (id, updates) =>
  Http.put({
    url: `/inquiries-service/${id}`,
    data: updates,
    messageSettings: {
      successMessage: 'Inquiry updated successfully',
      hideSuccessMessage:true
    },
  })

// Delete inquiry (soft delete)
export const deleteInquiry = (id) =>
  Http.delete({
    url: `/inquiries-service/${id}`,
    messageSettings: {
      successMessage: 'Inquiry deleted successfully',
      errorMessage: 'Failed to delete inquiry',
    },
  })
