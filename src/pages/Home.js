// src/pages/Home.js
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";

// Demo content (unchanged)
const outfits = [
  { id: 1, img: "https://placehold.co/800x1000?text=Outfit+1", title: "Vintage Streetwear", tags: ["Thrifted", "Street", "90s"] },
  { id: 2, img: "https://placehold.co/800x1000?text=Outfit+2", title: "Summer Casual",      tags: ["Casual", "Light", "Minimal"] },
  { id: 3, img: "https://placehold.co/800x1000?text=Outfit+3", title: "Layered Fit",        tags: ["Layered", "Cozy", "Neutral"] },
  { id: 4, img: "https://placehold.co/800x1000?text=Outfit+4", title: "Denim Rework",       tags: ["DIY", "Denim"] },
  { id: 5, img: "https://placehold.co/800x1000?text=Outfit+5", title: "Y2K Throwback",      tags: ["Y2K", "Thrifted"] },
  { id: 6, img: "https://placehold.co/800x1000?text=Outfit+6", title: "Prep Revival",       tags: ["Preppy", "Clean"] },
];

// Triptych images for the About section
const aboutImages = [
  "https://placehold.co/600x800?text=Look+1",
  "https://placehold.co/600x800?text=Look+2",
  "https://placehold.co/600x800?text=Look+3",
];

function Tag({ children }) {
  return (
    <span className="px-2.5 py-1 rounded-full text-xs bg-white/70 border border-line text-charcoal/80">
      {children}
    </span>
  );
}

/** Reusable card for the mosaic */
function CollectionCard({ title, img, className = "", children }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-line bg-white/70 ${className}`}>
      {/* image layer with hover zoom */}
      <img
        src={img}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {/* overlay */}
      <div className="absolute inset-0 bg-black/20" />
      {/* content */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-creme p-4">
        <h3 className="text-2xl md:text-3xl font-normal">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-creme">
      {/* 1) HERO (unchanged width — you like it as is) */}
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
              href="#about"
              className="px-5 py-2 rounded-lg border border-line text-charcoal hover:bg-white/60 transition"
            >
              Learn more
            </a>
          </div>
        </div>

        {/* scroll cue */}
        <a
          href="#about"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-charcoal/60 hover:text-charcoal transition flex flex-col items-center"
          aria-label="Scroll to about section"
        >
          <span className="text-xs tracking-wider">scroll</span>
          <svg className="w-5 h-5 mt-1 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>

      {/* 2) ABOUT — wider container + 12-col layout for fuller content width */}
      <section id="about" className="max-w-[100rem] mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* LEFT images: span 7/12 on large screens */}
          <div className="lg:col-span-7 bg-white/70 border border-line rounded-3xl p-3">
            <div className="grid grid-cols-3 gap-3">
              {aboutImages.map((src, i) => (
                <div key={i} className="overflow-hidden rounded-2xl">
                  <img
                    src={src}
                    alt={`About visual ${i + 1}`}
                    className="w-full h-[220px] md:h-[360px] object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT text: span 5/12 on large screens */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal">
              Find your next thrifted look
            </h2>
            <p className="mt-4 text-charcoal/70">
              Throw a Fit is a community-driven space to share thrifted outfits,
              tag the pieces, and discover new styles. Think of it like your
              curated, fashion-forward moodboard — powered by real people and real finds.
            </p>

            <div className="mt-6">
              <h3 className="text-xl font-normal text-charcoal">What you can do</h3>
              <ul className="mt-2 space-y-2 text-charcoal/80 list-disc list-inside">
                <li>Upload your fit and tag each garment</li>
                <li>Browse looks by style, color and vibe</li>
                <li>Follow profiles you love</li>
              </ul>
            </div>

            <div className="mt-8 flex gap-3">
              <Link
                to="/upload"
                className="bg-charcoal text-creme px-5 py-2 rounded-lg hover:bg-charcoal/90 transition"
              >
                Post your first fit
              </Link>
              <a
                href="#collections"
                className="px-5 py-2 rounded-lg border border-line text-charcoal hover:bg-white/60 transition"
              >
                Explore the feed
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3) FEATURED STYLES — wider container; height/shape unchanged */}
      <section id="collections" className="max-w-[100rem] mx-auto px-4 py-12 md:py-16">
        <header className="mb-6 md:mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal">fitography</h2>
          <p className="mt-2 text-charcoal/70">
            Dare to mix and match. Check our collections to level up your fashion game.
          </p>
        </header>

        <div
          className="
            grid gap-4
            sm:grid-cols-2 sm:auto-rows-[170px]
            lg:grid-cols-6 lg:grid-rows-[repeat(5,minmax(0,1fr))]
            lg:h-[min(82svh,700px)]
          "
        >
          {/* LEFT column */}
          <CollectionCard
            title="Streetwear"
            img="https://placehold.co/1200x800?text=Streetwear"
            className="sm:col-span-2 lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2"
          />
          <CollectionCard
            title="Vintage"
            img="https://placehold.co/1200x800?text=Vintage"
            className="sm:col-span-2 lg:col-start-1 lg:col-span-2 lg:row-start-3 lg:row-span-3"
          >
            <p className="mt-2 text-sm text-creme/90 text-center max-w-xs">
              Hand-picked classics and rare finds. New drops weekly.
            </p>
            <Link
              to="/"
              className="mt-3 inline-block rounded-full bg-creme/90 text-charcoal px-4 py-1.5 text-sm hover:bg-creme transition"
            >
              Discover
            </Link>
          </CollectionCard>

          {/* MIDDLE column (inverse) */}
          <CollectionCard
            title="Techwear"
            img="https://placehold.co/1200x800?text=Techwear"
            className="sm:col-span-2 lg:col-start-3 lg:col-span-2 lg:row-start-1 lg:row-span-3"
          />
          <CollectionCard
            title="Athleisure"
            img="https://placehold.co/1200x800?text=Athleisure"
            className="sm:col-span-2 lg:col-start-3 lg:col-span-2 lg:row-start-4 lg:row-span-2"
          />

          {/* RIGHT column (mirror left) */}
          <CollectionCard
            title="Minimalist"
            img="https://placehold.co/1200x800?text=Minimalist"
            className="sm:col-span-2 lg:col-start-5 lg:col-span-2 lg:row-start-1 lg:row-span-2"
          />
          <CollectionCard
            title="Y2K"
            img="https://placehold.co/1200x800?text=Y2K"
            className="sm:col-span-2 lg:col-start-5 lg:col-span-2 lg:row-start-3 lg:row-span-3"
          />
        </div>
      </section>

      {/* 4) CTA / STORY — wider container; height unchanged, text allowed to breathe more */}
      <section className="max-w-[100rem] mx-auto px-4 pb-24">
        <div className="rounded-2xl border border-line bg-white/70 p-6 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal">Share your thrift story</h2>
          <p className="mt-3 text-charcoal/70 max-w-4xl mx-auto">
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
