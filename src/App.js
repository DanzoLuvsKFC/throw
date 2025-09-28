// src/App.js
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useMemo } from "react";

import Home from "./pages/Home";
import OutfitPost from "./pages/OutfitPost";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import Container from "./components/Container";
import StaggeredMenu from "./components/StaggeredMenu";
import BootGate from "./components/BootGate";

import { FeedProvider } from "./store/FeedContext";
import UploadModal from "./components/UploadModal";

function AppShell() {
  const location = useLocation();
  const isUpload = location.pathname === "/upload";

  const menuItems = useMemo(
    () => [
      { label: "home", ariaLabel: "Go to home page", link: "/" },
      // keep this — it will now open the overlay modal on top of Home
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
          {/* IMPORTANT:
             We render Home for BOTH "/" and "/upload".
             When you're on "/upload", the UploadModal is layered above Home (see below).
          */}
          <Routes>
            <Route
              path="/"
              element={
                <BootGate preloadImages={[]} minimumShowMs={700}>
                  <Home />
                </BootGate>
              }
            />
            <Route
              path="/upload"
              element={
                <BootGate preloadImages={[]} minimumShowMs={700}>
                  <Home />
                </BootGate>
              }
            />

            <Route path="/outfit/:id" element={<OutfitPost />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </main>

      {/* Menu overlay (unchanged) */}
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
          colors={["#2e2e2e", "#ffffe3", "#2e2e2e", "#2e2e2e"]}
          accentColor="#ffffe3"
          menuButtonColor="#111111"
          openMenuButtonColor="#ffffe3"
          changeMenuColorOnOpen={true}
          onMenuOpen={() => console.log("Menu opened")}
          onMenuClose={() => console.log("Menu closed")}
        />
      </div>

      {/* Mount the modal ONLY on /upload */}
      {isUpload && <UploadModal />}
    </div>
  );
}

export default function App() {
  return (
    <FeedProvider>
      <AppShell />
    </FeedProvider>
  );
}
