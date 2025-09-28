// src/components/UploadModal.jsx
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useFeed } from "../store/FeedContext"; // if you don't have this yet, stub addPost

export default function UploadModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addPost } = useFeed?.() ?? { addPost: async () => {} };

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [caption, setCaption] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const introRef = useRef(null);

  // --- ANIMATION: intro (on mount)
  useLayoutEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const overlay = overlayRef.current;
    const card = cardRef.current;
    if (!overlay || !card) return;

    const ctx = gsap.context(() => {
      gsap.set(overlay, { opacity: 0, willChange: "opacity", force3D: true });
      gsap.set(card, { opacity: 0, y: 14, scale: 0.985, willChange: "transform,opacity", force3D: true });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      if (prefersReduced) {
        tl.to(overlay, { opacity: 1, duration: 0.15 })
          .to(card, { opacity: 1, duration: 0.15 }, 0);
      } else {
        tl.to(overlay, { opacity: 1, duration: 0.22 })
          .to(card, { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" }, 0.04);
      }
      introRef.current = tl;
    });

    return () => ctx.revert();
  }, []);

  // --- Clean preview URL
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  // --- Close with smooth outro, THEN navigate
  const navigateBack = useCallback(() => {
    if (location.state && location.state.backgroundLocation) navigate(-1);
    else navigate("/", { replace: true });
  }, [location.state, navigate]);

  const onClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);

    const overlay = overlayRef.current;
    const card = cardRef.current;
    if (!overlay || !card) return navigateBack();

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tl = gsap.timeline({
      defaults: { ease: "power2.in" },
      onComplete: navigateBack,
    });

    if (prefersReduced) {
      tl.to(card, { opacity: 0, duration: 0.12 })
        .to(overlay, { opacity: 0, duration: 0.12 }, 0);
    } else {
      tl.to(card, { opacity: 0, y: 10, scale: 0.985, duration: 0.2 })
        .to(overlay, { opacity: 0, duration: 0.22, ease: "power2.inOut" }, 0.02);
    }
  }, [isClosing, navigateBack]);

  // --- File select / drag drop
  const pickFile = (f) => {
    if (!f) return;
    setImgLoaded(false);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };
  const onFileChange = (e) => pickFile(e.target.files?.[0]);
  const onDrop = (e) => { e.preventDefault(); pickFile(e.dataTransfer.files?.[0]); };
  const onDragOver = (e) => e.preventDefault();

  // --- Tags
  const addTag = (value) => {
    const v = value.trim();
    if (!v || tags.includes(v)) return;
    setTags((t) => [...t, v]);
  };
  const removeTag = (t) => setTags((arr) => arr.filter((x) => x !== t));
  const onTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      addTag(tagInput);
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  // --- Submit
  const canSubmit = useMemo(() => !!file && !submitting, [file, submitting]);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    try {
      setSubmitting(true);
      await addPost({ file, caption, tags, user: "daniel" }); // stub user
      onClose();
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      alert("Failed to post. Try again.");
    }
  };

  // --- ESC key to close
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[80] bg-charcoal/70 backdrop-blur-[3px] flex items-center justify-center p-4"
      style={{ willChange: "opacity", backfaceVisibility: "hidden", transform: "translateZ(0)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-charcoal border border-creme/15 shadow-[0_10px_40px_rgba(0,0,0,.35)] will-change-[transform,opacity]"
      >
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-creme/15">
          <h3 className="font-clash text-xl font-semibold text-creme m-0">flex a fit</h3>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-creme/80 hover:bg-creme/10 transition"
          >
            close
          </button>
        </div>

        {/* body */}
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-0">
          {/* left: picker / preview */}
          <div
            className="relative min-h-[320px] md:min-h-[480px] flex items-center justify-center bg-charcoal"
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center text-center cursor-pointer group">
                <div className="rounded-xl border border-dashed border-creme/25 bg-white/5 px-8 py-10 group-hover:border-creme/50 transition">
                  <div className="text-creme mb-2 font-medium">drag photos here</div>
                  <div className="text-creme/70 text-sm">
                    or <span className="ml-1 underline">select from computer</span>
                  </div>
                </div>
                <input type="file" accept="image/*" className="sr-only" onChange={onFileChange} />
              </label>
            ) : (
              <div className="absolute inset-0">
                {/* fade the preview in only when decoded */}
                <img
                  src={previewUrl}
                  alt="preview"
                  className={`w-full h-full object-contain transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                  decoding="async"
                  onLoad={() => setImgLoaded(true)}
                />
                <div className="absolute top-2 right-2">
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-creme text-charcoal text-sm cursor-pointer hover:opacity-90 transition border border-charcoal/10">
                    change
                    <input type="file" accept="image/*" className="sr-only" onChange={onFileChange} />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* right: form */}
          <div className="p-4 md:p-6 flex flex-col gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wide text-creme/60 mb-1">caption</label>
              <textarea
                className="w-full rounded-lg border border-creme/15 bg-white/5 text-creme placeholder:text-creme/40 px-3 py-2 outline-none focus:ring-2 focus:ring-creme/20"
                rows={4}
                placeholder="say something about your fit…"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wide text-creme/60 mb-1">tags (press enter)</label>
              <div className="rounded-lg border border-creme/15 bg-white/5 px-2 py-2 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 rounded-full bg-creme text-charcoal px-2 py-1 text-sm">
                    {t}
                    <button
                      type="button"
                      className="text-charcoal/70 hover:text-charcoal"
                      onClick={() => removeTag(t)}
                      aria-label={`remove ${t}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  className="min-w-[120px] flex-1 px-2 outline-none bg-transparent text-creme placeholder:text-creme/40"
                  placeholder="vintage, y2k, denim…"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={onTagKeyDown}
                />
              </div>
            </div>

            <div className="mt-auto flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-md border border-creme/20 text-creme/90 hover:bg-white/5 transition"
              >
                cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="px-4 py-2 rounded-md bg-creme text-charcoal font-medium hover:opacity-90 disabled:opacity-60 transition"
              >
                {submitting ? "Posting…" : "Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
