"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Truck, Smartphone, Loader2 } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartItem } from "@/types";
import { getCart, getCartTotal, clearCart } from "@/lib/cart";

interface FormData {
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: "COD" | "UPI";
  notes: string;
}

const initialForm: FormData = {
  name: "",
  mobile: "",
  email: "",
  address: "",
  city: "",
  pincode: "",
  paymentMethod: "COD",
  notes: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const c = getCart();
    setCart(c);
    setMounted(true);
    if (c.length === 0) router.push("/cart");
  }, [router]);

  const subtotal = getCartTotal(cart);
  const deliveryCharge = subtotal >= 499 ? 0 : 49;
  const total = subtotal + deliveryCharge;

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) newErrors.mobile = "Enter a valid 10-digit mobile number";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Enter a valid email address";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = "Enter a valid 6-digit pincode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const orderData = {
        customer: {
          name: form.name,
          mobile: form.mobile,
          email: form.email,
          address: form.address,
          city: form.city,
          pincode: form.pincode,
        },
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        deliveryCharge,
        total,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();

      if (data.success) {
        clearCart();
        router.push(`/order-success?orderNumber=${data.order.orderNumber}`);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted || cart.length === 0) return null;

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <section className="bg-cream-100 py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="section-title">Checkout</h1>
          </div>
        </section>

        <section className="py-10">
          <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                <h3 className="font-semibold text-lg text-brown-800 mb-5">Delivery Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-brown-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="input-field"
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="text-maroon-700 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1.5">Mobile Number *</label>
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => handleChange("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="input-field"
                      placeholder="10-digit mobile number"
                    />
                    {errors.mobile && <p className="text-maroon-700 text-xs mt-1">{errors.mobile}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-maroon-700 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-brown-700 mb-1.5">Address *</label>
                    <textarea
                      value={form.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="input-field resize-none"
                      rows={3}
                      placeholder="House no, street, area"
                    />
                    {errors.address && <p className="text-maroon-700 text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1.5">City *</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="input-field"
                      placeholder="City"
                    />
                    {errors.city && <p className="text-maroon-700 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1.5">Pincode *</label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={(e) => handleChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="input-field"
                      placeholder="6-digit pincode"
                    />
                    {errors.pincode && <p className="text-maroon-700 text-xs mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
                <h3 className="font-semibold text-lg text-brown-800 mb-5">Payment Method</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleChange("paymentMethod", "COD")}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      form.paymentMethod === "COD" ? "border-maroon-700 bg-maroon-700/5" : "border-cream-200"
                    }`}
                  >
                    <Truck size={22} className={form.paymentMethod === "COD" ? "text-maroon-700" : "text-brown-400"} />
                    <div className="text-left">
                      <p className="font-medium text-brown-800">Cash on Delivery</p>
                      <p className="text-xs text-brown-500">Pay when you receive</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("paymentMethod", "UPI")}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      form.paymentMethod === "UPI" ? "border-maroon-700 bg-maroon-700/5" : "border-cream-200"
                    }`}
                  >
                    <Smartphone size={22} className={form.paymentMethod === "UPI" ? "text-maroon-700" : "text-brown-400"} />
                    <div className="text-left">
                      <p className="font-medium text-brown-800">UPI</p>
                      <p className="text-xs text-brown-500">GPay, PhonePe, Paytm</p>
                    </div>
                  </button>
                </div>
                {form.paymentMethod === "UPI" && (
                  <p className="text-xs text-brown-500 mt-4 bg-cream-100 p-3 rounded-lg">
                    UPI payment details will be shared via SMS/email after order confirmation.
                  </p>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
                <h3 className="font-semibold text-lg text-brown-800 mb-3">Order Notes (Optional)</h3>
                <textarea
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Any special instructions for delivery..."
                />
              </motion.div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h3 className="font-semibold text-lg text-brown-800 mb-5">Order Summary</h3>
                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex gap-3 items-center">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brown-800 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-brown-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-brown-800">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-cream-200 pt-4 space-y-2 text-sm mb-4">
                  <div className="flex justify-between text-brown-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-brown-600">
                    <span>Delivery</span>
                    <span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</span>
                  </div>
                </div>
                <div className="border-t border-cream-200 pt-4 mb-6">
                  <div className="flex justify-between font-bold text-brown-800 text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
