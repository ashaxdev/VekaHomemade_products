"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const images = [
  "/images/Pickles/Karuvadu.png",
  "/images/Pickles/karuvadu1.png",
  "/images/Pickles/karuvadu2.png",
  "/images/Pickles/pickle9.png",
  "/images/Pickles/Pickle2.png",
  "/images/Pickles/Pickle1.png"
];

export default function InstagramGallery() {
  return (
    <section className="py-16 md:py-20 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="section-subtitle">Follow Along</span>
          <h2 className="section-title mt-2 flex items-center justify-center gap-3">
            <Instagram className="text-maroon-700" size={32} />
            @vekahomemadeproducts
          </h2>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {images.map((src, i) => (
            <motion.a
              href="#"
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="relative aspect-square rounded-xl overflow-hidden group"
            >
              <Image
                src={src}
                alt="Instagram post"
                fill
                sizes="(max-width: 768px) 33vw, 16vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-maroon-800/0 group-hover:bg-maroon-800/40 transition-colors duration-300 flex items-center justify-center">
                <Instagram
                  size={22}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
