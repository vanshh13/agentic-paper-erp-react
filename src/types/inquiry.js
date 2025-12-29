// Inquiry Status Types
export const INQUIRY_STATUS = {
  NEW: 'new',
  PARSED: 'parsed',
  PI_SENT: 'pi_sent',
  FOLLOW_UP: 'follow_up',
  CONVERTED: 'converted',
  REJECTED: 'rejected',
  // Legacy support
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  COMPLETED: 'completed'
}

// Inquiry Source Types
export const INQUIRY_SOURCE = {
  WHATSAPP: 'whatsapp',
  EMAIL: 'email',
  PHONE: 'phone',
  PORTAL: 'portal',
  WALK_IN: 'walk_in'
}

// SLA Status Types
export const SLA_STATUS = {
  ON_TRACK: 'on_track',
  AT_RISK: 'at_risk',
  BREACHED: 'breached'
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
 * @property {string} [productId]
 * @property {string} [productSku]
 * @property {string} [productType]
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {number} totalAmount
 * @property {string} [specifications]
 * @property {string} [brand]
 * @property {number} [gsm]
 * @property {string} [dimensions]
 */

/**
 * @typedef {Object} Inquiry
 * @property {string|number} id
 * @property {string} inquiryNumber
 * @property {string} [companyId]
 * @property {string} source - One of INQUIRY_SOURCE values
 * @property {string} [sourceReference]
 * @property {string} [rawMessage]
 * @property {string} [customerId]
 * @property {string} [customerName]
 * @property {string} [customerPhone]
 * @property {string} [customerEmail]
 * @property {string} [customerPONumber]
 * @property {string} [assignedSalesPerson]
 * @property {string|number} [assignedSalesPersonId]
 * @property {string} inquiryDateTime
 * @property {boolean} [isWithinWorkingHours]
 * @property {string} [interactionDueTime]
 * @property {string} [slaStatus] - One of SLA_STATUS values
 * @property {string} [expectedDeliveryDate]
 * @property {number} [expectedPrice]
 * @property {string} [specialInstructions]
 * @property {string} status - One of INQUIRY_STATUS values
 * @property {InquiryItem[]} [items]
 * @property {number} [totalAmount]
 * @property {string} [notes]
 * @property {string} createdAt
 * @property {string} updatedAt
 */
