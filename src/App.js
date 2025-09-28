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
import UploadModal from "./components/UploadModal";
import { FeedProvider } from "./store/FeedContext";

function AppShell() {
  const menuItems = useMemo(
    () => [
      { label: "home", ariaLabel: "Go to home page", link: "/" },
      // keep /upload in the menu – it will open as a modal route
      { label: "flex a fit", ariaLabel: "Upload a fit", link: "/upload" },
      { label: "fitography", ariaLabel: "Browse styles", link: "/#collections" },
      { label: "profile", ariaLabel: "View my profile", link: "/profile/daniel" },
    ],
    []
  );

  const socialItems = useMemo(
    () => [
      { label: "instagram", link: "https://instagram.com" },
      { label: "gitHub", link: "https://github.com" },
      { label: "linkedIn", link: "https://linkedin.com" },
    ],
    []
  );

  const location = useLocation();
  const backgroundLocation = location.state && location.state.backgroundLocation;

  return (
    <div className="min-h-screen bg-creme relative">
      <main>
        <Container className="py-4">
          {/* MAIN routes; if we came from a page and opened /upload, keep that background */}
          <Routes location={backgroundLocation || location}>
            <Route
              path="/"
              element={
                <BootGate preloadImages={[]} minimumShowMs={700}>
                  <Home />
                </BootGate>
              }
            />
            {/* if a user lands directly on /upload, show Home under the modal */}
            <Route path="/upload" element={<Home />} />
            <Route path="/outfit/:id" element={<OutfitPost />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* MODAL route layer */}
          {(backgroundLocation || location.pathname === "/upload") && (
            <Routes>
              <Route path="/upload" element={<UploadModal />} />
            </Routes>
          )}
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
          colors={["#2e2e2e", "#ffffe3", "#2e2e2e", "#2e2e2e"]}
          accentColor="#ffffe3"
          menuButtonColor="#111111"
          openMenuButtonColor="#ffffe3"
          changeMenuColorOnOpen={true}
          onMenuOpen={() => console.log("Menu opened")}
          onMenuClose={() => console.log("Menu closed")}
        />
      </div>
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
