"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-serif text-7xl font-bold text-maroon-700 mb-4">404</p>
          <h1 className="text-2xl font-semibold text-brown-800 mb-3">Page Not Found</h1>
          <p className="text-brown-500 mb-8 max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            Back to Home <ArrowRight size={16} />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
