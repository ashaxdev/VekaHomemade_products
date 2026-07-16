"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types";
import { addToCart } from "@/lib/cart";
import { useState } from "react";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [added, setAdded] = useState(false);
  const discount = Math.round(((product.price - product.discountPrice) / product.price) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart({
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.discountPrice,
      weight: product.weight,
      quantity: 1,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/product/${product._id}`} className="card group block overflow-hidden h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-cream-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isBestSeller && (
              <span className="badge bg-gold-500 text-brown-800">Best Seller</span>
            )}
            {discount > 0 && (
              <span className="badge bg-maroon-700 text-white">{discount}% OFF</span>
            )}
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 bg-brown-800/60 flex items-center justify-center">
              <span className="bg-white text-brown-800 px-4 py-1.5 rounded-full text-sm font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <span className="text-xs text-gold-500 font-semibold uppercase tracking-wide mb-1">
            {product.category}
          </span>
          <h3 className="font-semibold text-brown-800 mb-1 line-clamp-1">{product.name}</h3>
          {/* <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="fill-gold-400 text-gold-400" />
            ))}
            <span className="text-xs text-brown-400 ml-1">(4.8)</span>
          </div> */}
          <p className="text-xs text-brown-500 mb-3">{product.weight}</p>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-brown-800">₹{product.discountPrice}</span>
              {discount > 0 && (
                <span className="text-xs text-brown-400 line-through">₹{product.price}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`p-2.5 rounded-full transition-all duration-200 ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-maroon-700 text-white hover:bg-maroon-800"
              } disabled:bg-cream-200 disabled:text-brown-400 disabled:cursor-not-allowed`}
              aria-label="Add to cart"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
