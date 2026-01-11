import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createProductFormConfig } from './product-form-config';
import DynamicForm from '../../components/form/dynamic-form';
import { productApi } from '../../services/api/product/product-api';
import { useSelector } from 'react-redux';
import { selectThemeMode, selectCurrentTheme } from '../../store/slices/theme-slice';

export default function ProductCreateEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isDarkMode = useSelector(selectThemeMode);
  const currentTheme = useSelector(selectCurrentTheme);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const isEdit = !!id;

  /* ===== LOAD PRODUCT BY ID (EDIT MODE) ===== */
  useEffect(() => {
    if (isEdit) {
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
    } else {
      // CREATE MODE - no loading needed
      setLoading(false);
    }
  }, [id, navigate, isEdit]);

  /* ===== SUBMIT ===== */
  const handleFormSubmit = async (formData) => {
    const payload = {
      name: formData.name,
      category: formData.category,
      brand: formData.brand,
      gsm: Number(formData.gsm) || 0,
      stock: Number(formData.currentStock) || 0,
      stockUnit: formData.stockUnit,
      minLevel: Number(formData.minStockLevel) || 0,
      price: Number(formData.sellingPrice) || 0,
      status: formData.status,
    };

    if (isEdit) {
      // UPDATE PRODUCT
      await productApi.update(product.id, payload);
    } else {
      // CREATE PRODUCT
      await productApi.create(payload);
    }

    navigate('/productsList');
  };

  const handleFormCancel = () => {
    navigate('/productsList');
  };

  /* ===== STATES ===== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Prepare form config and initial data
  let initialData = {};
  let formMode = 'create';

  if (isEdit && product) {
    formMode = 'edit';
    initialData = {
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
  }

  const formConfig = createProductFormConfig(formMode, initialData);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DynamicForm
        config={formConfig}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    </div>
  );
}
