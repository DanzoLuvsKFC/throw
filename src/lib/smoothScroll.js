// Optional smooth scrolling initializer without external deps.
// Provides programmatic smooth scroll via window.__lenis.scrollTo
// so anchors feel smooth even if @studio-freight/lenis isn't installed yet.
export function initSmoothScroll() {
  if (typeof window === 'undefined') return null;

  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return null;

  if (window.__lenis && typeof window.__lenis.scrollTo === 'function') return () => {};

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const scrollTo = (target, opts = {}) => {
    const { offset = 0, duration = 1 } = opts;
    const startY = window.scrollY || window.pageYOffset;
    const targetY = typeof target === 'number'
      ? target
      : (target?.getBoundingClientRect?.().top ?? 0) + startY + offset;

    const startTime = performance.now();
    const totalMs = Math.max(0, duration * 1000);

    const step = () => {
      const now = performance.now();
      const t = totalMs === 0 ? 1 : Math.min(1, (now - startTime) / totalMs);
      const y = startY + (targetY - startY) * easeOutCubic(t);
      window.scrollTo(0, y);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  window.__lenis = { scrollTo };
  return () => { delete window.__lenis; };
}
