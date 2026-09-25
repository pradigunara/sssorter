/** F2 — Polaroid (from P37). */
import { html } from "./html.js";
import { titleDate } from "./export-templates-shared.js";

/** @type {Record<number, { kind: "tape" | "pin", extra: string }>} */
const FASTENER = {
  1: { kind: "tape", extra: "is-wide" },
  2: { kind: "pin", extra: "" },
  3: { kind: "tape", extra: "is-tilt" },
  4: { kind: "pin", extra: "" },
  5: { kind: "tape", extra: "is-corner" },
  6: { kind: "pin", extra: "" },
  7: { kind: "tape", extra: "" },
  8: { kind: "pin", extra: "" },
  9: { kind: "tape", extra: "is-corner" },
  10: { kind: "pin", extra: "" },
  11: { kind: "tape", extra: "is-tilt" },
  12: { kind: "tape", extra: "is-corner" },
};

function sizeClass(rank) {
  if (rank === 1) return "is-hero";
  if (rank <= 3) return "is-mid";
  return "is-mini";
}

function fastener(rank) {
  const spec = FASTENER[rank];
  if (spec.kind === "pin") {
    return html`<span class="p37-pin" aria-hidden="true"></span>`;
  }
  return html`<span class="p37-tape ${spec.extra}" aria-hidden="true"></span>`;
}

function polaroid(name, rank, memberData, imgSrc) {
  const empty = !name;
  const color = empty ? "#b08958" : memberData[name].color;
  const photo = empty
    ? html`<div class="p37-photo"></div>`
    : html`<div class="p37-photo"><img src="${imgSrc(name)}" alt="" /></div>`;
  const caption = empty
    ? html`<div class="p37-caption">${rank} ·</div>`
    : html`<div class="p37-caption">${rank} · ${name}</div>`;
  const badge =
    rank === 1 ? html`<span class="p37-badge">1</span>` : "";

  return html`<article
    class="p37-card ${sizeClass(rank)} is-r${rank}${empty ? " is-empty" : ""}"
    style="--member-color:${color}"
    ${empty ? `aria-hidden="true"` : ""}
  >
    ${fastener(rank)}
    ${photo}
    ${caption}
    ${badge}
  </article>`;
}

export function renderF2({ top12, memberData }) {
  const imgSrc = (name) => `/members/${memberData[name].sNumber}.jpg`;
  const r1 = top12[0] ?? null;
  const accent = r1 ? memberData[r1].color : "#8b3a2a";

  const slot = (rank) => polaroid(top12[rank - 1] ?? null, rank, memberData, imgSrc);
  const heroes = [2, 1, 3].map(slot).join("");
  const minis = [4, 5, 6, 7, 8, 9, 10, 11, 12].map(slot).join("");

  return html`<div
    class="mockup-canvas layout-p37"
    data-export-canvas
    style="--p37-accent:${accent}"
  >
    <div class="p37-cork" aria-hidden="true"></div>
    <div class="p37-grain" aria-hidden="true"></div>
    <div class="p37-vignette" aria-hidden="true"></div>
    <div class="p37-rail is-top" aria-hidden="true"></div>
    <header class="p37-label">
      <span class="p37-label-tape is-l" aria-hidden="true"></span>
      <span class="p37-label-tape is-r" aria-hidden="true"></span>
      <div class="title">
        <div class="t1">my <span>top 12</span></div>
        <div class="t2">${titleDate()}</div>
      </div>
    </header>
    <section class="p37-heroes">${heroes}</section>
    <section class="p37-minis">${minis}</section>
    <div class="p37-rail is-bot" aria-hidden="true"></div>
    <div class="footer">sssorter.pages.dev</div>
  </div>`;
}
