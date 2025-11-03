// src/components/BootGate.jsx
import { useEffect, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";

function preloadImage(url) {
  return new Promise((resolve) => {
    if (!url) return resolve();
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = url;
  });
}

export default function BootGate({
  children,
  preloadImages = [],  // e.g. ['https://.../hero.jpg']
  minimumShowMs = 1400, // minimum time to show loader
  maskFadeMs = 420,    // fade-out of the mask
  contentFadeMs = 600, // fade-in of logo/subtitle
}) {
  const [ready, setReady] = useState(false);

  // Fade-in animation for loader content
  useLayoutEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from("#boot-logo", {
        opacity: 0,
        y: 10,
        duration: contentFadeMs / 1000,
        ease: "power2.out",
      }).from(
        "#boot-subtitle",
        {
          opacity: 0,
          y: 8,
          duration: contentFadeMs / 1000,
          ease: "power2.out",
        },
        "-=0.35"
      );
    });

    return () => ctx.revert();
  }, [contentFadeMs]);

  // Gate logic (fonts/images/min delay), then fade mask
  useEffect(() => {
    let mounted = true;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fontsPromise =
      typeof document !== "undefined" && document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve();

    const imagesPromise = Promise.all(preloadImages.map(preloadImage));
    const minDelay = new Promise((res) =>
      setTimeout(res, prefersReduced ? 0 : minimumShowMs)
    );

    Promise.all([fontsPromise, imagesPromise, minDelay]).then(() => {
      if (!mounted) return;

      if (prefersReduced) {
        setReady(true);
        return;
      }

      // Fade out the mask, then unmount it
      gsap.to("#boot-mask", {
        opacity: 0,
        duration: Math.max(maskFadeMs, 200) / 1000,
        ease: "power2.out",
        onComplete: () => mounted && setReady(true),
      });
    });

    return () => {
      mounted = false;
    };
  }, [preloadImages, minimumShowMs, maskFadeMs]);

  return (
    <>
      {!ready && (
        <div
          id="boot-mask"
          className="fixed inset-0 z-[70] bg-creme flex items-center justify-center"
          aria-label="Loading"
        >
          <div className="text-center select-none">
            <div id="boot-logo" className="font-clash text-4xl md:text-6xl font-bold text-charcoal">
              taf
            </div>
            <div id="boot-subtitle" className="mt-3 text-charcoal/60 text-sm">
              loading looks…
            </div>
          </div>
        </div>
      )}
      {ready ? children : null}
    </>
  );
}
