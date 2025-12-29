import { INQUIRY_STATUS } from '../types/inquiry'

const DUMMY_INQUIRIES = [
  {
    id: '1',
    inquiryNumber: 'INQ-2024-001',
    companyName: 'ABC Paper Trading Co.',
    contactPerson: 'Rajesh Kumar',
    email: 'rajesh@abc-paper.com',
    phone: '+91-9876543210',
    productCategory: 'Newsprint',
    status: INQUIRY_STATUS.APPROVED,
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
    inquiryNumber: 'INQ-2024-002',
    companyName: 'Global Papers Ltd.',
    contactPerson: 'Priya Singh',
    email: 'priya@globalpapers.com',
    phone: '+91-9123456789',
    productCategory: 'Coated Paper',
    status: INQUIRY_STATUS.PENDING,
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
    inquiryNumber: 'INQ-2024-003',
    companyName: 'Metro Print Solutions',
    contactPerson: 'Amit Patel',
    email: 'amit@metroprint.com',
    phone: '+91-9988776655',
    productCategory: 'Kraft Paper',
    status: INQUIRY_STATUS.DRAFT,
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
    inquiryNumber: 'INQ-2024-004',
    companyName: 'PrintTech Industries',
    contactPerson: 'Vikram Sharma',
    email: 'vikram@printtech.com',
    phone: '+91-9876654321',
    productCategory: 'Coated Paper',
    status: INQUIRY_STATUS.APPROVED,
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
    inquiryNumber: 'INQ-2024-005',
    companyName: 'EcoWrap Packaging',
    contactPerson: 'Neha Gupta',
    email: 'neha@ecowrap.com',
    phone: '+91-9765432109',
    productCategory: 'Kraft Paper',
    status: INQUIRY_STATUS.REJECTED,
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
        const newInquiry = {
          ...inquiry,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
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
  }
}