// src/pages/OutfitPost.js
import { useParams } from "react-router-dom";

export default function OutfitPost() {
  const { id } = useParams(); // e.g. "abc123"
  return (
    <main style={{ padding: 24 }}>
      <h1>Outfit #{id}</h1>
      <p>Large image, garment breakdown, tags, notes…</p>
    </main>
  );
}