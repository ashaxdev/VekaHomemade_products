"use client";
import { useState } from "react";
import { X, Truck, Phone } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-maroon-800 text-white text-xs py-2 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Truck size={13} className="text-gold-300" />
          <span>Free delivery on orders above ₹499</span>
        </div>
        <span className="text-maroon-600 hidden md:block">|</span>
        <div className="flex items-center gap-1.5">
          <Phone size={13} className="text-gold-300" />
          <span>Order: +91 6381513752</span>
        </div>
        <span className="text-maroon-600 hidden md:block">|</span>
        <span className="text-gold-300 font-semibold">100% Homemade · No Preservatives</span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-gold-300 transition-colors"
        aria-label="Close announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
