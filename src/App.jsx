
import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const initialApps = [
  { name: "addicted", description: "Media Gallery", image: "/addicted.webp", decorative: true },
  { name: "PS5", description: "PlayStation", image: "/playstation.jpg", id: "ps5" },
  { name: "YouTube", description: "YouTube", color: "#ffffff", id: "youtube" },
  { name: "Netflix", description: "Netflix", color: "#171717", id: "netflix" },
  { name: "HDMI 1", description: "HDMi1", color: "#0866bc", id: "hdmi1" },
  { name: "HDMI 2", description: "HDMi2", color: "#0866bc", id: "hdmi2" },
  { name: "Prime Video", description: "Amazon Prime Video", color: "#0866bc", id: "prime" },
  { name: "Spotify", description: "Spotify", color: "#000000", id: null },
  { name: "Help", image: "/CestTriste.jpg", decorative: true },
];

const titleLogos = {
  addicted: "/icon/BLOOD-plus.PNG",
  PS5: "/icon/sony.png",
  Netflix: "/icon/Netflix.png",
  YouTube: "/icon/ytbWhite.png",
  "Prime Video": "/icon/prime.svg",
  "HDMI 1": "/icon/HDMI.svg",
  "HDMI 2": "/icon/DisplayPort.svg",
  Spotify: "/icon/spotify.svg",
};

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

