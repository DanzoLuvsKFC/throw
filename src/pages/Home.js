// src/pages/Home.js
import { useMemo, useState } from "react";
import ScrollFloat from "../components/ScrollFloat";
import { useFeed } from "../store/FeedContext";

// --- import your 3 local photos (paths are from src/pages -> src/assets/...)
import look1 from "../assets/fonts/fits/fit.jpg";
import look2 from "../assets/fonts/fits/fit 8.jpg";   // spaces OK, but renaming is cleaner
import look3 from "../assets/fonts/fits/fit 12.jpg";  // spaces OK, but renaming is cleaner

/* Edge-to-edge triptych images for the About section */
const aboutImages = [look1, look2, look3];

/* Masonry-friendly card for uploads */
function FitCard({ post }) {
  return (
    <article className="mb-4 break-inside-avoid rounded-2xl overflow-hidden border border-charcoal/10 bg-white group">
      <div className="relative">
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
          <div className="text-sm text-charcoal/60">
            @{post.user ?? "guest"} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "—"}
          </div>
          {post.caption ? <div className="mt-1 text-charcoal">{post.caption}</div> : null}
        </div>
      )}
    </article>
  );
}

export default function Home() {
  const { posts } = useFeed();

  // --- Fitography search/filter state
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

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
    setSelectedTags((arr) => (arr.includes(t) ? arr.filter((x) => x !== t) : [...arr, t]));

  const clearFilters = () => {
    setQuery("");
    setSelectedTags([]);
  };

  return (
    <div className="bg-creme">
      {/* HERO */}
      <section
        className="relative max-w-6xl mx-auto flex items-center justify-center px-4"
        style={{ minHeight: "90svh" }}
      >
        <div className="text-center">
          <ScrollFloat
            as="h1"
            playOnMount
            animationDuration={1}
            ease="power3.out"
            containerClassName="m-0"
            textClassName="font-clash font-bold text-charcoal text-[4rem] sm:text-[6rem] md:text-[8rem] leading-none"
          >
            throw a fit
          </ScrollFloat>

          <ScrollFloat
            as="p"
            playOnMount
            mountDelay={0.25}
            animationDuration={0.9}
            ease="power3.out"
            stagger={0.01}
            containerClassName="mt-6 m-0"
            textClassName="text-[1.25rem] sm:text-[1.5rem] md:text-[2rem] text-charcoal/70"
          >
            {"don't know what to wear? throw a fit."}
          </ScrollFloat>
        </div>

        {/* scroll cue */}
        <a
          href="#about"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-charcoal/60 hover:text-charcoal transition flex flex-col items-center"
          aria-label="Scroll to about section"
        >
          <span className="text-xs tracking-wider">scroll</span>
          <svg className="w-5 h-5 mt-1 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>

      {/* SECTION 2 — ABOUT (edge-to-edge triptych + copy) */}
      <section id="about" className="max-w-[100rem] mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* LEFT: edge-to-edge images */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-3 gap-3">
              {aboutImages.map((src, i) => (
                <div key={i}>
                  <img
                    src={src}
                    alt={`Outfit ${i + 1}`}
                    className="w-full h-[240px] md:h-[360px] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: copy */}
          <div className="lg:col-span-5">
            <ScrollFloat
              as="h2"
              animationDuration={1.1}
              ease="back.out(1.4)"
              scrollStart="top 90%"
              scrollEnd="top 45%"
              stagger={0.022}
              containerClassName="m-0"
              textClassName="font-clash text-3xl md:text-4xl font-bold text-charcoal"
            >
              find the fit
            </ScrollFloat>

            <ScrollFloat
              as="p"
              animationDuration={1.05}
              ease="power2.out"
              scrollStart="top 95%"
              scrollEnd="top 55%"
              stagger={0.005}
              containerClassName="mt-4 m-0"
              textClassName="text-charcoal/70"
            >
              Throw a Fit is a community-driven space to share thrifted outfits, tag the pieces,
              and discover new styles. Think of it like your curated, fashion-forward moodboard,
              powered by real people and real finds.
            </ScrollFloat>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FITOGRAPHY (Explore uploads + search) */}
      <section id="collections" className="max-w-[100rem] mx-auto px-4 py-12 md:py-16">
        <header className="mb-6 md:mb-8 text-center">
          <ScrollFloat
            as="h2"
            animationDuration={1.05}
            ease="power3.out"
            scrollStart="top 92%"
            scrollEnd="top 50%"
            stagger={0.02}
            containerClassName="m-0"
            textClassName="font-clash text-2xl md:text-3xl font-bold text-charcoal"
          >
            fitography
          </ScrollFloat>

          <ScrollFloat
            as="p"
            animationDuration={0.95}
            ease="power2.out"
            scrollStart="top 95%"
            scrollEnd="top 60%"
            stagger={0.006}
            containerClassName="mt-2 m-0"
            textClassName="text-charcoal/70"
          >
            search by tag, caption, or @user — with no filters you’ll see everything.
          </ScrollFloat>

          {/* search + quick tags */}
          <div className="mx-auto mt-4 max-w-xl">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search tags, captions, or @user…"
              aria-label="Search fitography"
              className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-charcoal/10 text-charcoal placeholder:text-charcoal/40"
            />
            {allTags.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {allTags.slice(0, 12).map((t) => {
                  const active = selectedTags.includes(t);
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`px-3 py-1 rounded-full text-sm border transition ${
                        active
                          ? "bg-charcoal text-creme border-charcoal"
                          : "bg-white text-charcoal border-charcoal/15 hover:border-charcoal/30"
                      }`}
                      aria-pressed={active}
                    >
                      #{t}
                    </button>
                  );
                })}
                {(selectedTags.length > 0 || query) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-3 py-1 rounded-full text-sm border border-charcoal/15 bg-white text-charcoal hover:border-charcoal/30"
                  >
                    clear
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Masonry (Explore) — shows only matches if search/tags set, else all */}
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-charcoal/60">
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
