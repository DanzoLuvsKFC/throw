import React from "react";

// Lightweight background grid with radial mask (no hooks, no animations)
export default function DomeGallery({
  images = [],
  grayscale = true,
  imageBorderRadius = "24px",
  cols = 12,
  rows = 5,
}) {
  const pool = Array.isArray(images) ? images : [];
  const normalized = pool
    .map((it, i) => (typeof it === "string" ? { src: it, alt: `image ${i + 1}` } : { src: it?.src, alt: it?.alt || "" }))
    .filter(Boolean);
  const total = cols * rows;
  const items = total === 0 ? [] : Array.from({ length: total }, (_, i) => normalized[i % Math.max(1, normalized.length)]);

  const css = `
    .dg-sbg { --gap: 14px; }
    .dg-sbg-mask {
      -webkit-mask-image: radial-gradient(120% 85% at 50% 50%, #000 58%, transparent 100%);
      mask-image: radial-gradient(120% 85% at 50% 50%, #000 58%, transparent 100%);
    }
    .dg-sbg-grid { display: grid; grid-template-columns: repeat(${cols}, minmax(0, 1fr)); gap: var(--gap); align-content: center; justify-content: center; height: 100%; padding: 0 clamp(12px, 6vw, 64px); }
    .dg-sbg-item { position: relative; overflow: hidden; background: #e5e7eb; box-shadow: 0 8px 24px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.06); }
  `;

  return (
    <div className="dg-sbg relative w-full h-full pointer-events-none">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="absolute inset-0 dg-sbg-mask">
        <div className="dg-sbg-grid">
          {items.map((it, i) => (
            <div key={i} className="dg-sbg-item" style={{ borderRadius: imageBorderRadius }}>
              {it?.src ? (
                <img src={it.src} alt={it.alt || ""} className="w-full h-full object-cover" style={{ filter: grayscale ? "grayscale(1)" : "none" }} />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-24" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0))" }} />
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-24" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35), rgba(0,0,0,0))" }} />
    </div>
  );
}

