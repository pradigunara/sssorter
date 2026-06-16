/** F6 — Stamp collection album (from P15). */
import { html } from "./html.js";
import { titleDate } from "./export-templates-shared.js";

/** Series labels for commemorative hero stamps. */
const P15_SERIES = {
  1: "limited edition · first class",
  2: "commemorative issue · airmail",
  3: "collector's series · special post",
};

/**
 * Ranks 4–12 — scattered album placements with rotation, scale, and shape variety.
 * x/y are % within the scatter field; w is stamp width in px.
 */
const P15_MINI_SLOTS = [
  { x: 22, y: 12, rot: 22, w: 148, z: 5, tone: "rose", shape: "wide", scale: 1.04 },
  { x: 6, y: 33, rot: -13, w: 134, z: 6, tone: "sea", shape: "sq", mark: true, scale: 1.02 },
  { x: 47, y: 24, rot: -18, w: 140, z: 7, tone: "plum", shape: "tall", scale: 1.02 },
  { x: 90, y: 14, rot: 11, w: 126, z: 4, tone: "amber", shape: "sq", scale: 1 },
  { x: 72, y: 42, rot: 7, w: 144, z: 8, tone: "sage", shape: "wide", mark: true, scale: 1.03 },
  { x: 33, y: 55, rot: -16, w: 136, z: 5, tone: "slate", shape: "sq", scale: 1.01 },
  { x: 58, y: 64, rot: 19, w: 130, z: 6, tone: "sea", shape: "tall", scale: 1 },
  { x: 12, y: 78, rot: -9, w: 150, z: 7, tone: "amber", shape: "wide", scale: 1.03 },
  { x: 82, y: 72, rot: -20, w: 142, z: 7, tone: "rose", shape: "sq", mark: true, scale: 1.02 },
];

/** Scattered loose stamps — album ephemera */
const P15_LOOSE_STAMPS = [
  { x: 64, y: 12, rot: -24, w: 44, tone: "amber", z: 5 },
  { x: 96, y: 44, rot: 19, w: 38, tone: "sea", z: 5 },
  { x: 4, y: 52, rot: -7, w: 42, tone: "plum", z: 6 },
  { x: 42, y: 68, rot: 13, w: 40, tone: "rose", z: 5 },
  { x: 94, y: 82, rot: -11, w: 36, tone: "sage", z: 6 },
];

/** Flutter ornaments — labels, marks, tape, hinges, etc. */
const P15_FLUTTER = [
  { kind: "label", text: "rare find", x: 38, y: 34, rot: -12, variant: "gold", z: 8 },
  { kind: "label", text: "fragile", x: 68, y: 78, rot: 15, variant: "caution", z: 8 },
  { kind: "label", text: "insured", x: 18, y: 42, rot: 8, variant: "blue", z: 7 },
  { kind: "label", text: "par avion", x: 54, y: 10, rot: -9, variant: "air", z: 7 },
  { kind: "label", text: "mint", x: 48, y: 82, rot: -5, variant: "mint", z: 7 },
  { kind: "label", text: "verified", x: 90, y: 56, rot: 9, variant: "blue", z: 7 },
  { kind: "mini-mark", ring: "by air<br />mail", date: "→", x: 8, y: 64, rot: -22, z: 6 },
  { kind: "mini-mark", ring: "philately<br />club", date: "✦", x: 62, y: 46, rot: 14, z: 6 },
  { kind: "mini-mark", ring: "postage<br />due", date: "¢", x: 28, y: 14, rot: -6, z: 6 },
  { kind: "cancel", x: 76, y: 22, rot: -34, z: 6 },
  { kind: "cancel", x: 24, y: 60, rot: 24, z: 5 },
  { kind: "hinge", x: 52, y: 72, rot: 6, z: 5 },
  { kind: "hinge", x: 92, y: 30, rot: -10, z: 5 },
  { kind: "tape", x: 16, y: 18, rot: -30, color: "amber", z: 7 },
  { kind: "tape", x: 70, y: 52, rot: -22, color: "sea", z: 7 },
  { kind: "tape", x: 36, y: 86, rot: 18, color: "amber", z: 7 },
  { kind: "tape", x: 84, y: 14, rot: 12, color: "rose", z: 6 },
  { kind: "barcode", x: 58, y: 28, rot: -3, z: 6 },
  { kind: "scrap", x: 44, y: 56, rot: -16, z: 5 },
  { kind: "ink", x: 66, y: 64, rot: 8, z: 5 },
];

function p15Denom(rank) {
  return rank === 1 ? "★ 01" : String(rank).padStart(2, "0");
}

function p15DecoStyle({ x, y, rot, z = 5 }) {
  return `left:${x}%;top:${y}%;--rot:${rot}deg;--z:${z}`;
}

