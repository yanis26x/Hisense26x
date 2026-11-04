
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import { alignAppRow, focusElement, getFocusTargets, getRemoteKey, findSpatialTarget } from "./spatialNavigation.js";

const initialApps = [
  { name: "Store", description: "Store", color: "#0170cc", id: null },
  { name: "addicted", description: "Media Gallery", image: "/addicted.webp", decorative: true },
  { name: "PlayStation", description: "PlayStation", color: "#000", id: "ps5" },
  { name: "YouTube", description: "YouTube", color: "#ffffff", id: "youtube" },
  { name: "Netflix", description: "Netflix", color: "#171717", id: "netflix" },
  { name: "HDMI 1", description: "HDMi1", color: "#0866bc", id: "hdmi1" },
  { name: "HDMI 2", description: "HDMi2", color: "#0866bc", id: "hdmi2" },
  { name: "Prime Video", description: "Amazon Prime Video", color: "#0866bc", id: "prime" },
  { name: "Spotify", description: "Spotify", color: "#000000", id: null },
  { name: "Games", image: "/games/P4.jpg", gameGroup: true },
  { name: "Help", image: "/CestTriste.jpg", decorative: true },
];

const brandedApps = ["PlayStation", "YouTube", "Netflix", "HDMI 1", "HDMI 2", "Prime Video"];

const adjustableGlassApps = ["YouTube", "Netflix", "HDMI 1", "HDMI 2", "Prime Video"];

const games = [
  { name: "Persona 4 GOLDEN", image: "/games/P4.jpg" },
  { name: "Fatal Frame 2", image: "/games/FatalFrame2.webp" },
  { name: "RedSteel", image: "/games/redsteel.jpeg" },
];

const appDetails = {
  Store: ["Store", "Explore the store."],
  addicted: ["Media Gallery", "Explore personal photos in a slideshow format."],
  PlayStation: ["HDMI 3", "Dont forget to always buuy your games physically, or else you will not own them"],
  YouTube: ["Videos", "Watch your favorite videos on YouTube."],
  Netflix: ["Streaming service", "Discover movies and series on Netflix."],
  "HDMI 1": [" HDMI 1", "Display content from the device connected to HDMI 1."],
  "HDMI 2": ["HDMI 2", "Display content from the device connected to HDMI 2."],
  "Prime Video": ["Streaming service", "Use the Amazon Prime Video app to watch movies and series."],
  Spotify: ["Music Streaming", "Listen to your favorite music and podcasts.."],
  Help: ["Help", "Do—dope sick, I'm having withdrawals, I feel uneasy Skittles got me feeling tranquil, they're so relieving"],
};

function AppLogo({ name }) {
  if (name === "PlayStation") return <img className="app-logo-image" src="/icon/FFlogo.png" alt="" />;
  if (name === "Blood") return <img className="app-logo-image" src="/icon/bloodPlusWhite.png" alt="" />;
  if (name === "Prime Video") return <img className="app-logo-image" src="/icon/amazon.png" alt="" />;
  if (name === "YouTube") {
    return (
      <>
        <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute", pointerEvents: "none" }}>
          <defs>
            <filter id="youtube-wordmark-thin" x="0" y="0" width="100%" height="100%">
              <feMorphology in="SourceGraphic" operator="erode" radius="0.45" />
            </filter>
          </defs>
        </svg>
        <span className="youtube-wordmark" role="img" aria-label="YouTube" />
      </>
    );
  }

  if (name === "Netflix") {
    return <img className="app-logo-image netflix-title-logo" src="/icon/Netflix.png" alt="" />;
  }

  if (name === "Spotify") {
    return <><img className="app-logo-image spotify-red-logo" src="/icon/SpotifyLogoRed.webp" alt="" /><img className="spotify-bottom-logo" src="/icon/spotify.svg" alt="" /></>;
  }

  if (name.startsWith("HDMI")) {
    return <img className="app-logo-image hdmi-logo hdmi-one-logo" src="/icon/HDMI.svg" alt="" />;
  }

  return null;
}

