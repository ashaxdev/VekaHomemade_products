"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { motion } from "framer-motion";
import { Smartphone, Loader2 } from "lucide-react";
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
  notes: string;
}

const initialForm: FormData = {
  name: "",
  mobile: "",
  email: "",
  address: "",
  city: "",
  pincode: "",
  notes: "",
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    const c = getCart();
    setCart(c);
    setMounted(true);
    if (c.length === 0) router.push("/cart");
  }, [router]);

  const subtotal = getCartTotal(cart);
  const deliveryCharge = 0;
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

  const placeOrder = async (paymentInfo: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
  }) => {
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
      paymentMethod: "ONLINE",
      razorpayOrderId: paymentInfo.razorpay_order_id,
      razorpayPaymentId: paymentInfo.razorpay_payment_id,
      paymentStatus: "Paid",
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
      console.error("Order creation failed:", data.error);
      alert(
        "Your payment was successful, but we couldn't save your order automatically. Please contact support with your payment ID: " +
          paymentInfo.razorpay_payment_id
      );
    }
  };

  const payWithRazorpay = async () => {
    if (!razorpayReady || !window.Razorpay) {
      alert("Payment gateway is still loading, please try again in a moment.");
      setSubmitting(false);
      return;
    }

    try {
      const createRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const createData = await createRes.json();

      if (!createData.success) {
        alert("Could not initiate payment. Please try again.");
        setSubmitting(false);
        return;
      }

      const options = {
        key: createData.keyId,
        amount: createData.order.amount,
        currency: createData.order.currency,
        name: "Your Store",
        description: "Order Payment",
        order_id: createData.order.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.mobile,
        },
        theme: { color: "#7c2d12" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, amount: total }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              await placeOrder({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
              });
            } else {
              console.error("Verification failed:", verifyData.error);
              alert(
                "Payment verification failed. If money was deducted, please contact support with payment ID: " +
                  response.razorpay_payment_id
              );
            }
          } catch (err) {
            console.error(err);
            alert(
              "Something went wrong verifying your payment. If money was deducted, please contact support with payment ID: " +
                response.razorpay_payment_id
            );
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        alert("Payment failed. Please try again.");
        setSubmitting(false);
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await payWithRazorpay();
  };

  if (!mounted || cart.length === 0) return null;

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayReady(true)}
      />
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
                <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-maroon-700 bg-maroon-700/5">
                  <Smartphone size={22} className="text-maroon-700" />
                  <div className="text-left">
                    <p className="font-medium text-brown-800">Pay Online</p>
                    <p className="text-xs text-brown-500">UPI, Cards, Netbanking</p>
                  </div>
                </div>
                <p className="text-xs text-brown-500 mt-4 bg-cream-100 p-3 rounded-lg">
                  You&apos;ll be redirected to a secure Razorpay checkout to complete payment via UPI, card, or netbanking.
                </p>
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
                      <Loader2 size={18} className="animate-spin" /> Processing Payment...
                    </>
                  ) : (
                    `Pay ₹${total}`
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