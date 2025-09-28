// src/pages/Home.js
import { Link } from "react-router-dom";
import ScrollFloat from "../components/ScrollFloat";

// Triptych images for the About section
const aboutImages = [
  "https://placehold.co/600x800?text=Look+1",
  "https://placehold.co/600x800?text=Look+2",
  "https://placehold.co/600x800?text=Look+3",
];

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
      {/* 1) HERO — play-on-mount animations for title + subtitle */}
      <section
        className="relative max-w-6xl mx-auto flex items-center justify-center px-4"
        style={{ minHeight: "90svh" }}
      >
        <div className="text-center">
          {/* HERO title — plays once on mount */}
          <ScrollFloat
            as="h1"
            playOnMount
            animationDuration={1}
            ease="power3.out"
            containerClassName="m-0"
            textClassName="font-clash font-bold text-charcoal text-[4rem] sm:text-[6rem] md:text-[8rem] leading-none"
          >
            throw a fit
          </ScrollFloat>

          {/* HERO subtitle — also plays on mount, slightly delayed */}
          <ScrollFloat
            as="p"
            playOnMount
            mountDelay={0.25}
            animationDuration={0.9}
            ease="power3.out"
            stagger={0.01}
            containerClassName="mt-6 m-0"
            textClassName="text-[1.25rem] sm:text-[1.5rem] md:text-[2rem] text-charcoal/70"
          >
            {"don't know what to wear? throw a fit."}
          </ScrollFloat>
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

      {/* 2) ABOUT — wider container + 12-col layout */}
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
            <ScrollFloat
              as="h2"
              animationDuration={1.1}
              ease="back.out(1.4)"
              scrollStart="top 90%"
              scrollEnd="top 45%"
              stagger={0.022}
              containerClassName="m-0"
              textClassName="text-3xl md:text-4xl font-bold text-charcoal"
            >
              find the fit
            </ScrollFloat>

            <ScrollFloat
              as="p"
              animationDuration={1.05}
              ease="power2.out"
              scrollStart="top 95%"
              scrollEnd="top 55%"
              stagger={0.005}
              containerClassName="mt-4 m-0"
              textClassName="text-charcoal/70"
            >
              Throw a Fit is a community-driven space to share thrifted outfits, tag the pieces, and discover new styles. Think of it like your curated,
              fashion-forward moodboard — powered by real people and real finds.
            </ScrollFloat>

            <div className="mt-6">
              <ScrollFloat
                as="h3"
                animationDuration={0.9}
                ease="power2.out"
                scrollStart="top 96%"
                scrollEnd="top 70%"
                stagger={0.01}
                containerClassName="m-0"
                textClassName="text-xl font-normal text-charcoal"
              >
                What you can do
              </ScrollFloat>

              <ul className="mt-2 space-y-2 text-charcoal/80 list-disc list-inside">
                <li>Upload your fit and tag each garment</li>
                <li>Browse looks by style, color and vibe</li>
                <li>Follow profiles you love</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 3) FEATURED STYLES — symmetric mosaic */}
      <section id="collections" className="max-w-[100rem] mx-auto px-4 py-12 md:py-16">
        <header className="mb-6 md:mb-8 text-center">
          <ScrollFloat
            as="h2"
            animationDuration={1.05}
            ease="power3.out"
            scrollStart="top 92%"
            scrollEnd="top 50%"
            stagger={0.02}
            containerClassName="m-0"
            textClassName="text-2xl md:text-3xl font-bold text-charcoal"
          >
            fitography
          </ScrollFloat>

          <ScrollFloat
            as="p"
            animationDuration={0.95}
            ease="power2.out"
            scrollStart="top 95%"
            scrollEnd="top 60%"
            stagger={0.006}
            containerClassName="mt-2 m-0"
            textClassName="text-charcoal/70"
          >
            Dare to mix and match. Check our collections to level up your fashion game.
          </ScrollFloat>
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
          />

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
    </div>
  );
}
