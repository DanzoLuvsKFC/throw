// src/pages/Home.js
import { useMemo, useState, useLayoutEffect, useRef, useEffect } from "react";
import ScrollFloat from "../components/ScrollFloat";
import { useFeed } from "../store/FeedContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import look1 from "../assets/fonts/fits/fit.jpg";
import look2 from "../assets/fonts/fits/fit 8.jpg";
import look3 from "../assets/fonts/fits/fit 12.jpg";

gsap.registerPlugin(ScrollTrigger);

const aboutImages = [look1, look2, look3];

/* ---------- Simple float/fade-in on scroll (now can also play on mount) ---------- */
function FloatIn({
  as = "div",
  children,
  className = "",
  duration = 0.8,
  delay = 0,
  y = 28,
  ease = "power3.out",
  start = "top 85%",
  playOnMount = false,
}) {
  const Tag = as;
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y });

      if (playOnMount) {
        gsap.to(el, { opacity: 1, y: 0, duration, delay, ease });
      } else {
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
      }
    }, ref);

    return () => ctx.revert();
  }, [duration, delay, y, ease, start, playOnMount]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/* ---------- Card ---------- */
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

/* =========================================================
   GLIDE TWO-SLOT HERO CAROUSEL
   ========================================================= */

// smooth-load into an existing <img> without popping
function loadInto(imgEl, src) {
  return new Promise((resolve) => {
    gsap.set(imgEl, { opacity: 0, filter: "blur(2px)" });
    imgEl.src = src;
    if (imgEl.decode) {
      imgEl.decode().then(resolve).catch(resolve);
    } else {
      imgEl.onload = () => resolve();
      imgEl.onerror = () => resolve();
    }
  });
}

function GlideTwoSlotCarousel({
  images,
  gapPx = 20,
  cycleMs = 3400,
  glideMs = 1050,
}) {
  const wrapRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const imgLeftRef = useRef(null);
  const imgRightRef = useRef(null);
  const timerRef = useRef(null);

  const idxLeftRef = useRef(0);
  const idxRightRef = useRef(1);

  useEffect(() => {
    images.forEach((src) => {
      const im = new Image();
      im.src = src;
    });
  }, [images]);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const imgL = imgLeftRef.current;
    const imgR = imgRightRef.current;
    if (!wrap || !left || !right || !imgL || !imgR || images.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set([imgL, imgR], {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        willChange: "transform, opacity, filter",
      });

      idxLeftRef.current = 0;
      idxRightRef.current = images.length > 1 ? 1 : 0;
      imgL.src = images[idxLeftRef.current];
      imgR.src = images[idxRightRef.current];

      gsap.set([left, right], { x: 0, opacity: 1, scale: 1, clearProps: "filter" });

      const slotW = () => left.getBoundingClientRect().width;

      const doCycle = () => {
        const w = slotW();

        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut", duration: glideMs / 1000 },
        });

        gsap.set(right, { scale: 0.99, opacity: 0.92 });
        tl.to(right, { x: -(w + gapPx), scale: 1, opacity: 1 }, 0);
        tl.to(left, { x: w + gapPx, opacity: 0.82, scale: 0.985, filter: "blur(1px)" }, 0);
        tl.to(left, { opacity: 0, duration: 0.2, ease: "power2.out" }, `>${-0.12}`);

        tl.add(async () => {
          idxLeftRef.current = idxRightRef.current;
          idxRightRef.current = (idxRightRef.current + 1) % images.length;

          imgLeftRef.current.src = images[idxLeftRef.current];

          gsap.set([left, right], {
            x: 0,
            scale: 1,
            opacity: 1,
            clearProps: "filter",
          });

          const nextSrc = images[idxRightRef.current];
          await loadInto(imgRightRef.current, nextSrc);
          gsap.to(imgRightRef.current, {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.45,
            ease: "power2.out",
          });
        });

        tl.add(() => {
          timerRef.current = gsap.delayedCall(cycleMs / 1000, doCycle);
        });
      };

      timerRef.current = gsap.delayedCall((cycleMs - 600) / 1000, doCycle);

      const onResize = () =>
        gsap.set([left, right], { x: 0, scale: 1, opacity: 1, clearProps: "filter" });
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        if (timerRef.current) timerRef.current.kill();
      };
    }, wrapRef);

    return () => ctx.revert();
  }, [images, gapPx, cycleMs, glideMs]);

  return (
    <div ref={wrapRef} className="grid grid-cols-2 gap-5">
      <div ref={leftRef} className="rounded-2xl overflow-hidden h-[66svh] min-h-[480px] relative">
        <img ref={imgLeftRef} alt="carousel left" />
      </div>
      <div ref={rightRef} className="rounded-2xl overflow-hidden h-[66svh] min-h-[480px] relative">
        <img ref={imgRightRef} alt="carousel right" />
      </div>
    </div>
  );
}

