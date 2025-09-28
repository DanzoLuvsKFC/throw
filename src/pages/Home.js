// src/pages/Home.js
import ScrollFloat from "../components/ScrollFloat";
import { useFeed } from "../store/FeedContext";

// Triptych images for the About section
const aboutImages = [
  "https://placehold.co/600x800?text=Look+1",
  "https://placehold.co/600x800?text=Look+2",
  "https://placehold.co/600x800?text=Look+3",
];

function FitCard({ post }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white">
      <img
        src={post.image}
        alt={post.caption || "outfit photo"}
        className="w-full h-60 md:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="p-3">
        {post.caption && (
          <p className="text-sm text-charcoal/80 line-clamp-2">{post.caption}</p>
        )}
        {post.tags?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-full bg-black/5 text-charcoal/80"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  const { posts } = useFeed();

  return (
    <div className="bg-creme">
      {/* 1) HERO */}
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

      {/* 2) ABOUT */}
      <section id="about" className="max-w-[100rem] mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 bg-white/70 border border-black/10 rounded-3xl p-3">
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
              Throw a Fit is a community-driven space to share thrifted outfits, tag the pieces, and discover new styles. Think of it like your curated,
              fashion-forward moodboard — powered by real people and real finds.
            </ScrollFloat>

            <div className="mt-6">
              <ScrollFloat
                as="h3"
                animationDuration={0.9}
                ease="power2.out"
                scrollStart="top 96%"
                scrollEnd="top 70%"
                stagger={0.01}
                containerClassName="m-0"
                textClassName="text-xl font-normal text-charcoal"
              >
                What you can do
              </ScrollFloat>

              <ul className="mt-2 space-y-2 text-charcoal/80 list-disc list-inside">
                <li>Upload your fit and tag each garment</li>
                <li>Browse looks by style, color and vibe</li>
                <li>Follow profiles you love</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3) FITOGRAPHY — shows the uploaded posts */}
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
            Your latest looks — shared by the community.
          </ScrollFloat>
        </header>

        {posts.length === 0 ? (
          <div className="text-center text-charcoal/60">
            No fits yet. Hit <span className="underline">flex a fit</span> to upload your first one.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((p) => (
              <FitCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
