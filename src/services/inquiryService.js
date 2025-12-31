import { INQUIRY_STATUS, INQUIRY_SOURCE, SLA_STATUS } from '../types/inquiry'

const DUMMY_INQUIRIES = [
  {
    id: '1',
    inquiryNumber: 'INQ-241229-AB12',
    companyName: 'ABC Paper Trading Co.',
    customerName: 'ABC Paper Trading Co.',
    contactPerson: 'Rajesh Kumar',
    email: 'rajesh@abc-paper.com',
    customerEmail: 'rajesh@abc-paper.com',
    phone: '+91-9876543210',
    customerPhone: '+91-9876543210',
    productCategory: 'Newsprint',
    source: INQUIRY_SOURCE.WHATSAPP,
    status: INQUIRY_STATUS.CONVERTED,
    slaStatus: SLA_STATUS.ON_TRACK,
    assignedSalesPerson: 'John Doe',
    inquiryDateTime: '2024-12-20T10:30:00',
    items: [
      {
        id: '1-1',
        productName: 'Newsprint A4 75 GSM',
        quantity: 1000,
        unitPrice: 45,
        totalAmount: 45000,
        specifications: 'Bright white, smooth finish'
      },
      {
        id: '1-2',
        productName: 'Newsprint A3 80 GSM',
        quantity: 500,
        unitPrice: 50,
        totalAmount: 25000,
        specifications: 'Premium quality'
      }
    ],
    totalAmount: 70000,
    notes: 'Urgent requirement - needed by 5th January',
    createdAt: '2024-12-20',
    updatedAt: '2024-12-22'
  },
  {
    id: '2',
    inquiryNumber: 'INQ-241225-CD34',
    companyName: 'Global Papers Ltd.',
    customerName: 'Global Papers Ltd.',
    contactPerson: 'Priya Singh',
    email: 'priya@globalpapers.com',
    customerEmail: 'priya@globalpapers.com',
    phone: '+91-9123456789',
    customerPhone: '+91-9123456789',
    productCategory: 'Coated Paper',
    source: INQUIRY_SOURCE.EMAIL,
    status: INQUIRY_STATUS.NEW,
    slaStatus: SLA_STATUS.ON_TRACK,
    assignedSalesPerson: 'Jane Smith',
    inquiryDateTime: '2024-12-25T14:15:00',
    items: [
      {
        id: '2-1',
        productName: 'Glossy Coated 300 GSM',
        quantity: 2000,
        unitPrice: 120,
        totalAmount: 240000,
        specifications: 'High gloss finish, white'
      }
    ],
    totalAmount: 240000,
    notes: 'For premium brochure printing',
    createdAt: '2024-12-25',
    updatedAt: '2024-12-25'
  },
  {
    id: '3',
    inquiryNumber: 'INQ-241228-EF56',
    companyName: 'Metro Print Solutions',
    customerName: 'Metro Print Solutions',
    contactPerson: 'Amit Patel',
    email: 'amit@metroprint.com',
    customerEmail: 'amit@metroprint.com',
    phone: '+91-9988776655',
    customerPhone: '+91-9988776655',
    productCategory: 'Kraft Paper',
    source: INQUIRY_SOURCE.PHONE,
    status: INQUIRY_STATUS.PARSED,
    slaStatus: SLA_STATUS.AT_RISK,
    assignedSalesPerson: 'Mike Johnson',
    inquiryDateTime: '2024-12-28T09:00:00',
    items: [
      {
        id: '3-1',
        productName: 'Kraft Paper Brown 80 GSM',
        quantity: 5000,
        unitPrice: 35,
        totalAmount: 175000,
        specifications: 'Eco-friendly, biodegradable'
      }
    ],
    totalAmount: 175000,
    notes: '',
    createdAt: '2024-12-28',
    updatedAt: '2024-12-28'
  },
  {
    id: '4',
    inquiryNumber: 'INQ-241215-GH78',
    companyName: 'PrintTech Industries',
    customerName: 'PrintTech Industries',
    contactPerson: 'Vikram Sharma',
    email: 'vikram@printtech.com',
    customerEmail: 'vikram@printtech.com',
    phone: '+91-9876654321',
    customerPhone: '+91-9876654321',
    productCategory: 'Coated Paper',
    source: INQUIRY_SOURCE.PORTAL,
    status: INQUIRY_STATUS.PI_SENT,
    slaStatus: SLA_STATUS.ON_TRACK,
    assignedSalesPerson: 'Sarah Williams',
    inquiryDateTime: '2024-12-15T11:20:00',
    items: [
      {
        id: '4-1',
        productName: 'Matte Coated 200 GSM',
        quantity: 1500,
        unitPrice: 95,
        totalAmount: 142500,
        specifications: 'Matte finish, bright white'
      },
      {
        id: '4-2',
        productName: 'Art Paper 250 GSM',
        quantity: 800,
        unitPrice: 110,
        totalAmount: 88000,
        specifications: 'Premium art paper'
      }
    ],
    totalAmount: 230500,
    notes: 'Regular supplier - monthly requirement',
    createdAt: '2024-12-15',
    updatedAt: '2024-12-26'
  },
  {
    id: '5',
    inquiryNumber: 'INQ-241210-IJ90',
    companyName: 'EcoWrap Packaging',
    customerName: 'EcoWrap Packaging',
    contactPerson: 'Neha Gupta',
    email: 'neha@ecowrap.com',
    customerEmail: 'neha@ecowrap.com',
    phone: '+91-9765432109',
    customerPhone: '+91-9765432109',
    productCategory: 'Kraft Paper',
    source: INQUIRY_SOURCE.WALK_IN,
    status: INQUIRY_STATUS.REJECTED,
    slaStatus: SLA_STATUS.BREACHED,
    assignedSalesPerson: 'Tom Brown',
    inquiryDateTime: '2024-12-10T16:45:00',
    items: [
      {
        id: '5-1',
        productName: 'Kraft Paper White 70 GSM',
        quantity: 3000,
        unitPrice: 32,
        totalAmount: 96000,
        specifications: 'White kraft, recyclable'
      }
    ],
    totalAmount: 96000,
    notes: 'Out of stock - cannot fulfill',
    createdAt: '2024-12-10',
    updatedAt: '2024-12-12'
  },
  {
    id: '6',
    inquiryNumber: 'INQ-241227-KL12',
    companyName: 'Premium Print House',
    customerName: 'Premium Print House',
    contactPerson: 'Rahul Mehta',
    email: 'rahul@premiumprint.com',
    customerEmail: 'rahul@premiumprint.com',
    phone: '+91-9456789012',
    customerPhone: '+91-9456789012',
    productCategory: 'Specialty Paper',
    source: INQUIRY_SOURCE.EMAIL,
    status: INQUIRY_STATUS.FOLLOW_UP,
    slaStatus: SLA_STATUS.AT_RISK,
    assignedSalesPerson: 'Lisa Anderson',
    inquiryDateTime: '2024-12-27T13:30:00',
    items: [
      {
        id: '6-1',
        productName: 'Specialty Paper 150 GSM',
        quantity: 1200,
        unitPrice: 85,
        totalAmount: 102000,
        specifications: 'Premium specialty paper'
      }
    ],
    totalAmount: 102000,
    notes: 'Follow up required - waiting for customer response',
    createdAt: '2024-12-27',
    updatedAt: '2024-12-28'
  }
]

