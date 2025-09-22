import { Link } from "react-router-dom";

export default function Home() {
  // dummy example: link to a specific outfit + profile
  return (
    <main style={{ padding: 24 }}>
      <h1>Throw a Fit — Outfit Feed</h1>
      <p>Scroll outfits here.</p>
      <p>
        Try: <Link to="/outfit/abc123">View Outfit</Link> ·{" "}
        <Link to="/profile/daniel">Daniel’s Profile</Link> ·{" "}
        <Link to="/upload">Upload an Outfit</Link>
      </p>
    </main>
  );
}