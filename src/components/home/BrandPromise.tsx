"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Leaf, Flame, Package, Heart } from "lucide-react";

const promises = [
  {
    icon: Leaf,
    title: "Pure Ingredients",
    desc: "Farm-fresh vegetables, cold-pressed oils, and hand-ground spices — nothing artificial, ever.",
  },
  {
    icon: Flame,
    title: "Traditional Methods",
    desc: "Slow-cooked in small batches using recipes passed down through three generations.",
  },
  {
    icon: Package,
    title: "Hygienic Packing",
    desc: "Sealed fresh in food-grade jars to lock in flavour and keep it shelf-stable for months.",
  },
  {
    icon: Heart,
    title: "Made With Love",
    desc: "Every jar is packed by hand in our family kitchen — never a factory assembly line.",
  },
];

export default function BrandPromise() {
  return (
    <section className="relative overflow-hidden text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/Home/home3.png"
          alt="Veka products promise background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-brown-900/65" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-14"
        >
          <span className="text-gold-400 font-semibold text-xs sm:text-sm tracking-widest uppercase">
            Our Promise
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mt-3 leading-tight">
            Why Families Trust Us
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {promises.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center px-3"
            >
              <div className="w-16 h-16 rounded-2xl bg-brown-700/80 backdrop-blur flex items-center justify-center mx-auto mb-5 border border-gold-500/25">
                <item.icon size={26} className="text-gold-400" />
              </div>

              <h3 className="font-semibold text-lg md:text-xl mb-3">
                {item.title}
              </h3>

              <p className="text-cream-100 text-sm md:text-base leading-relaxed max-w-xs mx-auto">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}