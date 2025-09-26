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
    <div className="min-h-screen bg-cream">
      {/* Navbar */}
      <header className="bg-cream border-b border-line sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
          {/* Logo / Title */}
          <h1 className="text-xl font-bold text-charcoal">throw a fit</h1>

          {/* Links */}
          <div className="flex gap-6">
            <Link to="/" className="text-charcoal hover:text-caramel transition">
              Home
            </Link>
            <Link to="/upload" className="text-charcoal hover:text-caramel transition">
              Upload
            </Link>
            <Link to="/profile/daniel" className="text-charcoal hover:text-caramel transition">
              My Profile
            </Link>
          </div>
        </nav>
      </header>

      {/* Routes */}
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/outfit/:id" element={<OutfitPost />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
