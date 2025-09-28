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

function App() {
  const location = useLocation();

  const menuItems = useMemo(
    () => [
      { label: "home", ariaLabel: "Go to home page", link: "/" },
      { label: "flex a fit", ariaLabel: "Upload a fit", link: "/upload" }, // opens modal overlay
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
    <FeedProvider>
      <div className="min-h-screen bg-creme relative">
        <main>
          <Container className="py-4">
            <Routes location={location}>
              {/* show Home *also* at /upload so the modal sits on top of Home */}
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

            {/* Modal overlay appears whenever the URL is /upload */}
            {location.pathname === "/upload" && <UploadModal />}
          </Container>
        </main>

        {/* IMPORTANT: wrapper stays non-interactive so it never blocks clicks */}
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <StaggeredMenu
            /* don't add pointer-events-auto here; the component handles its own button */
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
    </FeedProvider>
  );
}

export default App;
