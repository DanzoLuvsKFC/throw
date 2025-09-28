// src/components/StaggeredMenu.jsx
import React, { useCallback, useLayoutEffect, useRef, useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";

const StaggeredMenu = ({
  position = "right",
  colors = ["#2e2e2e", "#2e2e2e", "#2e2e2e", "#2e2e2e"],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = false, // numbering OFF by default
  className,
  showLogo = false,
  logoUrl = "/logo.svg",
  menuButtonColor = "#111111",
  openMenuButtonColor = "#ffffe3",
  changeMenuColorOnOpen = true,
  accentColor = "#ffffe3",
  onMenuOpen,
  onMenuClose,
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);

  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);

  const textInnerRef = useRef(null);
  const textWrapRef = useRef(null);
  const [textLines, setTextLines] = useState(["Menu", "Close"]);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);

  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();

  // support hash links after close
  useEffect(() => {
    if (!open && location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [open, location]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers = [];
      if (preContainer) preLayers = Array.from(preContainer.querySelectorAll(".sm-prelayer"));
      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });

      gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
      gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  // --- helper: split labels into spans once ---------------------------------
  const splitLabelsOnce = useCallback((labelEls) => {
    labelEls.forEach((el) => {
      if (el.dataset.split === "1") return;
      const raw = el.textContent || "";
      const frag = document.createDocumentFragment();
      for (const ch of raw) {
        const span = document.createElement("span");
        span.className = "sm-char inline-block";
        span.textContent = ch === " " ? "\u00A0" : ch;
        frag.appendChild(span);
      }
      el.setAttribute("data-split", "1");
      el.setAttribute("aria-label", raw);
      el.textContent = "";
      el.appendChild(frag);
    });
  }, []);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();
    closeTweenRef.current = null;

    // grab labels and split into characters if needed
    const labelEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    splitLabelsOnce(labelEls);
    const perLabelChars = labelEls.map((el) => Array.from(el.querySelectorAll(".sm-char")));

    const numberEls = Array.from(panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"));
    const socialTitle = panel.querySelector(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));

    const layerStates = layers.map((el) => ({ el, start: Number(gsap.getProperty(el, "xPercent")) }));
    const panelStart = Number(gsap.getProperty(panel, "xPercent"));

    // set panel pre-state
    gsap.set(panel, { autoAlpha: 0, y: 10 });

    // char animation states (Float-in like ScrollFloat)
    const fromVars = {
      willChange: "opacity, transform",
      opacity: 0,
      yPercent: 120,
      scaleY: 2.3,
      scaleX: 0.7,
      transformOrigin: "50% 0%",
    };
    const toVars = {
      opacity: 1,
      yPercent: 0,
      scaleY: 1,
      scaleX: 1,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.018,
    };

    // reset chars to hidden before playing
    perLabelChars.forEach((chars) => gsap.set(chars, fromVars));
    if (numberEls.length) gsap.set(numberEls, { ["--sm-num-opacity"]: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0, y: 8 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 20, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    // colored pre-layers slide
    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: "power4.out" }, i * 0.07);
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layers.length ? 0.08 : 0);
    const panelDuration = 0.65;

    // panel slide + fade + rise
    tl.fromTo(
      panel,
      { xPercent: panelStart, autoAlpha: 0, y: 10 },
      { xPercent: 0, autoAlpha: 1, y: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime
    );

    // per-link char float-ins (stagger blocks by item)
    const itemsStart = panelInsertTime + panelDuration * 0.15;
    perLabelChars.forEach((chars, i) => {
      tl.to(
        chars,
        toVars,
        itemsStart + i * 0.07 // small cascade between each nav item
      );
    });

    // (optional) numbering reveal if enabled
    if (numberEls.length) {
      tl.to(
        numberEls,
        { duration: 0.6, ease: "power2.out", ["--sm-num-opacity"]: 1, stagger: { each: 0.08, from: "start" } },
        itemsStart + 0.1
      );
    }

    // socials
    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) tl.to(socialTitle, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, socialsStart);
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => gsap.set(socialLinks, { clearProps: "opacity" }),
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [splitLabelsOnce]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === "left" ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        // reset some states so re-open feels fresh
        const numberEls = Array.from(panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"));
        const socialTitle = panel.querySelector(".sm-socials-title");
        const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));
        if (numberEls.length) gsap.set(numberEls, { ["--sm-num-opacity"]: 0 });
        if (socialTitle) gsap.set(socialTitle, { opacity: 0, y: 8 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 20, opacity: 0 });
        gsap.set(panel, { autoAlpha: 0, y: 10 });
        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening) => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      spinTweenRef.current = gsap.timeline({ defaults: { ease: "power4.out" } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap.timeline({ defaults: { ease: "power3.inOut" } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    (opening) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening) => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";
    const cycles = 3;

    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === "Menu" ? "Close" : "Menu";
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: "power4.out",
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const onNavClick = (e, link) => {
    e.preventDefault();
    const [path, hash] = (link || "/").split("#");
    navigate(path || "/");
    if (openRef.current) toggleMenu();
    if (hash) {
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <div className="sm-scope w-full h-full">
      <div
        className={`${className ? className + " " : ""}staggered-menu-wrapper relative w-full h-full z-40`}
        style={accentColor ? { ["--sm-accent"]: accentColor } : undefined}
        data-position={position}
        data-open={open || undefined}
      >
        {/* pre-layers */}
        <div ref={preLayersRef} className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]" aria-hidden="true">
          {(() => {
            const raw = colors && colors.length ? colors.slice(0, 4) : ["#2e2e2e", "#2e2e2e", "#2e2e2e", "#2e2e2e"];
            let arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => (
              <div key={i} className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0" style={{ background: c }} />
            ));
          })()}
        </div>

        <header className="staggered-menu-header absolute top-0 left-0 w-full flex items-center justify-between p-[2em] bg-transparent pointer-events-none z-20" aria-label="Main navigation header">
          {showLogo ? (
            <div className="sm-logo flex items-center select-none pointer-events-auto" aria-label="Logo">
              <img src={logoUrl} alt="Logo" className="sm-logo-img block h-8 w-auto object-contain" draggable={false} width={110} height={24} />
            </div>
          ) : (
            <span />
          )}

          <button
            ref={toggleBtnRef}
            className="sm-toggle relative inline-flex items-center gap-[0.3rem] bg-transparent border-0 cursor-pointer font-medium leading-none overflow-visible pointer-events-auto"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span ref={textWrapRef} className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap w-[var(--sm-toggle-width,auto)] min-w-[var(--sm-toggle-width,auto)] mr-2" aria-hidden="true">
              <span ref={textInnerRef} className="sm-toggle-textInner flex flex-col leading-none">
                {textLines.map((l, i) => (
                  <span className="sm-toggle-line block h-[1em] leading-none" key={i}>{l}</span>
                ))}
              </span>
            </span>

            <span ref={iconRef} className="sm-icon relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center">
              <span ref={plusHRef} className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2" />
              <span ref={plusVRef} className="sm-icon-line sm-icon-line-v absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2" />
            </span>
          </button>
        </header>

        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel absolute top-0 right-0 h-full flex flex-col p-[6em_2em_2em_2em] overflow-y-auto z-10 backdrop-blur-[12px]"
          style={{ WebkitBackdropFilter: "blur(12px)" }}
          aria-hidden={!open}
        >
          <div className="sm-panel-inner flex-1 flex flex-col gap-5">
            <ul
              className="sm-panel-list list-none m-0 p-0 flex flex-col gap-2"
              role="list"
              data-numbering={displayItemNumbering || undefined}
            >
              {items && items.length ? (
                items.map((it, idx) => (
                  <li className="sm-panel-itemWrap relative leading-none" key={it.label + idx}>
                    <RouterLink
                      className="sm-panel-item font-clash relative cursor-pointer tracking-[-2px] transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.8em]"
                      to={it.link || "/"}
                      aria-label={it.ariaLabel || it.label}
                      data-index={idx + 1}
                      onClick={(e) => onNavClick(e, it.link || "/")}
                    >
                      <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">{it.label}</span>
                    </RouterLink>
                  </li>
                ))
              ) : (
                <li className="sm-panel-itemWrap relative leading-none" aria-hidden="true">
                  <span className="sm-panel-item font-clash relative cursor-pointer tracking-[-2px] pr-[1.8em]">
                    <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%]">No items</span>
                  </span>
                </li>
              )}
            </ul>

            {displaySocials && socialItems && socialItems.length > 0 && (
              <div className="sm-socials mt-auto pt-8 flex flex-col gap-3" aria-label="Social links">
                <h3 className="sm-socials-title m-0 text-base font-medium">Socials</h3>
                <ul className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap" role="list">
                  {socialItems.map((s, i) => (
                    <li key={s.label + i} className="sm-socials-item">
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-link text-[1.1rem] font-medium no-underline relative inline-block py-[2px] transition-[color,opacity] duration-300 ease-linear"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style>{`
/* scope & header */
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; }
.sm-scope .staggered-menu-header { position: absolute; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 2em; background: transparent; pointer-events: none; z-index: 20; }
.sm-scope .staggered-menu-header > * { pointer-events: auto; }

/* toggle */
.sm-scope .sm-toggle { font-weight: 600; }
.sm-scope .sm-toggle:focus-visible { outline: 2px solid #ffffff55; outline-offset: 4px; border-radius: 4px; }
.sm-scope .sm-icon { width: 14px; height: 14px; }

/* panel + prelayers width */
.sm-scope .staggered-menu-panel {
  position: absolute; top: 0; right: 0;
  width: clamp(300px, 24vw, 480px);
  height: 100%;
  background: rgba(46,46,46,0.95);
  border-left: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  display: flex; flex-direction: column;
  padding: 6em 2em 2em 2em;
  overflow-y: auto; z-index: 10;
}
.sm-scope .sm-prelayers { position: absolute; top: 0; right: 0; bottom: 0; width: clamp(300px, 24vw, 480px); pointer-events: none; z-index: 5; }
.sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; }
.sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }

/* prevent clipping */
.sm-scope .sm-panel-itemWrap { overflow: visible; }

/* item styles (ClashDisplay via class, plus fallback here) */
.sm-scope .sm-panel-list { display: flex; flex-direction: column; gap: 0.4rem; }
.sm-scope .sm-panel-item {
  font-family: "ClashDisplay", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: #ffffe3;
  font-weight: 700;
  font-size: 3rem;
  line-height: 1.08;
  letter-spacing: -0.02em;
  text-transform: none;
  transition: color 0.25s, opacity 0.25s;
  padding-right: 1.2em;
}
.sm-scope .sm-panel-item:hover { color: var(--sm-accent, #ffffe3); opacity: 0.92; }

/* label + char spans for float effect */
.sm-scope .sm-panel-itemLabel {
  display: inline-flex;            /* keeps chars on one baseline */
  overflow: hidden;                /* mask the rising chars */
  transform-origin: 50% 100%;
}
.sm-scope .sm-char {
  display: inline-block;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

/* numbering (disabled unless data-numbering is set) */
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after {
  counter-increment: smItem; content: counter(smItem, decimal-leading-zero);
  position: absolute; top: 0.05em; right: 1em;
  font-size: 16px; font-weight: 500;
  color: var(--sm-accent, #ffffe3);
  letter-spacing: 0; pointer-events: none; user-select: none;
  opacity: var(--sm-num-opacity, 0);
}

/* socials */
.sm-scope .sm-socials-title { color: var(--sm-accent, #ffffe3); }
.sm-scope .sm-socials-link { color: #ffffe3; }
.sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.35; }
.sm-scope .sm-socials-link:hover { color: var(--sm-accent, #ffffe3); }

@media (max-width: 400px) {
  .sm-scope .sm-panel-item { font-size: 2.6rem; line-height: 1.1; }
}
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
