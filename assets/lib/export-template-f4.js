/** F4 — Sepia detective case board (cork + chalk, from P3). */
import { html } from "./html.js";
import { titleDate } from "./export-templates-shared.js";

/** Nudge all member prints (+ matching twine) downward on the board. */
const P3_Y_SHIFT = 5;

/** Top 3 — hero snaps: #2 left, #1 center, #3 right */
const P3_HERO = [
  { rank: 2, x: 20, y: 38, rot: -11, w: 212, pin: "#d94a3d", z: 7 },
  { rank: 1, x: 50, y: 32, rot: 4, w: 308, pin: "#e8b020", z: 9 },
  { rank: 3, x: 80, y: 39, rot: 12, w: 210, pin: "#2e86c1", z: 7 },
];

/** Ranks 4–12 — organic scatter; row 3 keeps #12 compact on the right */
const P3_SCATTER = [
  { rank: 4, x: 10, y: 63, rot: -15, w: 116, z: 5, pin: "#e74c8a", tape: "pink", tapeRot: -9, tapeX: 14, tapeY: -4 },
  { rank: 5, x: 31, y: 59, rot: 9, w: 108, z: 4, pin: "#2ecc71" },
  { rank: 6, x: 52, y: 65, rot: -7, w: 114, z: 6, pin: "#3498db", tape: "mint", tapeRot: 11, tapeX: 56, tapeY: -4 },
  { rank: 7, x: 68, y: 61, rot: 11, w: 106, z: 4, pin: "#f39c12" },
  { rank: 8, x: 83, y: 66, rot: -8, w: 112, z: 5, pin: "#9b59b6", tape: "lavender", tapeRot: -5, tapeX: 18, tapeY: -4 },
  { rank: 9, x: 16, y: 77, rot: 6, w: 112, z: 6, pin: "#e67e22" },
  { rank: 10, x: 34, y: 75, rot: -8, w: 114, z: 7, pin: "#1abc9c", tape: "peach", tapeRot: 7, tapeX: 54, tapeY: -4 },
  { rank: 11, x: 52, y: 79, rot: 9, w: 108, z: 5, pin: "#e74c3c" },
  { rank: 12, x: 70, y: 83, rot: 6, w: 94, z: 6, pin: "#2e86c1", tape: "sky", tapeRot: -10, tapeX: 14, tapeY: -4 },
];

/** Fixed twine anchor points on the cork (px). */
const P3_ANCHORS = {
  tl: { x: 86, y: 172 },
  tr: { x: 994, y: 166 },
  br: { x: 972, y: 938 },
};

function boardPoint(xPct, yPct) {
  return {
    x: (xPct / 100) * 1080,
    y: ((yPct + P3_Y_SHIFT) / 100) * 1080,
  };
}

function heroPinPoint(slot) {
  const pt = boardPoint(slot.x, slot.y);
  const pinOffset = slot.rank === 1 ? 80 : 64;
  return { x: pt.x, y: pt.y - pinOffset };
}

