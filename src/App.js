// src/App.js
import "./App.css";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";

import Home from "./pages/Home";
import OutfitPost from "./pages/OutfitPost";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import Container from "./components/Container";
import StaggeredMenu from "./components/StaggeredMenu";
import BootGate from "./components/BootGate";
import UploadModal from "./components/UploadModal";
import { FeedProvider } from "./store/FeedContext";
import Portal from "./components/Portal";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = useMemo(
    () => [
      { label: "home", ariaLabel: "Go to home page", link: "/" },
      { label: "flex a fit", ariaLabel: "Upload a fit", link: "/upload" },
      { label: "fitography", ariaLabel: "Browse styles", link: "/#collections" },
      // { label: "profile", ariaLabel: "View my profile", link: "/profile/daniel" },
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

  // Smooth-hash + SPA link handling inside the menu only
  const handleMenuClick = (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;

    const href = a.getAttribute("href") || "";
    const target = (a.getAttribute("target") || "").toLowerCase();

    if (/^(https?:|mailto:|tel:)/i.test(href) || target === "_blank") return;

    e.preventDefault();

    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      const doScroll = () => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      };

      if (path && path !== location.pathname) {
        navigate(path);
        setTimeout(doScroll, 0);
      } else {
        doScroll();
      }
      return;
    }

    navigate(href);
  };

  // Lock body scroll when the slide-over menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [menuOpen]);

  return (
    <FeedProvider>
      <div className="min-h-screen bg-creme relative">
        <main>
          <Container className="py-4">
            <Routes location={location}>
              {/* Render Home for both "/" and "/upload" so the modal overlays it */}
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

            {location.pathname === "/upload" && <UploadModal />}
          </Container>
        </main>

        {/* MENU in a Portal so it can never be clipped by Container/max-width */}
        <Portal>
          <div
            className={`fixed inset-0 z-[9999] ${
              menuOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <div
              className="h-full"
              onClickCapture={menuOpen ? handleMenuClick : undefined}
            >
              <StaggeredMenu
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
                onMenuOpen={() => setMenuOpen(true)}
                onMenuClose={() => setMenuOpen(false)}
              />
            </div>
          </div>
        </Portal>
      </div>
    </FeedProvider>
  );
}

export default App;
