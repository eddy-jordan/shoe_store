"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
}

/** Full-bleed parallax background layer. Parent must be `relative` with a defined height. */
export function ParallaxImage({ src, alt, speed = 0.3 }: ParallaxImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    function update() {
      const wrapper = wrapperRef.current;
      const image = imageRef.current;
      if (!wrapper || !image) return;

      const rect = wrapper.getBoundingClientRect();
      const offset = rect.top * speed;
      image.style.transform = `translate3d(0, ${offset}px, 0)`;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 overflow-hidden">
      <div ref={imageRef} className="absolute inset-0 -top-1/4 h-[150%] w-full will-change-transform">
        <Image src={src} alt={alt} fill priority className="object-cover" sizes="100vw" />
      </div>
    </div>
  );
}
