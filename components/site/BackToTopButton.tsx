"use client";

import { useEffect, useState } from "react";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function updateVisibility() {
      setVisible(window.scrollY > 500);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={
        "fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/80 text-lg font-semibold text-white shadow-lg backdrop-blur-xl transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 " +
        (visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0")
      }
    >
      ↑
    </button>
  );
}
