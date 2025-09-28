// src/store/FeedContext.jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const FeedContext = createContext(null);
const LS_KEY = "taf_posts_v1";

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

export function FeedProvider({ children }) {
  const [posts, setPosts] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(posts));
    } catch {}
  }, [posts]);

  const addPost = useCallback(async ({ file, caption = "", tags = [], user = "guest" }) => {
    const src = await fileToDataUrl(file); // stores image locally
    const post = {
      id: makeId(),
      src,
      caption,
      tags,
      user, // simple string username for now
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
