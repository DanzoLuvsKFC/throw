import LogoLoop from "./LogoLoop";

// Inline SVG brand marks (no external deps)
const ReactLogo = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.2" {...props}>
    <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    <g stroke="currentColor">
      <ellipse cx="12" cy="12" rx="10" ry="4.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.6" transform="rotate(-60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.6" />
    </g>
  </svg>
);

const NextLogo = (props) => (
  <svg viewBox="0 0 128 78" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M83.3 0h10.9L44.2 76.9H33.3L83.3 0z" />
    <path d="M106.6 76.9L64.6 18.3h11.8l42 58.6h-11.8z" />
    <path d="M0 76.9V0h10.2v67.6h31.6v9.3H0z" />
  </svg>
);

const TypeScriptLogo = (props) => (
  <svg viewBox="0 0 256 256" width="1em" height="1em" aria-hidden="true" {...props}>
    <rect width="256" height="256" rx="24" fill="currentColor" opacity="0.09" />
    <path fill="currentColor" d="M105 116h46v14h-16v50h-14v-50h-16v-14zm68 64c6 0 10-2 13-6 3-3 5-8 5-13 0-6-2-10-5-13-3-4-8-6-14-6-7 0-12 2-15 7-3 4-5 9-5 16h14c0-4 1-6 2-8 2-2 4-3 7-3 2 0 4 1 6 3 1 2 2 4 2 7s-1 6-3 8c-2 1-4 2-7 2-4 0-7-1-9-4l-11 7c2 3 4 5 7 7 3 1 6 2 10 2z"/>
  </svg>
);

const TailwindLogo = (props) => (
  <svg viewBox="0 0 64 40" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M32 0C24 0 20 4 18 8c2-2 5-3 9-3 9 0 10 7 15 9 3 1 6 1 10-1-2 4-6 8-14 8-8 0-12-4-14-8-2 4-6 8-14 8C4 21 0 17 0 12 2 16 6 17 10 16c9 0 10-7 15-9 3-1 6-1 10 1 2-4 6-8 14-8z"/>
  </svg>
);

const techLogos = [
  { node: <ReactLogo />, title: "React", href: "https://react.dev" },
  { node: <NextLogo />, title: "Next.js", href: "https://nextjs.org" },
  { node: <TypeScriptLogo />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <TailwindLogo />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

export default function SiteFooter({
  logos = techLogos,
  speed = 120,
  direction = "left",
  logoHeight = 48,
  gap = 40,
  fadeOutColor = "#ffffe3",
}) {
  return (
    <footer className="w-full bg-creme border-t border-charcoal/10" role="contentinfo" aria-label="Site footer">
      <div className="w-full overflow-hidden pb-4">
        <LogoLoop
          logos={logos}
          speed={speed}
          direction={direction}
          logoHeight={logoHeight}
          gap={gap}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor={fadeOutColor}
          ariaLabel="Technology partners"
        />
      </div>
    </footer>
  );
}
