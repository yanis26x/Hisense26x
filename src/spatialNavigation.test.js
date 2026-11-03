import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { findSpatialTarget, focusElement, getFocusTargets, getRemoteKey, spatialScore } from './spatialNavigation.js';

const rect = (x, y, width = 100, height = 50) => ({ x, y, left: x, top: y, right: x + width, bottom: y + height, width, height });
const element = (bounds, row = null) => ({
  getBoundingClientRect: () => bounds,
  closest: selector => selector === '.app-row' ? row : null,
});

test('all four directions use screen position even with shuffled DOM order', () => {
  const current = element(rect(200, 200));
  const left = element(rect(50, 200));
  const right = element(rect(350, 200));
  const up = element(rect(200, 50));
  const down = element(rect(200, 350));
  const targets = [down, right, current, up, left];
  for (const [key, expected] of Object.entries({ ArrowLeft: left, ArrowRight: right, ArrowUp: up, ArrowDown: down })) {
    assert.equal(findSpatialTarget(current, targets, key), expected);
  }
  assert.equal(findSpatialTarget(left, targets, 'ArrowLeft'), null);
});

test('aligned controls win over diagonal controls; diagonal fallback remains available', () => {
  const origin = rect(0, 0);
  const aligned = rect(300, 0);
  const diagonal = rect(120, 70);
  assert.ok(spatialScore(origin, aligned, 'ArrowRight') < spatialScore(origin, diagonal, 'ArrowRight'));
  const current = element(origin);
  const fallback = element(diagonal);
  assert.equal(findSpatialTarget(current, [fallback], 'ArrowRight'), fallback);
});

test('horizontal navigation reveals clipped cards, vertical navigation skips them', () => {
  const previousWindow = globalThis.window;
  globalThis.window = { innerWidth: 800 };
  try {
    const row = element(rect(0, 200, 800, 200));
    const current = element(rect(650, 220, 140, 140), row);
    const clipped = element(rect(810, 220, 140, 140), row);
    const visible = element(rect(480, 220, 140, 140), row);
    assert.equal(findSpatialTarget(current, [current, clipped], 'ArrowRight'), clipped);
    const header = element(rect(810, 0));
    assert.equal(findSpatialTarget(header, [clipped, visible], 'ArrowDown'), visible);
  } finally { globalThis.window = previousWindow; }
});

test('hidden/disabled controls are excluded, offscreen and unchecked radio controls remain eligible', () => {
  const previousWindow = globalThis.window;
  globalThis.window = { getComputedStyle: el => el.style };
  try {
    const make = (disabled, hidden, visibility, bounds) => ({
      matches: () => disabled, closest: () => hidden,
      style: { visibility, display: 'block' }, getBoundingClientRect: () => bounds,
    });
    const eligible = make(false, false, 'visible', rect(2000, 0));
    const hidden = make(false, true, 'visible', rect(0, 0));
    const disabled = make(true, false, 'visible', rect(0, 0));
    const ambient = make(false, false, 'hidden', rect(0, 0));
    const empty = make(false, false, 'visible', rect(0, 0, 0, 0));
    assert.deepEqual(getFocusTargets({ querySelectorAll: () => [disabled, hidden, eligible, ambient, empty] }), [eligible]);
  } finally { globalThis.window = previousWindow; }
});

test('remote key names and legacy codes normalize to the same actions', () => {
  for (const key of ['Escape', 'Backspace', 'Back', 'BrowserBack', 'GoBack']) assert.equal(getRemoteKey({ key }), 'Back');
  for (const keyCode of [8, 27, 461, 10009]) assert.equal(getRemoteKey({ key: 'Unidentified', keyCode }), 'Back');
  for (const [keyCode, key] of [[13, 'Enter'], [37, 'ArrowLeft'], [38, 'ArrowUp'], [39, 'ArrowRight'], [40, 'ArrowDown']]) {
    assert.equal(getRemoteKey({ keyCode }), key);
    assert.equal(getRemoteKey({ key }), key);
  }
  assert.equal(getRemoteKey({ key: 'a' }), undefined);
});

test('focus uses nearest scrolling without the browser jumping first', () => {
  const calls = [];
  focusElement({ focus: options => calls.push(['focus', options]), scrollIntoView: options => calls.push(['scroll', options]) });
  assert.deepEqual(calls, [['focus', { preventScroll: true }], ['scroll', { block: 'nearest', inline: 'nearest', behavior: 'auto' }]]);
  focusElement(null);
});
