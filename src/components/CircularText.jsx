import { useEffect, useMemo, useState } from "react";
import { motion, useAnimation } from "motion/react";

/**
 * CircularText
 * - Spins text around a circle.
 * - Hover behaviors: "speedUp" | "slowDown" | "pause" | "goBonkers" | undefined
 *
 * Props:
 *  text: string
 *  spinDuration: seconds for one full revolution (default 20)
 *  onHover: behavior when hovered
 *  size: outer diameter in px
 *  radius: distance from center to text baseline in px (defaults to size/2 - 20)
 *  className: extra classes for container
 *  letterClassName: classes for letters
 *  centerSlot: optional React node rendered at the center (e.g., arrow icon)
 */
export default function CircularText({
  text = "THROW•A•FIT•",
  spinDuration = 20,
  onHover = "speedUp",
  size = 200,
  radius,
  className = "",
  letterClassName = "text-[clamp(0.9rem,1.6vw,1.25rem)] font-semibold",
  centerSlot = null,
}) {
  const letters = useMemo(() => Array.from(text), [text]);
  const controls = useAnimation();
  const [reduced, setReduced] = useState(false);

  const r = radius ?? Math.max(0, size / 2 - 20);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    setReduced(!!mq?.matches);
    const handler = (e) => setReduced(e.matches);
    mq?.addEventListener?.("change", handler);
    return () => mq?.removeEventListener?.("change", handler);
  }, []);

  // Start/Update spin
  const startSpin = (dur) => {
    if (reduced) return controls.stop();
    controls.start({
      rotate: 360,
      transition: {
        ease: "linear",
        duration: Math.max(0.1, dur),
        repeat: Infinity,
      },
    });
  };

  useEffect(() => {
    startSpin(spinDuration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinDuration, reduced, text]);

  const handleHoverStart = () => {
    if (!onHover || reduced) return;
    switch (onHover) {
      case "slowDown":
        startSpin(spinDuration * 2);
        break;
      case "speedUp":
        startSpin(spinDuration / 4);
        break;
      case "pause":
        controls.stop();
        break;
      case "goBonkers":
        startSpin(spinDuration / 20);
        break;
      default:
        startSpin(spinDuration);
    }
  };

  const handleHoverEnd = () => {
    if (!onHover || reduced) return;
    startSpin(spinDuration);
  };

  return (
    <motion.div
      role="img"
      aria-label={text.replace(/•/g, " ")}
      className={`relative rounded-full select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transformOrigin: "50% 50%",
      }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {/* letters */}
      {letters.map((letter, i) => {
        const angle = (360 / letters.length) * i;
        const t = `translate(-50%, -50%) rotate(${angle}deg) translateX(${r}px) rotate(${-angle}deg)`;
        return (
          <span
            key={`${letter}-${i}`}
            className={`absolute left-1/2 top-1/2 will-change-transform ${letterClassName}`}
            style={{ transform: t, WebkitTransform: t }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        );
      })}

      {/* center content */}
      {centerSlot && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          {centerSlot}
        </div>
      )}
    </motion.div>
  );
}