function scatterPinPoint(slot) {
  const pt = boardPoint(slot.x, slot.y);
  const pinOffset = Math.round(slot.w * 0.34);
  return { x: pt.x, y: pt.y - pinOffset };
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

/** Offset svg path coordinates — avoids CSS transforms that break in html-to-image. */
function offsetPathD(d, dx, dy) {
  return d.replace(/(-?\d*\.?\d+),(-?\d*\.?\d+)/g, (_, x, y) =>
    `${(parseFloat(x) + dx).toFixed(1)},${(parseFloat(y) + dy).toFixed(1)}`,
  );
}

function buildStringPaths() {
  const heroPins = Object.fromEntries(P3_HERO.map((s) => [s.rank, heroPinPoint(s)]));
  const scatterPins = Object.fromEntries(
    P3_SCATTER.filter((s) => s.pin).map((s) => [s.rank, scatterPinPoint(s)]),
  );

  const links = [
    { a: heroPins[1], b: heroPins[2], opts: { wave: 1 } },
    { a: heroPins[2], b: heroPins[3], opts: { wave: -1, sagMul: 0.95 } },
    { a: heroPins[3], b: heroPins[1], opts: { wave: 1, sagMul: 1.08 } },
    { a: P3_ANCHORS.tl, b: heroPins[2], opts: { wave: -1, sagMul: 1.12 } },
    { a: P3_ANCHORS.tr, b: heroPins[3], opts: { wave: 1, sagMul: 1.06 } },
    { a: P3_ANCHORS.tl, b: heroPins[1], opts: { wave: 1, sagMul: 1.18 } },
    { a: P3_ANCHORS.br, b: scatterPins[12], opts: { wave: -1, sagMul: 1.1 } },
    { a: heroPins[1], b: scatterPins[12], opts: { wave: 1, sagMul: 1.05 } },
    { a: heroPins[2], b: scatterPins[4], opts: { wave: -1, sagMul: 0.92 } },
    { a: heroPins[3], b: scatterPins[11], opts: { wave: 1, sagMul: 0.98 } },
    { a: scatterPins[4], b: scatterPins[5], opts: { wave: 1, sagMul: 0.82, slack: 0.032 } },
    { a: scatterPins[5], b: scatterPins[6], opts: { wave: -1, sagMul: 0.8, slack: 0.03 } },
    { a: scatterPins[6], b: scatterPins[7], opts: { wave: 1, sagMul: 0.85, slack: 0.034 } },
    { a: scatterPins[8], b: scatterPins[9], opts: { wave: -1, sagMul: 0.78, slack: 0.03 } },
    { a: scatterPins[9], b: scatterPins[10], opts: { wave: 1, sagMul: 0.8, slack: 0.032 } },
    { a: scatterPins[10], b: scatterPins[11], opts: { wave: -1, sagMul: 0.84, slack: 0.034 } },
    { a: scatterPins[4], b: scatterPins[9], opts: { wave: 1, sagMul: 1.14, slack: 0.05 } },
    { a: scatterPins[7], b: scatterPins[12], opts: { wave: -1, sagMul: 1.08, slack: 0.045 } },
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

  const bannerY = (P3_Y_SHIFT / 100) * 1080;
  const banner = `M 86,${172 + bannerY} Q 540,${248 + bannerY} ${994},${166 + bannerY}`;
  paths.push({
    shadow: offsetPathD(banner, 1.5, 2.5),
    strand: banner,
    highlight: offsetPathD(banner, -0.8, -1),
  });

  return paths;
}

function boardPin(name, rank, slot, ctx, { hero = false } = {}) {
  const { imgSrc, emo, html } = ctx;
  if (!name) return "";
  const {
    x,
    y,
    rot,
    w,
    pin,
    z = 5,
    tape,
    tapeRot = -8,
    tapeX = 20,
    tapeY = -5,
  } = slot;
  const rankCls = hero ? ` is-hero is-rank-${rank}` : " is-scatter";
  const pinEl = pin
    ? html`<div
        class="p3-pin${hero ? "" : " p3-pin--mini"}"
        style="--pin-color:${pin}"
        aria-hidden="true"
      ></div>`
    : "";
  const tapeEl = tape
    ? html`<div
        class="p3-tape p3-tape--${tape}"
        style="left:${tapeX}%;top:${tapeY}px;transform:rotate(${tapeRot}deg)"
        aria-hidden="true"
      ></div>`
    : "";
  const rankLabel = hero && rank === 1 ? "★ 1" : String(rank).padStart(2, "0");
  const tagEl = hero
    ? html`<div class="p3-print-tag">
        <span class="p3-print-name">${name}</span>
        <span class="p3-print-emo">${emo(name)}</span>
      </div>`
    : html`<div class="p3-print-overlay">
        <span class="p3-print-name">${name}</span>
        <span class="p3-print-emo">${emo(name)}</span>
      </div>`;

  return html`<div
    class="p3-item${rankCls}"
    style="left:${x}%;top:${y + P3_Y_SHIFT}%;--rot:${rot}deg;--w:${w}px;--z:${z}"
  >
    ${pinEl}
    ${tapeEl}
    <div class="p3-print">
      <div class="p3-print-photo">
        <img src="${imgSrc(name)}" alt="" />
        <span class="p3-print-rank">${rankLabel}</span>
        ${hero ? "" : tagEl}
      </div>
      ${hero ? tagEl : ""}
    </div>
  </div>`;
}

/** Sepia chalkboard — static SVG (no feTurbulence; safe for html-to-image export). */
function p3ChalkboardSvg() {
  const id = `p3c${(Math.random() * 1e7 | 0).toString(36)}`;
  const chalk = "rgba(108, 88, 68, 0.34)";
  const chalkFaint = "rgba(118, 98, 78, 0.2)";
  const chalkGhost = "rgba(128, 108, 88, 0.12)";
  return `<svg class="p3-board-svg" viewBox="0 0 1080 1080" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${id}-base" x1="8%" y1="4%" x2="92%" y2="96%">
        <stop offset="0%" stop-color="#e0d4be" />
        <stop offset="42%" stop-color="#d4c8b2" />
        <stop offset="100%" stop-color="#c8bca6" />
      </linearGradient>
      <radialGradient id="${id}-warm" cx="50%" cy="38%" r="72%">
        <stop offset="0%" stop-color="rgba(255, 248, 236, 0.22)" />
        <stop offset="100%" stop-color="rgba(255, 248, 236, 0)" />
      </radialGradient>
    </defs>
    <rect width="1080" height="1080" fill="url(#${id}-base)" />
    <rect width="1080" height="1080" fill="url(#${id}-warm)" />
    <g opacity="0.42" fill="none">
      <path d="M 120 148 H 960" stroke="${chalkFaint}" stroke-width="1" stroke-dasharray="6 14" />
      <path d="M 120 168 H 960" stroke="${chalkFaint}" stroke-width="1" stroke-dasharray="3 18" opacity="0.6" />
      <path d="M 148 148 V 932" stroke="${chalkFaint}" stroke-width="1" stroke-dasharray="4 16" />
      <path d="M 932 148 V 932" stroke="${chalkFaint}" stroke-width="1" stroke-dasharray="4 16" />
    </g>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="540" cy="410" rx="248" ry="198" stroke="${chalkFaint}" stroke-width="2.4" stroke-dasharray="9 7" />
      <path d="M 168 312 Q 248 268 338 302" stroke="${chalk}" stroke-width="2.8" />
      <path d="M 338 302 L 402 278" stroke="${chalk}" stroke-width="2.2" />
      <path d="M 402 278 L 428 252" stroke="${chalk}" stroke-width="2.6" />
      <path d="M 428 252 L 448 228 L 468 218" stroke="${chalk}" stroke-width="2.4" />
      <path d="M 862 348 Q 768 392 702 458" stroke="${chalkFaint}" stroke-width="2.2" stroke-dasharray="5 6" />
      <path d="M 702 458 L 648 512" stroke="${chalkFaint}" stroke-width="2" />
      <circle cx="648" cy="512" r="34" stroke="${chalk}" stroke-width="2.2" />
      <path d="M 214 748 Q 360 698 498 742 Q 640 786 768 728" stroke="${chalkGhost}" stroke-width="18" stroke-linecap="round" />
      <path d="M 248 612 L 312 688 M 312 612 L 248 688" stroke="${chalkFaint}" stroke-width="2.6" />
      <path d="M 812 812 Q 868 772 918 818" stroke="${chalkFaint}" stroke-width="2" stroke-dasharray="4 5" />
      <path d="M 148 868 Q 228 828 308 852" stroke="${chalkGhost}" stroke-width="14" stroke-linecap="round" />
      <g opacity="0.32" transform="rotate(3 812 892)">
        <circle cx="772" cy="882" r="5" fill="${chalkFaint}" />
        <circle cx="812" cy="892" r="5" fill="${chalkFaint}" />
        <circle cx="852" cy="884" r="5" fill="${chalkFaint}" />
        <path d="M 778 884 Q 812 870 846 882" stroke="${chalkFaint}" stroke-width="2" stroke-dasharray="4 6" />
      </g>
    </g>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.24">
      <path d="M 92 218 Q 118 188 148 208" stroke="${chalkFaint}" stroke-width="1.8" />
      <path d="M 108 238 Q 128 222 148 242" stroke="${chalkGhost}" stroke-width="1.4" stroke-dasharray="3 6" />
      <circle cx="98" cy="258" r="3" fill="${chalkGhost}" />
      <circle cx="122" cy="272" r="2.5" fill="${chalkGhost}" />
      <path d="M 918 188 L922 206 L940 206 L926 218 L932 236 L918 226 L904 236 L910 218 L896 206 L914 206 Z" stroke="${chalkGhost}" stroke-width="1.3" />
      <path d="M 96 438 Q 112 412 104 388 Q 96 364 118 352" stroke="${chalkFaint}" stroke-width="1.5" stroke-dasharray="4 7" />
      <path d="M 158 372 H174 M 154 412 H170 M 160 452 H176" stroke="${chalkGhost}" stroke-width="1.2" />
      <circle cx="908" cy="562" r="9" stroke="${chalkGhost}" stroke-width="1.4" />
      <circle cx="934" cy="582" r="5.5" stroke="${chalkGhost}" stroke-width="1.2" />
      <circle cx="888" cy="586" r="4" stroke="${chalkGhost}" stroke-width="1.1" />
      <path d="M 902 598 Q 918 578 938 592" stroke="${chalkFaint}" stroke-width="1.4" stroke-dasharray="3 5" />
      <path d="M 188 518 Q 208 498 198 478" stroke="${chalkGhost}" stroke-width="1.6" />
      <circle cx="206" cy="538" r="2.5" fill="${chalkGhost}" />
      <circle cx="222" cy="552" r="2" fill="${chalkGhost}" />
      <circle cx="858" cy="448" r="2.5" fill="${chalkGhost}" />
      <circle cx="874" cy="462" r="2" fill="${chalkGhost}" />
      <path d="M 478 808 L494 824 M 494 808 L478 824" stroke="${chalkFaint}" stroke-width="1.7" />
      <path d="M 562 836 L576 850 M 576 836 L562 850" stroke="${chalkFaint}" stroke-width="1.5" opacity="0.75" />
      <path d="M 628 812 L642 826 M 642 812 L628 826" stroke="${chalkGhost}" stroke-width="1.4" />
      <path d="M 412 958 Q 540 938 668 958" stroke="${chalkGhost}" stroke-width="11" stroke-linecap="round" />
      <path d="M 872 928 Q 932 892 972 918" stroke="${chalkFaint}" stroke-width="1.6" stroke-dasharray="5 9" />
      <path d="M 906 708 L918 720 L906 732" stroke="${chalkFaint}" stroke-width="1.5" />
      <path d="M 930 756 L942 768 L930 780" stroke="${chalkFaint}" stroke-width="1.3" opacity="0.8" />
      <path d="M 588 238 L588 276 M 588 238 Q608 258 588 276" stroke="${chalkGhost}" stroke-width="1.5" />
      <path d="M 452 268 Q 472 248 492 268 Q 512 288 532 268" stroke="${chalkGhost}" stroke-width="1.3" stroke-dasharray="2 6" />
      <path d="M 720 868 Q 768 842 812 862" stroke="${chalkFaint}" stroke-width="1.5" stroke-dasharray="4 8" />
      <circle cx="748" cy="878" r="2.5" fill="${chalkGhost}" />
      <circle cx="772" cy="866" r="2" fill="${chalkGhost}" />
      <circle cx="796" cy="874" r="2.5" fill="${chalkGhost}" />
    </g>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.32">
      <path d="M 56 56 L56 136 M 56 56 L136 56" stroke="${chalkFaint}" stroke-width="2" stroke-dasharray="6 9" />
      <path d="M 76 84 Q 98 62 122 84" stroke="${chalkGhost}" stroke-width="1.7" />
      <circle cx="94" cy="110" r="8" stroke="${chalkFaint}" stroke-width="1.5" />
      <path d="M 66 122 L74 130 M 74 122 L66 130" stroke="${chalkFaint}" stroke-width="1.6" />
      <circle cx="128" cy="74" r="2.5" fill="${chalkGhost}" />
      <circle cx="144" cy="92" r="2" fill="${chalkGhost}" />
      <circle cx="112" cy="148" r="2.5" fill="${chalkGhost}" />
      <path d="M 142 50 L146 64 L160 64 L148 74 L152 88 L142 80 L132 88 L136 74 L124 64 L138 64 Z" stroke="${chalkGhost}" stroke-width="1.3" />
      <path d="M 1024 56 L1024 136 M 1024 56 L944 56" stroke="${chalkFaint}" stroke-width="2" stroke-dasharray="6 9" />
      <circle cx="964" cy="90" r="13" stroke="${chalkGhost}" stroke-width="1.4" />
      <circle cx="964" cy="90" r="6" stroke="${chalkFaint}" stroke-width="1.2" />
      <path d="M 928 112 L940 124 L928 136" stroke="${chalkFaint}" stroke-width="1.6" />
      <path d="M 952 136 L964 148 L976 136" stroke="${chalkFaint}" stroke-width="1.4" opacity="0.85" />
      <circle cx="998" cy="80" r="2.5" fill="${chalkGhost}" />
      <circle cx="984" cy="122" r="2" fill="${chalkGhost}" />
      <path d="M 894 70 L898 86 L914 86 L900 96 L906 112 L894 102 L882 112 L888 96 L874 86 L890 86 Z" stroke="${chalkGhost}" stroke-width="1.2" />
      <path d="M 908 152 Q 948 122 988 146" stroke="${chalkFaint}" stroke-width="1.5" stroke-dasharray="4 7" />
      <path d="M 56 1024 L56 944 M 56 1024 L136 1024" stroke="${chalkFaint}" stroke-width="2" stroke-dasharray="6 9" />
      <path d="M 70 966 Q 92 944 110 968" stroke="${chalkGhost}" stroke-width="1.6" />
      <path d="M 86 988 Q 108 1008 130 988" stroke="${chalkFaint}" stroke-width="1.4" stroke-dasharray="3 5" />
      <circle cx="96" cy="1004" r="5.5" stroke="${chalkFaint}" stroke-width="1.3" />
      <circle cx="116" cy="956" r="2.5" fill="${chalkGhost}" />
      <circle cx="140" cy="976" r="2" fill="${chalkGhost}" />
      <circle cx="64" cy="996" r="2" fill="${chalkGhost}" />
      <path d="M 150 948 L158 956 M 158 948 L150 956" stroke="${chalkFaint}" stroke-width="1.5" />
      <path d="M 164 1006 H176 M170 1000 V1012" stroke="${chalkGhost}" stroke-width="1.2" />
      <path d="M 1024 1024 L1024 944 M 1024 1024 L944 1024" stroke="${chalkFaint}" stroke-width="2" stroke-dasharray="6 9" />
      <circle cx="960" cy="966" r="4" fill="${chalkGhost}" />
      <circle cx="980" cy="976" r="3" fill="${chalkGhost}" />
      <circle cx="1000" cy="966" r="4" fill="${chalkGhost}" />
      <path d="M 956 980 Q 980 960 1004 976" stroke="${chalkFaint}" stroke-width="1.6" stroke-dasharray="4 6" />
      <path d="M 926 986 L934 994 M 934 986 L926 994" stroke="${chalkFaint}" stroke-width="1.5" />
      <path d="M 966 1006 Q 1006 986 1046 1006" stroke="${chalkGhost}" stroke-width="1.5" stroke-dasharray="3 6" />
      <path d="M 1006 930 L1014 942 L1006 954" stroke="${chalkFaint}" stroke-width="1.5" />
      <path d="M 888 966 L902 974 L888 982" stroke="${chalkGhost}" stroke-width="1.4" />
    </g>
    <g fill="${chalkGhost}" opacity="0.2">
      <circle cx="268" cy="198" r="2" />
      <circle cx="284" cy="212" r="1.5" />
      <circle cx="792" cy="178" r="2" />
      <circle cx="808" cy="192" r="1.5" />
      <circle cx="324" cy="892" r="2" />
      <circle cx="340" cy="878" r="1.5" />
      <circle cx="356" cy="902" r="2" />
      <circle cx="724" cy="198" r="2" />
      <circle cx="740" cy="212" r="1.5" />
      <circle cx="168" cy="672" r="2" />
      <circle cx="184" cy="688" r="1.5" />
      <circle cx="912" cy="712" r="2" />
      <circle cx="928" cy="728" r="1.5" />
    </g>
    <g fill="${chalk}" font-family="Caveat, cursive">
      <text x="176" y="292" font-size="34" opacity="0.34" transform="rotate(-7 176 292)">motive?</text>
      <text x="768" y="248" font-size="42" opacity="0.28" transform="rotate(5 768 248)">?</text>
      <text x="118" y="892" font-size="28" opacity="0.22" transform="rotate(-4 118 892)">case notes</text>
      <text x="498" y="168" font-size="22" opacity="0.18" text-anchor="middle" letter-spacing="0.28em">TOP SUSPECTS</text>
    </g>
    <g fill="none" stroke-linecap="round" opacity="0.55">
      <path d="M 360 520 Q 420 480 468 520" stroke="${chalkGhost}" stroke-width="22" />
      <path d="M 700 640 Q 760 600 812 636" stroke="${chalkGhost}" stroke-width="22" />
    </g>
  </svg>`;
}

export function renderF4({ top12, memberData }) {
  const imgSrc = (name) => `/members/${memberData[name].sNumber}.jpg`;
  const emo = (name) => memberData[name].emoji;
  const TITLE_DATE = titleDate();
  const ctx = { imgSrc, emo, html };

  const strings = buildStringPaths();
  const twineSvg = strings
    .map(
      ({ shadow, strand, highlight }) =>
        `<path d="${shadow}" fill="none" stroke="rgba(108, 68, 52, 0.18)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
         <path d="${strand}" fill="none" stroke="#a83c30" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.92" />
         <path d="${highlight}" fill="none" stroke="rgba(255, 198, 168, 0.28)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />`,
    )
    .join("");

  const heroes = P3_HERO.map((slot) =>
    boardPin(top12[slot.rank - 1], slot.rank, slot, ctx, { hero: true }),
  ).join("");

  const scattered = P3_SCATTER.map((slot) =>
    boardPin(top12[slot.rank - 1], slot.rank, slot, ctx),
  ).join("");

  return html`<div class="mockup-canvas layout-p3" data-export-canvas>
    <div class="p3-wall" aria-hidden="true"></div>
    <div class="p3-board-shell" aria-hidden="true">
      <div class="p3-board-surface">
        ${p3ChalkboardSvg()}
        <div class="p3-chalk-dust"></div>
        <div class="p3-chalk-smudge"></div>
        <div class="p3-board-vignette"></div>
        <div class="p3-chalk-scribbles" aria-hidden="true">
          <span class="p3-chalk-note p3-chalk-note--a">alibi??</span>
          <span class="p3-chalk-glyph p3-chalk-glyph--b" aria-hidden="true">
            <svg viewBox="0 0 56 56" width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 8 L32 20 L44 22 L35 30 L38 42 L28 35 L18 42 L21 30 L12 22 L24 20 Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" />
              <circle cx="28" cy="28" r="4" fill="currentColor" opacity="0.55" />
            </svg>
          </span>
          <span class="p3-chalk-glyph p3-chalk-glyph--c" aria-hidden="true">
            <svg viewBox="0 0 48 48" width="44" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="11" stroke="currentColor" stroke-width="2" />
              <path d="M28 28 L40 40" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
            </svg>
          </span>
          <span class="p3-chalk-glyph p3-chalk-glyph--d" aria-hidden="true">
            <svg viewBox="0 0 40 40" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 28 Q18 8 34 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M26 14 L34 18 L28 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="p3-chalk-glyph p3-chalk-glyph--e" aria-hidden="true">◎</span>
          <span class="p3-chalk-glyph p3-chalk-glyph--f" aria-hidden="true">✧</span>
          <span class="p3-chalk-glyph p3-chalk-glyph--g" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 24 L16 8 L24 24" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
              <path d="M11 20 H21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
          </span>
        </div>
      </div>
    </div>
    <div class="p3-frame-rim" aria-hidden="true"></div>
    <svg class="p3-twine p3-twine--back" viewBox="0 0 1080 1080" aria-hidden="true">
      ${twineSvg}
    </svg>
    <div class="p3-deco p3-deco--clip" aria-hidden="true"></div>
    <div class="p3-deco p3-deco--heart" aria-hidden="true">♡</div>
    <div class="p3-deco p3-deco--star" aria-hidden="true">✦</div>
    <div class="p3-deco p3-deco--sticker p3-deco--sticker-top" aria-hidden="true">top 12</div>
    <div class="p3-deco p3-deco--washi p3-deco--washi-a" aria-hidden="true"></div>
    <div class="p3-deco p3-deco--washi p3-deco--washi-b" aria-hidden="true"></div>
    <div class="p3-deco p3-deco--pin p3-deco--pin-a" style="--pin-color:#e74c3c" aria-hidden="true"></div>
    <div class="p3-deco p3-deco--pin p3-deco--pin-b" style="--pin-color:#2ecc71" aria-hidden="true"></div>
    <div class="p3-deco p3-deco--pin p3-deco--pin-c" style="--pin-color:#3498db" aria-hidden="true"></div>
    <div class="p3-deco p3-deco--pin p3-deco--pin-d" style="--pin-color:#f1c40f" aria-hidden="true"></div>
    <div class="p3-board">${heroes}${scattered}</div>
    <div class="title">
      <div class="t1">my <span>top 12</span> ♡</div>
      <div class="t2">${TITLE_DATE}</div>
    </div>
    <div class="footer">sssorter.pages.dev</div>
  </div>`;
}