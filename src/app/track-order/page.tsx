"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, ChevronDown, Loader2 } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type OrderStatus = "Pending" | "Confirmed" | "Packed" | "Shipped" | "Delivered" | "Cancelled";

interface TrackedItem {
  name: string;
  price: number;
  quantity: number;
}

interface TrackedOrder {
  _id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: "Pending" | "Paid";
  total: number;
  items: TrackedItem[];
  createdAt: string;
  customer: { name: string };
}

const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Packed: "bg-purple-100 text-purple-800",
  Shipped: "bg-indigo-100 text-indigo-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const statusSteps: OrderStatus[] = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered"];

export default function TrackOrderPage() {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<TrackedOrder[] | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setOrders(null);
    try {
      const res = await fetch(`/api/orders/track?mobile=${mobile}`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.error || "No orders found");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <section className="bg-cream-100 py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="section-title">Track Your Order</h1>
            <p className="text-brown-500 text-sm mt-1">
              Enter the mobile number you used while placing the order.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-2xl mx-auto px-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400" />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="input-field pl-11"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary sm:w-auto disabled:opacity-60">
                {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Track Order"}
              </button>
            </form>

            {error && (
              <div className="card p-6 text-center mb-6">
                <Package size={32} className="text-brown-300 mx-auto mb-2" />
                <p className="text-brown-500 text-sm">{error}</p>
              </div>
            )}

            {orders && orders.length > 0 && (
              <div className="space-y-3">
                {orders.map((order) => (
                  <motion.div key={order._id} layout className="card overflow-hidden">
                    <div
                      className="p-4 md:p-5 cursor-pointer"
                      onClick={() =>
                        setExpandedOrder(expandedOrder === order._id ? null : order._id)
                      }
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 bg-maroon-700/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Package size={18} className="text-maroon-700" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-brown-800 text-sm truncate">
                              {order.orderNumber}
                            </p>
                            <p className="text-xs text-brown-400">
                              {new Date(order.createdAt).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-brown-800">₹{order.total}</span>
                          <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                          <ChevronDown
                            size={18}
                            className={`text-brown-400 transition-transform ${
                              expandedOrder === order._id ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedOrder === order._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-cream-200"
                        >
                          <div className="p-4 md:p-5">
                            {order.status !== "Cancelled" ? (
                              <div className="flex items-center justify-between mb-6">
                                {statusSteps.map((step, idx) => {
                                  const currentIdx = statusSteps.indexOf(order.status);
                                  const reached = idx <= currentIdx;
                                  return (
                                    <div key={step} className="flex-1 flex flex-col items-center relative">
                                      {idx > 0 && (
                                        <div
                                          className={`absolute top-2 right-1/2 w-full h-0.5 ${
                                            reached ? "bg-maroon-700" : "bg-cream-200"
                                          }`}
                                        />
                                      )}
                                      <div
                                        className={`w-4 h-4 rounded-full z-10 ${
                                          reached ? "bg-maroon-700" : "bg-cream-200"
                                        }`}
                                      />
                                      <span className="text-[10px] text-brown-500 mt-1 text-center">
                                        {step}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-sm text-maroon-700 font-medium mb-6">
                                This order has been cancelled.
                              </p>
                            )}

                            <h4 className="text-xs font-semibold text-brown-400 uppercase tracking-wide mb-3">
                              Items ({order.items.length})
                            </h4>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-brown-700">
                                    {item.name} × {item.quantity}
                                  </span>
                                  <span className="font-medium text-brown-800">
                                    ₹{item.price * item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-cream-200 mt-3 pt-3 flex justify-between font-bold text-brown-800">
                              <span>Total</span>
                              <span>₹{order.total}</span>
                            </div>
                            <p className="text-xs text-brown-500 mt-3">
                              Payment: <span className="font-medium">{order.paymentStatus}</span>
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}