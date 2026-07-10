"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.push("/admin/dashboard/orders");
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  return <div className="min-h-screen bg-brown-800" />;
}
