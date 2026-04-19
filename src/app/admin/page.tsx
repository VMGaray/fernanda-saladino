"use client";
import { useAdmin } from "../../lib/useAdmin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminPanel from "../../components/admin/AdminPanel";

export default function AdminPage() {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) router.push("/");
  }, [isAdmin, loading]);

  if (loading) return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <p className="text-brand-silver tracking-widest uppercase text-xs animate-pulse">Verificando acceso...</p>
    </div>
  );

  if (!isAdmin) return null;

  return <AdminPanel />;
}
