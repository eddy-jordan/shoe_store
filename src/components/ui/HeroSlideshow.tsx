"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  alt: string;
}

interface HeroSlideshowProps {
  slides: Slide[];
  intervalMs?: number;
  parallaxSpeed?: number;
}

/** Full-bleed crossfading slideshow with a parallax drift. Parent must be `relative` with a defined height. */
export function HeroSlideshow({ slides, intervalMs = 5000, parallaxSpeed = 0.25 }: HeroSlideshowProps) {
  const [index, setIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || slides.length <= 1) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);

    return () => clearInterval(id);
  }, [slides.length, intervalMs]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    function update() {
      const wrapper = wrapperRef.current;
      const image = imageRef.current;
      if (!wrapper || !image) return;

      const rect = wrapper.getBoundingClientRect();
      const offset = rect.top * parallaxSpeed;
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
  }, [parallaxSpeed]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 overflow-hidden">
      <div ref={imageRef} className="absolute inset-0 -top-1/4 h-[150%] w-full will-change-transform">
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            sizes="100vw"
          />
        ))}
      </div>
    </div>
  );
}
