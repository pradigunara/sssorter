/** F3 — Confetti (from P38). */
import { html } from "./html.js";
import { titleDate } from "./export-templates-shared.js";

function pad(rank) {
  return String(rank).padStart(2, "0");
}

function bits() {
  return Array.from({ length: 32 }, (_, i) =>
    html`<span class="p38-bit p38-k${i + 1}" aria-hidden="true"></span>`,
  ).join("");
}

function poster(name, rank, memberData, imgSrc, extraClass) {
  const num = pad(rank);
  if (!name) {
    return html`<article class="p38-poster ${extraClass} is-empty" aria-hidden="true">
      <div class="p38-photo"></div>
      <span class="p38-stamp">${num}</span>
    </article>`;
  }
  return html`<article
    class="p38-poster ${extraClass}"
    style="--member-color:${memberData[name].color}"
  >
    <span class="p38-strip" aria-hidden="true"></span>
    <div class="p38-photo">
      <img src="${imgSrc(name)}" alt="" />
    </div>
    <span class="p38-stamp">${num}</span>
    <div class="p38-namebar">${name}</div>
    <span class="p38-dots" aria-hidden="true"></span>
  </article>`;
}

function panel(name, rank, memberData, imgSrc) {
  const num = pad(rank);
  if (!name) {
    return html`<article class="p38-panel is-empty" aria-hidden="true">
      <span class="p38-panel-rank">${num}</span>
    </article>`;
  }
  return html`<article
    class="p38-panel"
    style="--member-color:${memberData[name].color}"
  >
    <span class="p38-strip" aria-hidden="true"></span>
    <div class="p38-panel-photo">
      <img src="${imgSrc(name)}" alt="" />
    </div>
    <span class="p38-panel-rank">${num}</span>
    <div class="p38-panel-name">${name}</div>
  </article>`;
}

export function renderF3({ top12, memberData }) {
  const imgSrc = (name) => `/members/${memberData[name].sNumber}.jpg`;
  const TITLE_DATE = titleDate();
  const r1 = top12[0] ?? null;
  const accent = r1 ? memberData[r1].color : "#FF2BD6";

  const panels = Array.from({ length: 9 }, (_, i) =>
    panel(top12[i + 3] ?? null, i + 4, memberData, imgSrc),
  ).join("");

  return html`<div
    class="mockup-canvas layout-p38"
    data-export-canvas
    style="--p38-accent:${accent}"
  >
    <div class="p38-wash" aria-hidden="true"></div>
    <div class="p38-speed" aria-hidden="true"></div>
    <div class="p38-blob is-a" aria-hidden="true"></div>
    <div class="p38-blob is-b" aria-hidden="true"></div>
    ${bits()}
    ${poster(r1, 1, memberData, imgSrc, "is-hero")}
    ${poster(top12[1] ?? null, 2, memberData, imgSrc, "is-r2")}
    ${poster(top12[2] ?? null, 3, memberData, imgSrc, "is-r3")}
    <header class="p38-mast">
      <div class="p38-burst" aria-hidden="true"></div>
      <div class="p38-sticker">
        <div class="title">
          <div class="t1">my <span>top 12</span></div>
          <div class="t2">${TITLE_DATE}</div>
        </div>
      </div>
    </header>
    <section class="p38-sheet">${panels}</section>
    <div class="p38-reg" aria-hidden="true">
      <i class="is-c"></i><i class="is-m"></i><i class="is-y"></i><i class="is-k"></i>
    </div>
    <div class="footer">sssorter.pages.dev</div>
  </div>`;
}
