"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const images = [
  "/images/Pickles/karuvadu1.png",
  "/images/Pickles/karuvadu2.png",
  "/images/Pickles/karuvadu3.png",
  "/images/Pickles/karuvadu5.png",
  "/images/Pickles/Pickle1.png",
  "/images/Pickles/Pickle2.png",
  "/images/Pickles/pickle3.png",
  "/images/Pickles/pickle6.png",
  "/images/Pickles/pickle4.png",
];

export default function PicklesSlideshow() {
  return (
    <section className="py-14 bg-cream-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="section-subtitle">Seafood Specials</span>
          <h2 className="section-title mt-2">Karuvadu & Meen Oorugai</h2>
        </div>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-5"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...images, ...images].map((src, index) => (
              <div
                key={index}
                className="relative min-w-[240px] md:min-w-[320px] h-[220px] md:h-[300px] rounded-3xl overflow-hidden shadow-card"
              >
                <Image
                  src={src}
                  alt="Karuvadu pickle"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}