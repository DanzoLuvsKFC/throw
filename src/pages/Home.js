// src/pages/Home.js
import { useMemo, useState, useLayoutEffect, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ScrollVelocity from "../components/ScrollVelocity";
import ScrollFloat from "../components/ScrollFloat";
import Magnet from "../components/Magnet";
// import DomeGallery from "../components/DomeGallery";
import CardSwap, { Card } from "../components/CardSwap";
import CircularGallery from "../components/CircularGallery";
import { useFeed } from "../store/FeedContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import look1 from "../assets/fonts/fits/fit.jpg";
import look2 from "../assets/fonts/fits/fit 8.jpg";
import look3 from "../assets/fonts/fits/fit 12.jpg";
import heroHanger from "../assets/fonts/fits/Hero Image.png";
import ReviewsMarquee from "../components/reviews/ReviewsMarquee";
import TiltedCard from "../components/TiltedCard";
import "../styles/reviews.css";

gsap.registerPlugin(ScrollTrigger);

const aboutImages = [look1, look2, look3];

function TitleFloat({
  as = "h2",
  children,
  textClassName = "",
  containerClassName = "m-0",
  wordClassName = "",
  charClassName = "",
  wordStyle,
  charStyle,
  playOnMount = false,
  animationDuration = 1,
  ease = "power3.out",
  stagger = 0.02,
  scrollStart = "top 92%",
  scrollEnd = "top 50%",
  once = false,
  scrub = true,
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
      wordClassName={wordClassName}
      charClassName={charClassName}
      wordStyle={wordStyle}
      charStyle={charStyle}
      scrollStart={scrollStart}
      scrollEnd={scrollEnd}
      once={once}
      scrub={scrub}
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
                className="rounded-full bg-creme/95 text-charcoal text-sm px-3 py-1 border border-charcoal/10 font-medium"
              >
                {t}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="rounded-full bg-creme/90 text-charcoal text-sm px-3 py-1 border border-charcoal/10 font-medium">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        ) : null}
      </div>
      {(post.caption || post.user) && (
        <div className="p-3 bg-[#cebda6]">
          <div className="text-sm font-semibold text-charcoal hidden">
            @{post.user ?? "guest"} •{" "}
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "-"}
          </div>
          <div className="text-sm font-semibold text-charcoal flex items-center">
            @{post.user ?? "guest"}
            <span aria-hidden="true" className="px-1.5 text-creme/80">
              &middot;
            </span>
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
          </div>
          {post.caption ? <div className="mt-1 text-creme/95 font-medium">{post.caption}</div> : null}
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

/* eslint-disable no-unused-vars */ // keep this here if you aren't rendering the carousel yet
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

    const onResize = () =>
      gsap.set([left, right], { x: 0, scale: 1, opacity: 1, clearProps: "filter" });

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
        // FIX: use standard GSAP position syntax
        tl.to(left, { opacity: 0, duration: 0.2, ease: "power2.out" }, ">-=0.12");

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

      window.addEventListener("resize", onResize);
    }, wrapRef);

    return () => {
      window.removeEventListener("resize", onResize);
      if (timerRef.current) timerRef.current.kill();
      ctx.revert();
    };
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
/* eslint-enable no-unused-vars */

/* ---------------- GLOBE visuals (inline SVGs) ---------------- */
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

const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function StepCard({ Icon, title, children, index }) {
  return (
    <FloatIn as="div" y={26} duration={0.9}>
      <TiltedCard number={String(index)} title={title} Icon={Icon}>
        {children}
      </TiltedCard>
    </FloatIn>
  );
}

