"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const faqs = [
  {
    category: "Orders & Delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "We dispatch all orders within 24-48 hours of confirmation. Delivery typically takes 4-6 business days depending on your location across India.",
      },
      {
        q: "Do you offer free delivery?",
        a: "Yes! Orders above ₹499 qualify for free delivery. Orders below this amount have a flat delivery charge of ₹49.",
      },
      {
        q: "Can I track my order?",
        a: "Once your order is shipped, you'll receive tracking details via SMS and email so you can follow its journey to your doorstep.",
      },
      {
        q: "What if I'm not available during delivery?",
        a: "Our delivery partner will attempt delivery up to 3 times. You can also coordinate a convenient time using the contact number provided in your tracking SMS.",
      },
    ],
  },
  {
    category: "Products & Quality",
    items: [
      {
        q: "Are your products preservative-free?",
        a: "Yes, all our pickles, thokku, and podis are made using traditional methods with salt, oil, and natural preservation techniques — no chemical preservatives added.",
      },
      {
        q: "What is the shelf life of your products?",
        a: "Shelf life varies by product, ranging from 3 to 12 months. Exact shelf life is mentioned on each product page and on the jar label.",
      },
      {
        q: "How should I store the products after opening?",
        a: "Store in a cool, dry place away from direct sunlight. Always use a clean, dry spoon to scoop out pickles or podis to prevent spoilage.",
      },
      {
        q: "Are your products suitable for vegetarians?",
        a: "Yes, all our products are 100% vegetarian. Ingredient lists are available on each product page for full transparency.",
      },
    ],
  },
  {
    category: "Payments & Returns",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Cash on Delivery (COD) and UPI payments (GPay, PhonePe, Paytm, and other UPI apps).",
      },
      {
        q: "Can I cancel my order?",
        a: "Orders can be cancelled before they are packed. Please contact us as soon as possible at +91 8072115228 to request a cancellation.",
      },
      {
        q: "Do you offer refunds?",
        a: "If you receive a damaged or incorrect product, please contact us within 48 hours of delivery with photos, and we'll arrange a replacement or refund.",
      },
    ],
  },
];

function FAQItem({
  q,
  a,
  isOpen,
  onClick,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-medium text-brown-800">{q}</span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={18} className="text-maroon-700" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-brown-500 text-sm leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main>
        {/* FAQ Hero Banner */}
        <section className="relative w-full bg-cream-100 overflow-hidden">
          <div className="relative w-full h-[190px] sm:h-[260px] md:h-[380px] lg:h-[450px]">
            <Image
              src="/images/hero faq.png"
              alt="Veka Homemade Products FAQ Banner"
              fill
              priority
              sizes="100vw"
              className="object-contain md:object-cover object-center"
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-14">
          <div className="max-w-3xl mx-auto px-4 space-y-10">
            {faqs.map((group) => (
              <div key={group.category}>
                <h2 className="font-serif text-xl font-bold text-brown-800 mb-4">
                  {group.category}
                </h2>

                <div className="space-y-3">
                  {group.items.map((item) => {
                    const key = `${group.category}-${item.q}`;

                    return (
                      <FAQItem
                        key={key}
                        q={item.q}
                        a={item.a}
                        isOpen={openItem === key}
                        onClick={() =>
                          setOpenItem(openItem === key ? null : key)
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="card p-8 text-center bg-maroon-700/5">
              <h3 className="font-semibold text-brown-800 mb-2">
                Still have questions?
              </h3>

              <p className="text-brown-500 text-sm mb-5">
                Our team is happy to help with anything else you need.
              </p>

              <Link href="/contact" className="btn-primary inline-block">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}