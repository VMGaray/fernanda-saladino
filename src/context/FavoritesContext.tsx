"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("fs-favorites");
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (next: string[]) => {
    setFavorites(next);
    localStorage.setItem("fs-favorites", JSON.stringify(next));
  };

  const addFavorite = (id: string) => {
    if (!favorites.includes(id)) persist([...favorites, id]);
  };

  const removeFavorite = (id: string) => {
    persist(favorites.filter(f => f !== id));
  };

  const toggleFavorite = (id: string) => {
    favorites.includes(id) ? removeFavorite(id) : addFavorite(id);
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
