// src/App.js
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useMemo } from "react";

import Home from "./pages/Home";
import OutfitPost from "./pages/OutfitPost";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import Container from "./components/Container";
import StaggeredMenu from "./components/StaggeredMenu";

function App() {
  const menuItems = useMemo(
    () => [
      { label: "home", ariaLabel: "Go to home page", link: "/" },
      { label: "flex a fit", ariaLabel: "Upload a fit", link: "/upload" },
      { label: "fitography", ariaLabel: "Browse styles", link: "/#collections" },
      { label: "profile", ariaLabel: "View my profile", link: "/profile/daniel" },
    ],
    []
  );

  const socialItems = useMemo(
    () => [
      { label: "Instagram", link: "https://instagram.com" },
      { label: "GitHub", link: "https://github.com" },
      { label: "LinkedIn", link: "https://linkedin.com" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-creme relative">
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

      {/* Menu overlay */}
      <div className="fixed inset-0 z-[60] pointer-events-none">
        <StaggeredMenu
          className="pointer-events-auto"
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials
          displayItemNumbering={false}
          showLogo={false}
          logoUrl="/logo.svg"

          /* >>> THEME <<< */
          colors={["#2e2e2e", "#ffffe3", "#2e2e2e", "#2e2e2e"]} // sweep layers
          accentColor="#ffffe3"                                 // hover/numbering/socials
          menuButtonColor="#111111"                             // toggle when closed
          openMenuButtonColor="#ffffe3"                         // toggle when open (over dark panel)
          changeMenuColorOnOpen={true}

          onMenuOpen={() => console.log("Menu opened")}
          onMenuClose={() => console.log("Menu closed")}
        />
      </div>
    </div>
  );
}

export default App;
