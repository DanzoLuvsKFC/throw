// src/pages/Home.js
import { useMemo, useState, useLayoutEffect, useRef } from "react";
import ScrollFloat from "../components/ScrollFloat";
import { useFeed } from "../store/FeedContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import look1 from "../assets/fonts/fits/fit.jpg";
import look2 from "../assets/fonts/fits/fit 8.jpg";
import look3 from "../assets/fonts/fits/fit 12.jpg";

gsap.registerPlugin(ScrollTrigger);

const aboutImages = [look1, look2, look3];

/* Simple float/fade-in reveal */
function FloatIn({
  as = "div",
  children,
  className = "",
  duration = 0.8,
  delay = 0,
  y = 28,
  ease = "power3.out",
  start = "top 85%",
}) {
  const Tag = as;
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          end: "top 60%",
          toggleActions: "play none none none",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [duration, delay, y, ease, start]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/* Masonry-friendly card for uploads */
function FitCard({ post }) {
  return (
    <FloatIn
      as="article"
      className="mb-4 break-inside-avoid rounded-2xl overflow-hidden border border-charcoal/10 bg-white group"
      y={36}
    >
      <div className="relative">
        <img
          src={post.src}
          alt={post.caption || "uploaded fit"}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
        {post.tags?.length ? (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-creme/95 text-charcoal text-xs px-2 py-[2px] border border-charcoal/10"
              >
                {t}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="rounded-full bg-creme/90 text-charcoal text-xs px-2 py-[2px] border border-charcoal/10">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        ) : null}
      </div>
      {(post.caption || post.user) && (
        <div className="p-3">
          <div className="text-sm text-charcoal/60">
            @{post.user ?? "guest"} •{" "}
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "—"}
          </div>
          {post.caption ? <div className="mt-1 text-charcoal">{post.caption}</div> : null}
        </div>
      )}
    </FloatIn>
  );
}