function BrandedAppArtwork({ name }) {
  const isInput = name.startsWith("HDMI");
  return (
    <span className={`branded-artwork ${name === "PlayStation" ? "playstation-artwork" : ""}`} aria-hidden="true">
      <span className="branded-category-icon">
        {name === "PlayStation" ? (
          <svg className="playstation-symbols" viewBox="0 0 64 64" aria-hidden="true">
            <rect x="5" y="6" width="22" height="22" />
            <path d="m47 5 14 24H33zM5 37l23 23M28 37 5 60" />
            <circle cx="47" cy="48" r="13" />
          </svg>
        ) : name === "Netflix" || name === "Prime Video" || name === "Blood" ? (
          <img className="service-category-logo pentagram-category-logo" src="/icon/pentagram.png" alt="" />
        ) : name === "YouTube" ? (
          <img className="service-category-logo youtube-category-logo" src="/icon/ytbLogo.png" alt="" />
        ) : (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          {isInput ? (
            <>
              <path d="M6 20h52a2 2 0 0 1 2 2v13a2 2 0 0 1-1.4 1.9L53 39l-6 5H17l-6-5-5.6-2.1A2 2 0 0 1 4 35V22a2 2 0 0 1 2-2z" />
              <path d="M15 31h34" />
              <text x="58" y="55" textAnchor="end" fill="currentColor" stroke="none" fontFamily="Arial, sans-serif" fontSize="12">{name === "HDMI 1" ? "1" : "2"}</text>
            </>
          ) : name === "Netflix" ? (
            <path d="M16 7h10v49l-10 2zM38 7h10v51l-10-2zM16 7h10l22 51-11-2z" fill="currentColor" stroke="none" />
          ) : name === "Prime Video" ? (
            <>
              <rect x="7" y="8" width="50" height="31" rx="2" />
              <path d="m28 17 11 6-11 6z" fill="currentColor" stroke="none" />
              <path d="M6 58V48a4 4 0 0 1 8 0v10m7 0V48a4 4 0 0 1 8 0v10m7 0V48a4 4 0 0 1 8 0v10m7 0V48a4 4 0 0 1 8 0v10" />
            </>
          ) : name === "YouTube" ? (
            <>
              <rect x="7" y="12" width="50" height="34" rx="4" />
              <path d="M25 54h14M32 46v8" />
            </>
          ) : (
            <>
              <path d="m9 21 7-8h13l7 8h15a5 5 0 0 1 5 5v22a5 5 0 0 1-5 5H13a5 5 0 0 1-5-5V26a5 5 0 0 1 5-5z" />
              <circle cx="32" cy="36" r="10" />
              <path d="M45 27h3" />
            </>
          )}
        </svg>
        )}
      </span>
      <span className="branded-divider"><span>{name === "PlayStation" ? "PLAY" : isInput ? "EXTERNAL INPUT" : "ENTERTAINMENT"}</span></span>
      <span className={`branded-service ${isInput ? "branded-input" : ""}`}>
        <AppLogo name={name} />
      </span>
    </span>
  );
}

const personalPhotos = ["/icon/BLOOD-plus.PNG"];

const wallpapers = ["/PS5background.JPG", "/frutigeraero8.jpg", "/wallpaper/PS3.jpeg", "/wallpaper/frutigeraero3.jpg"];

function testVidaaAPI() {
  const result = {
    omi_platform: typeof window.omi_platform,
    opera_omi: typeof window.opera_omi,
    Hisense_GetCountryCode: typeof window.Hisense_GetCountryCode,
  };

  alert(JSON.stringify(result, null, 2));
}

