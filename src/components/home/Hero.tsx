"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Award } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-cream-50">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-gold-200/30 rounded-full blur-3xl" />
      <div className="absolute top-40 -left-32 w-80 h-80 bg-maroon-700/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center relative">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="h-px w-8 bg-gold-500" />
            <span className="section-subtitle">Traditional &amp; Homemade</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brown-800 leading-tight mb-6">
            The Taste of <span className="text-maroon-700 italic">Ammamma&apos;s</span> Kitchen, Delivered
          </h1>
          <p className="text-brown-600 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
            Handcrafted pickles,  &amp; Thokku made the way our grandmothers made them —
            slow-cooked, sun-dried, and packed with real ingredients. No shortcuts, no preservatives.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <Link href="/shop" className="btn-primary flex items-center gap-2 group">
              Shop Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about" className="btn-outline">
              Our Story
            </Link>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-sm text-brown-600">
              <div className="p-2 bg-maroon-700/10 rounded-full">
                <Leaf size={16} className="text-maroon-700" />
              </div>
              <span>100% Natural</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-brown-600">
              <div className="p-2 bg-gold-500/10 rounded-full">
                <Award size={16} className="text-gold-500" />
              </div>
              <span>Since 2018</span>
            </div>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-card-hover">
            <Image
              src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80"
              alt="Traditional South Indian pickles in jars"
              fill
              priority
              className="object-cover object-[65%_center] md:object-center"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-card-hover p-4 flex items-center gap-3 max-w-[220px]"
          >
            <div className="w-12 h-12 rounded-full bg-maroon-700/10 flex items-center justify-center flex-shrink-0">
              <Leaf size={20} className="text-maroon-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-brown-800">No Preservatives</p>
              <p className="text-xs text-brown-500">Made fresh weekly</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
