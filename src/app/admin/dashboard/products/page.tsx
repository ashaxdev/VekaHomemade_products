"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Upload, X, Loader2, Check } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getAuthHeaders } from "@/hooks/useAdminAuth";

const categories = ["Pickles", "Thokku", "Masala"];

interface FormState {
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

const initialForm: FormState = {
  name: "",
  category: "Pickles",
  price: "",
  discountPrice: "",
  weight: "",
  description: "",
  ingredients: "",
  shelfLife: "",
  stock: "",
  isBestSeller: false,
  isFeatured: false,
};

export default function ProductUploadPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!imageFile) {
      setError("Please upload a product image.");
      return;
    }

    if (
      !form.name ||
      !form.price ||
      !form.discountPrice ||
      !form.weight ||
      !form.stock
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      console.log("UPLOAD RESPONSE:", uploadData);

      if (!uploadRes.ok || !uploadData.success) {
        setError(
          uploadData.error ||
            uploadData.message ||
            "Image upload failed. Please check Cloudinary settings."
        );

        setSubmitting(false);
        setUploading(false);
        return;
      }

      setUploading(false);

      const productData = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice),
        weight: form.weight.trim(),
        description: form.description.trim(),
        ingredients: form.ingredients.trim(),
        shelfLife: form.shelfLife.trim(),
        stock: Number(form.stock),
        image: uploadData.url,
        imagePublicId: uploadData.publicId,
        isBestSeller: form.isBestSeller,
        isFeatured: form.isFeatured,
        inStock: Number(form.stock) > 0,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      console.log("PRODUCT RESPONSE:", data);

      if (!res.ok || !data.success) {
        setError(
          data.error ||
            data.message ||
            "Image uploaded, but product was not saved in MongoDB."
        );
        return;
      }

      setSuccess(true);
      resetForm();

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error("PRODUCT UPLOAD PAGE ERROR:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <AdminSidebar>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-brown-800">
          Add New Product
        </h1>
        <p className="text-brown-500 text-sm mt-1">
          Upload a new product to your catalog
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="card p-6">
          <label className="block text-sm font-medium text-brown-700 mb-3">
            Product Image *
          </label>

          {imagePreview ? (
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />

              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-maroon-700 hover:bg-white"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-48 h-48 border-2 border-dashed border-cream-300 rounded-2xl flex flex-col items-center justify-center gap-2 text-brown-400 hover:border-maroon-700 hover:text-maroon-700 transition-colors"
            >
              <Upload size={28} />
              <span className="text-sm">Click to upload</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-brown-800">Basic Information</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-brown-700 mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="input-field"
                placeholder="e.g. Spicy Mango Pickle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1.5">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
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
              <label className="block text-sm font-medium text-brown-700 mb-1.5">
                Weight / Quantity *
              </label>
              <input
                type="text"
                value={form.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="input-field"
                placeholder="e.g. 250g"
              />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-brown-800">Pricing & Stock</h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1.5">
                Price (₹) *
              </label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="input-field"
                placeholder="299"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1.5">
                Discount Price (₹) *
              </label>
              <input
                type="number"
                min={0}
                value={form.discountPrice}
                onChange={(e) => handleChange("discountPrice", e.target.value)}
                className="input-field"
                placeholder="249"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1.5">
                Stock Quantity *
              </label>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                className="input-field"
                placeholder="50"
              />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-brown-800">Product Details</h3>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="Describe the product..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">
              Ingredients
            </label>
            <textarea
              value={form.ingredients}
              onChange={(e) => handleChange("ingredients", e.target.value)}
              className="input-field resize-none"
              rows={2}
              placeholder="e.g. Raw mango, gingelly oil, red chilli powder, mustard seeds, salt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1.5">
              Shelf Life
            </label>
            <input
              type="text"
              value={form.shelfLife}
              onChange={(e) => handleChange("shelfLife", e.target.value)}
              className="input-field"
              placeholder="e.g. 6 months"
            />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-brown-800 mb-4">Visibility</h3>

          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isBestSeller}
                onChange={(e) =>
                  handleChange("isBestSeller", e.target.checked)
                }
                className="w-4 h-4 accent-maroon-700"
              />
              <span className="text-sm text-brown-700">
                Mark as Best Seller
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => handleChange("isFeatured", e.target.checked)}
                className="w-4 h-4 accent-maroon-700"
              />
              <span className="text-sm text-brown-700">Mark as Featured</span>
            </label>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700 text-sm"
          >
            Product saved successfully!
          </motion.div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60 w-full sm:w-auto"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {uploading ? "Uploading Image..." : "Saving Product..."}
            </>
          ) : (
            "Save Product"
          )}
        </button>
      </form>
    </AdminSidebar>
  );
}