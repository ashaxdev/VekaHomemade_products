"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Star, Leaf, Clock, Package, ChevronRight, Check } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/types";
import { addToCart } from "@/lib/cart";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "shelf">("description");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.product);
          fetch(`/api/products?category=${encodeURIComponent(data.product.category)}&limit=4`)
            .then((r) => r.json())
            .then((d) => {
              if (d.success) {
                setRelated(d.products.filter((p: Product) => p._id !== data.product._id).slice(0, 4));
              }
            });
        } else {
          router.push("/shop");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id, router]);

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;
    addToCart({
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.discountPrice,
      weight: product.weight,
      quantity,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-cream-200 rounded-3xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 w-24 bg-cream-200 rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-cream-200 rounded animate-pulse" />
            <div className="h-24 bg-cream-200 rounded animate-pulse" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) return null;

  const discount = Math.round(((product.price - product.discountPrice) / product.price) * 100);

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
          <div className="flex items-center gap-2 text-sm text-brown-500">
            <Link href="/" className="hover:text-maroon-700">Home</Link>
            <ChevronRight size={14} />
            <Link href="/shop" className="hover:text-maroon-700">Shop</Link>
            <ChevronRight size={14} />
            <span className="text-brown-700 font-medium line-clamp-1">{product.name}</span>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10 md:gap-14">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-3xl overflow-hidden shadow-card-hover bg-cream-100"
          >
            <Image src={product.image} alt={product.name} fill className="object-cover" priority />
            {discount > 0 && (
              <span className="absolute top-4 left-4 badge bg-maroon-700 text-white">{discount}% OFF</span>
            )}
            {product.isBestSeller && (
              <span className="absolute top-4 right-4 badge bg-gold-500 text-brown-800">Best Seller</span>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-xs text-gold-500 font-semibold uppercase tracking-widest">{product.category}</span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown-800 mt-2 mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="fill-gold-400 text-gold-400" />
              ))}
              <span className="text-sm text-brown-500">(4.8 · 120 reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-bold text-brown-800">₹{product.discountPrice}</span>
              {discount > 0 && <span className="text-lg text-brown-400 line-through">₹{product.price}</span>}
              <span className="text-sm text-brown-400">/ {product.weight}</span>
            </div>
            <p className={`text-sm font-medium mb-6 ${product.inStock ? "text-green-700" : "text-maroon-700"}`}>
              {product.inStock ? `✓ In Stock (${product.stock} available)` : "✗ Out of Stock"}
            </p>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-cream-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 hover:bg-cream-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-5 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="p-3 hover:bg-cream-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                  added ? "bg-green-600 text-white" : "bg-maroon-700 text-white hover:bg-maroon-800"
                } disabled:bg-cream-300 disabled:text-brown-400 disabled:cursor-not-allowed`}
              >
                {added ? (
                  <>
                    <Check size={18} /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add to Cart
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 text-xs text-brown-500">
              <div className="flex items-center gap-1.5">
                <Leaf size={14} className="text-maroon-700" /> 100% Natural
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-maroon-700" /> {product.shelfLife} shelf life
              </div>
              <div className="flex items-center gap-1.5">
                <Package size={14} className="text-maroon-700" /> Hygienically packed
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-cream-200 pt-6">
              <div className="flex gap-6 mb-4 border-b border-cream-200">
                {(["description", "ingredients", "shelf"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium capitalize transition-colors relative ${
                      activeTab === tab ? "text-maroon-700" : "text-brown-400"
                    }`}
                  >
                    {tab === "shelf" ? "Shelf Life" : tab}
                    {activeTab === tab && (
                      <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-maroon-700" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-brown-600 text-sm leading-relaxed">
                {activeTab === "description" && product.description}
                {activeTab === "ingredients" && product.ingredients}
                {activeTab === "shelf" && `Best consumed within ${product.shelfLife} from the date of packing. Store in a cool, dry place away from direct sunlight. Always use a clean, dry spoon.`}
              </p>
            </div>
          </motion.div>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section className="py-14 bg-cream-100">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="section-title mb-8">You Might Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((p, i) => (
                  <ProductCard key={p._id} product={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
