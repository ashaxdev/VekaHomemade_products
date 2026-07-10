"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/types";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?featured=true&limit=4")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-subtitle">Handpicked For You</span>
            <h2 className="section-title mt-2">Featured Products</h2>
          </motion.div>

          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-maroon-700 font-semibold hover:gap-2.5 transition-all"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-cream-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-cream-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-maroon-700/10">
              <Package className="text-maroon-700" size={26} />
            </div>

            <h3 className="font-serif text-2xl font-bold text-brown-800">
              No Featured Products Yet
            </h3>

            <p className="mt-3 text-brown-500">
              Add products from admin and mark them as featured.
            </p>

            <Link href="/shop" className="btn-primary mt-6 inline-block">
              Visit Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}