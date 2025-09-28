// src/store/FeedContext.jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/* --- Import ONLY the fits you want in Fitography --- */
/* Paths are from this file to src/assets/fonts/fits/... */
import fit2 from "../assets/fonts/fits/fit 2.jpg";
import fit3 from "../assets/fonts/fits/fit 3.jpg";
import fit4 from "../assets/fonts/fits/fit 4.jpg";
import fit5 from "../assets/fonts/fits/fit 5.jpg";
import fit6 from "../assets/fonts/fits/fit 6.jpg";
import fit7 from "../assets/fonts/fits/fit 7.jpg";
import fit9 from "../assets/fonts/fits/fit 9.jpg";
import fit11 from "../assets/fonts/fits/fit 11.jpg";
import fit13 from "../assets/fonts/fits/fit 13.jpg";
import fit14 from "../assets/fonts/fits/fit 14.jpg";
import fit15 from "../assets/fonts/fits/fit 15.jpg";

const FeedContext = createContext(null);

/** Bump the key so old empty data doesn't suppress seeds */
const LS_KEY = "taf_posts_v3";

/** Utility */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}
function makeId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** --- Seed posts (exactly what you asked for) --- */
const seedPosts = [
  {
    id: "seed_fit2",
    src: fit2,
    caption: "",
    tags: ["light blue", "denim", "converse"],
    user: "chicbabe03",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 11,
  },
  {
    id: "seed_fit3",
    src: fit3,
    caption: "",
    tags: ["green", "white", "football", "dress"],
    user: "littlemsrager",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: "seed_fit4",
    src: fit4,
    caption: "",
    tags: ["yellow", "green", "football", "denim"],
    user: "littlemsrager",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
  },
  {
    id: "seed_fit5",
    src: fit5,
    caption: "",
    tags: ["black", "cargo", "shorts", "blue"],
    user: "littlemsrager",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },
  {
    id: "seed_fit6",
    src: fit6,
    caption: "",
    tags: ["black", "red", "bomber", "uggs"],
    user: "danzo",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: "seed_fit7",
    src: fit7,
    caption: "",
    tags: ["green", "black", "grey", "beanie"],
    user: "danzo",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
  },
  {
    id: "seed_fit9",
    src: fit9,
    caption: "",
    tags: ["leather", "layers", "grey"],
    user: "rolls",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: "seed_fit11",
    src: fit11,
    caption: "",
    tags: ["pink", "scarf", "charcoal", "carhartt"],
    user: "tofu",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: "seed_fit13",
    src: fit13,
    caption: "",
    tags: ["sweats", "creme", "handbag"],
    user: "cozy",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "seed_fit14",
    src: fit14,
    caption: "",
    tags: ["navy", "denim", "undershirt"],
    user: "rolls",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: "seed_fit15",
    src: fit15,
    caption: "",
    tags: ["cargo", "crop top", "black"],
    user: "rolls",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
];

export function FeedProvider({ children }) {
  const [posts, setPosts] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 0) return arr;
      }
      // If nothing saved (or empty), use seeds:
      return seedPosts;
    } catch {
      return seedPosts;
    }
  });

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(posts));
    } catch {}
  }, [posts]);

  // Add a new post (upload modal still works)
  const addPost = useCallback(async ({ file, caption = "", tags = [], user = "guest" }) => {
    const src = await fileToDataUrl(file);
    const post = {
      id: makeId(),
      src,
      caption,
      tags,
      user,
      createdAt: Date.now(),
    };
    setPosts((arr) => [post, ...arr]);
    return post;
  }, []);

  const value = useMemo(() => ({ posts, addPost }), [posts, addPost]);
  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be used inside <FeedProvider>");
  return ctx;
}
