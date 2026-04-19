"use client";
import { useState, useEffect } from "react";

export function useScrollHeader() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Siempre visible en el top
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolleando hacia abajo → ocultar
        setVisible(false);
      } else {
        // Scrolleando hacia arriba → mostrar
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return visible;
}