// src/components/PostLightbox.jsx
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useFeed } from "../store/FeedContext";

export default function PostLightbox({ postId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { posts } = useFeed();

  const post = useMemo(() => posts.find((p) => p.id === postId), [posts, postId]);

  const overlayRef = useRef(null);
  const shellRef = useRef(null);
  const imgRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  // Lock scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Intro animation
  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const shell = shellRef.current;
    if (!overlay || !shell) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.set(overlay, { opacity: 0 });
      gsap.set(shell, { opacity: 0, y: 14, scale: 0.99 });
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      if (prefersReduced) {
        tl.to(overlay, { opacity: 1, duration: 0.12 })
          .to(shell, { opacity: 1, duration: 0.12 }, 0);
      } else {
        tl.to(overlay, { opacity: 1, duration: 0.18 })
          .to(shell, { opacity: 1, y: 0, scale: 1, duration: 0.26 }, 0.02);
      }
    });

    return () => ctx.revert();
  }, []);

  const navigateBack = useCallback(() => {
    if (location.state && location.state.backgroundLocation) navigate(-1);
    else navigate("/", { replace: true });
  }, [location.state, navigate]);

  const onClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    const overlay = overlayRef.current;
    const shell = shellRef.current;
    if (!overlay || !shell) return navigateBack();

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tl = gsap.timeline({ defaults: { ease: "power2.in" }, onComplete: navigateBack });
    if (prefersReduced) {
      tl.to(shell, { opacity: 0, duration: 0.12 })
        .to(overlay, { opacity: 0, duration: 0.12 }, 0);
    } else {
      tl.to(shell, { opacity: 0, y: 10, scale: 0.985, duration: 0.18 })
        .to(overlay, { opacity: 0, duration: 0.2 }, 0.02);
    }
  }, [isClosing, navigateBack]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!post) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[85] bg-black/70 backdrop-blur-[2px] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        ref={shellRef}
        className="relative w-full max-w-6xl bg-transparent"
        role="document"
      >
        {/* Close button */}
        <button
          type="button"
          aria-label="Close post"
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/90 hover:text-white text-3xl"
        >
          ×
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_380px] bg-white rounded-xl overflow-hidden shadow-2xl">
          {/* Media */}
          <div className="relative bg-black flex items-center justify-center">
            <img
              ref={imgRef}
              src={post.src}
              alt={post.caption || "uploaded fit"}
              className="max-h-[82vh] w-auto h-auto object-contain"
              loading="eager"
            />
          </div>

          {/* Right panel with tags/user */}
          <aside className="p-5 md:p-6 bg-white text-charcoal max-h-[82vh] overflow-auto">
            <div className="text-sm text-charcoal/60">@{post.user ?? "guest"}</div>
            {post.caption ? (
              <div className="mt-1 text-[0.95rem]">{post.caption}</div>
            ) : null}

            {Array.isArray(post.tags) && post.tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full bg-creme text-charcoal text-sm md:text-base px-3 py-1 border border-charcoal/15"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            ) : null}

            {post.createdAt ? (
              <div className="mt-4 text-xs text-charcoal/50">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}

