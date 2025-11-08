import React, { useMemo } from "react";
import ReviewCard from "./ReviewCard";

export default function ReviewsMarquee({ items = [], direction = "left", duration = 50, className = "" }) {
  const doubled = useMemo(() => [...items, ...items], [items]);
  const style = {
    "--rb2-duration": `${duration}s`,
    "--rb2-direction": direction === "right" ? "reverse" : "normal",
  };
  return (
    <div className={`rb2-marquee ${className}`} style={style}>
      <div className="rb2-track" aria-hidden>
        {doubled.map((it, i) => (
          <ReviewCard key={i} {...it} />
        ))}
      </div>
    </div>
  );
}

