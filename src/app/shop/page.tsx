"use client";

import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/types";

const categories = ["All", "Pickles", "Thokku", "Masala"];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [sort, setSort] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);

    const url =
      activeCategory === "All"
        ? "/api/products"
        : `/api/products?category=${encodeURIComponent(activeCategory)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);

    const params = new URLSearchParams(searchParams.toString());

    if (cat === "All") params.delete("category");
    else params.set("category", cat);

    const query = params.toString();
    router.push(query ? `/shop?${query}` : "/shop", { scroll: false });
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-low") return a.discountPrice - b.discountPrice;
      if (sort === "price-high") return b.discountPrice - a.discountPrice;
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main>
        {/* Shop Hero Banner */}
        <section className="relative w-full bg-cream-100 overflow-hidden">
          <div className="relative w-full h-[190px] sm:h-[260px] md:h-[380px] lg:h-[450px]">
            <Image
              src="/images/hero shop.png"
              alt="Veka Homemade products Banner"
              fill
              priority
              sizes="100vw"
              className="object-contain md:object-cover object-center"
            />
          </div>
        </section>

        {/* Products Section */}
        <section className="py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field flex-1"
              />

              <div className="flex gap-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="input-field flex-1 sm:w-48 cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="md:hidden p-3 bg-white rounded-xl border border-cream-200"
                  aria-label="Toggle filters"
                >
                  {filterOpen ? <X size={20} /> : <SlidersHorizontal size={20} />}
                </button>
              </div>
            </div>

            <div
              className={`flex flex-wrap gap-2.5 mb-8 ${
                filterOpen ? "flex" : "hidden md:flex"
              }`}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-maroon-700 text-white shadow-card"
                      : "bg-white text-brown-600 border border-cream-200 hover:border-maroon-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-cream-200 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-brown-500 text-lg">No products found.</p>
                <p className="text-brown-400 text-sm mt-2">
                  Try a different category or search term.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
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

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-50" />}>
      <ShopContent />
    </Suspense>
  );
}