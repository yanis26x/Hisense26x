const keyCodes = {
  13: "Enter", 37: "ArrowLeft", 38: "ArrowUp", 39: "ArrowRight", 40: "ArrowDown",
  8: "Back", 27: "Back", 461: "Back", 10009: "Back",
};

export function getRemoteKey(event) {
  if (["Back", "BrowserBack", "GoBack", "Escape", "Backspace"].includes(event.key)) return "Back";
  if (["Enter", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return event.key;
  return keyCodes[event.keyCode || event.which];
}

export function getFocusTargets(root) {
  return [...root.querySelectorAll('button, a[href], input:not([type="hidden"]), select, textarea, [tabindex]')]
    .filter(element => {
      if (element.matches(':disabled, [aria-disabled="true"]') || element.closest('[hidden], [inert], [aria-hidden="true"]')) return false;
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      // Keep offscreen scrollable cards/settings eligible, but exclude hidden pages.
      return style.visibility === "visible" && style.display !== "none" && rect.width > 0 && rect.height > 0;
    });
}

// Rank geometry, not DOM order. Prefer neighbors in the same horizontal/vertical
// beam, then the closest diagonal when no aligned control exists.
export function spatialScore(from, to, direction) {
  const horizontal = direction === "ArrowLeft" || direction === "ArrowRight";
  const sign = direction === "ArrowLeft" || direction === "ArrowUp" ? -1 : 1;
  const primary = horizontal ? "x" : "y";
  const secondary = horizontal ? "y" : "x";
  const size = horizontal ? "width" : "height";
  const crossSize = horizontal ? "height" : "width";
  const forward = sign * ((to[primary] + to[size] / 2) - (from[primary] + from[size] / 2));
  if (forward <= 1) return Infinity;
  const crossGap = Math.max(0, from[secondary] - to[secondary] - to[crossSize], to[secondary] - from[secondary] - from[crossSize]);
  const cross = Math.abs(to[secondary] + to[crossSize] / 2 - from[secondary] - from[crossSize] / 2);
  const edgeGap = Math.max(0, sign > 0 ? to[primary] - from[primary] - from[size] : from[primary] - to[primary] - to[size]);
  return (crossGap > 0 ? 1000000 : 0) + edgeGap * 4 + crossGap * 8 + cross + forward * 0.1;
}

export function findSpatialTarget(current, targets, direction) {
  const from = current.getBoundingClientRect();
  let best = null;
  let bestScore = Infinity;
  for (const target of targets) {
    if (target === current) continue;
    const rect = target.getBoundingClientRect();
    const row = target.closest('.app-row');
    // A vertical jump should land on a visible card; left/right can reveal the
    // next clipped card within the same scrolling row.
    if (row && (direction === "ArrowUp" || direction === "ArrowDown" || current.closest('.app-row') !== row)) {
      const bounds = row.getBoundingClientRect();
      if (rect.right <= Math.max(0, bounds.left) || rect.left >= Math.min(window.innerWidth, bounds.right)) continue;
    }
    const score = spatialScore(from, rect, direction);
    if (score < bestScore) { best = target; bestScore = score; }
  }
  return best;
}

export function focusElement(element) {
  if (!element) return;
  element.focus({ preventScroll: true });
  element.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
}
