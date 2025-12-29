// Inquiry Types as constants for documentation
export const INQUIRY_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
}

export const PRODUCT_CATEGORIES = [
  'Newsprint',
  'Coated Paper',
  'Kraft Paper',
  'Copy Paper',
  'Tissue Paper',
  'Specialty Paper'
]

/**
 * @typedef {Object} InquiryItem
 * @property {string} id
 * @property {string} productName
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {number} totalAmount
 * @property {string} [specifications]
 */

/**
 * @typedef {Object} Inquiry
 * @property {string} id
 * @property {string} inquiryNumber
 * @property {string} companyName
 * @property {string} contactPerson
 * @property {string} email
 * @property {string} phone
 * @property {string} productCategory
 * @property {string} status - One of INQUIRY_STATUS values
 * @property {InquiryItem[]} items
 * @property {number} totalAmount
 * @property {string} [notes]
 * @property {string} createdAt
 * @property {string} updatedAt
 */
