/** F7 — Rank 1 + trio on the left, two 4-cut photostrips on the right (from P17). */
import { html } from "./html.js";
import { titleDate } from "./export-templates-shared.js";

function pad(rank) {
  return String(rank).padStart(2, "0");
}

function p17Card(name, rank, memberData, imgSrc, extraClass = "") {
  if (!name) {
    return html`<article class="p17-card is-empty ${extraClass}" aria-hidden="true">
      <div class="p17-sleeve">
        <div class="p17-photo"></div>
      </div>
    </article>`;
  }
  const color = memberData[name].color;
  const sNumber = memberData[name].sNumber;
  const star = rank === 1 ? html`<span class="p17-star" aria-hidden="true">★</span>` : "";
  return html`<article
    class="p17-card ${extraClass}"
    style="--member-color:${color}"
  >
    <div class="p17-sleeve">
      <div class="p17-photo">
        <img src="${imgSrc(name)}" alt="" />
        <span class="p17-snum">${sNumber}</span>
        <span class="p17-rank">${pad(rank)}</span>
        ${star}
        <div class="p17-shine" aria-hidden="true"></div>
      </div>
      <div class="p17-caption">${name}</div>
    </div>
  </article>`;
}

function p17Frame(name, rank, memberData, imgSrc) {
  if (!name) {
    return html`<div class="p17-frame is-empty" aria-hidden="true"></div>`;
  }
  return html`<div class="p17-frame" style="--member-color:${memberData[name].color}">
    <img src="${imgSrc(name)}" alt="" />
    <span class="p17-frame-rank">${pad(rank)}</span>
    <span class="p17-frame-name">${name}</span>
  </div>`;
}

function p17Strip(top12, memberData, imgSrc, startRank, variant) {
  const frames = Array.from({ length: 4 }, (_, i) =>
    p17Frame(top12[startRank - 1 + i] ?? null, startRank + i, memberData, imgSrc),
  ).join("");
  const endRank = startRank + 3;
  return html`<article class="p17-strip is-${variant}">
    <div class="p17-strip-head">
      <span class="p17-strip-brand">bias 4-cut</span>
      <span class="p17-strip-range">${pad(startRank)}–${pad(endRank)}</span>
    </div>
    <div class="p17-strip-frames">${frames}</div>
    <div class="p17-strip-foot">sssorter</div>
  </article>`;
}

export function renderF7({ top12, memberData }) {
  const imgSrc = (name) => `/members/${memberData[name].sNumber}.jpg`;
  const TITLE_DATE = titleDate();

  const trio = [2, 3, 4]
    .map((rank) =>
      p17Card(top12[rank - 1] ?? null, rank, memberData, imgSrc, `is-rank-${rank}`),
    )
    .join("");

  return html`<div class="mockup-canvas layout-p17" data-export-canvas>
    <div class="p17-felt" aria-hidden="true"></div>
    <header class="p17-mast">
      <div class="title">
        <div class="t1">my <span>top 12</span></div>
        <div class="t2">${TITLE_DATE}</div>
        <span class="p17-kicker">desk print · 4-cut extra</span>
      </div>
    </header>
    <div class="p17-left">
      ${p17Card(top12[0] ?? null, 1, memberData, imgSrc, "is-hero")}
      <div class="p17-trio">${trio}</div>
    </div>
    <div class="p17-right">
      ${p17Strip(top12, memberData, imgSrc, 5, "a")}
      ${p17Strip(top12, memberData, imgSrc, 9, "b")}
    </div>
    <div class="footer">sssorter.pages.dev</div>
  </div>`;
}
