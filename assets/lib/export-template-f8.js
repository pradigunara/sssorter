/** F8 — Rhythm (from P29). */
import { html } from "./html.js";
import { titleDate } from "./export-templates-shared.js";

function pad(rank) {
  return String(rank).padStart(2, "0");
}

function lifePips(filled = 9, total = 10) {
  return Array.from({ length: total }, (_, i) =>
    html`<i class="${i < filled ? "is-on" : ""}"></i>`,
  ).join("");
}

function chartNotes() {
  const lanes = [
    [0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
    [0, 0, 1, 1, 0, 0, 1, 0, 1, 0],
  ];
  return lanes
    .map(
      (lane) =>
        html`<div class="p29-lane">${lane
          .map((on) => html`<span class="${on ? "is-note" : ""}"></span>`)
          .join("")}</div>`,
    )
    .join("");
}

function rosterTile(name, rank, memberData, imgSrc) {
  const num = pad(rank);
  if (!name) {
    return html`<article class="p29-tile is-empty" aria-hidden="true">
      <div class="p29-sil"></div>
      <span class="p29-tile-rank">${num}</span>
    </article>`;
  }
  const pick = rank === 1 ? " is-pick" : "";
  return html`<article
    class="p29-tile${pick}"
    style="--tile-color:${memberData[name].color}"
  >
    <img src="${imgSrc(name)}" alt="" />
    ${rank === 1 ? html`<span class="p29-tile-sel">SELECTED</span>` : ""}
    <span class="p29-tile-rank">${num}</span>
    <span class="p29-tile-name">${name}</span>
  </article>`;
}

function heroCard(name, imgSrc) {
  if (!name) {
    return html`<div class="p29-hex is-empty">
      <div class="p29-hex-glow" aria-hidden="true"></div>
      <div class="p29-hex-frame">
        <div class="p29-hex-photo"><div class="p29-sil is-lg"></div></div>
      </div>
    </div>`;
  }
  return html`<div class="p29-hex">
    <div class="p29-hex-glow" aria-hidden="true"></div>
    <div class="p29-hex-frame">
      <div class="p29-hex-photo">
        <img src="${imgSrc(name)}" alt="" />
        <div class="p29-hex-shine" aria-hidden="true"></div>
      </div>
    </div>
    <span class="p29-hero-live">LIVE</span>
  </div>`;
}

function nameplate(name, memberData) {
  if (!name) {
    return html`<div class="p29-plate is-empty">
      <span class="p29-no">01</span>
      <div class="p29-plate-name">empty slot</div>
      <div class="p29-plate-sub">waiting</div>
    </div>`;
  }
  return html`<div class="p29-plate">
    <span class="p29-no">01</span>
    <div class="p29-plate-copy">
      <div class="p29-plate-name">${name}</div>
      <div class="p29-plate-sub">
        <span>vocal</span>
        <span>${memberData[name].sNumber}</span>
        <span class="p29-emo">${memberData[name].emoji}</span>
      </div>
    </div>
  </div>`;
}

export function renderF8({ top12, memberData }) {
  const imgSrc = (name) => `/members/${memberData[name].sNumber}.jpg`;
  const r1 = top12[0] ?? null;
  const accent = r1 ? memberData[r1].color : "#7ee8ff";
  const filled = top12.filter(Boolean).length;

  const tiles = Array.from({ length: 12 }, (_, i) =>
    rosterTile(top12[i] ?? null, i + 1, memberData, imgSrc),
  ).join("");

  return html`<div
    class="mockup-canvas layout-p29"
    data-export-canvas
    style="--p29-accent:${accent}"
  >
    <div class="p29-bg" aria-hidden="true"></div>
    <div class="p29-spot" aria-hidden="true"></div>
    <div class="p29-floor" aria-hidden="true"></div>
    <div class="p29-vignette" aria-hidden="true"></div>
    <header class="p29-hud">
      <span class="p29-player">PLAYER 1</span>
      <div class="title">
        <div class="t1">my <span>top 12</span></div>
        <div class="t2">${titleDate()}</div>
      </div>
      <span class="p29-build">bias live</span>
    </header>
    <section class="p29-hero">
      ${heroCard(r1, imgSrc)}
      ${nameplate(r1, memberData)}
      <div class="p29-vanity">
        <div class="p29-stats">
          <div class="p29-diff">
            <span class="p29-diff-lab">difficulty</span>
            <span class="p29-diff-val">MASTER</span>
            <span class="p29-diff-lv">14</span>
          </div>
          <div class="p29-life">
            <span class="p29-life-lab">LIFE</span>
            <div class="p29-life-track">${lifePips()}</div>
          </div>
          <div class="p29-combo">
            <span class="p29-combo-lab">COMBO</span>
            <span class="p29-combo-num">1200</span>
          </div>
        </div>
        <div class="p29-chart" aria-hidden="true">
          <div class="p29-chart-lab">chart</div>
          <div class="p29-lanes">${chartNotes()}</div>
          <div class="p29-judge">PERFECT</div>
        </div>
        <div class="p29-ready">
          <span class="p29-ready-txt">READY</span>
        </div>
      </div>
    </section>
    <aside class="p29-side">
      <div class="p29-side-head">
        <span class="p29-side-lab">unit roster</span>
        <span class="p29-side-count">${pad(filled)} / 12</span>
      </div>
      <div class="p29-grid">${tiles}</div>
    </aside>
    <div class="footer">sssorter.pages.dev</div>
  </div>`;
}
