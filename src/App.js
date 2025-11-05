// src/App.js
import "./App.css";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";

import Home from "./pages/Home";
import OutfitPost from "./pages/OutfitPost";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import Container from "./components/Container";
import SiteFooter from "./components/SiteFooter";
import StaggeredMenu from "./components/StaggeredMenu";
import BootGate from "./components/BootGate";
import UploadModal from "./components/UploadModal";
import { FeedProvider } from "./store/FeedContext";
import Portal from "./components/Portal";

// Inline social icons (no external deps)
const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7z" />
    <path d="M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
    <circle cx="17.5" cy="6.5" r="1.2" />
  </svg>
);

const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 11.02 5 2.5 2.5 0 01-.02-5z" />
    <path d="M3.5 9h3v11h-3zM9 9h3v1.9h.04c.42-.8 1.46-2 3.48-2 3.72 0 4.41 2.45 4.41 5.63V20h-3v-4.7c0-1.12-.02-2.56-1.56-2.56-1.56 0-1.8 1.22-1.8 2.48V20h-3z" />
  </svg>
);

const GitHubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 .5A11.5 11.5 0 008.36 22.9c.58.11.79-.25.79-.56v-2.17c-3.2.69-3.87-1.54-3.87-1.54-.53-1.35-1.3-1.71-1.3-1.71-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.27 1.2-3.07-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.17a11.02 11.02 0 015.8 0c2.21-1.48 3.18-1.17 3.18-1.17.63 1.59.23 2.76.11 3.05.75.8 1.2 1.82 1.2 3.07 0 4.41-2.68 5.39-5.24 5.67.42.37.79 1.1.79 2.22v3.29c0 .31.21.67.8.56A11.5 11.5 0 0012 .5z" />
  </svg>
);

const socialLogos = [
  { node: <InstagramIcon />, title: "Instagram", href: "https://instagram.com" },
  { node: <LinkedInIcon />, title: "LinkedIn", href: "https://linkedin.com" },
  { node: <GitHubIcon />, title: "GitHub", href: "https://github.com" },
];

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
        if (!el) return;
        if (window.__lenis) {
          window.__lenis.scrollTo(el, { offset: 0, duration: 1 });
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
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

        <SiteFooter logos={socialLogos} logoHeight={40} gap={36} speed={120} direction="left" />

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

