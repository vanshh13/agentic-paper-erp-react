// src/api/product-api.js

let products = [
  { id: 1, name: 'VIVEX', category: 'Kraft', brand: '-', gsm: 90, stock: 6, stockUnit: 'sheets', minLevel: 0, price: 1999, status: 'active' },
  { id: 2, name: 'Copier Paper 75 GSM A4', category: 'Copier', brand: 'JK Paper', gsm: 75, stock: 15376, stockUnit: 'kg', minLevel: 1875, price: 58, status: 'active' },
  { id: 3, name: 'Copier Paper 80 GSM A4', category: 'Copier', brand: 'JK Paper', gsm: 80, stock: 43318, stockUnit: 'kg', minLevel: 909, price: 58, status: 'active' },
  { id: 4, name: 'Duplex Board 230 GSM', category: 'Duplex', brand: 'Century', gsm: 230, stock: 15149, stockUnit: 'kg', minLevel: 1366, price: 78, status: 'active' },
  { id: 5, name: 'Duplex Board 300 GSM', category: 'Duplex', brand: 'Century', gsm: 300, stock: 32877, stockUnit: 'kg', minLevel: 855, price: 51, status: 'active' },
  
  { id: 6, name: 'Art Paper 130 GSM', category: 'Art Paper', brand: 'Ballarpur', gsm: 130, stock: 45914, stockUnit: 'kg', minLevel: 1735, price: 80, status: 'active' },
  { id: 7, name: 'Art Paper 170 GSM', category: 'Art Paper', brand: 'Ballarpur', gsm: 170, stock: 48899, stockUnit: 'kg', minLevel: 1840, price: 18, status: 'active' },
  { id: 8, name: 'Kraft Paper 120 GSM', category: 'Kraft', brand: 'West Coast', gsm: 120, stock: 5047, stockUnit: 'kg', minLevel: 1036, price: 49, status: 'active' },
  { id: 9, name: 'Bond Paper 80 GSM', category: 'Bond', brand: 'ITC', gsm: 80, stock: 2300, stockUnit: 'kg', minLevel: 500, price: 42, status: 'low_stock' },
  { id: 10, name: 'Gloss Paper 150 GSM', category: 'Gloss', brand: 'Century', gsm: 150, stock: 8750, stockUnit: 'kg', minLevel: 1200, price: 95, status: 'active' },

  { id: 11, name: 'Newsprint 45 GSM', category: 'Newsprint', brand: 'TNPL', gsm: 45, stock: 120000, stockUnit: 'kg', minLevel: 10000, price: 32, status: 'active' },
  { id: 12, name: 'Cardboard Sheet 350 GSM', category: 'Cardboard', brand: 'ITC', gsm: 350, stock: 6400, stockUnit: 'sheets', minLevel: 1000, price: 120, status: 'active' },
  { id: 13, name: 'Ivory Board 250 GSM', category: 'Ivory Board', brand: 'JK Paper', gsm: 250, stock: 9800, stockUnit: 'kg', minLevel: 1500, price: 88, status: 'active' },
  { id: 14, name: 'Maplitho Paper 70 GSM', category: 'Maplitho', brand: 'West Coast', gsm: 70, stock: 54000, stockUnit: 'kg', minLevel: 7000, price: 45, status: 'active' },
  { id: 15, name: 'Thermal Paper Roll 55 GSM', category: 'Thermal', brand: 'Ricoh', gsm: 55, stock: 3200, stockUnit: 'rolls', minLevel: 600, price: 110, status: 'active' },

];

// simulate delay
const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

/* ================= API FUNCTIONS ================= */

export const productApi = {
  async getAll() {
    await delay();
    return [...products];
  },

    async getById(id) {
    await delay();
    return products.find(p => p.id === id); // ✅ MUST RETURN
  },

  async create(data) {
    await delay();
    const newProduct = {
      ...data,
      id: Math.max(0, ...products.map(p => p.id)) + 1,
    };
    products.push(newProduct);
    return newProduct;
  },

  async update(id, data) {
    await delay();
    products = products.map(p =>
      p.id === id ? { ...p, ...data } : p
    );
    return products.find(p => p.id === id);
  },

  async remove(id) {
    await delay();
    products = products.filter(p => p.id !== id);
    return true;
  },
};