export default function App() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    let timer;
    function resetInactivity() {
      clearTimeout(timer);
      setShowFooter(false);
      timer = setTimeout(() => setShowFooter(true), 5000);
    }
    const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "touchmove"];
    // Capture activity even when the intro or gallery consumes the event.
    events.forEach(name => window.addEventListener(name, resetInactivity, { capture: true, passive: true }));
    timer = setTimeout(() => setShowFooter(true), 5000);
    return () => {
      clearTimeout(timer);
      events.forEach(name => window.removeEventListener(name, resetInactivity, true));
    };
  }, []);

  const [introActive, setIntroActive] = useState(true);
  const [introStage, setIntroStage] = useState("ja");
  const introAudioRef = useRef(null);
  const introSkipRef = useRef(null);

  useEffect(() => {
    if (!introActive) return;
    const audio = introAudioRef.current;
    const playAudio = () => {
      if (audio && audio.paused && !audio.ended) {
        // Some TV browsers require a remote/pointer gesture before playing sound.
        audio.play().catch(() => {});
      }
    };
    playAudio();
    window.addEventListener("keydown", playAudio, true);
    window.addEventListener("pointerdown", playAudio, true);
    return () => {
      window.removeEventListener("keydown", playAudio, true);
      window.removeEventListener("pointerdown", playAudio, true);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [introActive]);

  useEffect(() => {
    if (!introActive) return;
    const englishTimer = setTimeout(() => setIntroStage("en"), 5000);
    return () => {
      clearTimeout(englishTimer);
    };
  }, [introActive]);

  useEffect(() => {
    if (introActive) introSkipRef.current?.focus({ preventScroll: true });
  }, [introActive]);

  function replayIntro() {
    setIntroStage("ja");
    // Start within the click/Enter gesture so replay also works with autoplay blocked.
    const audio = introAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
    setIntroActive(true);
  }

  const [apiResult, setApiResult] = useState("");

  useEffect(() => {
    try {
      const fn = window.omi_platform?.sendPlatformMessage;

      // One-time diagnostic of the TV bridge after mounting.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setApiResult(
        fn ? Function.prototype.toString.call(fn) : "API indisponible"
      );
    } catch (error) {
      setApiResult(String(error));
    }
    const timer = setTimeout(() => setApiResult(""), 5000);
    return () => clearTimeout(timer);
  }, []);

  const [page, setPage] = useState("home");
  const [selectionEffect, setSelectionEffect] = useState(() => {
    try {
      const saved = localStorage.getItem("vidaa-selection-effect");
      return ["none", "outline", "glow", "neon", "neon-pink"].includes(saved) ? saved : "outline";
    } catch { return "outline"; }
  });
  useEffect(() => {
    try { localStorage.setItem("vidaa-selection-effect", selectionEffect); } catch { /* Storage may be unavailable on TV. */ }
  }, [selectionEffect]);
  const [transparentCards, setTransparentCards] = useState(() => {
    try { return localStorage.getItem("vidaa-transparent-cards") === "true"; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem("vidaa-transparent-cards", String(transparentCards)); } catch { /* Storage may be unavailable on TV. */ }
  }, [transparentCards]);
  const [sharedGlass, setSharedGlass] = useState(() => {
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem("vidaa-shared-glass")) || JSON.parse(localStorage.getItem("vidaa-app-glass"))?.YouTube || {};
    } catch { /* Use defaults. */ }
    return {
      transparency: Number.isFinite(saved.transparency) ? Math.max(0, Math.min(100, saved.transparency)) : 50,
      blur: Number.isFinite(saved.blur) ? Math.max(0, Math.min(40, saved.blur)) : 24,
    };
  });
  useEffect(() => {
    try { localStorage.setItem("vidaa-shared-glass", JSON.stringify(sharedGlass)); } catch { /* Storage may be unavailable on TV. */ }
  }, [sharedGlass]);

  function glassStyle(name) {
    return adjustableGlassApps.includes(name) ? { "--card-glass-opacity": 1 - sharedGlass.transparency / 100, "--card-glass-blur": `${sharedGlass.blur}px` } : undefined;
  }

  function updateGlassSetting(key, value) {
    setSharedGlass(previous => ({ ...previous, [key]: value }));
    setTransparentCards(true);
  }

  function handleGlassSliderKey(event, key) {
    const remoteKey = getRemoteKey(event);
    if (remoteKey !== "ArrowLeft" && remoteKey !== "ArrowRight") return;
    event.preventDefault();
    event.stopPropagation();
    const step = key === "transparency" ? 5 : 1;
    const max = key === "transparency" ? 100 : 40;
    const next = sharedGlass[key] + (remoteKey === "ArrowRight" ? step : -step);
    updateGlassSetting(key, Math.max(0, Math.min(max, next)));
  }

  const [cardRadius, setCardRadius] = useState(() => {
    try {
      const saved = Number(localStorage.getItem("vidaa-card-radius"));
      return [0, 12].includes(saved) ? saved : 0;
    } catch { return 0; }
  });

  useEffect(() => {
    try { localStorage.setItem("vidaa-card-radius", String(cardRadius)); } catch { /* Storage may be unavailable on TV. */ }
  }, [cardRadius]);

  const apps = initialApps;
  const [folderExpanded, setFolderExpanded] = useState(false);
  const photoButtonsRef = useRef([]);
  const gameButtonsRef = useRef([]);
  const [selectedGame, setSelectedGame] = useState(0);
  const photoCloseRef = useRef(null);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [selected, setSelected] = useState(() => initialApps.findIndex(app => app.name === "addicted"));
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [clock, setClock] = useState("");
  const buttonsRef = useRef([]);
  const lastNavigationRef = useRef(0);
  const launcherRef = useRef(null);
  const remoteModeRef = useRef(true);
  const lastFocusRef = useRef(null);
  const rowRef = useRef(null);

  useEffect(() => {
    if (!galleryOpen) return;
    const opener = lastFocusRef.current;
    photoCloseRef.current?.focus({ preventScroll: true });
    function handlePhotoKey(event) {
      const key = getRemoteKey(event);
      if (key === "Back" || key === "ArrowLeft" || key === "ArrowRight" || event.key === "Tab") {
        event.preventDefault();
        event.stopImmediatePropagation();
        remoteModeRef.current = true;
        if (key === "Back") setGalleryOpen(false);
        else if (key === "ArrowLeft" || key === "ArrowRight") {
          const direction = key === "ArrowRight" ? 1 : -1;
          setPhotoIndex(index => (index + direction + personalPhotos.length) % personalPhotos.length);
        } else photoCloseRef.current?.focus({ preventScroll: true });
      } else if (key === "Enter") {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!event.repeat) setGalleryOpen(false);
      }
    }
    window.addEventListener("keydown", handlePhotoKey, true);
    return () => {
      window.removeEventListener("keydown", handlePhotoKey, true);
      opener?.focus({ preventScroll: true });
    };
  }, [galleryOpen]);

  useEffect(() => {
    function updateClock() {
      setClock(
        new Date().toLocaleTimeString("fr-CA", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }

    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const root = launcherRef.current;
    function handleKey(event) {
      const key = getRemoteKey(event);
      if (introActive && key) {
        event.preventDefault();
        if (key === "ArrowDown") introSkipRef.current?.focus({ preventScroll: true });
        if (key === "Enter" && !event.repeat && document.activeElement === introSkipRef.current) introSkipRef.current.click();
        return;
      }
      if (!key || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      remoteModeRef.current = true;
      root.dataset.remote = "true";
      // Gallery input is handled by its capture listener.
      if (introActive || galleryOpen) return;
      const targets = getFocusTargets(root);
      const current = targets.includes(document.activeElement) ? document.activeElement : null;
      if (key === "Back") {
        if (event.repeat) return;
        if (folderExpanded) {
          setFolderExpanded(false);
          focusElement(buttonsRef.current[selected]);
        } else if (page === "settings") setPage("home");
        else focusElement(buttonsRef.current[selected]);
        return;
      }
      if (key === "Enter") {
        if (event.repeat) return;
        if (!current) {
          focusElement(buttonsRef.current[selected] || targets[0]);
        } else {
          current.click();
        }
        return;
      }
      // Rate-limit held arrows, while keeping individual presses responsive.
      const now = performance.now();
      if (event.repeat && now - lastNavigationRef.current < 140) return;
      lastNavigationRef.current = now;
      if (!current) {
        focusElement(page === "home" ? buttonsRef.current[selected] : targets[0]);
        return;
      }
      if (page === "home" && key === "ArrowUp" && current.closest(".app-row")) {
        setFolderExpanded(false);
        focusElement(root.querySelector('.main-sections button[aria-label="Settings"]'));
        return;
      }
      if (page === "home" && key === "ArrowDown" && current.closest(".main-sections")) {
        focusElement(buttonsRef.current[selected]);
        return;
      }
      const photoPosition = photoButtonsRef.current.indexOf(current);
      if (key === "ArrowUp" && current.closest(".folder-app-row") && photoPosition < 4) {
        focusElement(buttonsRef.current[selected]);
        return;
      }
      const next = findSpatialTarget(current, targets, key);
      if (next) focusElement(next);
    }
    function pointerMode(event) {
      remoteModeRef.current = false;
      delete root.dataset.remote;
      if (folderExpanded && event.clientY < Math.max(80, window.innerHeight * .12)) setFolderExpanded(false);
    }
    function rememberFocus(event) {
      lastFocusRef.current = event.target;
      if (!event.target.closest(".folder-app-row")) setFolderExpanded(false);
    }
    window.addEventListener("keydown", handleKey);
    root.addEventListener("pointermove", pointerMode);
    root.addEventListener("pointerdown", pointerMode);
    root.addEventListener("focusin", rememberFocus);
    return () => {
      window.removeEventListener("keydown", handleKey);
      root.removeEventListener("pointermove", pointerMode);
      root.removeEventListener("pointerdown", pointerMode);
      root.removeEventListener("focusin", rememberFocus);
    };
  }, [selected, page, galleryOpen, introActive, folderExpanded]);

  useEffect(() => {
    // Restore focus after a page change, closing the gallery, or removal of a transient button.
    const root = launcherRef.current;
    const frame = requestAnimationFrame(() => {
      if (introActive || galleryOpen) return;
      const targets = getFocusTargets(root);
      if (targets.includes(document.activeElement)) return;
      const remembered = targets.includes(lastFocusRef.current) ? lastFocusRef.current : null;
      const fallback = page === "settings"
        ? root.querySelector('.settings-page input:checked, .settings-page input')
        : buttonsRef.current[selected];
      if (remoteModeRef.current) {
        root.dataset.remote = "true";
        focusElement(remembered || fallback || targets[0]);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [page, galleryOpen, selected, introActive]);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const tile = buttonsRef.current[selected];
    if (page !== "home" || !row || !tile || galleryOpen) return;
    const align = () => alignAppRow(row, tile);
    align();
    window.addEventListener("resize", align);
    return () => window.removeEventListener("resize", align);
  }, [selected, page, galleryOpen, apps]);

  async function launch(app) {
    if (app.gameGroup) {
      setFolderExpanded(true);
      focusElement(gameButtonsRef.current[selectedGame]);
      return;
    }
    if (app.name === "addicted") {
      setFolderExpanded(true);
      focusElement(photoButtonsRef.current[0]);
      return;
    }

    if (app.decorative) return;

    if (!app.id) {
      alert("Cette application sera ajoutée prochainement.");
      return;
    }

    try {
      const response = await fetch(`/api/launch/${app.id}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Commande VIDAA échouée");
      }
    } catch (error) {
      console.error(error);
      alert("Impossible de lancer l'application sur la TV.");
    }
  }

  return (
    <>
    <main inert={introActive || galleryOpen ? true : undefined} aria-hidden={introActive || galleryOpen ? true : undefined} ref={launcherRef} className={`launcher selection-${selectionEffect} ${galleryOpen ? "gallery-open" : ""} ${folderExpanded && (apps[selected].name === "addicted" || apps[selected].gameGroup) && page === "home" ? "folder-expanded" : ""}`} style={{ "--wallpaper": `url("${wallpapers[wallpaperIndex]}")`, "--card-radius": `${cardRadius}px` }}>
      <div className="background-shade" />



      <header className="topbar">
        <div className="app-description brand">
          {page === "settings"
            ? <span id="settings-title">Settings</span>
            : <img className="brand-blood" src={["/wallpaper/frutigeraero3.jpg", "/frutigeraero8.jpg"].includes(wallpapers[wallpaperIndex]) ? "/icon/BLOOD-plus.PNG" : "/icon/bloodPlusWhite.png"} alt="Blood Plus" />}
        </div>
        <div className="topbar-right">
          <nav className="main-sections" aria-label="Outils du launcher">
            <button type="button" onClick={testVidaaAPI} aria-label="Test VIDAA API" title="Test VIDAA API">
              <span className="test-api-symbol" aria-hidden="true">⛧</span>
            </button>
            <button type="button" onClick={() => setPage(page === "settings" ? "home" : "settings")} aria-label={page === "settings" ? "Home" : "Settings"} title={page === "settings" ? "Home" : "Settings"}>
              {page === "settings" ? (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9" /></svg>
              ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 3-.6 2.2-1.3.8-2.2-.6-2.5 4.2 1.6 1.6v1.6l-1.6 1.6L5.4 19l2.2-.6 1.3.8.6 2.2h5l.6-2.2 1.3-.8 2.2.6 2.5-4.2-1.6-1.6v-1.6l1.6-1.6-2.5-4.2-2.2.6-1.3-.8L14.5 3z" /><circle cx="12" cy="12" r="3.5" /></svg>
              )}
            </button>
            <button type="button" onClick={() => setWallpaperIndex(value => (value + 1) % wallpapers.length)} aria-label="Change theme" title="Change theme">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.4-3.4 1.5 1.5 0 0 1 1.1-2.6H18a3 3 0 0 0 3-3 9 9 0 0 0-9-9z" /><circle cx="7.5" cy="10" r="1" fill="currentColor" /><circle cx="11" cy="6.8" r="1" fill="currentColor" /><circle cx="15.5" cy="7.5" r="1" fill="currentColor" /><circle cx="17.5" cy="11" r="1" fill="currentColor" /></svg>
            </button>
          </nav>
          <span className="topbar-clock">{clock}</span>
        </div>
      </header>

      <section className="apps" aria-label="Applications et entrées HDMI" hidden={page !== "home"}>
        <div ref={rowRef} className="app-row">
          {apps.map((app, index) => (
            <button
              key={app.name}
              style={glassStyle(app.name)}
              ref={el => { buttonsRef.current[index] = el; }}
              className={`app ${app.name === "Spotify" ? "spotify-card" : ""} ${app.name === "PlayStation" ? "playstation-card" : ""} ${app.name === "Help" ? "help-card" : ""} ${brandedApps.includes(app.name) ? "branded-card" : ""} ${selected === index ? "selected" : ""} ${["addicted", "Help"].includes(app.name) ? "original-card" : transparentCards ? "glass-card" : ""}`}
              onMouseMove={() => {
                if (selected !== index) {
                  setSelected(index);
                  buttonsRef.current[index]?.focus({ preventScroll: true });
                }
              }}
              onFocus={() => setSelected(index)}
              onClick={() => launch(app)}
              aria-label={app.name}
              aria-expanded={app.name === "addicted" || app.gameGroup ? folderExpanded : undefined}
              aria-controls={selected === index ? (app.gameGroup ? "game-library" : app.name === "addicted" ? "photo-gallery" : undefined) : undefined}
            >
              <span
                className="app-tile"
              >
                <span className="app-artwork" style={{ background: app.color || "#111" }}>
                {app.name === "Store" ? (
                  <span className="store-artwork">
                    <img className="store-icon" src="/icon/PSstore.png" alt="" />
                    <span className="store-label">Store</span>
                  </span>
                ) : app.gameGroup ? (
                  <span className="game-group-grid" aria-hidden="true">
                    {games.map(game => <img key={game.name} src={game.image} alt="" />)}
                    <span className="game-group-folder"><svg viewBox="0 0 48 48"><path d="M5 13a3 3 0 0 1 3-3h12l5 5h15a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" /><path d="M5 21h38" /></svg></span>
                  </span>
                ) : brandedApps.includes(app.name) ? (
                  <BrandedAppArtwork name={app.name} />
                ) : app.image ? (
                  <img className="app-image" src={app.image} alt="" />
                ) : (
                  <span className={`app-logo ${["PlayStation", "Spotify", "YouTube", "Netflix", "Prime Video"].includes(app.name) || app.name.startsWith("HDMI") ? "large-logo" : ""}`}>
                    <AppLogo name={app.name} />
                  </span>
                )}
                {app.name === "Help" && <img className="help-blood-frame" src="/wallpaper/bloodFrame.png" alt="" />}
                </span>
                {selected === index && !app.gameGroup && <span className="app-start">{app.name === "Help" ? "@yanis26x" : "Start"}<img className="app-start-disc" src={app.name === "Help" ? "/icon/playstation3.png" : "/icon/cd.png"} alt="" /></span>}
                {selected === index && app.gameGroup && <span className="app-start game-group-open" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 9 7 7 7-7" /></svg></span>}
              </span>

            </button>
          ))}
        </div>
        <div className="selected-app-title" aria-live="polite">
            <div className="app-heading">
              <h1>{apps[selected].name === "Help" ? <img className="app-heading-logo blood-title-logo" src="/icon/BLOOD-plus.PNG" alt="BLOOD-plus" /> : apps[selected].name === "Netflix" ? <img className="app-heading-logo netflix-title-logo" src="/icon/Netflix.png" alt="Netflix" /> : apps[selected].name}</h1>
            </div>
        </div>
        <div className={`selected-app-details ${apps[selected].name === "addicted" ? "photo-gallery-details" : ""}`}>
          {apps[selected].gameGroup ? (
            <div id="game-library" className="folder-app-row game-library-row" role="group" aria-label="Games">
              {games.map((game, index) => (
                <figure className="game-library-item" key={game.name}>
                  <button
                    type="button"
                    className={`app game-library-card ${selectedGame === index ? "selected" : ""}`}
                    ref={element => { gameButtonsRef.current[index] = element; }}
                    aria-label={`${game.name}, locked`}
                    aria-disabled="true"
                    data-focusable-disabled="true"
                    onFocus={() => { setFolderExpanded(true); setSelectedGame(index); }}
                    onMouseMove={event => {
                      if (document.activeElement !== event.currentTarget) event.currentTarget.focus({ preventScroll: true });
                    }}
                    onClick={event => event.preventDefault()}
                  >
                    <span className="app-tile">
                      <span className="app-artwork"><img className="app-image" src={game.image} alt="" /></span>
                      {folderExpanded && <span className="app-start game-title-bar"><span className="game-title-text">{game.name}</span>
                        <svg className="app-start-disc game-lock" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15" r="1" /></svg>
                      </span>}
                    </span>
                  </button>
                </figure>
              ))}
            </div>
          ) : apps[selected].name === "addicted" ? (
            <div id="photo-gallery" className="folder-app-row photo-gallery-row" role="group" aria-label="Galerie photos">
              {personalPhotos.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  ref={element => { photoButtonsRef.current[index] = element; }}
                  className="photo-thumbnail"
                  onFocus={() => setFolderExpanded(true)}
                  onMouseMove={event => {
                    if (document.activeElement !== event.currentTarget) event.currentTarget.focus({ preventScroll: true });
                  }}
                  onClick={() => { setPhotoIndex(index); setGalleryOpen(true); }}
                  aria-label={`Ouvrir la photo ${index + 1} en plein écran`}
                  aria-haspopup="dialog"
                >
                  <img src={src} alt={`Photo ${index + 1}`} />
                </button>
              ))}
            </div>
          ) : (
            <div aria-live="polite">
              <p className="app-summary">{appDetails[apps[selected].name][1]}</p>
            </div>
          )}
        </div>
      </section>

      {page === "settings" && (
        <section className="settings-page" aria-labelledby="settings-title">
          <div className="settings-layout">
            <div className="settings-controls">
              <fieldset className="settings-option">
                <legend id="option-radius">Card corners</legend>
                <div className="radius-options">
                  {[[0, "Square"], [12, "Rounded"]].map(([radius, label]) => (
                    <label key={radius}>
                      <input type="radio" name="card-radius" value={radius} checked={cardRadius === radius} onChange={() => setCardRadius(radius)} />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="settings-option">
                <legend id="option-effect">Selection style</legend>
                <div className="radius-options">
                  {[["none", "None"], ["outline", "Outline"], ["glow", "Blue glow"], ["neon", "Neon blue"], ["neon-pink", "Neon pink"]].map(([effect, label]) => (
                    <label key={effect}>
                      <input type="radio" name="selection-effect" value={effect} checked={selectionEffect === effect} onChange={() => setSelectionEffect(effect)} />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="settings-option">
                <legend id="option-transparency">Transparency</legend>
                <label className="settings-toggle">
                  <input type="checkbox" checked={transparentCards} onChange={event => setTransparentCards(event.target.checked)} />
                  Transparent, blurred cards
                </label>
              </fieldset>
              <fieldset className="settings-option">
                <legend id="option-wallpaper">Wallpaper</legend>
                <button type="button" className="settings-wallpaper" onClick={() => setWallpaperIndex(value => (value + 1) % wallpapers.length)}>
                  <span className="settings-wallpaper-thumb" style={{ backgroundImage: `url("${wallpapers[wallpaperIndex]}")` }} aria-hidden="true" />
                  <span>Change wallpaper <small>{wallpaperIndex + 1} / {wallpapers.length}</small></span>
                  <span aria-hidden="true">→</span>
                </button>
              </fieldset>
              <fieldset className="settings-option glass-customization">
                <legend>Transparency &amp; blur · All apps</legend>
                <div className="glass-slider-row">
                  <label htmlFor="app-transparency">Transparency</label>
                  <input id="app-transparency" type="range" min="0" max="100" step="5" value={sharedGlass.transparency} onChange={event => updateGlassSetting("transparency", Number(event.target.value))} onKeyDown={event => handleGlassSliderKey(event, "transparency")} />
                  <output htmlFor="app-transparency">{sharedGlass.transparency}%</output>
                </div>
                <div className="glass-slider-row">
                  <label htmlFor="app-blur">Blur</label>
                  <input id="app-blur" type="range" min="0" max="40" step="1" value={sharedGlass.blur} onChange={event => updateGlassSetting("blur", Number(event.target.value))} onKeyDown={event => handleGlassSliderKey(event, "blur")} />
                  <output htmlFor="app-blur">{sharedGlass.blur} px</output>
                </div>
              </fieldset>
              <div className="settings-bottom-actions">
                <button type="button" className="settings-back" onClick={replayIntro}>Replay intro</button>
              </div>
            </div>
            <aside className="settings-preview-panel" aria-label="Spotify and Blood card previews">
              <div className="settings-preview-cards">
                {["Spotify", "Blood"].map(name => (
                  <figure key={name} className="settings-preview-item" aria-label={name} style={name === "Blood" ? glassStyle("YouTube") : undefined}>
                    <div className={`app selected ${name === "Blood" ? "branded-card" : "spotify-card"} ${transparentCards ? "glass-card" : ""}`}>
                      <div className="app-tile">
                        <span className="app-artwork" style={{ background: "#000" }}>
                          {name === "Blood" ? <BrandedAppArtwork name="Blood" /> : <span className="app-logo large-logo"><AppLogo name="Spotify" /></span>}
                        </span>
                        <span className="app-start">Start<img className="app-start-disc" src="/icon/cd.png" alt="" /></span>
                      </div>
                    </div>
                  </figure>
                ))}
              </div>
            </aside>
          </div>
        </section>
      )}


      <footer className={`bottom-bar inactivity-footer ${showFooter ? "is-visible" : ""}`} aria-hidden={!showFooter}>
        <strong className="copyright">© 2026 yanis26x · all rights reserved</strong>
        <div className="navigation-hints">
          <span className="navigation-hint"><img className="select-icon" src="/icon/X.svg" alt="" />Select</span>
          <span className="navigation-hint"><img className="select-icon" src="/icon/circle.svg" alt="" />Return</span>
        </div>
      </footer>
      {apiResult && (
        <pre
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            right: 20,
            zIndex: 99999,
            padding: 24,
            background: "#101827",
            color: "#fff",
            fontSize: 20,
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
          }}
        >
          {apiResult}
        </pre>
      )}
    </main>
    {galleryOpen && (
      <div className="photo-viewer" role="dialog" aria-modal="true" aria-label={`Photo ${photoIndex + 1} sur ${personalPhotos.length}`}>
        <img src={personalPhotos[photoIndex]} alt={`Photo ${photoIndex + 1}`} />
        <button ref={photoCloseRef} type="button" className="photo-viewer-close" onClick={() => setGalleryOpen(false)} aria-label="Fermer la photo">×</button>
      </div>
    )}
    <audio ref={introAudioRef} src="/SFX/evil_laugh4.mp3" preload="auto" />
    {introActive && (
      <section className="startup-warning" role="alert" aria-labelledby="intro-warning-title">
        {introStage !== "ja" && (
          <header className="english-warning-banner" lang="en">
            <img className="english-banner-pentagram" src="/icon/pentagram.png" alt="" />
          </header>
        )}
        <div className={`gc-warning-screen jp-warning-screen ${introStage !== "ja" ? "en-warning-screen" : ""}`} lang={introStage === "ja" ? "ja" : "en"}>
          {introStage === "ja" ? (
            <>
              <h1 id="intro-warning-title" className="gc-warning-title">
                <svg viewBox="0 0 60 56" aria-hidden="true"><path d="M30 2 58 54H2z" fill="#ffe33b" /><path d="M30 17v19" stroke="#171406" strokeWidth="6" strokeLinecap="round" /><circle cx="30" cy="45" r="3" fill="#171406" /></svg>
                <span><ruby>警告<rt>けいこく</rt></ruby> - <ruby>健康<rt>けんこう</rt></ruby>と<ruby>安全<rt>あんぜん</rt></ruby>のために</span>
              </h1>
              <div className="gc-warning-body">
                <p>
                  ご<ruby>使用<rt>しよう</rt></ruby>の<ruby>前<rt>まえ</rt></ruby>に<ruby>取扱説明書<rt>とりあつかいせつめいしょ</rt></ruby>の「<ruby>安全<rt>あんぜん</rt></ruby>に<ruby>使用<rt>しよう</rt></ruby>し<br />
                  ていただくために…」をお<ruby>読<rt>よ</rt></ruby>みください。
                </p>
                <p>
                  ここには、あなたの<ruby>健康<rt>けんこう</rt></ruby>と<ruby>安全<rt>あんぜん</rt></ruby>のための<br />
                  <ruby>大切<rt>たいせつ</rt></ruby>な<ruby>内容<rt>ないよう</rt></ruby>が<ruby>書<rt>か</rt></ruby>かれています。
                </p>
              </div>
              <div className="gc-warning-information">
                <p>この<ruby>内容<rt>ないよう</rt></ruby>はホームページでも<ruby>見<rt>み</rt></ruby>ることができます。</p>
                <span>https://soundcloud.com/ca-hed-cobraz/mantra-good-i-casted-so-many</span>
                <p className="intro-japanese-message">私はもうすぐ死ぬ。それは分かっている。</p>
              </div>
            </>
          ) : (
            <>
              <div className="english-warning-content">
                <h1 id="intro-warning-title" className="gc-warning-title"><span>WARNING</span><img className="warning-blood-logo" src="/icon/bloodPlusWhite.png" alt="Blood Plus" /></h1>
                <div className="gc-warning-body">
                  <p className="firmware-device-note">Developed using a <strong>Hisense 50A6KV.</strong> Compatibility with other devices and firmware versions has not been verified.</p>
                  <div className="firmware-danger">
                    <span className="firmware-danger-label">SYSTEM INTEGRITY AT RISK</span>
                    <p>Modifying firmware, flashing incompatible files or interrupting an update can corrupt the system and <strong>BRICK YOUR TV.</strong></p>
                    <p>Your screen may never turn on again. A factory reset may not restore it. Recovery may require professional repair.</p>
                  </div>
                  <p className="firmware-final-warning">Use this app at your own risk.<br /><strong>If you can see this message, it’s already too late.</strong></p>
                </div>
                <div className="gc-warning-information">
                  <p className="firmware-scar">Scar doesn’t disappear.</p>
                  <p>To get help, visit:</p>
                  <span>https://soundcloud.com/ca-hed-cobraz/mantra-good-i-casted-so-many</span>
                </div>
              </div>
            </>
          )}
        </div>
        <button ref={introSkipRef} type="button" className="intro-skip" lang="en" onClick={() => setIntroActive(false)}>SKIP</button>
      </section>
    )}
    </>
  );
}
