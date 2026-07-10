"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  PackagePlus,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const navItems = [
  { href: "/admin/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/dashboard/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/dashboard/products", label: "Add Product", icon: PackagePlus },
  { href: "/admin/dashboard/analytics", label: "Analytics", icon: LayoutDashboard },
];

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { checked, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!checked) {
    return <div className="min-h-screen bg-cream-50" />;
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-brown-800 text-white px-4 py-3 flex items-center justify-between">
        <span className="font-serif font-bold">Veka Admin</span>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-brown-800 text-white flex flex-col z-30 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-brown-700 hidden md:block">
          <h1 className="font-serif text-xl font-bold">Veka</h1>
          <p className="text-gold-400 text-xs uppercase tracking-widest font-semibold">Admin Dashboard</p>
        </div>

        <nav className="flex-1 px-4 py-6 mt-14 md:mt-0 space-y-1.5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors relative ${
                  active ? "text-white" : "text-cream-200 hover:bg-brown-700"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="admin-nav-active"
                    className="absolute inset-0 bg-maroon-700 rounded-xl"
                  />
                )}
                <item.icon size={18} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brown-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-cream-200 hover:bg-brown-700 w-full transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-20"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
