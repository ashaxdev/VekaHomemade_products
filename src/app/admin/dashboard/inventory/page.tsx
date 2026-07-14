"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, Search, Save, Loader2, Pencil, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getAuthHeaders } from "@/hooks/useAdminAuth";
import { Product } from "@/types";

const LOW_STOCK_THRESHOLD = 10;
const categories = ["ReadyMix", "Thokku", "Masala"];

interface EditFormState {
  name: string;
  category: string;
  price: string;
  discountPrice: string;
  weight: string;
  description: string;
  ingredients: string;
  shelfLife: string;
  stock: string;
  isBestSeller: boolean;
  isFeatured: boolean;
}

export default function InventoryManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingStock, setEditingStock] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  // Edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editUploading, setEditUploading] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products", { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockChange = (id: string, value: number) => {
    setEditingStock((prev) => ({ ...prev, [id]: value }));
  };

  const saveStock = async (id: string) => {
    const newStock = editingStock[id];
    if (newStock === undefined) return;
    setSavingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ stock: newStock, inStock: newStock > 0 }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.map((p) => (p._id === id ? data.product : p)));
        setEditingStock((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSavingId(null);
    }
  };

  const toggleInStock = async (id: string, inStock: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ inStock: !inStock }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.map((p) => (p._id === id ? data.product : p)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product permanently? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ---- Edit modal handlers ----

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      discountPrice: String(product.discountPrice),
      weight: product.weight,
      description: product.description || "",
      ingredients: product.ingredients || "",
      shelfLife: product.shelfLife || "",
      stock: String(product.stock),
      isBestSeller: product.isBestSeller,
      isFeatured: product.isFeatured,
    });
    setEditImageFile(null);
    setEditImagePreview(product.image);
    setEditError("");
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditForm(null);
    setEditImageFile(null);
    setEditImagePreview(null);
    setEditError("");
  };

  const handleEditChange = (field: keyof EditFormState, value: string | boolean) => {
    setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const saveEdit = async () => {
    if (!editingProduct || !editForm) return;

    if (!editForm.name || !editForm.price || !editForm.discountPrice || !editForm.weight) {
      setEditError("Please fill in all required fields.");
      return;
    }

    setEditSaving(true);
    setEditError("");

    try {
      let imageUrl = editingProduct.image;
      let imagePublicId = editingProduct.imagePublicId;

      // If a new image was picked, upload it first
      if (editImageFile) {
        setEditUploading(true);
        const formData = new FormData();
        formData.append("file", editImageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        setEditUploading(false);

        if (!uploadRes.ok || !uploadData.success) {
          setEditError(uploadData.error || uploadData.message || "Image upload failed.");
          setEditSaving(false);
          return;
        }

        imageUrl = uploadData.url;
        imagePublicId = uploadData.publicId;
      }

      const payload = {
        name: editForm.name.trim(),
        category: editForm.category,
        price: Number(editForm.price),
        discountPrice: Number(editForm.discountPrice),
        weight: editForm.weight.trim(),
        description: editForm.description.trim(),
        ingredients: editForm.ingredients.trim(),
        shelfLife: editForm.shelfLife.trim(),
        stock: Number(editForm.stock),
        inStock: Number(editForm.stock) > 0,
        isBestSeller: editForm.isBestSeller,
        isFeatured: editForm.isFeatured,
        image: imageUrl,
        imagePublicId,
      };

      const res = await fetch(`/api/products/${editingProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setEditError(data.error || data.message || "Failed to update product.");
        setEditSaving(false);
        return;
      }

      setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? data.product : p)));
      closeEditModal();
    } catch (error: any) {
      console.error(error);
      setEditError(error.message || "Something went wrong.");
    } finally {
      setEditSaving(false);
      setEditUploading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const lowStockCount = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <AdminSidebar>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-brown-800">Inventory Management</h1>
        <p className="text-brown-500 text-sm mt-1">{products.length} products total</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-5">
          <p className="text-brown-500 text-sm mb-1">Total Products</p>
          <p className="text-2xl font-bold text-brown-800">{products.length}</p>
        </div>
        <div className="card p-5 border-l-4 border-yellow-400">
          <p className="text-brown-500 text-sm mb-1">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
        </div>
        <div className="card p-5 border-l-4 border-maroon-700">
          <p className="text-brown-500 text-sm mb-1">Out of Stock</p>
          <p className="text-2xl font-bold text-maroon-700">{outOfStockCount}</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-11 max-w-md"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-cream-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-cream-100 border-b border-cream-200">
              <tr className="text-left text-xs font-semibold text-brown-500 uppercase tracking-wide">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredProducts.map((product) => (
                <motion.tr key={product._id} layout className="hover:bg-cream-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-brown-800 text-sm truncate max-w-[180px]">{product.name}</p>
                        <p className="text-xs text-brown-400">{product.weight}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-brown-600">{product.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        value={editingStock[product._id] ?? product.stock}
                        onChange={(e) => handleStockChange(product._id, parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1.5 border border-cream-200 rounded-lg text-sm"
                      />
                      {editingStock[product._id] !== undefined &&
                        editingStock[product._id] !== product.stock && (
                          <button
                            onClick={() => saveStock(product._id)}
                            disabled={savingId === product._id}
                            className="p-1.5 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800"
                          >
                            {savingId === product._id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Save size={14} />
                            )}
                          </button>
                        )}
                      {product.stock <= LOW_STOCK_THRESHOLD && product.stock > 0 && (
                        <AlertTriangle size={15} className="text-yellow-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleInStock(product._id, product.inStock)}
                      className={`badge cursor-pointer ${
                        product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 text-brown-400 hover:text-maroon-700 transition-colors"
                        aria-label="Edit product"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="p-2 text-brown-400 hover:text-maroon-700 transition-colors"
                        aria-label="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <p className="text-center text-brown-400 py-10">No products found.</p>
          )}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProduct && editForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeEditModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-brown-800">Edit Product</h2>
                <button onClick={closeEditModal} className="p-1.5 text-brown-400 hover:text-maroon-700">
                  <X size={20} />
                </button>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1.5">Product Image</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                    {editImagePreview && (
                      <Image src={editImagePreview} alt="Preview" fill className="object-cover" unoptimized />
                    )}
                  </div>
                  <label className="btn-secondary cursor-pointer text-sm px-3 py-2">
                    Change Image
                    <input type="file" accept="image/*" onChange={handleEditImageSelect} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleEditChange("name", e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">Category *</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => handleEditChange("category", e.target.value)}
                    className="input-field cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">Weight / Quantity *</label>
                  <input
                    type="text"
                    value={editForm.weight}
                    onChange={(e) => handleEditChange("weight", e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.price}
                    onChange={(e) => handleEditChange("price", e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">Discount Price (₹) *</label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.discountPrice}
                    onChange={(e) => handleEditChange("discountPrice", e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">Stock Quantity *</label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.stock}
                    onChange={(e) => handleEditChange("stock", e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1.5">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => handleEditChange("description", e.target.value)}
                  className="input-field resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1.5">Ingredients</label>
                <textarea
                  value={editForm.ingredients}
                  onChange={(e) => handleEditChange("ingredients", e.target.value)}
                  className="input-field resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1.5">Shelf Life</label>
                <input
                  type="text"
                  value={editForm.shelfLife}
                  onChange={(e) => handleEditChange("shelfLife", e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isBestSeller}
                    onChange={(e) => handleEditChange("isBestSeller", e.target.checked)}
                    className="w-4 h-4 accent-maroon-700"
                  />
                  <span className="text-sm text-brown-700">Mark as Best Seller</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isFeatured}
                    onChange={(e) => handleEditChange("isFeatured", e.target.checked)}
                    className="w-4 h-4 accent-maroon-700"
                  />
                  <span className="text-sm text-brown-700">Mark as Featured</span>
                </label>
              </div>

              {editError && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
                  {editError}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={saveEdit}
                  disabled={editSaving}
                  className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {editSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {editUploading ? "Uploading Image..." : "Saving..."}
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button onClick={closeEditModal} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminSidebar>
  );
}