function p15LooseDeco(stamp) {
  const { x, y, rot, w, tone, z } = stamp;
  return html`<div
    class="p15-deco p15-loose-stamp is-tone-${tone}"
    style="${p15DecoStyle({ x, y, rot, z })};--w:${w}px"
    aria-hidden="true"
  ></div>`;
}

function p15FlutterDeco(item) {
  const style = p15DecoStyle(item);
  switch (item.kind) {
    case "label":
      return html`<div class="p15-deco p15-label is-scatter is-${item.variant}" style="${style}" aria-hidden="true">${item.text}</div>`;
    case "mini-mark":
      return html`<div class="p15-deco p15-postmark is-scatter is-tiny" style="${style}" aria-hidden="true">
        <span class="p15-postmark-ring">${item.ring}</span>
        <span class="p15-postmark-line"></span>
        <span class="p15-postmark-date">${item.date}</span>
      </div>`;
    case "cancel":
      return html`<div class="p15-deco p15-cancel is-scatter" style="${style}" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>`;
    case "hinge":
      return html`<div class="p15-deco p15-hinge" style="${style}" aria-hidden="true"></div>`;
    case "tape":
      return html`<div class="p15-deco p15-tape p15-tape--${item.color}" style="${style}" aria-hidden="true"></div>`;
    case "barcode":
      return html`<div class="p15-deco p15-barcode" style="${style}" aria-hidden="true">
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>`;
    case "scrap":
      return html`<div class="p15-deco p15-scrap" style="${style}" aria-hidden="true"></div>`;
    case "ink":
      return html`<div class="p15-deco p15-ink" style="${style}" aria-hidden="true"></div>`;
    default:
      return "";
  }
}

function p15RouteSvg() {
  return `<svg class="p15-routes" viewBox="0 0 992 1008" preserveAspectRatio="none" aria-hidden="true">
    <path fill="none" stroke="rgba(139, 58, 58, 0.24)" stroke-width="1.6" stroke-dasharray="5 7" stroke-linecap="round" d="M 72 360 Q 210 310 360 390 T 640 470" />
    <path fill="none" stroke="rgba(139, 58, 58, 0.24)" stroke-width="1.6" stroke-dasharray="5 7" stroke-linecap="round" d="M 860 240 Q 720 300 620 390" />
    <path fill="none" stroke="rgba(106, 148, 184, 0.22)" stroke-width="1.6" stroke-dasharray="3 9" stroke-linecap="round" d="M 120 720 Q 320 680 480 760 T 780 820" />
    <circle fill="rgba(139, 58, 58, 0.35)" cx="210" cy="350" r="3" />
    <circle fill="rgba(139, 58, 58, 0.35)" cx="640" cy="470" r="3" />
    <circle fill="rgba(139, 58, 58, 0.35)" cx="780" cy="820" r="3" />
  </svg>`;
}

function p15HeroStamp(name, rank, imgSrc) {
  if (!name) return "";
  const rankCls = ` is-rank-${rank}`;
  const series = P15_SERIES[rank] ?? "postal issue";
  return html`<article class="p15-hero${rankCls}">
    <div class="p15-stamp-shell">
      <div class="p15-stamp-face">
        <div class="p15-stamp-border">
          <div class="p15-stamp-border-inner">
            <div class="p15-hero-header">
              <span class="p15-hero-kicker">commemorative</span>
              <span class="p15-hero-denom">${p15Denom(rank)}</span>
            </div>
            <div class="p15-hero-portrait">
              <img src="${imgSrc(name)}" alt="" />
              <div class="p15-hero-veil" aria-hidden="true"></div>
            </div>
            <div class="p15-hero-caption">
              <h2 class="p15-hero-name">${name}</h2>
              <span class="p15-hero-series">${series}</span>
            </div>
          </div>
        </div>
        <div class="p15-hero-mark" aria-hidden="true">
          <span>bias<br />post</span>
        </div>
      </div>
    </div>
  </article>`;
}

function p15MiniStamp(name, rank, slot, imgSrc) {
  const {
    x,
    y,
    rot,
    w,
    z = 4,
    tone = "sea",
    shape = "sq",
    mark = false,
    scale = 1,
  } = slot;
  const posStyle = `left:${x}%;top:${y}%;--rot:${rot}deg;--w:${w}px;--z:${z};--scale:${scale}`;
  if (!name) {
    return html`<div
      class="p15-mini is-empty is-shape-${shape}"
      style="${posStyle}"
      aria-hidden="true"
    >
      <div class="p15-stamp-shell">
        <div class="p15-stamp-face">
          <div class="p15-mini-portrait"></div>
        </div>
      </div>
    </div>`;
  }
  const num = String(rank).padStart(2, "0");
  const markEl = mark
    ? html`<div class="p15-mini-cancel" aria-hidden="true"><span>${num}</span></div>`
    : "";
  return html`<div
    class="p15-mini is-tone-${tone} is-shape-${shape}${mark ? " has-mark" : ""}"
    style="${posStyle}"
  >
    <div class="p15-stamp-shell">
      <div class="p15-stamp-face">
        <div class="p15-mini-portrait">
          <img src="${imgSrc(name)}" alt="" />
          <span class="p15-mini-rank">${num}</span>
        </div>
        <span class="p15-mini-name">${name}</span>
        ${markEl}
      </div>
    </div>
  </div>`;
}

