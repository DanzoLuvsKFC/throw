// src/pages/Home.js
import { useMemo, useState, useLayoutEffect, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ScrollVelocity from "../components/ScrollVelocity";
import ScrollFloat from "../components/ScrollFloat";
import { useFeed } from "../store/FeedContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import look1 from "../assets/fonts/fits/fit.jpg";
import look2 from "../assets/fonts/fits/fit 8.jpg";
import look3 from "../assets/fonts/fits/fit 12.jpg";
import heroHanger from "../assets/fonts/fits/Hero Image.png";

gsap.registerPlugin(ScrollTrigger);

const aboutImages = [look1, look2, look3];

function TitleFloat({
  as = "h2",
  children,
  textClassName = "",
  containerClassName = "m-0",
  playOnMount = false,
  animationDuration = 1,
  ease = "power3.out",
  stagger = 0.02,
  scrollStart = "top 92%",
  scrollEnd = "top 50%",
}) {
  return (
    <ScrollFloat
      as={as}
      playOnMount={playOnMount}
      animationDuration={animationDuration}
      ease={ease}
      stagger={stagger}
      containerClassName={containerClassName}
      textClassName={textClassName}
      scrollStart={scrollStart}
      scrollEnd={scrollEnd}
    >
      {children}
    </ScrollFloat>
  );
}

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

function FitCard({ post }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <FloatIn
      as="article"
      className="mb-4 break-inside-avoid rounded-2xl overflow-hidden border border-charcoal/10 bg-white group"
      y={36}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() =>
          navigate(`/outfit/${encodeURIComponent(post.id)}`, {
            state: { backgroundLocation: location },
          })
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate(`/outfit/${encodeURIComponent(post.id)}`, {
              state: { backgroundLocation: location },
            });
          }
        }}
        className="relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-charcoal/10"
      >
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
          <div className="text-sm text-charcoal/60 hidden">
            @{post.user ?? "guest"} •{" "}
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "—"}
          </div>
          <div className="text-sm text-charcoal/60">
            @{post.user ?? "guest"}
            <span aria-hidden="true" className="px-1.5">&middot;</span>
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
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
    theLeft: { }
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

/* ---------------- How It Works visuals (inline SVGs) ---------------- */
const UploadIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TagIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M7 7h5l7 7-5 5-7-7V7z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
  </svg>
);

const DiscoverIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

