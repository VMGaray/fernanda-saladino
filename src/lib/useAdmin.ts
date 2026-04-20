"use client";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      setIsAdmin(data?.role === "admin");
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isAdmin, loading };
}
