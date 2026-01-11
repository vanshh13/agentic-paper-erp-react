// src/pages/Products/ProductFormConfig.js
import React from 'react';

// ==================== PRODUCT FORM CONFIG ====================

const createProductFormConfig = (mode = 'create', initialData = {}) => {
  const isViewMode = mode === 'view';
  
  return {
    title: mode === 'edit' 
      ? 'Update Product' 
      : mode === 'view' 
        ? 'Product Details' 
        : 'Add New Product',
    subtitle: isViewMode 
      ? 'View product information' 
      : 'Manage product details',
    mode,
    showBackButton: true,
    submitLabel: mode === 'edit' ? 'Update Product' : 'Add Product',
    cancelLabel: 'Cancel',
    initialData: initialData || {
      name: '',
      category: '',
      brand: '',
      gsm: '',
      currentStock: '',
      stockUnit: 'kg',
      minStockLevel: '',
      sellingPrice: '',
      status: 'active',
    },
    
    sections: [
      {
        title: 'Product Information',
        description: isViewMode ? 'Basic product details' : 'Essential product details',
        gridCols: 'md:grid-cols-2',
        fields: [
          {
            name: 'name',
            label: 'Product Name',
            type: 'text',
            required: !isViewMode,
            placeholder: 'e.g., Copier Paper 80 GSM A4',
          },
          {
            name: 'category',
            label: 'Category',
            type: 'select',
            required: !isViewMode,
            placeholder: 'Select category',
            options: [
              { value: 'Copier', label: 'Copier Paper' },
              { value: 'Duplex', label: 'Duplex Board' },
              { value: 'Art Paper', label: 'Art Paper' },
              { value: 'Kraft', label: 'Kraft Paper' },
              { value: 'Bond', label: 'Bond Paper' },
              { value: 'Gloss', label: 'Gloss Paper' },
              { value: 'Newsprint', label: 'Newsprint' },
              { value: 'Cardboard', label: 'Cardboard' },
            ],
          },
          {
            name: 'brand',
            label: 'Brand',
            type: 'text',
            required: !isViewMode,
            placeholder: 'e.g., JK Paper',
          },
          {
            name: 'gsm',
            label: 'GSM (Grams per Square Meter)',
            type: 'number',
            required: !isViewMode,
            placeholder: 'e.g., 80',
            // Custom view rendering for GSM
            renderView: isViewMode 
              ? (value) => <span className="text-foreground">{value} g/m²</span>
              : undefined,
          },
        ],
      },
      
      {
        title: 'Inventory & Pricing',
        description: isViewMode 
          ? 'Stock and pricing information' 
          : 'Stock and price details',
        gridCols: 'md:grid-cols-2',
        fields: [
          {
            name: 'currentStock',
            label: 'Current Stock',
            type: 'number',
            required: !isViewMode,
            placeholder: '0',
            helperText: isViewMode ? undefined : 'Enter stock quantity',
            // Custom view rendering for stock with unit
            renderView: isViewMode 
              ? (value, formData) => (
                  <span className="text-foreground">
                    {value} {formData.stockUnit || 'units'}
                  </span>
                )
              : undefined,
          },
          {
            name: 'stockUnit',
            label: 'Stock Unit',
            type: 'select',
            required: !isViewMode,
            options: [
              { value: 'kg', label: 'Kilograms (kg)' },
              { value: 'pieces', label: 'Pieces' },
              { value: 'reams', label: 'Reams' },
              { value: 'sheets', label: 'Sheets' },
              { value: 'boxes', label: 'Boxes' },
            ],
          },
          {
            name: 'minStockLevel',
            label: 'Minimum Stock Level',
            type: 'number',
            required: !isViewMode,
            placeholder: '0',
            helperText: isViewMode ? undefined : 'Alert when stock falls below this level',
            // Custom view rendering for min level with unit
            renderView: isViewMode 
              ? (value, formData) => (
                  <span className="text-foreground">
                    {value} {formData.stockUnit || 'units'}
                  </span>
                )
              : undefined,
          },
          {
            name: 'sellingPrice',
            label: 'Selling Price (₹)',
            type: 'number',
            required: !isViewMode,
            placeholder: '0.00',
            helperText: isViewMode ? undefined : 'Price per unit',
            // Custom view rendering for price
            renderView: isViewMode 
              ? (value) => (
                  <span className="text-foreground font-medium">₹{value}</span>
                )
              : undefined,
          },
        ],
      },
      
      {
        title: 'Status',
        description: isViewMode 
          ? 'Product availability' 
          : 'Product availability status',
        fields: [
          {
            name: 'status',
            label: isViewMode ? 'Current Status' : 'Status',
            type: 'radio',
            required: !isViewMode,
            fullWidth: isViewMode,
            options: [
              { value: 'active', label: 'Active - Available for sale' },
              { value: 'inactive', label: 'Inactive - Not available' },
            ],
            // Custom view rendering for status badge
            renderView: isViewMode 
              ? (value) => (
                  <span
                    className={`inline-flex px-3 py-1.5 rounded-md text-sm font-medium ${
                      value === 'active'
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}
                  >
                    {value === 'active' ? 'Active' : 'Inactive'}
                  </span>
                )
              : undefined,
          },
        ],
      },
    ],
  };
};

export { createProductFormConfig };