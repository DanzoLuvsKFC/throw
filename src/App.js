// src/App.js
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import OutfitPost from "./pages/OutfitPost";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="App">
      {/* Simple nav (you can restyle or replace later) */}
      <header className="App-header" style={{ padding: 16 }}>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">Home</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/profile/daniel">My Profile</Link>
        </nav>
      </header>

      {/* Route definitions */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/outfit/:id" element={<OutfitPost />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
