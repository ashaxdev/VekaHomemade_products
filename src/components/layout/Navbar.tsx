"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/track-order", label: "Track Order" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

interface CartItem {
  quantity: number;
  [key: string]: unknown;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const cart: CartItem[] = JSON.parse(localStorage.getItem("lkp_cart") || "[]");
      const count = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
      setCartCount(count);
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    window.addEventListener("cart-updated", updateCart);
    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("cart-updated", updateCart);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-card" : "bg-cream-50"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/veka-logo.jpeg"
            alt="Veka Homemade Products"
            width={1254}
            height={1254}
            priority
            className="h-12 w-auto md:h-14 object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-maroon-700 ${
                  pathname === link.href ? "text-maroon-700 font-semibold" : "text-brown-600"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/shop" className="hidden md:flex p-2 hover:text-maroon-700 transition-colors" aria-label="Search">
            <Search size={20} />
          </Link>
          <Link href="/cart" className="relative p-2 hover:text-maroon-700 transition-colors" aria-label="Cart">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-maroon-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-cream-200 overflow-hidden"
          >
            <ul className="px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-base font-medium block py-1 ${
                      pathname === link.href ? "text-maroon-700 font-semibold" : "text-brown-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}