export function renderF6({ top12, memberData }) {
  const imgSrc = (name) => `/members/${memberData[name].sNumber}.jpg`;
  const TITLE_DATE = titleDate();
  const [r1, r2, r3, ...rest] = top12;

  const heroes = [
    p15HeroStamp(r2, 2, imgSrc),
    p15HeroStamp(r1, 1, imgSrc),
    p15HeroStamp(r3, 3, imgSrc),
  ].join("");

  const miniStamps = P15_MINI_SLOTS.map((slot, i) =>
    p15MiniStamp(rest[i] ?? null, i + 4, slot, imgSrc),
  ).join("");

  const holes = [72, 148, 224, 300, 376, 452, 528, 604, 680, 756, 832, 908]
    .map((top) => html`<span class="p15-hole" style="top:${top}px" aria-hidden="true"></span>`)
    .join("");

  const looseDeco = P15_LOOSE_STAMPS.map(p15LooseDeco).join("");
  const flutterDeco = P15_FLUTTER.map(p15FlutterDeco).join("");

  return html`<div class="mockup-canvas layout-p15" data-export-canvas>
    <div class="p15-paper" aria-hidden="true"></div>
    <div class="p15-album-frame" aria-hidden="true"></div>
    <div class="p15-page">
      <div class="p15-binding" aria-hidden="true">${holes}</div>
      <div class="p15-deco p15-corner p15-corner--tl" aria-hidden="true"></div>
      <div class="p15-deco p15-corner p15-corner--tr" aria-hidden="true"></div>
      <div class="p15-deco p15-corner p15-corner--bl" aria-hidden="true"></div>
      <div class="p15-deco p15-corner p15-corner--br" aria-hidden="true"></div>
      <div class="p15-deco p15-rule p15-rule--heroes" aria-hidden="true"></div>
      <div class="p15-deco p15-rule p15-rule--grid" aria-hidden="true"></div>
      <div class="p15-deco p15-airmail" aria-hidden="true">
        <span class="p15-airmail-text">air mail</span>
      </div>
      <div class="p15-deco p15-label p15-label--edition" aria-hidden="true">1st edition</div>
      <div class="p15-deco p15-label p15-label--priority" aria-hidden="true">priority</div>
      <div class="p15-deco p15-wax" aria-hidden="true">
        <span>ss</span>
      </div>
      <div class="p15-deco p15-perf p15-perf--top" aria-hidden="true"></div>
      <div class="p15-deco p15-perf p15-perf--side" aria-hidden="true"></div>
      <div class="p15-deco p15-cancel" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
      <div class="p15-deco p15-postmark p15-postmark--tl" aria-hidden="true">
        <span class="p15-postmark-ring">bias post<br />approved</span>
        <span class="p15-postmark-line"></span>
        <span class="p15-postmark-date">top 12</span>
      </div>
      <div class="p15-deco p15-postmark p15-postmark--tr is-small" aria-hidden="true">
        <span class="p15-postmark-ring">special<br />delivery</span>
        <span class="p15-postmark-line"></span>
        <span class="p15-postmark-date">★</span>
      </div>
      <div class="p15-deco p15-postmark p15-postmark--br" aria-hidden="true">
        <span class="p15-postmark-ring">collector<br />series</span>
        <span class="p15-postmark-line"></span>
        <span class="p15-postmark-date">♡</span>
      </div>
      <div class="p15-deco p15-postmark p15-postmark--ml is-small" aria-hidden="true">
        <span class="p15-postmark-ring">registered<br />mail</span>
        <span class="p15-postmark-line"></span>
        <span class="p15-postmark-date">12</span>
      </div>
      ${p15RouteSvg()}
      <div class="p15-ornaments p15-ornaments--back" aria-hidden="true">${looseDeco}${flutterDeco}</div>
      <div class="title">
        <div class="t1">my <span>top 12</span> ♡</div>
        <div class="t2">${TITLE_DATE}</div>
      </div>
      <div class="p15-heroes-label">commemorative issue · ranks 1–3</div>
      <div class="p15-heroes">${heroes}</div>
      <div class="p15-grid-label">album page · ranks 4–12</div>
      <div class="p15-album-scatter">${miniStamps}</div>
      <div class="p15-deco p15-deco-burst" aria-hidden="true">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="footer">sssorter.pages.dev</div>
    </div>
  </div>`;
}