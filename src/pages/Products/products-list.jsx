// src/pages/Products/ProductsList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { productApi } from '../../services/api/product/product-api';
import DynamicTable from '../../components/table/DynamicTable';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import productColumns from './productColumns';

export default function ProductsList() {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 p-6">
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
            <h1 className="text-3xl font-bold text-gray-100">Product Catalog</h1>
            <p className="text-gray-500 text-sm">Manage inventory</p>
          </div>
        </div>

        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white"
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
              className="text-[oklch(0.75_0_0)] hover:text-[oklch(0.95_0_0)] transition-colors cursor-pointer"  
              title="View"
            >
              <Eye size={25} />
            </button>
            <button
              onClick={() => handleEditProduct(row)}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
              title="Edit"
            >
              <Edit2 size={25} />
            </button>
            <button
              onClick={() => handleDeleteProduct(row.id)}
              className="text-red-400 hover:text-red-300 transition-colors"
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