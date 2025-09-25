import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";

const outfits = [
  {
    id: 1,
    img: "https://via.placeholder.com/400x500?text=Outfit+1",
    title: "Vintage Streetwear",
    tags: ["Thrifted", "Street", "90s"],
  },
  {
    id: 2,
    img: "https://via.placeholder.com/400x500?text=Outfit+2",
    title: "Summer Casual",
    tags: ["Casual", "Light", "Minimal"],
  },
  {
    id: 3,
    img: "https://via.placeholder.com/400x500?text=Outfit+3",
    title: "Layered Fit",
    tags: ["Layered", "Cozy", "Neutral"],
  },
];

export default function Home() {
  return (
    <main
      className="mx-auto max-w-6xl px-4 py-10"
      style={{ background: "#FAF8F6" }}
    >
      <section className="mb-8">
        <h1 className="text-4xl font-bold" style={{ color: "#2E2E2E" }}>
          Throw a Fit
        </h1>
        <p className="mt-2" style={{ color: "#5A5A5A" }}>
          thrifted looks • stories • tags
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {outfits.map((o, i) => (
          <Reveal key={o.id} delay={i * 0.05}>
            <TiltCard>
              <img
                src={o.img}
                alt={o.title}
                className="w-full h-72 object-cover rounded-2xl"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{o.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {o.tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ background: "#F1E8DA", color: "#6A5C4A" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </section>
    </main>
  );
}
