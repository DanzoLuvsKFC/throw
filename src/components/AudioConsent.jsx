import { useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

export default function AudioConsent() {
  const navigate = useNavigate();
  const scopeRef = useRef(null);

  // if user already chose, skip this screen
  useEffect(() => {
    const pref = localStorage.getItem("taf_audio_pref");
    if (pref === "on" || pref === "off") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ["#ac-title", "#ac-sub", "#ac-cta"],
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }
      );
    }, scopeRef);
    return () => ctx.revert();
  }, []);

  const startAudioAndGo = async () => {
    // persist pref
    localStorage.setItem("taf_audio_pref", "on");

    // global singleton so it survives route changes
    const existing = window.__tafAudio;
    const audio =
      existing ||
      new Audio(`${process.env.PUBLIC_URL}/audio/intro.mp3`);

    // keep reference globally
    window.__tafAudio = audio;
    audio.preload = "auto";
    audio.loop = false;

    try {
      // start quiet, then fade up
      audio.volume = 0;
      await audio.play(); // allowed because it's button-click initiated
      gsap.to(audio, { volume: 0.65, duration: 0.6, ease: "power2.out" });
    } catch (e) {
      // if something blocks playback, just continue without audio
      localStorage.setItem("taf_audio_pref", "off");
    }

    navigate("/", { replace: true });
  };

  const skipAndGo = () => {
    localStorage.setItem("taf_audio_pref", "off");
    // stop any existing audio
    try {
      if (window.__tafAudio) {
        window.__tafAudio.pause();
        window.__tafAudio.currentTime = 0;
      }
    } catch {}
    navigate("/", { replace: true });
  };

  return (
    <div
      ref={scopeRef}
      className="min-h-screen bg-creme flex items-center justify-center px-6"
    >
      <div className="text-center">

        <p
          id="ac-sub"
          className="mt-4 text-charcoal/70 text-base md:text-lg max-w-md mx-auto"
        >
          Would you like audio while the site animates?
        </p>

        <div
          id="ac-cta"
          className="mt-8 flex items-center justify-center gap-3"
        >
          <button
            onClick={startAudioAndGo}
            className="px-5 py-2.5 rounded-lg bg-charcoal text-creme hover:bg-charcoal/90 transition"
          >
            Yes, turn on audio
          </button>
          <button
            onClick={skipAndGo}
            className="px-5 py-2.5 rounded-lg border border-line text-charcoal hover:bg-white/60 transition"
          >
            No thanks
          </button>
        </div>

        <div className="mt-6 text-[12px] text-charcoal/50">
          You can change this later by reloading and choosing again.
        </div>
      </div>
    </div>
  );
}
