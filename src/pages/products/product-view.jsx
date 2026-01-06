// src/pages/Products/ProductView.jsx
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createProductFormConfig } from './product-form-config';
import DynamicForm from '../../components/form/dynamic-form';
import { productApi } from '../../services/api/product/product-api';

export default function ProductView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===== LOAD PRODUCT BY ID ===== */
  useEffect(() => {
    const loadProduct = async () => {
      const data = await productApi.getById(Number(id));

      if (!data) {
        navigate('/productsList');
        return;
      }

      setProduct(data);
      setLoading(false);
    };

    loadProduct();
  }, [id, navigate]);

  /* ===== HANDLERS ===== */
  const handleBack = () => {
    navigate('/productsList');
  };

  const handleEdit = () => {
    navigate(`/productsList/edit/${id}`);
  };

  /* ===== LOADING STATE ===== */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-400">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-400">Product not found</p>
      </div>
    );
  }

  /* ===== PREPARE DATA FOR VIEW MODE ===== */
  // Map API data to form field names
  const viewData = {
    name: product.name,
    category: product.category,
    brand: product.brand,
    gsm: String(product.gsm),
    currentStock: String(product.stock),
    stockUnit: product.stockUnit,
    minStockLevel: String(product.minLevel),
    sellingPrice: String(product.price),
    status: product.status,
  };

  /* ===== CREATE VIEW CONFIG USING SAME FORM CONFIG ===== */
  const formConfig = createProductFormConfig('view', viewData);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300">
      <DynamicForm
        config={formConfig}
        onCancel={handleBack}
        onEdit={handleEdit}
      />
    </div>
  );
}