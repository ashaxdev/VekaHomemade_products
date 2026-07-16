"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-[70vh] flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={40} className="text-green-600" />
          </motion.div>
          <h1 className="font-serif text-3xl font-bold text-brown-800 mb-3">Order Placed Successfully!</h1>
          <p className="text-brown-500 mb-6 leading-relaxed">
            Thank you for your order. We&apos;ve received it and our kitchen team will start preparing your items right away.
          </p>

          {orderNumber && (
            <div className="card p-5 mb-8 flex items-center justify-center gap-3">
              <Package size={20} className="text-maroon-700" />
              <div className="text-left">
                <p className="text-xs text-brown-400">Order Number</p>
                <p className="font-semibold text-brown-800">{orderNumber}</p>
              </div>
            </div>
          )}

          <p className="text-sm text-brown-500 mb-8">
           You can expect delivery within 4-6 business days.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="btn-primary flex items-center justify-center gap-2">
              Continue Shopping <ArrowRight size={16} />
            </Link>
            <Link href="/" className="btn-outline">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-50" />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
