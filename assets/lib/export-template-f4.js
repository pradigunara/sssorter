/** F4 — Charcoal detective moodboard (from P39). */
import { html } from "./html.js";
import { titleDate } from "./export-templates-shared.js";

const Y_SHIFT = 4;

/** #2 left, #1 center, #3 right — tilted snaps, not a grid. */
const HERO = [
  { rank: 2, x: 20, y: 36, rot: -14, w: 228, z: 9 },
  { rank: 1, x: 50, y: 29, rot: 3.5, w: 322, z: 12 },
  { rank: 3, x: 81, y: 37, rot: 13, w: 222, z: 9 },
];

/**
 * Ranks 4–12: staggered heights, mixed sizes, overlapping the heroes.
 * Not two even rows — closer to a movie investigation wall.
 */
const SCATTER = [
  { rank: 4, x: 8, y: 62, rot: -18, w: 138, z: 7, tape: true, tapeRot: -11, tapeX: 12, tapeY: -5 },
  { rank: 5, x: 29, y: 60, rot: 12, w: 118, z: 5 },
  { rank: 6, x: 48, y: 59, rot: -9, w: 126, z: 8, tape: true, tapeRot: 8, tapeX: 52, tapeY: -4 },
  { rank: 7, x: 67, y: 63, rot: 16, w: 114, z: 6 },
  { rank: 8, x: 91, y: 65, rot: -11, w: 130, z: 7, tape: true, tapeRot: -6, tapeX: 16, tapeY: -4 },
  { rank: 9, x: 14, y: 76, rot: 8, w: 132, z: 8 },
  { rank: 10, x: 37, y: 80, rot: -13, w: 124, z: 6, tape: true, tapeRot: 10, tapeX: 48, tapeY: -4 },
  { rank: 11, x: 59, y: 75, rot: 10, w: 118, z: 7 },
  { rank: 12, x: 80, y: 81, rot: -7, w: 108, z: 5, tape: true, tapeRot: -12, tapeX: 10, tapeY: -4 },
];

const ANCHORS = {
  tl: { x: 88, y: 158 },
  tr: { x: 992, y: 152 },
  bl: { x: 102, y: 938 },
  br: { x: 972, y: 948 },
};

function pad(rank) {
  return String(rank).padStart(2, "0");
}

function boardPoint(xPct, yPct) {
  return {
    x: (xPct / 100) * 1080,
    y: ((yPct + Y_SHIFT) / 100) * 1080,
  };
}

function pinPoint(slot, hero) {
  const pt = boardPoint(slot.x, slot.y);
  let offset;
  if (hero && slot.rank === 1) offset = 92;
  else if (hero) offset = 68;
  else offset = Math.round(slot.w * 0.36);
  return { x: pt.x, y: pt.y - offset };
}

