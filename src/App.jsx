
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import { alignAppRow, focusElement, getFocusTargets, getRemoteKey, findSpatialTarget } from "./spatialNavigation.js";

const initialApps = [
  { name: "addicted", description: "Media Gallery", image: "/addicted.webp", decorative: true },
  { name: "PS5", description: "PlayStation", image: "/playstation.jpg", id: "ps5" },
  { name: "YouTube", description: "YouTube", color: "#ffffff", id: "youtube" },
  { name: "Netflix", description: "Netflix", color: "#171717", id: "netflix" },
  { name: "HDMI 1", description: "HDMi1", color: "#0866bc", id: "hdmi1" },
  { name: "HDMI 2", description: "HDMi2", color: "#0866bc", id: "hdmi2" },
  { name: "Prime Video", description: "Amazon Prime Video", color: "#0866bc", id: "prime" },
  { name: "Spotify", description: "Spotify", color: "#000000", id: null },
  { name: "Applications", color: "#17376d", group: true },
  { name: "Help", image: "/CestTriste.jpg", decorative: true },
];

const groupedApps = [
  { name: "Settings", action: "settings", color: "#183c68", accent: "#81d4ff", description: "Personnaliser" },
  { name: "TEST", action: "test", color: "#30224e", accent: "#c4a4ff", description: "VIDAA API" },
  { name: "Revoir l’intro", action: "intro", color: "#4a202b", accent: "#ff9bad", description: "10 secondes" },
];

const appDetails = {
  addicted: ["Media Gallery", "Explore personal photos in a slideshow format."],
  PS5: ["HDMI 3", "Dont forget to always buuy your games physically, or else you will not own them"],
  YouTube: ["Videos", "Watch your favorite videos on YouTube."],
  Netflix: ["Streaming service", "Discover movies and series on Netflix."],
  "HDMI 1": [" HDMI 1", "Display content from the device connected to HDMI 1."],
  "HDMI 2": ["HDMI 2", "Display content from the device connected to HDMI 2."],
  "Prime Video": ["Streaming service", "Use the Amazon Prime Video app to watch movies and series."],
  Spotify: ["Music Streaming", "Listen to your favorite music and podcasts.."],
  Help: ["Help", "Use the arrows to select an application and OK to launch it."],
};

function GroupActionIcon({ action }) {
  if (action === "test") return <span className="group-test-icon" aria-hidden="true">⛧</span>;
  if (action === "settings") return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 3-.6 2.2-1.3.8-2.2-.6-2.5 4.2 1.6 1.6v1.6l-1.6 1.6L5.4 19l2.2-.6 1.3.8.6 2.2h5l.6-2.2 1.3-.8 2.2.6 2.5-4.2-1.6-1.6v-1.6l1.6-1.6-2.5-4.2-2.2.6-1.3-.8L14.5 3z" /><circle cx="12" cy="12" r="3.5" /></svg>
  );
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9a8 8 0 1 1 0 6M4 3v6h6" /><path d="m10 8 6 4-6 4z" fill="currentColor" stroke="none" /></svg>;
}

function AppLogo({ name, transparent = false }) {
  if (name === "Applications") return (
    <span className="folder-preview" aria-hidden="true">
      {groupedApps.map(app => (
        <span key={app.name} style={{ background: app.color, color: app.accent }}><GroupActionIcon action={app.action} /></span>
      ))}
    </span>
  );
  if (name === "Prime Video") return <img className="app-logo-image prime-blue-logo" src="/icon/prime.svg" alt="" />;
  if (name === "YouTube") {
    return (
      <img className="youtube-logo" src={transparent ? "/icon/ytbWhite.png" : "/icon/Youtube-Logo.png"} alt="" />
    );
  }

  if (name === "Netflix") {
    return <img className="app-logo-image" src="/icon/Netflix.png" alt="" />;
  }

  if (name === "Spotify") {
    return <img className="app-logo-image" src="/icon/spotify.svg" alt="" />;
  }

  if (name.startsWith("HDMI")) {
    return <img className="app-logo-image hdmi-logo" src={name === "HDMI 2" ? "/icon/DisplayPort.svg" : "/icon/HDMI.svg"} alt="" />;
  }

  return null;
}