function StepCard({ Icon, title, children, index }) {
  return (
    <FloatIn
      as="div"
      y={26}
      duration={0.9}
      className="rounded-2xl border border-charcoal/10 bg-white p-5 md:p-6"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-11 h-11 rounded-xl bg-creme border border-charcoal/10 flex items-center justify-center text-charcoal">
            <Icon className="w-6 h-6" />
          </div>
          <span className="absolute -top-2 -right-2 text-xs font-semibold text-charcoal/60">
            {index}
          </span>
        </div>
        <div>
          <h3 className="font-clash text-lg md:text-xl text-charcoal font-semibold">
            {title}
          </h3>
          <p className="mt-1.5 text-charcoal/70 text-[0.95rem] md:text-[1.05rem] leading-relaxed">
            {children}
          </p>
        </div>
      </div>
    </FloatIn>
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
  const hangerRef = useRef(null);

  // HOW-IT-WORKS refs
  const howRef = useRef(null);
  const howTitleRef = useRef(null);
  const howCardsRef = useRef(null);

  // WAVE refs (wrapper holds Tailwind transforms; inner svg is animated)
  const waveWrapRef = useRef(null);
  const waveRef = useRef(null);

  /* Hero intro: wave up first, then hanger */
  useLayoutEffect(() => {
    const textWrap = textWrapRef.current;
    const title = titleRef.current;
    const tag = tagRef.current;
    const wave = waveRef.current;
    const hangerEl = hangerRef.current;
    if (!textWrap || !title || !tag) return;

    const ctx = gsap.context(() => {
      gsap.set([textWrap, title, tag], { clearProps: "all" });

      gsap.fromTo(
        textWrap,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 }
      );

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (wave) {
        tl.fromTo(wave, { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55 });
      }

      if (hangerEl) {
        tl.fromTo(
          hangerEl,
          { y: 260, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7 },
          ">-0.05"
        );
      }
    });

    return () => ctx.revert();
  }, []);

  /* "How it works" – pinned, two-part scroll */
  useLayoutEffect(() => {
    const sec = howRef.current;
    const tWrap = howTitleRef.current;
    const cards = howCardsRef.current;
    if (!sec || !tWrap || !cards) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.set(tWrap, { y: 24, opacity: 1 });
      gsap.set(cards, { y: 120, opacity: 0 });

      let titleUp = -100;
      let cardsUp = -130;

      mm.add(
        {
          md: "(min-width: 768px)",
          lg: "(min-width: 1024px)",
        },
        (mq) => {
          if (mq.conditions.lg) {
            titleUp = -130;
            cardsUp = -160;
          } else if (mq.conditions.md) {
            titleUp = -115;
            cardsUp = -140;
          } else {
            titleUp = -100;
            cardsUp = -120;
          }
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "+=120%",
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
        defaults: { ease: "power3.out" },
      });

      tl.to(tWrap, { y: 0, duration: 0.35 });
      tl.to({}, { duration: 0.12 });
      tl.to(tWrap, { y: titleUp, duration: 0.35 }, "segB");
      tl.to(cards, { y: cardsUp, opacity: 1, duration: 0.55 }, "segB+=0.1");
    }, howRef);

    return () => {
      mm.kill();
      ctx.revert();
    };
  }, []);

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
      <section className="relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 min-h-[100svh] pb-56 md:pb-64 lg:pb-72 flex items-center justify-center">
          <div ref={textWrapRef} className="text-center w-fit mx-auto relative z-10">
            <div ref={titleRef} className="block">
              <TitleFloat
                as="h1"
                playOnMount
                animationDuration={1}
                ease="power3.out"
                stagger={0.02}
                textClassName="font-clash font-bold text-charcoal whitespace-nowrap text-[2.2rem] sm:text-[3.25rem] md:text-[4.25rem] lg:text-[5.25rem] xl:text-[6.5rem] 2xl:text-[7rem] leading-none"
              >
                throw a fit
              </TitleFloat>
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

            <div className="block mt-6 mx-auto text-center max-w-full sm:max-w-[40ch] md:max-w-[50ch]">
              {/* CHANGED: use TitleFloat here for the same per-character animation as the H1 */}
              <TitleFloat
                as="p"
                playOnMount
                animationDuration={0.9}
                ease="power3.out"
                stagger={0.01}
                textClassName="m-0 text-charcoal/70 text-[0.85rem] sm:text-[0.95rem] md:text-[1.1rem] lg:text-[1.2rem] xl:text-[1.25rem] leading-relaxed break-keep hyphens-none"
              >
                A community moodboard for sustainable style, share full outfits, tag every piece,
                and discover real fits from real people.
              </TitleFloat>
            </div>
          </div>

          <div
            ref={hangerRef}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-[52svh] sm:-bottom-[56svh] md:-bottom-[60svh] lg:-bottom-[64svh] w-[100vw] max-w-none z-0"
            aria-hidden="true"
          >
            <img
              src={heroHanger}
              alt=""
              className="block mx-auto w-[100vw] h-auto select-none drop-shadow-xl origin-bottom scale-[1.10] sm:scale-[1.08] md:scale-[1.06] lg:scale-[1.04]"
              draggable="false"
            />
          </div>
        </div>

        <a
          href="#about"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-charcoal/60 hover:text-charcoal transition flex flex-col items-center"
          aria-label="Scroll to about section"
        >
        </a>
      </section>

      {/* ---------------- SCROLL DIVIDER ---------------- */}
      <div className="relative z-30 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden border-2 border-charcoal bg-creme">
        <ScrollVelocity
          texts={["taf • throw a fit •taf • throw a fit •"]}
          velocity={110}
          parallaxClassName="py-0.5 md:py-2.5"
          scrollerClassName="text-charcoal font-satoshi text-[2.25rem] sm:text-[3.25rem] md:text-[4.25rem] lg:text-[5.25rem] xl:text-[6.5rem] 2xl:text-[2rem] leading-[0.95]"
        />
      </div>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section
        id="about"
        ref={howRef}
        className="relative isolate z-10 bg-[#cebda6] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-visible"
      >
        {/* Wave wrapper holds position; inner SVG is animated */}
        <div
          ref={waveWrapRef}
          className="absolute left-1/2 -translate-x-1/2 top-0
                     -translate-y-28 md:-translate-y-40
                     w-[102vw] md:w-[104vw] h-20 md:h-28
                     max-w-none pointer-events-none z-10"
        >
          <svg
            ref={waveRef}
            className="w-full h-full"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,40 C240,110 480,0 720,40 C960,80 1200,10 1440,40 L1440,120 L0,120 Z"
              className="fill-[#cebda6]"
            />
          </svg>
        </div>

        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 py-0">
          <div className="min-h-[70svh] md:min-h-[75svh] flex items-center justify-center">
            <div ref={howTitleRef}>
              <TitleFloat
                as="h2"
                playOnMount={false}
                animationDuration={1}
                ease="power3.out"
                stagger={0.02}
                scrollStart="top 92%"
                scrollEnd="top 50%"
                textClassName="font-clash text-center text-charcoal font-bold leading-[0.95]
                         text-[2.25rem] sm:text-[3rem] md:text-[4rem] lg:text-[4.75rem]"
              >
                how does it work?
              </TitleFloat>
            </div>
          </div>

          <div
            ref={howCardsRef}
            className="relative z-10 max-w-6xl mx-auto -mt-15 md:-mt-20 grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <StepCard Icon={UploadIcon} title="Upload your fit" index="01">
              Snap your look, add a caption, and share it with the community.
            </StepCard>
            <StepCard Icon={TagIcon} title="Tag the pieces" index="02">
              Add brands, categories, or details so others can find similar items.
            </StepCard>
            <StepCard Icon={DiscoverIcon} title="Discover styles" index="03">
              Search by tags or captions and build your personal moodboard.
            </StepCard>
          </div>
        </div>
      </section>

      {/* ---------------- FITOGRAPHY ---------------- */}
      <section id="collections" className="relative z-0 bg-creme max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <header className="mb-6 md:mb-8 text-center">
          <TitleFloat
            as="h2"
            playOnMount={false}
            animationDuration={1.05}
            ease="power3.out"
            stagger={0.02}
            containerClassName="m-0"
            textClassName="font-clash text-2xl md:text-3xl font-bold text-charcoal"
          >
            fitography
          </TitleFloat>

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
