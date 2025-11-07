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
  wordClassName = "",
  charClassName = "",
  wordStyle,
  charStyle,
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
    // Split into tokens preserving spaces so we can keep words together
    const tokens = text.split(/(\s+)/);

    let key = 0;
    return tokens.map((tok) => {
      if (tok.trim() === "") {
        // Render spaces as actual spaces so lines can wrap between words
        return tok; // keeps natural wrapping at spaces
      }
      // For word tokens, wrap characters but prevent breaks within the word
      const chars = tok.split("").map((ch) => (
        <span className={`inline-block sf-char ${charClassName}`} style={charStyle} key={key++}>{ch}</span>
      ));
      return (
        <span className={`inline-block whitespace-nowrap sf-word ${wordClassName}`} style={wordStyle} key={key++}>
          {chars}
        </span>
      );
    });
  }, [children, wordClassName, charClassName, wordStyle, charStyle]);

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