const personalPhotos = ["/addicted.webp", "/242.g.jpeg", "/CestTriste.jpg"];

const wallpapers = ["/PS5background.JPG", "/frutigeraero8.jpg", "/KH-blackLockscreen.jpg", "/wallpaper/PS3.jpeg", "/wallpaper/frutigeraero3.jpg", "/wallpaper/playbackDark.jpeg", "/wallpaper/playback.png"];

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
  const introAudioRef = useRef(null);

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
    const timer = setTimeout(() => setIntroActive(false), 10000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", playAudio, true);
      window.removeEventListener("pointerdown", playAudio, true);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [introActive]);

  function replayIntro() {
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
      return ["outline", "glow", "thick"].includes(saved) ? saved : "outline";
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
  const [whiteLogos, setWhiteLogos] = useState(() => {
    try { return localStorage.getItem("vidaa-white-logos") === "true"; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem("vidaa-white-logos", String(whiteLogos)); } catch { /* Storage may be unavailable on TV. */ }
  }, [whiteLogos]);
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
  const folderButtonsRef = useRef([]);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [selected, setSelected] = useState(0);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [clock, setClock] = useState("");
  const buttonsRef = useRef([]);
  const lastNavigationRef = useRef(0);
  const launcherRef = useRef(null);
  const remoteModeRef = useRef(true);
  const lastFocusRef = useRef(null);
  const rowRef = useRef(null);

  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const update = () => {
      const lastTile = buttonsRef.current[apps.length - 1];
      if (!lastTile || selected === apps.length - 1) {
        setCanScrollRight(false);
        return;
      }
      const rowBounds = row.getBoundingClientRect();
      const lastBounds = lastTile.getBoundingClientRect();
      setCanScrollRight(lastBounds.right > Math.min(rowBounds.right, window.innerWidth) + 2);
    };
    update();
    row.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    observer?.observe(row);
    return () => {
      row.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [selected, apps]);

  useEffect(() => {
    if (!galleryOpen) return;
    function closeGallery(event) {
      setGalleryOpen(false);
      if (event.type === "keydown" || event.type === "pointerdown") {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }
    const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"];
    events.forEach(name => window.addEventListener(name, closeGallery, { capture: true, passive: false }));
    return () => events.forEach(name => window.removeEventListener(name, closeGallery, true));
  }, [galleryOpen]);

  useEffect(() => {
    if (!galleryOpen) return;
    const interval = setInterval(() => setPhotoIndex(value => (value + 1) % personalPhotos.length), 10000);
    return () => clearInterval(interval);
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
      if (key === "ArrowUp" && current.closest(".folder-app-row")) {
        focusElement(buttonsRef.current[selected]);
        return;
      }
      const next = findSpatialTarget(current, targets, key);
      if (next) focusElement(next);
    }
    function pointerMode() {
      remoteModeRef.current = false;
      delete root.dataset.remote;
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
    if (app.group) {
      setFolderExpanded(true);
      focusElement(folderButtonsRef.current[0]);
      return;
    }
    if (app.name === "addicted") {
      setPhotoIndex(0);
      setGalleryOpen(true);
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
    <main inert={introActive ? true : undefined} aria-hidden={introActive ? true : undefined} ref={launcherRef} className={`launcher ${whiteLogos ? "white-logos" : ""} selection-${selectionEffect} ${galleryOpen ? "gallery-open" : ""} ${folderExpanded && apps[selected].group && page === "home" ? "folder-expanded" : ""}`} style={{ "--wallpaper": `url("${wallpapers[wallpaperIndex]}")`, "--card-radius": `${cardRadius}px` }}>
      <div className="background-shade" />



      <header className="topbar">
        <div className="app-description brand"><img src="/icon/playstation3.png" alt="" /><span>Hisense26x</span></div>
        <div className="topbar-right">
          <nav className="main-sections" aria-label="Outils du launcher">
            <button type="button" onClick={testVidaaAPI} aria-label="Test VIDAA API" title="Test VIDAA API">
              <span className="test-api-symbol" aria-hidden="true">⛧</span>
            </button>
            <button type="button" aria-current={page === "settings" ? "page" : undefined} onClick={() => setPage("settings")} aria-label="Settings" title="Settings">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 3-.6 2.2-1.3.8-2.2-.6-2.5 4.2 1.6 1.6v1.6l-1.6 1.6L5.4 19l2.2-.6 1.3.8.6 2.2h5l.6-2.2 1.3-.8 2.2.6 2.5-4.2-1.6-1.6v-1.6l1.6-1.6-2.5-4.2-2.2.6-1.3-.8L14.5 3z" /><circle cx="12" cy="12" r="3.5" /></svg>
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
              ref={el => { buttonsRef.current[index] = el; }}
              className={`app ${selected === index ? "selected" : ""} ${["addicted", "PS5", "Help"].includes(app.name) ? "original-card" : transparentCards ? "glass-card" : ""}`}
              onMouseMove={() => {
                if (selected !== index) {
                  setSelected(index);
                  buttonsRef.current[index]?.focus({ preventScroll: true });
                }
              }}
              onFocus={() => setSelected(index)}
              onClick={() => launch(app)}
              aria-label={app.name}
              aria-expanded={app.group ? folderExpanded : undefined}
              aria-controls={app.group && apps[selected].group ? "folder-apps" : undefined}
            >
              <span
                className="app-tile"
                style={{ background: app.color || "#111" }}
              >
                <span className="app-artwork">
                {app.image ? (
                  <img className="app-image" src={app.image} alt="" />
                ) : (
                  <span className={`app-logo ${["Spotify", "YouTube", "Netflix", "Prime Video"].includes(app.name) || app.name.startsWith("HDMI") ? "large-logo" : ""}`}>
                    <AppLogo name={app.name} transparent={transparentCards} />
                  </span>
                )}
                {app.name === "Help" && <img className="help-blood-frame" src="/wallpaper/bloodFrame.png" alt="" />}
                </span>
                {selected === index && <span className="app-start">Start</span>}
              </span>

            </button>
          ))}
        </div>
        {canScrollRight && (
          <button className="more-apps-arrow" type="button" aria-label="Voir les applications à droite" onClick={() => setSelected(value => Math.min(value + 1, apps.length - 1))}>›</button>
        )}
        <div className="selected-app-title" aria-live="polite">
            <div className="app-heading">
              <h1>{apps[selected].name}</h1>
            </div>
        </div>
        <div className="selected-app-details">
          {apps[selected].group ? (
            <div id="folder-apps" className="folder-app-row" role="group" aria-label="Applications du groupe">
              {groupedApps.map((app, index) => (
                <button
                  type="button"
                  key={app.name}
                  ref={element => { folderButtonsRef.current[index] = element; }}
                  className="folder-subapp"
                  style={{ "--action-color": app.color, "--action-accent": app.accent }}
                  onFocus={() => setFolderExpanded(true)}
                  onMouseMove={event => {
                    if (document.activeElement !== event.currentTarget) event.currentTarget.focus({ preventScroll: true });
                  }}
                  onClick={() => {
                    if (app.action === "settings") setPage("settings");
                    else if (app.action === "test") testVidaaAPI();
                    else replayIntro();
                  }}
                  aria-label={app.name}
                >
                  <span className="folder-subapp-art">
                    <GroupActionIcon action={app.action} />
                  </span>
                  <span className="folder-subapp-name">{app.name}</span>
                  <span className="folder-subapp-description">{app.description}</span>
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
          <div>
            <h1 id="settings-title">Settings</h1>
            <p>Personnalisez le style de vos cartes.</p>
            <fieldset>
              <legend>Arrondi des cartes</legend>
              <div className="radius-options">
                {[[0, "Carré"], [12, "Léger"]].map(([radius, label]) => (
                  <label key={radius}>
                    <input type="radio" name="card-radius" value={radius} checked={cardRadius === radius} onChange={() => setCardRadius(radius)} />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Effet de sélection</legend>
              <div className="radius-options">
                {[["outline", "Contour blanc"], ["glow", "Halo bleu"], ["thick", "Gros contour"]].map(([effect, label]) => (
                  <label key={effect}>
                    <input type="radio" name="selection-effect" value={effect} checked={selectionEffect === effect} onChange={() => setSelectionEffect(effect)} />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Fond des cartes</legend>
              <label className="white-logos-option">
                <input type="checkbox" checked={transparentCards} onChange={event => setTransparentCards(event.target.checked)} />
                Tout rendre transparent et flouté
              </label>
            </fieldset>

            <fieldset>
              <legend>Couleur des logos</legend>
              <label className="white-logos-option">
                <input type="checkbox" checked={whiteLogos} onChange={event => setWhiteLogos(event.target.checked)} />
                Afficher les logos en blanc
              </label>
            </fieldset>
            <fieldset>
              <legend>Fond d’écran</legend>
              <div className="detail-actions">
            <button type="button" className="wallpaper-action" onClick={() => setWallpaperIndex(value => (value + 1) % wallpapers.length)}><svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="4" width="26" height="24" rx="1" /><circle cx="10" cy="11" r="2" fill="currentColor" stroke="none" /><path d="m5 25 8-9 5 5 5-7 6 11" fill="currentColor" stroke="none" /></svg>Wallpaper</button>
              </div>
            </fieldset>
            <p className="settings-note">Le réglage est enregistré automatiquement.</p>
            <div className="intro-replay-actions">
              <button type="button" className="settings-back" onClick={replayIntro}>Revoir l’introduction · 10 secondes</button>
            </div>
            <button type="button" className="settings-back" onClick={() => setPage("home")}>← Retour à Home</button>
          </div>
          <div className={`settings-preview app selected ${transparentCards ? "glass-card" : ""}`}>
            <div className="app-tile" style={{ background: "#0866bc" }}><span className="app-logo large-logo"><AppLogo name="HDMI 1" /></span></div>
            <span>Aperçu · HDMI 1</span>
          </div>
        </section>
      )}


      {galleryOpen && (
        <div className="personal-slideshow">
          <img src={personalPhotos[photoIndex]} alt="" />
        </div>
      )}

      <footer className={`bottom-bar inactivity-footer ${showFooter ? "is-visible" : ""}`} aria-hidden={!showFooter}>
        <strong className="copyright">© 2026 yanis26x · all rights reserved</strong>
        <div className="navigation-hints">
          <span className="navigation-hint"><img className="select-icon" src="/icon/X.svg" alt="" />Select</span>
          <span className="navigation-hint"><span className="navigate-symbol" aria-hidden="true">◀ ▶</span>Navigate</span>
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
    <audio ref={introAudioRef} src="/SFX/evil_laugh4.mp3" preload="auto" />
    {introActive && (
      <section className="startup-warning" role="alert" aria-label="Introduction HISENS26x">
        <img src="/icon/BLOOD-plus.PNG" alt="BLOOD-plus" />
        <p>
          this app was made by using a Hisense 50A6KV. using Hisens26x on anything else may lead your device being blocked and unusable forever. Be carfull. anywhays its to late....
        </p>
        <strong className={`startup-warning-copyright inactivity-footer ${showFooter ? "is-visible" : ""}`} aria-hidden={!showFooter}>© 2026 yanis26x · all rights reserved</strong>
      </section>
    )}
    </>
  );
}
