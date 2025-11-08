import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const springValues = {
  damping: 30,
  stiffness: 120,
  mass: 1.6,
};

export default function TiltedCard({
  number = "1",
  title = "",
  Icon,
  children,
  className = "",
  containerClassName = "",
  rotateAmplitude = 12,
  scaleOnHover = 1.04,
  size = "320px",
  numberScale = 2,
  pillDepth = 40,
  pillParallax = 8,
  pillTiltDegrees = 0,
  descDepth = 28,
  descParallax = 6,
  descTiltDegrees = 0,
}) {
  const ref = useRef(null);
  const boxRef = useRef(null);
  const numRef = useRef(null);

  const rotateXMV = useMotionValue(0);
  const rotateYMV = useMotionValue(0);
  const rotateX = useSpring(rotateXMV, springValues);
  const rotateY = useSpring(rotateYMV, springValues);
  const scale = useSpring(1, springValues);

  // Foreground pill parallax/tilt
  const pillXMV = useMotionValue(0);
  const pillYMV = useMotionValue(0);
  const pillRotZMV = useMotionValue(0);
  const pillX = useSpring(pillXMV, { ...springValues, stiffness: 220, damping: 24, mass: 0.9 });
  const pillY = useSpring(pillYMV, { ...springValues, stiffness: 220, damping: 24, mass: 0.9 });
  const pillRotateZ = useSpring(pillRotZMV, { ...springValues, stiffness: 260, damping: 26, mass: 0.9 });
  // Derived transforms for description chip
  const pxRatio = pillParallax ? descParallax / pillParallax : 0;
  const ptRatio = pillTiltDegrees ? (descTiltDegrees / pillTiltDegrees) : 0;
  const descX = useTransform(pillX, (v) => v * pxRatio);
  const descY = useTransform(pillY, (v) => v * pxRatio);
  const descRotateZ = useTransform(pillRotateZ, (v) => v * ptRatio);

  function handleMouse(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateXMV.set(rotationX);
    rotateYMV.set(rotationY);

    // Parallax for the title pill
    const nx = Math.max(-1, Math.min(1, offsetX / (rect.width / 2)));
    const ny = Math.max(-1, Math.min(1, offsetY / (rect.height / 2)));
    pillXMV.set(nx * pillParallax);
    pillYMV.set(ny * pillParallax);
    if (pillTiltDegrees) {
      pillRotZMV.set(nx * -pillTiltDegrees);
    }
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
  }

  function handleMouseLeave() {
    scale.set(1);
    rotateXMV.set(0);
    rotateYMV.set(0);
    pillXMV.set(0);
    pillYMV.set(0);
    pillRotZMV.set(0);
  }

  // Resize big number to touch top/bottom of square
  function sizeNumber() {
    const box = boxRef.current;
    const num = numRef.current;
    if (!box || !num) return;
    const h = box.clientHeight;
    if (!h) return;
    // subtract a little to avoid clipping the glyphs
    num.style.fontSize = `${Math.max(10, h * Number(numberScale))}px`;
    num.style.lineHeight = 1;
  }

  // Attach resize observer
  useEffect(() => {
    sizeNumber();
    let ro;
    const box = boxRef.current;
    if (typeof window !== "undefined" && "ResizeObserver" in window) {
      ro = new ResizeObserver(sizeNumber);
      if (box) ro.observe(box);
      return () => ro && ro.disconnect();
    }
    window.addEventListener("resize", sizeNumber);
    return () => window.removeEventListener("resize", sizeNumber);
  }, []);

  return (
    <figure
      className={`relative w-full h-full [perspective:800px] ${containerClassName}`}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={ref}
        className="relative [transform-style:preserve-3d]"
        style={{ rotateX, rotateY, scale }}
      >
        <div
          ref={boxRef}
          className={`relative aspect-square mx-auto rounded-2xl border border-charcoal/10 bg-creme p-5 md:p-6 overflow-hidden ${className}`}
          style={{ width: size }}
        >
          {/* Big background number */}
          <span
            ref={numRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center font-clash font-bold text-charcoal/10 leading-none select-none"
            style={{ transform: "translateZ(1px)" }}
          >
            {number}
          </span>

          {/* Foreground content */}
          <div className="relative z-[2] will-change-transform [transform:translateZ(28px)] h-full w-full flex flex-col items-center justify-center text-center gap-3">
            {title ? (
              <div
                className="relative inline-block will-change-transform"
                style={{ transform: `translateZ(${pillDepth}px)` }}
              >
                <motion.div className="relative inline-flex flex-col items-center gap-2" style={{ x: pillX, y: pillY, rotate: pillRotateZ }}>
                  {Icon ? (
                    <div className="relative inline-block">
                      <div aria-hidden className="absolute inset-0 translate-y-1 scale-95 rounded-full bg-black/30 blur-md opacity-40" />
                      <div className="relative w-20 h-20 rounded-full bg-[#cebda6] text-charcoal flex items-center justify-center shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
                        <Icon className="w-11 h-11" />
                      </div>
                    </div>
                  ) : null}
                  <div className="relative inline-block">
                    <div aria-hidden className="absolute inset-0 translate-y-1 scale-95 rounded-full bg-black/30 blur-md opacity-40" />
                    <h3 className="relative w-fit whitespace-nowrap inline-flex items-center font-clash text-[0.95rem] md:text-[1.05rem] font-semibold text-charcoal rounded-full px-3.5 py-2 bg-[#cebda6] shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
                      {title}
                    </h3>
                  </div>
                </motion.div>
              </div>
            ) : null}

            {children ? (
              <div
                className="relative inline-block will-change-transform"
                style={{ transform: `translateZ(${descDepth}px)` }}
              >
                <motion.div style={{ x: descX, y: descY, rotate: descRotateZ }}>
                  <div aria-hidden className="absolute inset-0 translate-y-1 scale-95 rounded-full bg-black/25 blur-md opacity-35" />
                  <p className="relative w-fit whitespace-nowrap inline-flex items-center text-charcoal/95 text-[0.9rem] md:text-[1rem] rounded-full px-3 py-1.5 bg-[#cebda6] shadow-[0_10px_20px_rgba(0,0,0,0.18)]">
                    {children}
                  </p>
                </motion.div>
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </figure>
  );
}