/* ------------------ HOME ------------------ */
export default function Home() {
  const { posts } = useFeed();
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // HERO refs
  const textWrapRef = useRef(null); // wrapper that slides left
  const titleRef = useRef(null);
  const tagRef = useRef(null);      // tagline moves independently
  const heroImagesRef = useRef(null);

  /* HERO animation: title starts centered, slides left; images slide in from right (lg+).
     Tagline can be nudged independently via tagOffsetX. */
  useLayoutEffect(() => {
    const textWrap = textWrapRef.current;
    const title = titleRef.current;
    const tag = tagRef.current;
    const images = heroImagesRef.current;
    if (!textWrap || !title || !tag) return;

    const mm = gsap.matchMedia();

    mm.add(
      { base: "(min-width: 0px)", lg: "(min-width: 1024px)" },
      (ctx) => {
        const isLg = ctx.conditions.lg;

        // Reset any prior inline styles
        gsap.set([textWrap, title, tag], { clearProps: "all" });
        if (images) gsap.set(images, { clearProps: "all" });

        // Start positions
        gsap.set(textWrap, { x: 0, autoAlpha: 1 });
        gsap.set(tag, { x: 0 });
        if (images && isLg) gsap.set(images, { x: 240, autoAlpha: 0 });

        // Targets (edit these to taste)
        const textTargetX = isLg ? -350 : 0; // whole block (title + tagline)
        const tagOffsetX  = isLg ? 24 : 0;   // tagline-only offset (right is positive)

        const tl = gsap.timeline({ delay: 0.6, defaults: { ease: "power3.inOut" } });

        // 1) images in a touch early
        if (images && isLg) tl.to(images, { x: 0, autoAlpha: 1, duration: 1.1 }, 0.05);

        // 2) move whole text block from center to left
        tl.to(textWrap, { x: textTargetX, duration: 1.1 }, 0.0);

        // 3) tagline-only micro-adjust so it lines up exactly how you want
        tl.to(tag, { x: tagOffsetX, duration: 0.9 }, "<0.2");

        return () => tl.kill();
      }
    );

    return () => mm.kill();
  }, []);

  /* Fitography filtering logic */
  const allTags = useMemo(() => {
    const map = new Map();
    posts.forEach((p) =>
      (p.tags || []).forEach((t) => {
        const key = t.trim().toLowerCase();
        if (!key) return;
        map.set(key, (map.get(key) || 0) + 1);
      })
    );
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t);
  }, [posts]);

  const filtered = useMemo(() => {
    const raw = query.trim().toLowerCase();
    const isUserQuery = raw.startsWith("@");
    const q = isUserQuery ? raw.slice(1) : raw;

    return posts.filter((p) => {
      const tags = (p.tags || []).map((t) => t.toLowerCase());
      const user = (p.user || "").toLowerCase();
      const caption = (p.caption || "").toLowerCase();

      const hasAllSelected =
        selectedTags.length === 0 || selectedTags.every((t) => tags.includes(t));

      let matchesQuery = true;
      if (q) {
        matchesQuery = isUserQuery
          ? user.includes(q)
          : caption.includes(q) || user.includes(q) || tags.some((t) => t.includes(q));
      }

      return hasAllSelected && matchesQuery;
    });
  }, [posts, query, selectedTags]);

  const toggleTag = (t) =>
    setSelectedTags((arr) =>
      arr.includes(t) ? arr.filter((x) => x !== t) : [...arr, t]
    );

  const clearFilters = () => {
    setQuery("");
    setSelectedTags([]);
  };

  return (
    <div className="bg-creme">
      {/* ---------------- HERO ---------------- */}
      <section className="relative w-full overflow-visible">
        {/* Outer keeps hero vertically centered */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 min-h-[100svh] flex items-center justify-center">
          {/* Text block starts centered; slides left on lg+ */}
          <div ref={textWrapRef} className="text-center lg:text-left w-fit mx-auto lg:mx-0">
            <div ref={titleRef} className="block">
              <ScrollFloat
                as="h1"
                playOnMount
                animationDuration={1}
                ease="power3.out"
                containerClassName="m-0"
                textClassName="font-clash font-bold text-charcoal whitespace-nowrap text-[2.5rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7rem] leading-none"
              >
                throw a fit
              </ScrollFloat>
            </div>

            <div ref={tagRef} className="block mt-4 lg:mt-3">
              <ScrollFloat
                as="p"
                playOnMount
                mountDelay={0.25}
                animationDuration={0.9}
                ease="power3.out"
                stagger={0.01}
                containerClassName="m-0"
                textClassName="text-[1rem] sm:text-[1.25rem] md:text-[1.5rem] lg:text-[1.75rem] xl:text-[2rem] text-charcoal/70"
              >
                {"don't know what to wear? throw a fit."}
              </ScrollFloat>
            </div>
          </div>

          {/* Images on right (absolute so text starts perfectly centered) */}
          <div
            ref={heroImagesRef}
            className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 w-[48%] max-w-[760px]"
            aria-hidden="true"
          >
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-1 row-span-2 rounded-2xl overflow-hidden h-[66svh] min-h-[480px]">
                <img
                  src={aboutImages[0]}
                  alt="fit 1"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="col-span-1 rounded-2xl overflow-hidden h-[31svh] min-h-[220px]">
                <img
                  src={aboutImages[1]}
                  alt="fit 2"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="col-span-1 rounded-2xl overflow-hidden h-[31svh] min-h-[220px]">
                <img
                  src={aboutImages[2]}
                  alt="fit 3"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SCROLL CUE */}
        <a
          href="#about"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-charcoal/60 hover:text-charcoal transition flex flex-col items-center"
          aria-label="Scroll to about section"
        >
          <span className="text-xs tracking-wider">scroll</span>
          <svg
            className="w-5 h-5 mt-1 animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>

      {/* ---------------- ABOUT ---------------- */}
      <section id="about" className="max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* LEFT: images */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-3 gap-3">
              {aboutImages.map((src, i) => (
                <FloatIn key={i} className="rounded-2xl overflow-hidden" y={36}>
                  <img
                    src={src}
                    alt={`Outfit ${i + 1}`}
                    className="w-full h-[220px] md:h-[320px] lg:h-[360px] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </FloatIn>
              ))}
            </div>
          </div>

          {/* RIGHT: copy */}
          <div className="lg:col-span-5">
            <ScrollFloat
              as="h2"
              animationDuration={1.1}
              ease="back.out(1.4)"
              scrollStart="top 90%"
              scrollEnd="top 45%"
              stagger={0.022}
              containerClassName="m-0"
              textClassName="font-clash text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal"
            >
              find the fit
            </ScrollFloat>

            <FloatIn as="p" className="mt-4 m-0 text-charcoal/70" y={20} duration={0.9}>
              Throw a Fit is a community-driven space to share thrifted outfits, tag the pieces,
              and discover new styles. Think of it like your curated, fashion-forward moodboard,
              powered by real people and real finds.
            </FloatIn>
          </div>
        </div>
      </section>

      {/* ---------------- FITOGRAPHY ---------------- */}
      <section id="collections" className="max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <header className="mb-6 md:mb-8 text-center">
          <ScrollFloat
            as="h2"
            animationDuration={1.05}
            ease="power3.out"
            scrollStart="top 92%"
            scrollEnd="top 50%"
            stagger={0.02}
            containerClassName="m-0"
            textClassName="font-clash text-2xl md:text-3xl font-bold text-charcoal"
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
            search by tag, caption, or @user — with no filters you’ll see everything.
          </ScrollFloat>

          {/* search + quick tags */}
          <div className="mx-auto mt-4 max-w-xl">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search tags, captions, or @user…"
              aria-label="Search fitography"
              className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-charcoal/10 text-charcoal placeholder:text-charcoal/40"
            />
            {allTags.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {allTags.slice(0, 12).map((t) => {
                  const active = selectedTags.includes(t);
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`px-3 py-1 rounded-full text-sm border transition ${
                        active
                          ? "bg-charcoal text-creme border-charcoal"
                          : "bg-white text-charcoal border-charcoal/15 hover:border-charcoal/30"
                      }`}
                      aria-pressed={active}
                    >
                      #{t}
                    </button>
                  );
                })}
                {(selectedTags.length > 0 || query) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-3 py-1 rounded-full text-sm border border-charcoal/15 bg-white text-charcoal hover:border-charcoal/30"
                  >
                    clear
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Masonry (Explore) */}
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-charcoal/60">
            {posts.length === 0
              ? "no uploads yet — hit “flex a fit” to add your first look."
              : "no matches for your filters. try a different search."}
          </div>
        ) : (
          <div
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
            style={{ columnFill: "balance" }}
          >
            {filtered.map((p) => (
              <FitCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