/**
 * Inquiry Service - Handles CRUD operations for inquiries
 */
export const inquiryService = {
  /**
   * Get all inquiries
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...DUMMY_INQUIRIES]), 300)
    })
  },

  /**
   * Get inquiry by ID
   * @param {string} id - Inquiry ID
   * @returns {Promise<Object|undefined>}
   */
  getById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const inquiry = DUMMY_INQUIRIES.find((i) => i.id === id)
        resolve(inquiry)
      }, 300)
    })
  },

  /**
   * Create new inquiry
   * @param {Object} inquiry - Inquiry data
   * @returns {Promise<Object>}
   */
  create: async (inquiry) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate inquiry number
        const date = new Date()
        const prefix = 'INQ'
        const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '')
        const random = Math.random().toString(36).substring(2, 6).toUpperCase()
        const inquiryNumber = `${prefix}-${dateStr}-${random}`

        const newInquiry = {
          ...inquiry,
          id: Math.random().toString(36).substr(2, 9),
          inquiryNumber,
          inquiryDateTime: inquiry.inquiryDateTime || new Date().toISOString(),
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          // Legacy compatibility
          companyName: inquiry.customerName || inquiry.companyName || '',
          contactPerson: inquiry.contactPerson || '',
          email: inquiry.customerEmail || inquiry.email || '',
          phone: inquiry.customerPhone || inquiry.phone || '',
        }
        DUMMY_INQUIRIES.push(newInquiry)
        resolve(newInquiry)
      }, 500)
    })
  },

  /**
   * Update existing inquiry
   * @param {string} id - Inquiry ID
   * @param {Object} updates - Partial inquiry updates
   * @returns {Promise<Object>}
   */
  update: async (id, updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = DUMMY_INQUIRIES.findIndex((i) => i.id === id)
        if (index !== -1) {
          DUMMY_INQUIRIES[index] = {
            ...DUMMY_INQUIRIES[index],
            ...updates,
            updatedAt: new Date().toISOString().split('T')[0]
          }
          resolve(DUMMY_INQUIRIES[index])
        }
      }, 500)
    })
  },

  /**
   * Delete inquiry
   * @param {string} id - Inquiry ID
   * @returns {Promise<boolean>}
   */
  delete: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = DUMMY_INQUIRIES.findIndex((i) => i.id === id)
        if (index !== -1) {
          DUMMY_INQUIRIES.splice(index, 1)
        }
        resolve(true)
      }, 500)
    })
  },

  /**
   * Get inquiries by status
   * @param {string} status - Inquiry status
   * @returns {Promise<Array>}
   */
  getByStatus: async (status) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = DUMMY_INQUIRIES.filter((i) => i.status === status)
        resolve([...filtered])
      }, 300)
    })
  },

  /**
   * Search inquiries
   * @param {string} searchTerm - Search term (company name, contact person, etc)
   * @returns {Promise<Array>}
   */
  search: async (searchTerm) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const term = searchTerm.toLowerCase()
        const filtered = DUMMY_INQUIRIES.filter(
          (i) =>
            i.companyName.toLowerCase().includes(term) ||
            i.contactPerson.toLowerCase().includes(term) ||
            i.email.toLowerCase().includes(term) ||
            i.inquiryNumber.toLowerCase().includes(term)
        )
        resolve([...filtered])
      }, 300)
    })
  },

  /**
   * Get inquiries by category
   * @param {string} category - Product category
   * @returns {Promise<Array>}
   */
  getByCategory: async (category) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = DUMMY_INQUIRIES.filter((i) => i.productCategory === category)
        resolve([...filtered])
      }, 300)
    })
  },

  /**
   * Calculate summary statistics
   * @returns {Promise<Object>}
   */
  getStatistics: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          total: DUMMY_INQUIRIES.length,
          draft: DUMMY_INQUIRIES.filter((i) => i.status === INQUIRY_STATUS.DRAFT).length,
          pending: DUMMY_INQUIRIES.filter((i) => i.status === INQUIRY_STATUS.PENDING).length,
          approved: DUMMY_INQUIRIES.filter((i) => i.status === INQUIRY_STATUS.APPROVED).length,
          rejected: DUMMY_INQUIRIES.filter((i) => i.status === INQUIRY_STATUS.REJECTED).length,
          completed: DUMMY_INQUIRIES.filter((i) => i.status === INQUIRY_STATUS.COMPLETED).length,
          totalValue: DUMMY_INQUIRIES.reduce((sum, i) => sum + i.totalAmount, 0)
        }
        resolve(stats)
      }, 300)
    })
  },

  /**
   * Get all interactions for a specific inquiry
   * @param {string} inquiryId 
   */
  getInteractions: async (inquiryId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = DUMMY_INQUIRIES.filter(int => int.inquiryId === inquiryId);
        resolve([...filtered]);
      }, 300);
    });
  },

  /**
   * Add a new interaction
   */
  addInteraction: async (inquiryId, interactionData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newInteraction = {
          ...interactionData,
          id: Math.random().toString(36).substr(2, 9),
          inquiryId,
          dateTime: interactionData.dateTime || new Date().toISOString(),
        };
        DUMMY_INQUIRIES.push(newInteraction);
        resolve(newInteraction);
      }, 500);
    });
  },

  /**
   * Delete an interaction
   * @param {string} interactionId - The unique ID of the interaction to remove
   * @returns {Promise<boolean>}
   */
  deleteInteraction: async (interactionId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = DUMMY_INQUIRIES.findIndex((int) => int.id === interactionId);
        if (index !== -1) {
          // Remove the interaction from the array
          DUMMY_INQUIRIES.splice(index, 1);
          resolve(true);
        } else {
          // If not found, we resolve true anyway or throw error based on your preference
          resolve(false);
        }
      }, 500);
    });
  }
}