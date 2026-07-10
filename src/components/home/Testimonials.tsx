"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Meena Sundaram",
    location: "Chennai",
    text: "The mango pickle tastes exactly like my grandmother used to make. I've stopped buying store pickles completely after finding this.",
    rating: 5,
  },
  {
    name: "Karthik Raja",
    location: "Coimbatore",
    text: "Ordered the podi combo pack for my mother in the US. She said it brought back so many memories. Packaging was excellent too.",
    rating: 5,
  },
  {
    name: "Priya Venkatesh",
    location: "Bengaluru",
    text: "Finally a brand that doesn't compromise on quality. The garlic thokku is incredibly authentic and the spice level is just right.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-subtitle">Testimonials</span>
          <h2 className="section-title mt-2">What Our Customers Say</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 relative"
            >
              <Quote size={32} className="text-gold-200 absolute top-5 right-5" />
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} size={15} className="fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="text-brown-600 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-maroon-700 text-white flex items-center justify-center font-semibold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-brown-800 text-sm">{t.name}</p>
                  <p className="text-xs text-brown-400">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
