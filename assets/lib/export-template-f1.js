/** F1 — Bubbles (from P36). */
import { html } from "./html.js";
import { titleDate } from "./export-templates-shared.js";

function pad(rank) {
  return String(rank).padStart(2, "0");
}

function tierClass(rank) {
  if (rank === 1) return " is-hero";
  if (rank <= 3) return " is-mid";
  return " is-mini";
}

function orbBody(photoInner) {
  return html`<div class="p36-orb">
    <div class="p36-photo">${photoInner}</div>
    <div class="p36-shine" aria-hidden="true"></div>
    <span class="p36-spec" aria-hidden="true"></span>
    <div class="p36-rim" aria-hidden="true"></div>
  </div>`;
}

function bubble(name, rank, memberData, imgSrc) {
  const num = pad(rank);
  const tier = tierClass(rank);
  const mini = rank >= 4;

  if (!name) {
    const rankMark = mini
      ? html`<span class="p36-badge">${num}</span>`
      : html`<span class="p36-rank">${num}</span>`;
    const pill = mini
      ? ""
      : html`<div class="p36-pill">${rankMark}</div>`;
    const badge = mini ? rankMark : "";
    return html`<article class="p36-bubble is-rank-${rank}${tier} is-empty" aria-hidden="true">
      ${orbBody("")}
      ${badge}
      ${pill}
    </article>`;
  }

  const emo =
    rank <= 3
      ? html`<span class="p36-emo">${memberData[name].emoji}</span>`
      : "";
  const rankMark = mini
    ? html`<span class="p36-badge">${num}</span>`
    : html`<span class="p36-rank">${num}</span>`;
  const badge = mini ? rankMark : "";
  const pillRank = mini ? "" : rankMark;

  return html`<article
    class="p36-bubble is-rank-${rank}${tier}"
    style="--member-color:${memberData[name].color}"
  >
    ${orbBody(html`<img src="${imgSrc(name)}" alt="" />`)}
    ${badge}
    <div class="p36-pill">
      ${pillRank}
      <span class="p36-name">${name}</span>
      ${emo}
    </div>
  </article>`;
}

export function renderF1({ top12, memberData }) {
  const imgSrc = (name) => `/members/${memberData[name].sNumber}.jpg`;
  const slot = (rank) => bubble(top12[rank - 1] ?? null, rank, memberData, imgSrc);
  const heroes = [2, 1, 3].map(slot).join("");
  const minis = [4, 5, 6, 7, 8, 9, 10, 11, 12].map(slot).join("");

  return html`<div class="mockup-canvas layout-p36" data-export-canvas>
    <div class="p36-films" aria-hidden="true"></div>
    <div class="p36-glints" aria-hidden="true"></div>
    <header class="p36-mast">
      <div class="title">
        <div class="t1">my <span>top 12</span></div>
        <div class="t2">${titleDate()}</div>
      </div>
    </header>
    <section class="p36-heroes">${heroes}</section>
    <section class="p36-minis">${minis}</section>
    <div class="footer">sssorter.pages.dev</div>
  </div>`;
}