/* ------------------ HOME ------------------ */
export default function Home() {
  const { posts } = useFeed();
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // HERO refs
  const textWrapRef = useRef(null);
  const titleRef = useRef(null);
  const tagRef = useRef(null);
  const heroImagesRef = useRef(null);

  /* Text starts centered → slides left; images slide in from right (xl+) */
  useLayoutEffect(() => {
    const textWrap = textWrapRef.current;
    const title = titleRef.current;
    const tag = tagRef.current;
    const images = heroImagesRef.current;
    if (!textWrap || !title || !tag) return;

    const mm = gsap.matchMedia();

    mm.add(
      { base: "(min-width: 0px)", xl: "(min-width: 1280px)" },
      (ctx) => {
        const isXl = ctx.conditions.xl;

        gsap.set([textWrap, title, tag], { clearProps: "all" });
        if (images) gsap.set(images, { clearProps: "all" });

        gsap.set(textWrap, { x: 0, autoAlpha: 1 });
        gsap.set(tag, { x: 0 });
        if (images && isXl) gsap.set(images, { x: 280, autoAlpha: 0 });

        const textTargetX = isXl ? -320 : 0;
        const tagOffsetX = isXl ? 20 : 0;

        const tl = gsap.timeline({ delay: 0.55, defaults: { ease: "power3.inOut" } });

        if (images && isXl) tl.to(images, { x: 50, autoAlpha: 1, duration: 1.0 }, 0.05);
        tl.to(textWrap, { x: textTargetX, duration: 1.05 }, 0.0);
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
          {/* Text block (center → left) */}
          <div ref={textWrapRef} className="text-center xl:text-left w-fit mx-auto xl:mx-0">
            <div ref={titleRef} className="block">
              <ScrollFloat
                as="h1"
                playOnMount
                animationDuration={1}
                ease="power3.out"
                containerClassName="m-0"
                textClassName="font-clash font-bold text-charcoal whitespace-nowrap text-[2.2rem] sm:text-[3.25rem] md:text-[4.25rem] lg:text-[5.25rem] xl:text-[6.5rem] 2xl:text-[7rem] leading-none"
              >
                throw a fit
              </ScrollFloat>
            </div>

            <div ref={tagRef} className="block -mt-2 xl:-mt-4">
              <ScrollFloat
                as="p"
                playOnMount
                mountDelay={0.25}
                animationDuration={0.9}
                ease="power3.out"
                stagger={0.01}
                containerClassName="m-0"
                textClassName="text-[0.95rem] sm:text-[1.15rem] md:text-[1.35rem] lg:text-[1.55rem] xl:text-[1.75rem] 2xl:text-[2rem] text-charcoal/70"
              >
                {"don't know what to wear? throw a fit."}
              </ScrollFloat>
            </div>

            {/* Description — smaller on mobile, scales up smoothly */}
            <div className="block mt-6 mx-auto text-center max-w-full sm:max-w-[40ch] md:max-w-[50ch]">
              <FloatIn
                as="p"
                y={16}
                duration={0.9}
                playOnMount
                className="m-0 text-charcoal/70 text-[0.85rem] sm:text-[0.95rem] md:text-[1.1rem] lg:text-[1.2rem] xl:text-[1.25rem] leading-relaxed break-keep hyphens-none"
              >
                A community moodboard for sustainable style — share full outfits, tag every piece,
                and discover real fits from real people.
              </FloatIn>
            </div>
          </div>

          {/* Right: two-slot carousel (show only on xl+) */}
          <div
            ref={heroImagesRef}
            className="hidden xl:block absolute right-6 top-1/2 -translate-y-1/2 w-[48%] max-w-[760px]"
            aria-hidden="true"
          >
            <GlideTwoSlotCarousel images={aboutImages} cycleMs={3400} glideMs={1050} />
          </div>
        </div>

        {/* SCROLL CUE */}
        <a
          href="#about"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-charcoal/60 hover:text-charcoal transition flex flex-col items-center"
          aria-label="Scroll to about section"
        >
          <span className="text-sm md:text-base tracking-wider font-semibold">scroll</span>
          <svg
            className="w-7 h-7 md:w-9 md:h-9 mt-2 animate-bounce"
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
        <div className="grid xl:grid-cols-12 gap-8 items-center">
          {/* LEFT: images */}
          <div className="xl:col-span-7">
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
          <div className="xl:col-span-5">
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

            <FloatIn
              as="p"
              className="mt-4 m-0 text-charcoal/70 text-[1rem] sm:text-[1.15rem] md:text-[1.25rem] leading-relaxed"
              y={20}
              duration={0.9}
            >
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
            textClassName="text-charcoal/70 text-[1rem] sm:text-[1.15rem] md:text-[1.25rem] leading-relaxed"
          >
            search by tag, caption, or @user — with no filters you’ll see everything.
          </ScrollFloat>

          {/* search */}
          <div className="mx-auto mt-4 max-w-xl">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search tags, captions, or @user…"
              aria-label="Search fitography"
              className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-charcoal/10 text-charcoal placeholder:text-charcoal/40"
            />
          </div>
        </header>

        {/* Masonry (Explore) */}
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-charcoal/60 text-[1rem] sm:text-[1.15rem] md:text-[1.25rem] leading-relaxed">
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
