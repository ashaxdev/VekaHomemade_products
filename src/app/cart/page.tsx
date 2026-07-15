"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartItem } from "@/types";
import { getCart, updateCartQuantity, removeFromCart, getCartTotal } from "@/lib/cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCart(getCart());
    setMounted(true);
    const update = () => setCart(getCart());
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  const handleQuantityChange = (productId: string, qty: number) => {
    const updated = updateCartQuantity(productId, qty);
    setCart(updated);
  };

  const handleRemove = (productId: string) => {
    const updated = removeFromCart(productId);
    setCart(updated);
  };

  const subtotal = getCartTotal(cart);
  const deliveryCharge = subtotal >= 499 || subtotal === 0 ? 0 : 0;
  const total = subtotal + deliveryCharge;

  if (!mounted) return null;

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-[60vh]">
        <section className="bg-cream-100 py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="section-title">Your Cart</h1>
            <p className="text-brown-500 mt-2">{cart.length} {cart.length === 1 ? "item" : "items"} in your cart</p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4">
            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-5">
                  <ShoppingBag size={32} className="text-brown-400" />
                </div>
                <h2 className="text-xl font-semibold text-brown-800 mb-2">Your cart is empty</h2>
                <p className="text-brown-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
                <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
                  Start Shopping <ArrowRight size={16} />
                </Link>
              </motion.div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart items */}
                <div className="lg:col-span-2 space-y-4">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="card p-4 flex gap-4 items-center"
                      >
                        <Link href={`/product/${item.productId}`} className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-cream-100">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/product/${item.productId}`} className="font-semibold text-brown-800 hover:text-maroon-700 transition-colors line-clamp-1">
                            {item.name}
                          </Link>
                          <p className="text-xs text-brown-400 mb-2">{item.weight}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-cream-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                className="p-2 hover:bg-cream-100 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                className="p-2 hover:bg-cream-100 transition-colors disabled:opacity-40"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <span className="font-bold text-brown-800">₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="p-2 text-brown-400 hover:text-maroon-700 transition-colors flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                  <div className="card p-6 sticky top-24">
                    <h3 className="font-semibold text-lg text-brown-800 mb-5">Order Summary</h3>
                    <div className="space-y-3 text-sm mb-5">
                      <div className="flex justify-between text-brown-600">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-brown-600">
                        <span>Delivery</span>
                        <span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</span>
                      </div>
                      {deliveryCharge > 0 && (
                        <p className="text-xs text-gold-500">Add ₹{499 - subtotal} more for free delivery</p>
                      )}
                    </div>
                    <div className="border-t border-cream-200 pt-4 mb-6">
                      <div className="flex justify-between font-bold text-brown-800 text-lg">
                        <span>Total</span>
                        <span>₹{total}</span>
                      </div>
                    </div>
                    <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
                      Proceed to Checkout <ArrowRight size={16} />
                    </Link>
                    <Link href="/shop" className="block text-center text-sm text-brown-500 hover:text-maroon-700 mt-4">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
