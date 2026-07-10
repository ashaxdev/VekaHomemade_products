"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (!t) {
      router.push("/admin/login");
    } else {
      setToken(t);
    }
    setChecked(true);
  }, [router]);

  const logout = async () => {
    localStorage.removeItem("admin_token");
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return { token, checked, logout };
}

export function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
