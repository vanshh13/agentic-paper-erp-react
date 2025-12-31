// Demo in-memory API for purchase orders
// This file acts like a backend for now; replace with real HTTP calls later.

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

let purchaseOrders = [
  {
    id: 1,
    poNumber: 'PO-20251218-2595',
    type: 'jk_company',
    status: 'new',
    delivery: 'direct_to_customer',
    amount: 1000,
    deliveryDate: '2025-12-18',
    vendor: 'ABC Suppliers Ltd.',
    items: 2,
    lineItems: [
      { itemName: 'A4 Copier Paper', qualityGrade: 'A', brand: 'JK CopyPlus', gsm: '80', size1: '210', size2: '297', quantity: 250, packagingMode: 'carton', fscType: 'fsc_certified' },
      { itemName: 'Letter Copier Paper', qualityGrade: 'B', brand: 'JK Eco', gsm: '75', size1: '216', size2: '279', quantity: 150, packagingMode: 'carton', fscType: 'fsc_mixed' },
    ],
    jkDetails: {
      unit: 'unit1',
      division: 'division1',
      supplyFrom: 'ABC Suppliers Ltd.',
      incoterms: 'fob',
      deliveryType: 'direct',
      deliveryDate: '2025-12-18',
      routeCode: 'WEST1',
      paymentTerms: '45 days NST',
      policyNumber: 'POL-123',
      insurerName: 'Allied Insurance',
      policyExpiry: '2026-12-31',
      specialRemarks: 'Priority delivery',
    },
  },
  {
    id: 2,
    poNumber: 'PO/24-25/0001',
    type: 'jk_company',
    status: 'completed',
    delivery: 'warehouse',
    amount: 3200,
    deliveryDate: '2025-11-20',
    vendor: 'Global Trading Co.',
    items: 1,
    lineItems: [
      { itemName: 'Ream Paper', qualityGrade: 'A', brand: 'JK Sparkle', gsm: '90', size1: '210', size2: '297', quantity: 500, packagingMode: 'pallet', fscType: 'fsc_certified' },
    ],
    jkDetails: {
      unit: 'unit2',
      division: 'division2',
      supplyFrom: 'Global Trading Co.',
      incoterms: 'cif',
      deliveryType: 'warehouse',
      deliveryDate: '2025-11-20',
      routeCode: 'EAST2',
      paymentTerms: '30 days',
      policyNumber: 'POL-789',
      insurerName: 'Secure Insure',
      policyExpiry: '2026-05-01',
      specialRemarks: 'Completed and archived',
    },
  },
  {
    id: 3,
    poNumber: 'PO/24-25/0002',
    type: 'jk_company',
    status: 'in_transit',
    delivery: 'warehouse',
    amount: 1800,
    deliveryDate: '2025-12-05',
    vendor: 'Metro Supplies',
    items: 2,
    lineItems: [
      { itemName: 'Newsprint Roll', qualityGrade: 'B', brand: 'Metro Roll', gsm: '55', size1: '800', size2: '1200', quantity: 20, packagingMode: 'pallet', fscType: 'non_fsc' },
      { itemName: 'Packaging Board', qualityGrade: 'A', brand: 'Metro Board', gsm: '250', size1: '600', size2: '800', quantity: 50, packagingMode: 'pallet', fscType: 'fsc_mixed' },
    ],
    jkDetails: {
      unit: 'unit3',
      division: 'division1',
      supplyFrom: 'Metro Supplies',
      incoterms: 'cpt',
      deliveryType: 'warehouse',
      deliveryDate: '2025-12-05',
      routeCode: 'NORTH3',
      paymentTerms: '60 days',
      policyNumber: 'POL-456',
      insurerName: 'Guardian',
      policyExpiry: '2026-08-15',
      specialRemarks: 'Handle with care',
    },
  },
  {
    id: 4,
    poNumber: 'PO-20251215-1234',
    type: 'others',
    status: 'approved',
    delivery: 'warehouse',
    amount: 2500,
    deliveryDate: '2025-12-20',
    vendor: 'Local Vendors Inc.',
    items: 2,
    lineItems: [
      { itemName: 'Corrugated Box', quantity: 300, unitPrice: 4.5 },
      { itemName: 'Stretch Film Roll', quantity: 50, unitPrice: 25 },
    ],
    details: {
      vendorType: 'others',
      buyerName: 'Paper ERP Pvt Ltd',
      buyerContact: '9999999999',
      buyerLocation: 'Mumbai',
      buyerState: 'MH',
      buyerCountry: 'India',
      supplierName: 'Local Vendors Inc.',
      supplierContact: '8888888888',
      supplierLocation: 'Pune',
      supplierState: 'MH',
      supplierCountry: 'India',
      incoterms: 'fob',
      billToAddress: 'HQ Mumbai',
      shipToAddress: 'Mumbai Warehouse',
      deliverToAddress: 'Client A',
      paymentTerms: '30 days',
      documentDate: '2025-12-10',
      deliveryType: 'warehouse',
      deliveryDate: '2025-12-20',
      lineItems: [
        { itemName: 'Corrugated Box', quantity: 300, unitPrice: 4.5 },
        { itemName: 'Stretch Film Roll', quantity: 50, unitPrice: 25 },
      ],
    },
  },
  {
    id: 5,
    poNumber: 'PO-20251210-5678',
    type: 'others',
    status: 'in_transit',
    delivery: 'direct_to_customer',
    amount: 1800,
    deliveryDate: '2025-12-22',
    vendor: 'National Traders',
    items: 1,
    lineItems: [
      { itemName: 'Kraft Paper Bundle', quantity: 120, unitPrice: 15 },
    ],
    details: {
      vendorType: 'others',
      buyerName: 'Paper ERP Pvt Ltd',
      buyerContact: '9999999999',
      buyerLocation: 'Delhi',
      buyerState: 'DL',
      buyerCountry: 'India',
      supplierName: 'National Traders',
      supplierContact: '7777777777',
      supplierLocation: 'Delhi',
      supplierState: 'DL',
      supplierCountry: 'India',
      incoterms: 'cfr',
      billToAddress: 'Delhi HO',
      shipToAddress: 'Client B',
      deliverToAddress: 'Client B',
      paymentTerms: '45 days',
      documentDate: '2025-12-05',
      deliveryType: 'direct_to_customer',
      deliveryDate: '2025-12-22',
      lineItems: [
        { itemName: 'Kraft Paper Bundle', quantity: 120, unitPrice: 15 },
      ],
    },
  },
  {
    id: 6,
    poNumber: 'PO-20251205-9012',
    type: 'imports',
    status: 'pending',
    delivery: 'warehouse',
    amount: 5000,
    deliveryDate: '2026-01-15',
    vendor: 'International Exports Ltd.',
    items: 2,
    lineItems: [
      { itemName: 'Art Paper Rolls', quantity: 40, unitPrice: 70 },
      { itemName: 'Duplex Board', quantity: 25, unitPrice: 80 },
    ],
    details: {
      vendorType: 'imports',
      buyerName: 'Paper ERP Pvt Ltd',
      buyerContact: '9999999999',
      buyerLocation: 'Chennai',
      buyerState: 'TN',
      buyerCountry: 'India',
      supplierName: 'International Exports Ltd.',
      supplierContact: '+1-222-333-4444',
      supplierLocation: 'New York',
      supplierState: 'NY',
      supplierCountry: 'USA',
      incoterms: 'cif',
      billToAddress: 'Chennai Port',
      shipToAddress: 'Chennai Warehouse',
      deliverToAddress: 'Chennai Warehouse',
      paymentTerms: 'LC at sight',
      documentDate: '2025-12-01',
      deliveryType: 'warehouse',
      deliveryDate: '2026-01-15',
      shipmentMode: 'sea',
      countryOfOrigin: 'usa',
      portOfLoading: 'New York',
      portOfDischarge: 'Chennai',
      finalDestination: 'Chennai',
      blNumber: 'BL-555',
      awbNumber: '',
      lineItems: [
        { itemName: 'Art Paper Rolls', quantity: 40, unitPrice: 70 },
        { itemName: 'Duplex Board', quantity: 25, unitPrice: 80 },
      ],
    },
  },
  {
    id: 7,
    poNumber: 'PO-20251201-3456',
    type: 'imports',
    status: 'in_transit',
    delivery: 'warehouse',
    amount: 7500,
    deliveryDate: '2026-01-10',
    vendor: 'Global Imports Co.',
    items: 1,
    lineItems: [
      { itemName: 'Coated Paper Rolls', quantity: 60, unitPrice: 125 },
    ],
    details: {
      vendorType: 'imports',
      buyerName: 'Paper ERP Pvt Ltd',
      buyerContact: '9999999999',
      buyerLocation: 'Chennai',
      buyerState: 'TN',
      buyerCountry: 'India',
      supplierName: 'Global Imports Co.',
      supplierContact: '+1-999-111-0000',
      supplierLocation: 'London',
      supplierState: 'London',
      supplierCountry: 'UK',
      incoterms: 'cfr',
      billToAddress: 'Chennai Port',
      shipToAddress: 'Chennai Warehouse',
      deliverToAddress: 'Chennai Warehouse',
      paymentTerms: '30% advance',
      documentDate: '2025-11-28',
      deliveryType: 'warehouse',
      deliveryDate: '2026-01-10',
      shipmentMode: 'sea',
      countryOfOrigin: 'uk',
      portOfLoading: 'London',
      portOfDischarge: 'Chennai',
      finalDestination: 'Chennai',
      blNumber: 'BL-777',
      awbNumber: '',
      lineItems: [
        { itemName: 'Coated Paper Rolls', quantity: 60, unitPrice: 125 },
      ],
    },
  },
]

let nextId = purchaseOrders.length + 1

const clone = (data) => JSON.parse(JSON.stringify(data))

export const purchaseOrderApi = {
  async getAll() {
    await delay()
    return clone(purchaseOrders)
  },

  async getById(id) {
    await delay()
    const found = purchaseOrders.find((po) => po.id === Number(id))
    if (!found) throw new Error('Purchase order not found')
    return clone(found)
  },

  async create(data) {
    await delay()
    const newPO = { id: nextId++, status: 'new', ...data }
    purchaseOrders = [...purchaseOrders, newPO]
    return clone(newPO)
  },

  async update(id, updates) {
    await delay()
    let updated
    purchaseOrders = purchaseOrders.map((po) => {
      if (po.id === Number(id)) {
        updated = { ...po, ...updates }
        return updated
      }
      return po
    })
    if (!updated) throw new Error('Purchase order not found')
    return clone(updated)
  },

  async remove(id) {
    await delay()
    const existing = purchaseOrders.some((po) => po.id === Number(id))
    purchaseOrders = purchaseOrders.filter((po) => po.id !== Number(id))
    if (!existing) throw new Error('Purchase order not found')
    return { success: true }
  },
}
