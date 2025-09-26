// src/pages/Home.js
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";

const outfits = [
  { id: 1, img: "https://via.placeholder.com/800x1000?text=Outfit+1", title: "Vintage Streetwear", tags: ["Thrifted", "Street", "90s"] },
  { id: 2, img: "https://via.placeholder.com/800x1000?text=Outfit+2", title: "Summer Casual", tags: ["Casual", "Light", "Minimal"] },
  { id: 3, img: "https://via.placeholder.com/800x1000?text=Outfit+3", title: "Layered Fit", tags: ["Layered", "Cozy", "Neutral"] },
  { id: 4, img: "https://via.placeholder.com/800x1000?text=Outfit+4", title: "Denim Rework", tags: ["DIY", "Denim"] },
  { id: 5, img: "https://via.placeholder.com/800x1000?text=Outfit+5", title: "Y2K Throwback", tags: ["Y2K", "Thrifted"] },
  { id: 6, img: "https://via.placeholder.com/800x1000?text=Outfit+6", title: "Prep Revival", tags: ["Preppy", "Clean"] },
];

function Tag({ children }) {
  return (
    <span className="px-2.5 py-1 rounded-full text-xs bg-white/70 border border-line text-charcoal/80">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <div className="bg-creme">
      {/* 1) HERO — ~90svh so next section peeks */}
      <section
        className="relative max-w-6xl mx-auto flex items-center justify-center px-4"
        style={{ minHeight: "90svh" }}
      >
        <div className="text-center">
            <h1 className="font-clash font-bold text-charcoal text-[4rem] sm:text-[6rem] md:text-[8rem] leading-none">
              throw a fit
            </h1>
            <p className="mt-6 text-[1.25rem] sm:text-[1.5rem] md:text-[2rem] text-charcoal/70">
              don't know what to wear? throw a fit.
            </p>
          
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/upload"
              className="bg-charcoal text-creme px-5 py-2 rounded-lg hover:bg-charcoal/90 transition"
            >
              Upload a Fit
            </Link>
            <a
              href="#discover"
              className="px-5 py-2 rounded-lg border border-line text-charcoal hover:bg-white/60 transition"
            >
              Browse
            </a>
          </div>
        </div>

        {/* scroll cue */}
        <a
          href="#discover"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-charcoal/60 hover:text-charcoal transition flex flex-col items-center"
          aria-label="Scroll to discover"
        >
          <span className="text-xs tracking-wider">scroll</span>
          <svg className="w-5 h-5 mt-1 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>

      {/* 2) DISCOVER GRID */}
      <section id="discover" className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <header className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal">Discover Fits</h2>
          <p className="mt-2 text-charcoal/70">Fresh thrifted outfits from the community</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {outfits.map((o, i) => (
            <Reveal key={o.id} delay={i * 0.05}>
              <TiltCard>
                <img
                  src={o.img}
                  alt={o.title}
                  className="w-full h-72 object-cover rounded-2xl"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-charcoal">{o.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {o.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                  <Link
                    to={`/outfit/${o.id}`}
                    className="inline-block mt-3 text-sm text-charcoal hover:text-charcoal/80 underline-offset-4 hover:underline"
                  >
                    View Outfit →
                  </Link>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3) CTA / STORY */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="rounded-2xl border border-line bg-white/70 p-6 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal">Share your thrift story</h2>
          <p className="mt-3 text-charcoal/70 max-w-2xl mx-auto">
            Post your latest find, tag the garments, and inspire someone’s next fit.
          </p>
          <div className="mt-6">
            <Link
              to="/upload"
              className="bg-charcoal text-creme px-5 py-2 rounded-lg hover:bg-charcoal/90 transition"
            >
              Upload a Fit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
