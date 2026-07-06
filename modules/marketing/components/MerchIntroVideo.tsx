"use client";

import { useEffect, useRef, useState } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function MerchIntroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let animationFrame = 0;

    function updateOpacity() {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const fadeDistance = Math.max(section.offsetHeight * 0.68, 1);
      const progress = clamp(Math.abs(Math.min(rect.top, 0)) / fadeDistance, 0, 1);

      setOpacity(1 - progress * 0.82);
    }

    function onScroll() {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateOpacity);
    }

    updateOpacity();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[128svh] overflow-clip border-b border-neutral-100 bg-black"
    >
      <div className="sticky top-0 flex min-h-screen items-center justify-center bg-black">
        <video
          aria-label="TSA merch logo intro"
          autoPlay
          className="h-screen w-full object-cover transition-opacity duration-150 ease-out"
          loop
          muted
          playsInline
          preload="auto"
          src="/membership/merch/intro-video"
          style={{ opacity }}
        />
      </div>
    </section>
  );
}