function makeTwinePath(a, b, { sagMul = 1, wave = 1, slack = 0.042 } = {}) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const sag = (16 + len * slack) * sagMul;
  const cx = mx + (-dy / len) * 7 * wave;
  const cy = my + sag;
  return `M ${a.x.toFixed(1)},${a.y.toFixed(1)} Q ${cx.toFixed(1)},${cy.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
}

function offsetPathD(d, dx, dy) {
  return d.replace(/(-?\d*\.?\d+),(-?\d*\.?\d+)/g, (_, x, y) =>
    `${(parseFloat(x) + dx).toFixed(1)},${(parseFloat(y) + dy).toFixed(1)}`,
  );
}

function buildStringPaths() {
  const heroPins = Object.fromEntries(HERO.map((s) => [s.rank, pinPoint(s, true)]));
  const scatterPins = Object.fromEntries(SCATTER.map((s) => [s.rank, pinPoint(s, false)]));

  const links = [
    { a: heroPins[1], b: heroPins[2], opts: { wave: 1 } },
    { a: heroPins[2], b: heroPins[3], opts: { wave: -1, sagMul: 0.95 } },
    { a: heroPins[3], b: heroPins[1], opts: { wave: 1, sagMul: 1.08 } },
    { a: ANCHORS.tl, b: heroPins[2], opts: { wave: -1, sagMul: 1.12 } },
    { a: ANCHORS.tr, b: heroPins[3], opts: { wave: 1, sagMul: 1.06 } },
    { a: ANCHORS.tl, b: heroPins[1], opts: { wave: 1, sagMul: 1.18 } },
    { a: ANCHORS.br, b: scatterPins[12], opts: { wave: -1, sagMul: 1.1 } },
    { a: ANCHORS.bl, b: scatterPins[9], opts: { wave: 1, sagMul: 1.04 } },
    { a: heroPins[1], b: scatterPins[12], opts: { wave: 1, sagMul: 1.05 } },
    { a: heroPins[2], b: scatterPins[4], opts: { wave: -1, sagMul: 0.92 } },
    { a: heroPins[3], b: scatterPins[8], opts: { wave: 1, sagMul: 0.98 } },
    { a: heroPins[1], b: scatterPins[6], opts: { wave: -1, sagMul: 0.7, slack: 0.028 } },
    { a: scatterPins[4], b: scatterPins[5], opts: { wave: 1, sagMul: 0.82, slack: 0.032 } },
    { a: scatterPins[5], b: scatterPins[6], opts: { wave: -1, sagMul: 0.8, slack: 0.03 } },
    { a: scatterPins[6], b: scatterPins[7], opts: { wave: 1, sagMul: 0.85, slack: 0.034 } },
    { a: scatterPins[7], b: scatterPins[8], opts: { wave: -1, sagMul: 0.78, slack: 0.03 } },
    { a: scatterPins[9], b: scatterPins[10], opts: { wave: 1, sagMul: 0.8, slack: 0.032 } },
    { a: scatterPins[10], b: scatterPins[11], opts: { wave: -1, sagMul: 0.84, slack: 0.034 } },
    { a: scatterPins[11], b: scatterPins[12], opts: { wave: 1, sagMul: 0.82, slack: 0.03 } },
    { a: scatterPins[4], b: scatterPins[9], opts: { wave: 1, sagMul: 1.14, slack: 0.05 } },
    { a: scatterPins[7], b: scatterPins[12], opts: { wave: -1, sagMul: 1.08, slack: 0.045 } },
    { a: scatterPins[8], b: scatterPins[11], opts: { wave: 1, sagMul: 0.9, slack: 0.036 } },
  ];

  const paths = links
    .filter(({ a, b }) => a && b)
    .map(({ a, b, opts }) => {
      const strand = makeTwinePath(a, b, opts);
      return {
        shadow: offsetPathD(strand, 1.5, 2.5),
        strand,
        highlight: offsetPathD(strand, -0.8, -1),
      };
    });

  const bannerY = (Y_SHIFT / 100) * 1080;
  const banner = `M 88,${158 + bannerY} Q 540,${236 + bannerY} 992,${152 + bannerY}`;
  paths.push({
    shadow: offsetPathD(banner, 1.5, 2.5),
    strand: banner,
    highlight: offsetPathD(banner, -0.8, -1),
  });

  return paths;
}

function sizeClass(rank) {
  if (rank === 1) return "is-hero";
  if (rank <= 3) return "is-mid";
  return "is-mini";
}

function print(name, slot, memberData, imgSrc, { hero = false } = {}) {
  const { rank, x, y, rot, w, z, tape, tapeRot = -8, tapeX = 20, tapeY = -5 } = slot;
  const empty = !name;
  const color = empty ? "#8a7a68" : memberData[name].color;
  const photo = empty
    ? html`<div class="p39-photo"></div>`
    : html`<div class="p39-photo"><img src="${imgSrc(name)}" alt="" /></div>`;
  const meta = empty
    ? html`<div class="p39-meta"><span class="p39-rank">${pad(rank)}</span></div>`
    : html`<div class="p39-meta">
        <span class="p39-rank">${pad(rank)}</span>
        <span class="p39-name">${name}</span>
      </div>`;
  const tapeEl = tape
    ? html`<div
        class="p39-tape"
        style="left:${tapeX}%;top:${tapeY}px;transform:rotate(${tapeRot}deg)"
        aria-hidden="true"
      ></div>`
    : "";

  return html`<article
    class="p39-item p39-print ${sizeClass(rank)}${empty ? " is-empty" : ""}${hero ? " is-pinned-hero" : ""}"
    style="left:${x}%;top:${y + Y_SHIFT}%;--rot:${rot}deg;--w:${w}px;--z:${z};--member-color:${color}"
    ${empty ? `aria-hidden="true"` : ""}
  >
    <span class="p39-pin" aria-hidden="true"></span>
    ${tapeEl}
    ${photo}
    ${meta}
  </article>`;
}

export function renderF4({ top12, memberData }) {
  const imgSrc = (name) => `/members/${memberData[name].sNumber}.jpg`;
  const r1 = top12[0] ?? null;
  const r2 = top12[1] ?? null;
  const r3 = top12[2] ?? null;
  const c1 = r1 ? memberData[r1].color : "#d4a574";
  const c2 = r2 ? memberData[r2].color : "#c47a6a";
  const c3 = r3 ? memberData[r3].color : "#7a9bb8";

  const strings = buildStringPaths()
    .map(
      ({ shadow, strand, highlight }) =>
        `<path class="p39-twine-shadow" d="${shadow}" />
         <path class="p39-twine-strand" d="${strand}" />
         <path class="p39-twine-lit" d="${highlight}" />`,
    )
    .join("");

  const heroes = HERO.map((slot) =>
    print(top12[slot.rank - 1] ?? null, slot, memberData, imgSrc, { hero: true }),
  ).join("");
  const minis = SCATTER.map((slot) =>
    print(top12[slot.rank - 1] ?? null, slot, memberData, imgSrc),
  ).join("");

  return html`<div
    class="mockup-canvas layout-p39"
    data-export-canvas
    style="--p39-c1:${c1};--p39-c2:${c2};--p39-c3:${c3}"
  >
    <div class="p39-felt" aria-hidden="true"></div>
    <div class="p39-grain" aria-hidden="true"></div>
    <div class="p39-vignette" aria-hidden="true"></div>
    <div class="p39-frame" aria-hidden="true"></div>
    <svg class="p39-string" viewBox="0 0 1080 1080" aria-hidden="true">
      ${strings}
    </svg>
    <span class="p39-loose-pin p39-loose-pin--a" style="--member-color:${c2}" aria-hidden="true"></span>
    <span class="p39-loose-pin p39-loose-pin--b" style="--member-color:${c3}" aria-hidden="true"></span>
    <span class="p39-loose-pin p39-loose-pin--c" style="--member-color:${c1}" aria-hidden="true"></span>
    <span class="p39-note p39-note--a" aria-hidden="true">motive?</span>
    <span class="p39-note p39-note--b" aria-hidden="true">top suspects</span>
    <header class="p39-mast">
      <div class="p39-swatches" aria-hidden="true">
        <i style="background:var(--p39-c1)"></i>
        <i style="background:var(--p39-c2)"></i>
        <i style="background:var(--p39-c3)"></i>
      </div>
      <div class="title">
        <div class="t1">my <span>top 12</span></div>
        <div class="t2">${titleDate()}</div>
      </div>
    </header>
    <div class="p39-board">${heroes}${minis}</div>
    <div class="footer">sssorter.pages.dev</div>
  </div>`;
}
