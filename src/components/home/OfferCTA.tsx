"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gift } from "lucide-react";

export default function OfferCTA() {
  return (
    <section className="py-12 md:py-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto overflow-hidden rounded-[32px]
                   min-h-[560px] sm:min-h-[480px] md:h-[430px]"
      >
        {/* Background */}
        <Image
          src="/images/Home/Home2.png"
          alt="Combo Packs Banner"
          fill
          priority
          className="object-cover object-center md:object-center"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-full max-w-3xl text-center px-6 md:px-12">

            <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6">
              <Gift size={30} className="text-brown-900" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
              Try Our Pickles &amp; Save 20%
            </h2>

            <p className="mx-auto max-w-2xl text-white text-base sm:text-lg leading-8 mb-8">
              Get a curated mix of our most-loved pickles, Thokku,
              podis and homemade specialties — perfect for gifting
              or stocking your pantry.
            </p>

            <Link
              href="/shop?category=Combo+Packs"
              className="inline-flex items-center gap-2
                         bg-gold-500 hover:bg-gold-400
                         text-brown-900
                         px-8 py-4
                         rounded-xl
                         font-semibold
                         shadow-xl
                         transition-all"
            >
              Explore Pickles
              <ArrowRight size={20} />
            </Link>

          </div>
        </div>
      </motion.div>
    </section>
  );
}