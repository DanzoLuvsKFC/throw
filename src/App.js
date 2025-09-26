// src/App.js
import "./App.css";
import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import OutfitPost from "./pages/OutfitPost";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import Container from "./components/Container";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-creme">
      {/* Navbar */}
      <header className="bg-creme border-b border-line sticky top-0 z-50">
        <Container className="flex items-center justify-between py-3">
          {/* Logo / Title */}
          <Link to="/" className="text-xl font-bold text-charcoal">
            throw a fit
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="font-satoshi font-light text-charcoal hover:text-caramel transition"
            >
              Home
            </Link>
            <Link
              to="/upload"
              className="font-satoshi font-light text-charcoal hover:text-caramel transition"
            >
              Upload
            </Link>
            <Link
              to="/profile/daniel"
              className="font-satoshi font-light text-charcoal hover:text-caramel transition"
            >
              My Profile
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg border border-line text-charcoal"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Toggle menu</span>
            {/* simple hamburger */}
            <div className="space-y-1">
              <span className="block h-0.5 w-5 bg-charcoal"></span>
              <span className="block h-0.5 w-5 bg-charcoal"></span>
              <span className="block h-0.5 w-5 bg-charcoal"></span>
            </div>
          </button>
        </Container>

        {/* Mobile drawer */}
        {open && (
          <div
            id="mobile-nav"
            className="md:hidden border-t border-line bg-creme"
          >
            <Container className="py-3 flex flex-col gap-3">
              <Link
                onClick={() => setOpen(false)}
                to="/"
                className="font-satoshi font-light text-charcoal hover:text-caramel transition"
              >
                Home
              </Link>
              <Link
                onClick={() => setOpen(false)}
                to="/upload"
                className="font-satoshi font-light text-charcoal hover:text-caramel transition"
              >
                Upload
              </Link>
              <Link
                onClick={() => setOpen(false)}
                to="/profile/daniel"
                className="font-satoshi font-light text-charcoal hover:text-caramel transition"
              >
                My Profile
              </Link>
            </Container>
          </div>
        )}
      </header>

      {/* Routes */}
      <main>
        <Container className="py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/outfit/:id" element={<OutfitPost />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </main>
    </div>
  );
}

export default App;
