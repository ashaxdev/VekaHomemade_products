"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, ChevronDown, X, Phone, MapPin, Package, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getAuthHeaders } from "@/hooks/useAdminAuth";
import { Order, OrderStatus } from "@/types";

const statusOptions: OrderStatus[] = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Packed: "bg-purple-100 text-purple-800",
  Shipped: "bg-indigo-100 text-indigo-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.set("status", statusFilter);
      if (search) params.set("search", search);
      const res = await fetch(`/api/orders?${params.toString()}`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchOrders, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? data.order : o)));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminSidebar>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-brown-800">Order Management</h1>
        <p className="text-brown-500 text-sm mt-1">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400" />
          <input
            type="text"
            placeholder="Search by order number, name, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field sm:w-48 cursor-pointer"
        >
          <option value="All">All Status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-cream-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="card p-12 text-center">
          <Package size={40} className="text-brown-300 mx-auto mb-3" />
          <p className="text-brown-500">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <motion.div key={order._id} layout className="card overflow-hidden">
              <div
                className="p-4 md:p-5 cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-maroon-700/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package size={18} className="text-maroon-700" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-brown-800 text-sm truncate">{order.orderNumber}</p>
                      <p className="text-xs text-brown-400">
                        {order.customer.name} · {new Date(order.createdAt).toLocaleDateString("en-IN")}
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
                    <div className="p-4 md:p-5 grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-semibold text-brown-400 uppercase tracking-wide mb-3">
                          Customer Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="font-medium text-brown-800">{order.customer.name}</p>
                          <p className="flex items-center gap-2 text-brown-600">
                            <Phone size={14} /> {order.customer.mobile}
                          </p>
                          <p className="text-brown-600">{order.customer.email}</p>
                          <p className="flex items-start gap-2 text-brown-600">
                            <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                            {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                          </p>
                          <p className="text-brown-600">
                            Payment: <span className="font-medium">{order.paymentMethod}</span>
                          </p>
                          {order.notes && (
                            <p className="text-brown-600 bg-cream-100 p-2 rounded-lg text-xs">Note: {order.notes}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-brown-400 uppercase tracking-wide mb-3">
                          Items ({order.items.length})
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-brown-700">
                                {item.name} × {item.quantity}
                              </span>
                              <span className="font-medium text-brown-800">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-cream-200 mt-3 pt-3 flex justify-between font-bold text-brown-800">
                          <span>Total</span>
                          <span>₹{order.total}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 md:px-5 pb-5 flex flex-wrap items-center gap-3 border-t border-cream-200 pt-4">
                      <label className="text-sm font-medium text-brown-700">Update Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value as OrderStatus)}
                        disabled={updatingId === order._id}
                        className="input-field w-auto py-2 text-sm cursor-pointer"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {updatingId === order._id && <Loader2 size={16} className="animate-spin text-maroon-700" />}
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="ml-auto flex items-center gap-1.5 text-sm text-maroon-700 hover:text-maroon-800 font-medium"
                      >
                        <Trash2 size={15} /> Delete Order
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </AdminSidebar>
  );
}
