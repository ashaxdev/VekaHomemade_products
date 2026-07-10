"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <section className="py-16 bg-gold-500/10">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-14 h-14 bg-maroon-700 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Mail size={24} className="text-white" />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-brown-800 mb-3">
            Get 10% Off Your First Order
          </h2>
          <p className="text-brown-500 mb-7 max-w-md mx-auto">
            Subscribe for new arrivals, festive offers, and recipes from our kitchen.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field flex-1"
            />
            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {subscribed ? (
                <>
                  <Check size={18} /> Subscribed
                </>
              ) : (
                <>
                  Subscribe <Send size={16} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
