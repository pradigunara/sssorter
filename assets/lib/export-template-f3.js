/** F3 — Confetti (from P43). */
import { html } from "./html.js";
import { titleDate } from "./export-templates-shared.js";

function pad(rank) {
  return String(rank).padStart(2, "0");
}

function bits() {
  return Array.from({ length: 24 }, (_, i) =>
    html`<span class="p43-bit p43-k${i + 1}" aria-hidden="true"></span>`,
  ).join("");
}

function card(name, rank, memberData, imgSrc, extraClass) {
  const num = pad(rank);
  if (!name) {
    return html`<article class="p43-card ${extraClass} is-empty" aria-hidden="true">
      <div class="p43-photo"></div>
      <span class="p43-stamp">${num}</span>
    </article>`;
  }
  return html`<article
    class="p43-card ${extraClass}"
    style="--member-color:${memberData[name].color}"
  >
    <span class="p43-strip" aria-hidden="true"></span>
    <div class="p43-photo">
      <img src="${imgSrc(name)}" alt="" />
    </div>
    <span class="p43-stamp">${num}</span>
    <div class="p43-namebar">${name}</div>
  </article>`;
}

export function renderF3({ top12, memberData }) {
  const imgSrc = (name) => `/members/${memberData[name].sNumber}.jpg`;
  const r1 = top12[0] ?? null;
  const accent = r1 ? memberData[r1].color : "#FF2BD6";
  const slot = (rank, cls) => card(top12[rank - 1] ?? null, rank, memberData, imgSrc, cls);

  const topRow = [5, 6, 7, 8].map((rank) => slot(rank, "is-mini")).join("");
  const botRow = [9, 10, 11, 12].map((rank) => slot(rank, "is-mini")).join("");

  return html`<div
    class="mockup-canvas layout-p43"
    data-export-canvas
    style="--p43-accent:${accent}"
  >
    <div class="p43-wash" aria-hidden="true"></div>
    <div class="p43-speed" aria-hidden="true"></div>
    <div class="p43-blob is-a" aria-hidden="true"></div>
    <div class="p43-blob is-b" aria-hidden="true"></div>
    ${bits()}
    ${slot(1, "is-r1")}
    ${slot(2, "is-r2")}
    ${slot(3, "is-r3")}
    ${slot(4, "is-r4")}
    <header class="p43-mast">
      <div class="p43-burst" aria-hidden="true"></div>
      <div class="p43-sticker">
        <div class="title">
          <div class="t1">my <span>top 12</span></div>
          <div class="t2">${titleDate()}</div>
        </div>
      </div>
    </header>
    <section class="p43-row is-top">${topRow}</section>
    <section class="p43-row is-bot">${botRow}</section>
    <div class="p43-reg" aria-hidden="true">
      <i class="is-c"></i><i class="is-m"></i><i class="is-y"></i><i class="is-k"></i>
    </div>
    <div class="footer">sssorter.pages.dev</div>
  </div>`;
}
