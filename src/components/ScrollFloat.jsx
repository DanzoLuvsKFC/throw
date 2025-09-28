import { useMemo, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({
  children,
  as = "h2",
  scrollContainerRef,
  containerClassName = "",
  textClassName = "",
  animationDuration = 1,
  ease = "back.inOut(2)",
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  stagger = 0.03,
  scrub = true,
  once = false,
  playOnMount = false,
  mountDelay = 0,
}) => {
  const containerRef = useRef(null);
  const Tag = as;

  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    return text.split("").map((char, i) => (
      <span className="inline-block sf-char" key={i}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  }, [children]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const fromVars = {
      willChange: "opacity, transform",
      opacity: 0,
      yPercent: 120,
      scaleY: 2.3,
      scaleX: 0.7,
      transformOrigin: "50% 0%",
    };
    const toVars = {
      duration: animationDuration,
      ease,
      opacity: 1,
      yPercent: 0,
      scaleY: 1,
      scaleX: 1,
      stagger,
    };

    // Scope animations to this element; StrictMode double-mount safe
    const ctx = gsap.context(() => {
      const chars = el.querySelectorAll(".sf-char");

      if (playOnMount) {
        gsap.set(chars, fromVars);
        gsap.to(chars, { ...toVars, delay: mountDelay });
        return; // no ScrollTrigger needed
      }

      const scroller = scrollContainerRef?.current ?? window;

      gsap.fromTo(chars, fromVars, {
        ...toVars,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: scrub && !once ? true : false,
          toggleActions: once ? "play none none none" : undefined,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [
    scrollContainerRef,
    animationDuration,
    ease,
    scrollStart,
    scrollEnd,
    stagger,
    scrub,
    once,
    playOnMount,
    mountDelay,
  ]);

  return (
    <Tag ref={containerRef} className={`my-5 overflow-hidden ${containerClassName}`}>
      <span className={`inline-block ${textClassName}`}>{splitText}</span>
    </Tag>
  );
};

export default ScrollFloat;
