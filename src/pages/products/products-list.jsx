// src/pages/Products/ProductsList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { productApi } from '../../services/api/product/product-api';
import DynamicTable from '../../components/table/dynamic-table';
import ConfirmationModal from '../../components/ui/confirmation-modal';
import productColumns from './product-columns';
import { useSelector } from 'react-redux';
import { selectThemeMode, selectCurrentTheme } from '../../store/slices/theme-slice';

export default function ProductsList() {
  const navigate = useNavigate();
  const isDarkMode = useSelector(selectThemeMode);
  const currentTheme = useSelector(selectCurrentTheme);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);

  /* ===== TOAST ===== */
  const showToast = (message) => {
    setToast({ show: true, message, type: 'success' });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  /* ===== LOAD PRODUCTS ===== */
  useEffect(() => {
    const loadProducts = async () => {
      const data = await productApi.getAll();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  /* ===== ACTIONS ===== */
  const handleAddProduct = () => {
    navigate('/productsList/add');
  };

  const handleViewProduct = (product) => {
    navigate(`/productsList/view/${product.id}`);
  };

  const handleEditProduct = (product) => {
    navigate(`/productsList/edit/${product.id}`);
  };

  const handleDeleteProduct = async (id) => {
    setDeleteProductId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteProductId) {
      await productApi.remove(deleteProductId);
      setProducts(prev => prev.filter(p => p.id !== deleteProductId));
      showToast('Product deleted successfully');
      setDeleteProductId(null);
    }
  };

  /* ===== UI ===== */
  if (loading) {
    return <div className="p-6 text-gray-400">Loading products...</div>;
  }

  return (
    <div
      className="min-h-screen p-6 bg-background text-foreground"
      style={{ backgroundColor: currentTheme.background, color: currentTheme.foreground }}
    >
      {/* Toast */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className="px-6 py-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400">
            {toast.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: currentTheme.foreground }}>Product Catalog</h1>
            <p className="text-sm" style={{ color: currentTheme.mutedForeground }}>Manage inventory</p>
          </div>
        </div>

        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors"
          style={{ backgroundColor: currentTheme.primary, color: currentTheme.primaryForeground }}
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Dynamic Table */}
      <DynamicTable
        title="Products"
        columns={productColumns(products)}   
        rows={products}
        loading={loading}
        renderActions={(row) => (
          <div className="flex gap-3">
            <button
              onClick={() => handleViewProduct(row)}
              className="transition-opacity cursor-pointer hover:opacity-80"
              style={{ color: currentTheme.mutedForeground }}
              title="View"
            >
              <Eye size={25} />
            </button>
            <button
              onClick={() => handleEditProduct(row)}
              className="transition-opacity hover:opacity-80"
              style={{ color: currentTheme.primary }}
              title="Edit"
            >
              <Edit2 size={25} />
            </button>
            <button
              onClick={() => handleDeleteProduct(row.id)}
              className="transition-opacity hover:opacity-80"
              style={{ color: currentTheme.destructive }}
              title="Delete"
            >
              <Trash2 size={25} />
            </button>
          </div>
        )}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}