/* ------------------ HOME ------------------ */
export default function Home() {
  const { posts } = useFeed();
  const globeImages = useMemo(
    () => posts.map((p, i) => ({ src: p.src, alt: p.caption || `fit ${i + 1}` })),
    [posts]
  );
  const galleryItems = useMemo(
    () =>
      posts.slice(0, 6).map((p, i) => ({
        image: p.src,
        text: p.user ? `@${p.user}` : p.caption || `fit ${i + 1}`,
      })),
    [posts]
  );
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [magnetDisabled, setMagnetDisabled] = useState(false);
  const [showHoverBg, setShowHoverBg] = useState(false);
  const [hoverBgDismissed, setHoverBgDismissed] = useState(false);

  // Build review items based on posts' usernames
  const reviewItems = useMemo(() => {
    // Unique handles from posts (no duplicates)
    const uniqueHandles = Array.from(
      new Set(
        posts
          .map((p) => (p.user || "").trim())
          .filter(Boolean)
      )
    ).map((u) => `@${u}`);

    const texts = [
      "Super cool concept, would be amazing if it was fully developed.",
      "Love the curated vibe.",
      "The tags makes things so much more easier.",
      "Super niche to be quite honest.",
      "Found about 6/7 cool new outfits here.",
      "Would love to see this made into a real app.",
      "Tags make searching a breeze.",
      "Sponser the creator, the idea is fire.",
    ];

    // Limit to 8 unique usernames and 8 unique quotes (no repeats)
    const MAX = 8;
    const handlesLimited = uniqueHandles.slice(0, MAX);
    const count = Math.min(handlesLimited.length, texts.length);
    const items = count
      ? Array.from({ length: count }, (_, i) => ({ text: texts[i], handle: handlesLimited[i] }))
      : texts.slice(0, MAX).map((t) => ({ text: t, handle: "@guest" }));

    const third = Math.ceil(items.length / 3) || 1;
    return {
      top: items.slice(0, third),
      mid: items.slice(third, third * 2),
      bottom: items.slice(third * 2),
    };
  }, [posts]);

  // HERO refs
  const textWrapRef = useRef(null);
  const titleRef = useRef(null);
  const tagRef = useRef(null);
  const hangerRef = useRef(null);

  // HOW-IT-WORKS refs
  const howRef = useRef(null);
  const howTitleRef = useRef(null);
  const howCardsRef = useRef(null);

  // WAVE refs
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

  // Fade in background "HOVER" text after main hero content animates
  useEffect(() => {
    if (magnetDisabled) return;
    const t = setTimeout(() => setShowHoverBg(true), 1400);
    return () => clearTimeout(t);
  }, [magnetDisabled]);

  // Swap background text after hover near title (don't hide container)
  useEffect(() => {
    if (hoverBgDismissed || magnetDisabled) return;
    const el = titleRef.current;
    if (!el) return;

    const padding = 60;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const withinX = Math.abs(cx - e.clientX) < rect.width / 2 + padding;
      const withinY = Math.abs(cy - e.clientY) < rect.height / 2 + padding;
      if (withinX && withinY) {
        setHoverBgDismissed(true);
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [hoverBgDismissed, magnetDisabled]);

  // Disable magnet on touch devices / reduced motion
  useEffect(() => {
    const pointerMq = window.matchMedia?.("(pointer: coarse)");
    const reducedMq = window.matchMedia?.("(prefers-reduced-motion: reduce)");

    const compute = () => {
      const isTouch = pointerMq ? pointerMq.matches : false;
      const reduced = reducedMq ? reducedMq.matches : false;
      setMagnetDisabled(isTouch || reduced);
    };

    compute();

    if (pointerMq?.addEventListener) pointerMq.addEventListener("change", compute);
    if (reducedMq?.addEventListener) reducedMq.addEventListener("change", compute);

    return () => {
      if (pointerMq?.removeEventListener) pointerMq.removeEventListener("change", compute);
      if (reducedMq?.removeEventListener) reducedMq.removeEventListener("change", compute);
    };
  }, []);

  /* "How it works" – pinned, two-part scroll */
  useLayoutEffect(() => {
    // disabled pinned scroll behavior for dome section
    return;
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

  // About/second section: play title when section enters, then delay and fade globe
  useLayoutEffect(() => {
    const sec = howRef.current;
    const titleEl = howTitleRef.current;
    const globeWrap = howCardsRef.current;
    if (!sec || !titleEl || !globeWrap) return;

    let delayHandle = null;
    const ctx = gsap.context(() => {
      gsap.set(globeWrap, { autoAlpha: 0 });
      const quickDelay = 0.15; // much faster reveal

      ScrollTrigger.create({
        trigger: sec,
        start: "top 90%",
        once: true,
        onEnter: () => {
          delayHandle = gsap.delayedCall(quickDelay, () => {
            gsap.to(globeWrap, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });
          });
        },
      });
    }, howRef);

    return () => ctx.revert();
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
      <section className="relative w-full">
        {/* Big background text crossfades from "hover" to "throw a fit" */}
        <div
          aria-hidden="true"
          className={
            `pointer-events-none absolute inset-0 z-[5] flex items-center justify-center ` +
            `transition-opacity duration-700 ${showHoverBg && !magnetDisabled ? "opacity-20" : "opacity-0"}`
          }
        >
          <div className="grid place-items-center">
            <span
              className={
                "font-clash font-bold lowercase select-none tracking-tight text-[#cebda6] leading-none whitespace-nowrap text-[6rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] xl:text-[22rem] col-start-1 row-start-1 " +
                `transition-opacity duration-700 ${hoverBgDismissed ? "opacity-0" : "opacity-100"}`
              }
            >
              hover
            </span>
            <span
              className={
                "font-clash font-bold select-none tracking-tight text-[#cebda6] leading-none whitespace-nowrap text-[4.5rem] sm:text-[7.5rem] md:text-[11rem] lg:text-[15rem] xl:text-[19rem] 2xl:text-[21rem] col-start-1 row-start-1 " +
                `transition-opacity duration-700 ${hoverBgDismissed ? "opacity-100" : "opacity-0"}`
              }
            >
              throw a fit
            </span>
          </div>

        </div>
        {/* Inner wrapper retains original clipping */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-10 min-h-[100svh] pb-56 md:pb-64 lg:pb-72 flex items-center justify-center">
            <div ref={textWrapRef} className="text-center w-fit mx-auto relative z-10">
              <div ref={titleRef} className="block">
                <Magnet disabled={magnetDisabled} padding={60} magnetStrength={7}>
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
                </Magnet>
              </div>

              <div ref={tagRef} className="block -mt-2 xl:-mt-4">
                <Magnet disabled={magnetDisabled} padding={60} magnetStrength={16}>
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
                </Magnet>
              </div>

              <div className="block mt-6 mx-auto text-center max-w-full sm:max-w-[40ch] md:max-w-[50ch]">
                <Magnet disabled={magnetDisabled} padding={50} magnetStrength={18}>
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
                </Magnet>
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
            <span className="sr-only">Scroll to about section</span>
          </a>
        </div>
      </section>

      {/* ---------------- SCROLL DIVIDER ---------------- */}
      <div className="relative z-30 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden border-2 border-creme"
        style={{ backgroundColor: "#cebda6" }}>
        <ScrollVelocity
          texts={["taf • throw a fit •taf • throw a fit •"]}
          velocity={110}
          parallaxClassName="py-0.5 md:py-2.5"
          scrollerClassName="text-creme font-satoshi text-[2.25rem] sm:text-[3.25rem] md:text-[4.25rem] lg:text-[5.25rem] xl:text-[6.5rem] 2xl:text-[2rem] leading-[0.95]"
        />
      </div>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section
        id="about"
        ref={howRef}
        className="relative isolate z-10 bg-[#cebda6] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-visible"
      >
        {/* Big creme background text */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-30 -translate-y-[40px] md:-translate-y-[64px]"
        >
          <span
            className={
              "font-clash font-bold lowercase select-none tracking-tight text-creme leading-none whitespace-nowrap " +
              "text-[6rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] xl:text-[28rem]"
            }
          >
            find a fit
          </span>
        </div>
        {/* Wave */}
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

        {/* Title + Circular Gallery */}
        <div className="relative z-10 max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 py-16 overflow-visible">
          <header className="mb-8 text-center">
            <div ref={howTitleRef}>
              <TitleFloat
                as="h2"
                playOnMount={false}
                animationDuration={1}
                ease="power3.out"
                stagger={0.02}
                scrollStart="top 85%"
                scrollEnd="top 55%"
                once
                containerClassName="m-0"
                textClassName="font-clash font-semibold text-charcoal tracking-[-0.01em] leading-[1.05] text-[2.25rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem]"
              >
                find fits around you
              </TitleFloat>
            </div>
            <ScrollFloat
              as="p"
              animationDuration={0.9}
              ease="power2.out"
              scrollStart="top 95%"
              scrollEnd="top 65%"
              stagger={0.006}
              containerClassName="mt-3 m-0"
              textClassName="text-charcoal/70 text-[1.05rem] md:text-[1.15rem] max-w-3xl mx-auto"
            >
              Every outfit is tagged, every detail connected. Whether you’re chasing a specific look or just exploring, finding your next fitspo is as simple as a scroll.
            </ScrollFloat>
          </header>
          <div
            ref={howCardsRef}
            style={{ height: '600px', position: 'relative' }}
            className="-mt-20 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-visible"
          >
            <CircularGallery
              items={galleryItems}
              bend={3}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollEase={0.02}
              wavy={false}
            />
          </div>

        </div>
      </section>

      {/* ---------------- REVIEWS ---------------- */}
      <section
        id="reviews"
        className="relative isolate z-10 bg-creme left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-visible"
      >
        {/* Wave (top) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0
             -translate-y-28 md:-translate-y-20
             w-[102vw] md:w-[104vw] h-32 md:h-28
             max-w-none overflow-hidden pointer-events-none z-10"
          aria-hidden="true"
        >
          <svg
            className="w-full h-full origin-top scale-y-[1.6] md:scale-y-100"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C240,110 480,0 720,40 C960,80 1200,10 1440,40 L1440,120 L0,120 Z"
              className="fill-creme"
            />
          </svg>
        </div>


        {/* Spacer to move marquee down without affecting wave */}
        <div className="h-6 md:h-10" aria-hidden="true" />

        {/* Top marquee under wave */}
        <div
          className="relative z-30 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden border-2 border-[#cebda6] bg-creme"
        >
          <ScrollVelocity
            texts={["taf • throw a fit • taf • throw a fit •"]}
            velocity={110}
            parallaxClassName="py-0.5 md:py-2.5"
            scrollerClassName="text-[#cebda6] font-satoshi text-[2.25rem] sm:text-[3.25rem] md:text-[4.25rem] lg:text-[5.25rem] xl:text-[6.5rem] 2xl:text-[2rem] leading-[0.95]"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
          {/* Big background text */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-30 -translate-y-[40px] md:-translate-y-[64px]"
          >
            <span
              className={
                "font-clash font-bold lowercase select-none tracking-tight text-[#cebda6] leading-none whitespace-nowrap " +
                "text-[6rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] xl:text-[28rem]"
              }
            >
              reviews
            </span>
          </div>
          <header className="mb-6 md:mb-8 text-center">
            <TitleFloat
              as="h2"
              playOnMount={false}
              animationDuration={1.05}
              ease="power3.out"
              stagger={0.02}
              containerClassName="m-0"
              textClassName="font-clash font-semibold text-charcoal tracking-[-0.01em] leading-[1.05] text-[2.25rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem]"
            >
              loved by thrifters
            </TitleFloat>

            <ScrollFloat
              as="p"
              animationDuration={0.9}
              ease="power2.out"
              scrollStart="top 95%"
              scrollEnd="top 60%"
              stagger={0.006}
              containerClassName="mt-2 m-0"
              textClassName="text-charcoal/70 text-[1rem] sm:text-[1.15rem] md:text-[1.25rem] leading-relaxed"
            >
              what people are saying about throw a fit.
            </ScrollFloat>
          </header>

          {/* Simple review quotes grid (placeholder) */}
          <div className="hidden grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm">
                <p className="text-charcoal/80 text-[0.95rem] leading-relaxed">
                  'love the community vibes and how easy it is to discover real fits.'
                </p>
                <div className="mt-3 text-sm text-charcoal/50">- user{i}</div>
              </div>
            ))}
          </div>
          <div id="rb2-reviews" className="rb2-section">
            <ReviewsMarquee items={reviewItems.top} direction="left" duration={55} />
            <div className="h-4" />
            <ReviewsMarquee items={reviewItems.mid} direction="right" duration={58} />
            <div className="h-4" />
            <ReviewsMarquee items={reviewItems.bottom} direction="left" duration={62} />
          </div>
        </div>
        {/* Bottom wave (solid #cebda6) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-8 md:translate-y-12
                     w-[102vw] md:w-[104vw] h-20 md:h-28 max-w-none pointer-events-none z-10"
          aria-hidden="true"
        >
          <svg className="w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path
              d="M0,40 C240,110 480,0 720,40 C960,80 1200,10 1440,40 L1440,120 L0,120 Z"
              className="fill-[#cebda6]"
            />
          </svg>
        </div>
      </section>

      {/* ---------------- HOW TO FLEX ---------------- */}
      <section
        id="how-to-flex"
        className="relative isolate z-10 bg-[#cebda6] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-visible pb-12 md:pb-20"
      >
        {/* Big creme background text */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-25 -translate-y-[40px] md:-translate-y-[64px]"
        >
          <span
            className={
              "font-clash font-bold lowercase select-none tracking-tight text-creme leading-none whitespace-nowrap " +
              "text-[6rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] xl:text-[28rem]"
            }
          >
            how to flex
          </span>
        </div>

        {/* Spacer to move marquee down without affecting wave */}
        <div className="h-6 md:h-10" aria-hidden="true" />

        {/* Creme marquee under wave */}
        <div
          className="relative z-30 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden border-2 border-creme bg-[#cebda6]"
        >
          <ScrollVelocity
            texts={["taf • throw a fit • "]}
            velocity={110}
            parallaxClassName="py-0.5 md:py-2.5"
            scrollerClassName="text-creme font-satoshi text-[2.25rem] sm:text-[3.25rem] md:text-[4.25rem] lg:text-[5.25rem] xl:text-[6.5rem] 2xl:text-[2rem] leading-[0.95]"
          />
        </div>

        <div className="relative z-10 max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
          <header className="mb-6 md:mb-8 text-center">
            <TitleFloat
              as="h2"
              playOnMount={false}
              animationDuration={1}
              ease="power3.out"
              stagger={0.02}
              scrollStart="top 85%"
              scrollEnd="top 55%"
              once
              containerClassName="m-0"
              textClassName="font-clash font-semibold text-charcoal tracking-[-0.01em] leading-[1.05] text-[2.25rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem]"
            >
              how to flex?
            </TitleFloat>
            <ScrollFloat
              as="p"
              animationDuration={0.9}
              ease="power2.out"
              scrollStart="top 95%"
              scrollEnd="top 60%"
              stagger={0.006}
              containerClassName="mt-2 m-0"
              textClassName="text-charcoal/70 text-[1rem] sm:text-[1.15rem] md:text-[1.25rem] leading-relaxed"
            >
              share your fit, tag each piece, and show your style.
            </ScrollFloat>
          </header>

          <div className="mt-6">
            <div className="flex flex-row items-center justify-center gap-6 flex-wrap md:flex-nowrap md:overflow-visible overflow-x-auto px-2">
              <StepCard Icon={UploadIcon} title="upload your fit" index="1">
                Post a clean photo of your outfit.
              </StepCard>
              <StepCard Icon={TagIcon} title="tag each piece" index="2">
                Add tags for brands, items, and vibes.
              </StepCard>
              <StepCard Icon={DiscoverIcon} title="flex it" index="3">
                Publish and let the timeline see.
              </StepCard>
              <StepCard Icon={CheckIcon} title="done" index="4">
                You’re set. Explore and get inspired.
              </StepCard>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FITOGRAPHY ---------------- */}
      <section
        id="collections"
        className="relative isolate z-10 bg-creme left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-visible px-4 sm:px-6 md:px-8 py-12 md:py-16"
      >
        {/* Wave (top) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0
             -translate-y-28 md:-translate-y-20
             w-[102vw] md:w-[104vw] h-32 md:h-28
             max-w-none overflow-hidden pointer-events-none z-10"
          aria-hidden="true"
        >
          <svg
            className="w-full h-full origin-top scale-y-[1.6] md:scale-y-100"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C240,110 480,0 720,40 C960,80 1200,10 1440,40 L1440,120 L0,120 Z"
              className="fill-creme"
            />
          </svg>
        </div>


        {/* Spacer to move marquee down without affecting wave */}
        <div className="-h-4 md:-h-8" aria-hidden="true" />

        {/* Creme marquee indicator */}
        <div
          className="relative z-20 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden border-2 border-[#cebda6] bg-creme"
        >
          <ScrollVelocity
            texts={["taf • throw a fit • taf • throw a fit •"]}
            velocity={110}
            parallaxClassName="py-0.5 md:py-2.5"
            scrollerClassName="text-[#cebda6] font-satoshi text-[2.25rem] sm:text-[3.25rem] md:text-[4.25rem] lg:text-[5.25rem] xl:text-[6.5rem] 2xl:text-[2rem] leading-[0.95]"
          />
        </div>

        <div className="relative z-10 max-w-[100rem] mx-auto">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-6 sm:top-18 md:top-10 h-[24rem] sm:h-[26rem] md:h-[30rem] z-0 overflow-hidden opacity-30"
          >
            <div className="flex h-full flex-col justify-center gap-8">
              {Array.from({ length: 5 }).map((_, index) => (
                <p
                  key={`fits-bg-${index}`}
                  style={{ transform: index % 2 === 0 ? "translateX(-6%)" : "translateX(10%)" }}
                  className="font-clash font-bold lowercase tracking-[0.25em] text-[#cebda6] whitespace-nowrap text-[4.5rem] sm:text-[6.5rem] md:text-[8.5rem] lg:text-[11rem]"
                >
                  {"fits ".repeat(8)}
                </p>
              ))}
            </div>
          </div>
          <header className="relative z-20 mb-3 md:mb-4 text-center">
            <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-30">
              <p className="font-clash font-bold lowercase text-[#cebda6] whitespace-nowrap text-[8rem] sm:text-[10rem] md:text-[12rem] lg:text-[20rem]">
                fits fits fits
              </p>
            </div>
            <TitleFloat
              as="h2"
              playOnMount={false}
              animationDuration={1.05}
              ease="power3.out"
              stagger={0.02}
              containerClassName="m-0"
              textClassName="font-clash font-semibold text-charcoal tracking-[-0.01em] leading-[1.05] text-[2.25rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem]"
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
              search by tag, caption, or @user - with no filters you'll see everything.
            </ScrollFloat>

            <div className="mx-auto mt-4 max-w-xl">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search tags, captions, or @user..."
                aria-label="Search fitography"
                className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-charcoal/10 text-charcoal placeholder:text-charcoal/40"
              />
            </div>
          </header>

          {filtered.length === 0 ? (
            <div className="p-8 text-center text-charcoal/60 text-[1rem] sm:text-[1.15rem] md:text-[1.25rem] leading-relaxed">
              {posts.length === 0
                ? "no uploads yet - hit 'flex a fit' to add your first look."
                : "no matches for your filters. try a different search."}
            </div>
          ) : (
            <div
              className="relative z-10 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
              style={{ columnFill: "balance" }}
            >
              {filtered.map((p) => (
                <FitCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>
      </section>    </div>
  );
}