function AppLogo({ name, transparent = false }) {
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

export default function App() {
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

  const [apps, setApps] = useState(initialApps);
  const [moving, setMoving] = useState(false);
  const moveSnapshotRef = useRef(null);

  const [idle, setIdle] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const idleRef = useRef(false);
  const [selected, setSelected] = useState(0);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [ambient, setAmbient] = useState(false);
  const [clock, setClock] = useState("");
  const buttonsRef = useRef([]);
  const lastNavigationRef = useRef(0);
  const pointerSelectionRef = useRef(false);
  const rowRef = useRef(null);
  const edgeScrollRef = useRef(0);

  function startMove() {
    moveSnapshotRef.current = { apps, selected };
    setMoving(true);
    buttonsRef.current[selected]?.focus();
  }

  const moveApp = useCallback((direction) => {
    const target = selected + direction;
    if (target < 0 || target >= apps.length) return;
    const next = [...apps];
    const [app] = next.splice(selected, 1);
    next.splice(target, 0, app);
    setApps(next);
    setSelected(target);
  }, [apps, selected]);

  const cancelMove = useCallback(() => {
    if (moveSnapshotRef.current) {
      setApps(moveSnapshotRef.current.apps);
      setSelected(moveSnapshotRef.current.selected);
    }
    setMoving(false);
  }, []);


  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let frame;
    let previousTime;
    function tick(time) {
      const elapsed = previousTime === undefined ? 0 : Math.min(time - previousTime, 50);
      previousTime = time;
      row.scrollLeft += edgeScrollRef.current * elapsed * 0.16;
      const atEnd = edgeScrollRef.current > 0
        ? row.scrollLeft >= row.scrollWidth - row.clientWidth - 1
        : row.scrollLeft <= 0;
      if (edgeScrollRef.current && !atEnd) frame = requestAnimationFrame(tick);
      else { frame = undefined; previousTime = undefined; }
    }
    function move(event) {
      const bounds = row.getBoundingClientRect();
      const edge = 85;
      edgeScrollRef.current = event.clientX < bounds.left + edge ? -1 : event.clientX > bounds.right - edge ? 1 : 0;
      if (edgeScrollRef.current && frame === undefined) frame = requestAnimationFrame(tick);
    }
    function stop() {
      edgeScrollRef.current = 0;
      cancelAnimationFrame(frame);
      frame = undefined;
      previousTime = undefined;
    }
    row.addEventListener("pointermove", move, { passive: true });
    row.addEventListener("pointerleave", stop);
    window.addEventListener("keydown", stop);
    window.addEventListener("blur", stop);
    return () => {
      stop();
      row.removeEventListener("pointermove", move);
      row.removeEventListener("pointerleave", stop);
      window.removeEventListener("keydown", stop);
      window.removeEventListener("blur", stop);
    };
  }, []);
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
    let timer;
    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!idleRef.current) setAmbient(true);
      }, 60000);
    }
    function wake(event) {
      setAmbient(false);
      resetTimer();
      if (idleRef.current) {
        idleRef.current = false;
        setIdle(false);
        if (event.type === "keydown" || event.type === "pointerdown") {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      }
    }
    const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"];
    events.forEach(name => window.addEventListener(name, wake, { capture: true, passive: false }));
    resetTimer();
    return () => {
      clearTimeout(timer);
      events.forEach(name => window.removeEventListener(name, wake, true));
    };
  }, []);

  useEffect(() => {
    if (!idle) return;
    const interval = setInterval(() => setPhotoIndex(value => (value + 1) % personalPhotos.length), 10000);
    return () => clearInterval(interval);
  }, [idle]);

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
    function handleKey(event) {
      if (page === "settings") {
        if (event.key === "Escape" || event.key === "Backspace") {
          event.preventDefault();
          setPage("home");
        }
        return;
      }
      if (moving) {
        if (["ArrowLeft", "ArrowRight", "Enter", "Escape", "Backspace"].includes(event.key)) {
          event.preventDefault();
          if (event.key === "Enter") setMoving(false);
          else if (event.key === "Escape" || event.key === "Backspace") cancelMove();
          else {
            const now = performance.now();
            if (now - lastNavigationRef.current < 250) return;
            lastNavigationRef.current = now;
            moveApp(event.key === "ArrowRight" ? 1 : -1);
          }
        }
        return;
      }
      if (event.target.closest?.(".detail-actions, .main-sections")) return;
      if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        const now = performance.now();
        if (now - lastNavigationRef.current < 250) return;
        lastNavigationRef.current = now;
        if (event.key === "ArrowRight") setSelected(value => Math.min(value + 1, apps.length - 1));
        if (event.key === "ArrowLeft") setSelected(value => Math.max(value - 1, 0));
      }

      if (event.key === "Escape" || event.key === "Backspace") {
        event.preventDefault();
        setSelected(1);
        buttonsRef.current[selected]?.blur();
      }

      if (event.key === "Enter") {
        event.preventDefault();
        buttonsRef.current[selected]?.click();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, moving, apps, moveApp, cancelMove, page]);

  useEffect(() => {
    if (pointerSelectionRef.current) {
      pointerSelectionRef.current = false;
      return;
    }
    buttonsRef.current[selected]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "auto",
    });
  }, [selected]);

  async function launch(app) {
    if (app.name === "addicted") {
      setPhotoIndex(0);
      idleRef.current = true;
      setIdle(true);
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
    <main className={`launcher ${whiteLogos ? "white-logos" : ""} selection-${selectionEffect} ${ambient ? "ambient-mode" : ""} ${idle ? "idle-mode" : ""}`} style={{ "--wallpaper": `url("${wallpapers[wallpaperIndex]}")`, "--card-radius": `${cardRadius}px` }}>
      <div className="background-shade" />



      <header className="topbar">
        <div className="app-description brand"><img src="/icon/playstation3.png" alt="" /><span>Hisense26x</span></div>
        <nav className="main-sections" aria-label="Sections principales">
          <button type="button" aria-current={page === "home" ? "page" : undefined} onClick={() => setPage("home")}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9" /></svg>Home
          </button>
          <button type="button" aria-current={page === "settings" ? "page" : undefined} onClick={() => { setMoving(false); setPage("settings"); }}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3v18M12 3v18M20 3v18" /><rect x="1" y="7" width="6" height="4" rx="1" fill="currentColor" stroke="none" /><rect x="9" y="14" width="6" height="4" rx="1" fill="currentColor" stroke="none" /><rect x="17" y="5" width="6" height="4" rx="1" fill="currentColor" stroke="none" /></svg>Settings
          </button>
        </nav>
        <div className="topbar-right">
          <span className="profile-avatar-wrap">
            <img className="profile-avatar" src="/242.g.jpeg" alt="Photo de profil de yanis26x" />
            <span className="online-status" role="img" aria-label="En ligne" title="En ligne" />
          </span>
          <span className="profile-name">yanis26x</span>
          <span className="topbar-clock">{clock}</span>
        </div>
      </header>

      <section className="apps" aria-label="Applications et entrées HDMI" hidden={page !== "home"}>
        <div ref={rowRef} className="app-row">
          {apps.map((app, index) => (
            <button
              key={app.name}
              ref={el => { buttonsRef.current[index] = el; }}
              className={`app ${selected === index ? "selected" : ""} ${moving && selected === index ? "moving" : ""} ${["addicted", "PS5", "Help"].includes(app.name) ? "original-card" : transparentCards ? "glass-card" : ""}`}
              onMouseEnter={() => {
                if (!moving && selected !== index) {
                  pointerSelectionRef.current = true;
                  setSelected(index);
                }
              }}
              onFocus={() => { if (!moving) setSelected(index); }}
              onClick={() => { if (!moving) launch(app); }}
              aria-label={app.name}
            >
              <span
                className="app-tile"
                style={{ background: app.color || "#111" }}
              >
                {app.image ? (
                  <img className="app-image" src={app.image} alt="" />
                ) : (
                  <span className={`app-logo ${["Spotify", "YouTube", "Netflix", "Prime Video"].includes(app.name) || app.name.startsWith("HDMI") ? "large-logo" : ""}`}>
                    <AppLogo name={app.name} transparent={transparentCards} />
                  </span>
                )}
                {app.name === "Help" && <img className="help-blood-frame" src="/wallpaper/bloodFrame.png" alt="" />}
              </span>

            </button>
          ))}
        </div>
        {canScrollRight && (
          <button className="more-apps-arrow" type="button" aria-label="Voir les applications à droite" onClick={() => setSelected(value => Math.min(value + 1, apps.length - 1))}>›</button>
        )}
        <div className="selected-app-details">
          <div aria-live="polite">
            <div className="app-heading">
              <h1>
                {titleLogos[apps[selected].name]
                  ? <img className={`app-heading-logo ${apps[selected].name.startsWith("HDMI") ? "hdmi-logo" : ""} ${apps[selected].name === "PS5" ? "sony-title-logo" : ""} ${apps[selected].name === "addicted" ? "blood-title-logo" : ""}`} src={titleLogos[apps[selected].name]} alt={apps[selected].name} />
                  : apps[selected].name}
              </h1>
            </div>
            <p className="app-summary">{appDetails[apps[selected].name][1]}</p>
          </div>

          <div className="detail-actions">
            <button type="button" className="wallpaper-action" onClick={() => setWallpaperIndex(value => (value + 1) % wallpapers.length)}><svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="4" width="26" height="24" rx="1" /><circle cx="10" cy="11" r="2" fill="currentColor" stroke="none" /><path d="m5 25 8-9 5 5 5-7 6 11" fill="currentColor" stroke="none" /></svg>Wallpaper</button>
            <button type="button" className="move-action" aria-pressed={moving} onClick={() => moving ? setMoving(false) : startMove()}><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3v26M3 16h26M11 8l5-5 5 5M11 24l5 5 5-5M8 11l-5 5 5 5M24 11l5 5-5 5" /></svg>{moving ? "DONE" : "MOVE"}</button>
            {moving && <>
              <button type="button" aria-label="Déplacer à gauche" disabled={selected === 0} onClick={() => moveApp(-1)}>←</button>
              <button type="button" aria-label="Déplacer à droite" disabled={selected === apps.length - 1} onClick={() => moveApp(1)}>→</button>
              <button type="button" onClick={cancelMove}>Annuler</button>
            </>}
          </div>
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
            <p className="settings-note">Le réglage est enregistré automatiquement.</p>
            <button type="button" className="settings-back" onClick={() => setPage("home")}>← Retour à Home</button>
          </div>
          <div className={`settings-preview app selected ${transparentCards ? "glass-card" : ""}`}>
            <div className="app-tile" style={{ background: "#0866bc" }}><span className="app-logo large-logo"><AppLogo name="HDMI 1" /></span></div>
            <span>Aperçu · HDMI 1</span>
          </div>
        </section>
      )}


      {idle && (
        <div className="personal-slideshow">
          <img src={personalPhotos[photoIndex]} alt="" />
        </div>
      )}

      <footer className="bottom-bar">
        <strong className="copyright">© 2026 yanis26x · all rights reserved</strong>
        <div className="navigation-hints">
          <span className="navigation-hint"><img className="select-icon" src="/icon/cd.png" alt="" />Select</span>
          <span className="navigation-hint"><span className="navigate-symbol" aria-hidden="true">◀ ▶</span>Navigate</span>
        </div>
      </footer>
    </main>
  );
}
