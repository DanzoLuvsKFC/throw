// src/store/FeedContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FeedContext = createContext(null);

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

export function FeedProvider({ children }) {
  const [posts, setPosts] = useState([]);

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("taf_posts");
      if (raw) setPosts(JSON.parse(raw));
    } catch {}
  }, []);

  // save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("taf_posts", JSON.stringify(posts));
    } catch {}
  }, [posts]);

  const addPost = async ({ file, caption = "", tags = [], user = "guest" }) => {
    if (!file) throw new Error("No file provided");

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const dataUrl = await fileToDataUrl(file);

    const post = {
      id,
      image: dataUrl,     // data URL for persistence
      caption: caption.trim(),
      tags: tags.map((t) => t.trim()).filter(Boolean),
      user,
      createdAt: Date.now(),
    };

    setPosts((prev) => [post, ...prev]);
    return id;
  };

  const removePost = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const value = useMemo(() => ({ posts, addPost, removePost }), [posts]);

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be used inside <FeedProvider>");
  return ctx;
}
