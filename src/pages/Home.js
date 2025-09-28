import ScrollFloat from "../components/ScrollFloat";
import { useFeed } from "../store/FeedContext";

// Curated mosaic (replace these URLs with your photos)
const curated = {
  leftTop:  "https://placehold.co/1200x800?text=Streetwear",
  leftBot:  "https://placehold.co/1200x800?text=Vintage",
  midTop:   "https://placehold.co/1200x800?text=Techwear",
  midBot:   "https://placehold.co/1200x800?text=Athleisure",
  rightTop: "https://placehold.co/1200x800?text=Minimalist",
  rightBot: "https://placehold.co/1200x800?text=Y2K",
};

// Triptych images for the About section (optional)
const aboutImages = [
  "https://placehold.co/600x800?text=Look+1",
  "https://placehold.co/600x800?text=Look+2",
  "https://placehold.co/600x800?text=Look+3",
];

function CollectionCard({ title, img, className = "" }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-line bg-white/70 ${className}`}>
      <img
        src={img}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-creme p-4">
        <h3 className="text-2xl md:text-3xl font-normal">{title}</h3>
      </div>
    </div>
  );
}

function UploadCard({ post }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
      <div className="relative">
        <img
          src={post.src}
          alt={post.caption || "uploaded fit"}
          className="w-full h-72 object-cover md:h-80"
          loading="lazy"
        />
        {post.tags?.length ? (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded-full bg-creme/95 text-charcoal text-xs px-2 py-[2px] border border-charcoal/10">
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
      <div className="p-3">
        <div className="text-sm text-charcoal/60">@{post.user} • {new Date(post.createdAt).toLocaleDateString()}</div>
        {post.caption ? <div className="mt-1 text-charcoal">{post.caption}</div> : null}
      </div>
    </article>
  );
}

export default function Home() {
  const { posts } = useFeed();

  return (
    <div className="bg-creme">
      {/* HERO */}
      <section className="relative max-w-6xl mx-auto flex items-center justify-center px-4" style={{ minHeight: "90svh" }}>
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

      {/* ABOUT */}
      <section id="about" className="max-w-[100rem] mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 bg-white/70 border border-line rounded-3xl p-3">
            <div className="grid grid-cols-3 gap-3">
              {aboutImages.map((src, i) => (
                <div key={i} className="overflow-hidden rounded-2xl">
                  <img
                    src={src}
                    alt={`About visual ${i + 1}`}
                    className="w-full h-[220px] md:h-[360px] object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <ScrollFloat
              as="h2"
              animationDuration={1.1}
              ease="back.out(1.4)"
              scrollStart="top 90%"
              scrollEnd="top 45%"
              stagger={0.022}
              containerClassName="m-0"
              textClassName="text-3xl md:text-4xl font-bold text-charcoal"
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
              throw a Fit is a community-driven space to share thrifted outfits, tag the pieces, and discover new styles. Think of it like your curated,
              fashion-forward moodboard, powered by real people and real finds.
            </ScrollFloat>
          </div>
        </div>
      </section>

      {/* FEATURED STYLES — curated mosaic */}
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
            textClassName="text-2xl md:text-3xl font-bold text-charcoal"
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
            dare to mix and match. Check our collections to level up your fashion game.
          </ScrollFloat>
        </header>

        <div
          className="
            grid gap-4
            sm:grid-cols-2 sm:auto-rows-[170px]
            lg:grid-cols-6 lg:grid-rows-[repeat(5,minmax(0,1fr))]
            lg:h-[min(82svh,700px)]
          "
        >
          <CollectionCard title="Streetwear"  img={curated.leftTop}  className="sm:col-span-2 lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2" />
          <CollectionCard title="Vintage"     img={curated.leftBot}  className="sm:col-span-2 lg:col-start-1 lg:col-span-2 lg:row-start-3 lg:row-span-3" />
          <CollectionCard title="Techwear"    img={curated.midTop}   className="sm:col-span-2 lg:col-start-3 lg:col-span-2 lg:row-start-1 lg:row-span-3" />
          <CollectionCard title="Athleisure"  img={curated.midBot}   className="sm:col-span-2 lg:col-start-3 lg:col-span-2 lg:row-start-4 lg:row-span-2" />
          <CollectionCard title="Minimalist"  img={curated.rightTop} className="sm:col-span-2 lg:col-start-5 lg:col-span-2 lg:row-start-1 lg:row-span-2" />
          <CollectionCard title="Y2K"         img={curated.rightBot} className="sm:col-span-2 lg:col-start-5 lg:col-span-2 lg:row-start-3 lg:row-span-3" />
        </div>
      </section>

      {/* RECENT FITS — user uploads */}
      <section className="max-w-[100rem] mx-auto px-4 pt-2 pb-16">
        <header className="mb-5 md:mb-7 text-center">
          {/* Animated header + Clash font to match other headings */}
          <ScrollFloat
            as="h3"
            animationDuration={1.05}
            ease="power3.out"
            scrollStart="top 92%"
            scrollEnd="top 60%"
            stagger={0.02}
            containerClassName="m-0"
            textClassName="font-clash text-xl md:text-2xl font-bold text-charcoal"
          >
            recent fits
          </ScrollFloat>

          {/* Optional: animate subtext too for consistency */}
          <ScrollFloat
            as="p"
            animationDuration={0.95}
            ease="power2.out"
            scrollStart="top 96%"
            scrollEnd="top 70%"
            stagger={0.006}
            containerClassName="mt-1 m-0"
            textClassName="text-charcoal/70"
          >
            uploads from you and your friends (saved locally for now).
          </ScrollFloat>
        </header>

        {posts.length === 0 ? (
          <div className="p-6 text-center text-charcoal/70">
            no uploads yet. hit <span className="font-medium">“flex a fit”</span> to post your first look.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((p) => (
              <UploadCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
