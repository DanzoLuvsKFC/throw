// src/pages/Profile.js
import { useParams } from "react-router-dom";

export default function Profile() {
  const { username } = useParams();
  return (
    <main style={{ padding: 24 }}>
      <h1>@{username}</h1>
      <p>Bio, avatar, and their outfits go here.</p>
    </main>
  );
}