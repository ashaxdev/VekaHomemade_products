"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/dashboard/orders");
  }, [router]);

  return <div className="min-h-screen bg-cream-50" />;
}
