"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  Check,
} from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const contactInfo = [
  { icon: Phone, title: "Call Us", value: "+91 6381513752", sub: "Mon-Sat, 9am-7pm" },
  { icon: Mail, title: "Email Us", value: "kalaveluchamy0430@gmail.com", sub: "We reply within 24 hours" },
  { icon: MapPin, title: "Visit Us", value: "Burmanagar, Ennore, Chennai, Tamil Nadu", sub: "India" },
  { icon: Clock, title: "Working Hours", value: "Mon - Sat", sub: "9:00 AM - 7:00 PM" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    }, 1000);
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main>
        {/* Contact Hero Banner */}
        <section className="relative w-full bg-cream-100 overflow-hidden">
          <div className="relative w-full h-[190px] sm:h-[260px] md:h-[380px] lg:h-[450px]">
            <Image
              src="/images/hero contact.png"
              alt="Veka Homemade products Contact Banner"
              fill
              priority
              sizes="100vw"
              className="object-contain md:object-cover object-center"
            />
          </div>
        </section>

        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
              {contactInfo.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-6 text-center"
                >
                  <div className="w-12 h-12 bg-maroon-700/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon size={20} className="text-maroon-700" />
                  </div>
                  <h3 className="font-semibold text-brown-800 text-sm mb-1">{item.title}</h3>
                  <p className="text-brown-700 text-sm font-medium break-words">{item.value}</p>
                  <p className="text-brown-400 text-xs mt-0.5">{item.sub}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card p-6 md:p-8"
              >
                <h2 className="font-serif text-2xl font-bold text-brown-800 mb-6">
                  Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="Your name"
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field"
                      placeholder="you@example.com"
                    />

                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-field"
                      placeholder="Phone"
                    />
                  </div>

                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field resize-none"
                    placeholder="How can we help you?"
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : sent ? (
                      <>
                        <Check size={18} /> Message Sent
                      </>
                    ) : (
                      <>
                        Send Message <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-3xl bg-gradient-to-r from-emerald-700 to-green-500 p-7 md:p-10 text-white shadow-card"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <Phone size={42} className="text-white flex-shrink-0" />
                      <div>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold">
                          Order via WhatsApp
                        </h2>
                        <p className="mt-2 text-white/90 font-medium">
                          Get instant replies & track your order
                        </p>
                      </div>
                    </div>

                    <a
                      href="https://wa.me/916381513752"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:scale-105"
                    >
                      Chat Now
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="rounded-3xl overflow-hidden shadow-card min-h-[360px] md:min-h-[430px]"
                >
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=80.3000%2C13.2000%2C80.3400%2C13.2400&layer=mapnik"
                    className="w-full h-[360px] md:h-[430px] border-0"
                    loading="lazy"
                    title="Location map"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}