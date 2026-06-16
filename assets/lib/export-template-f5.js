/** F5 — Magazine spread (from P10). */
import { html } from "./html.js";
import { titleDate } from "./export-templates-shared.js";

function p10Hero(name, rank, imgSrc) {
  if (!name) return "";
  const num = String(rank).padStart(2, "0");
  return html`<article class="p10-hero">
    <div class="p10-hero-frame">
      <img src="${imgSrc(name)}" alt="" />
      <div class="p10-hero-veil" aria-hidden="true"></div>
    </div>
    <div class="p10-hero-cap">
      <span class="p10-kicker">cover story</span>
      <span class="p10-rank">${num}</span>
      <h2 class="p10-name">${name}</h2>
    </div>
  </article>`;
}

function p10Feature(name, rank, imgSrc) {
  if (!name) return "";
  const num = String(rank).padStart(2, "0");
  const cap = html`<div class="p10-feature-cap">
    <div class="p10-feature-line">
      <span class="p10-rank">${num}</span>
      <h3 class="p10-name">${name}</h3>
    </div>
  </div>`;
  const img = html`<div class="p10-feature-img">
    <img src="${imgSrc(name)}" alt="" />
    <div class="p10-feature-veil" aria-hidden="true"></div>
  </div>`;

  if (rank === 2) {
    return html`<article class="p10-feature is-rank-2">${img}${cap}</article>`;
  }

  return html`<article class="p10-feature is-rank-3">${cap}${img}</article>`;
}

function p10MosaicCell(name, rank, imgSrc) {
  if (!name) {
    return html`<div class="p10-cell is-empty" aria-hidden="true">
      <div class="p10-cell-img"></div>
    </div>`;
  }
  const num = String(rank).padStart(2, "0");
  return html`<div class="p10-cell">
    <div class="p10-cell-img">
      <img src="${imgSrc(name)}" alt="" />
      <span class="p10-cell-rank">${num}</span>
    </div>
    <span class="p10-cell-name">${name}</span>
  </div>`;
}

export function renderF5({ top12, memberData }) {
  const imgSrc = (name) => `/members/${memberData[name].sNumber}.jpg`;
  const TITLE_DATE = titleDate();
  const [r1, r2, r3, ...rest] = top12;

  const gridSlots = rest.slice(0, 9);
  while (gridSlots.length < 9) gridSlots.push(null);
  const mosaic = gridSlots
    .map((name, i) => p10MosaicCell(name, name ? i + 4 : null, imgSrc))
    .join("");

  return html`<div class="mockup-canvas layout-p10" data-export-canvas>
    <div class="p10-paper" aria-hidden="true"></div>
    <div class="p10-page">
      <header class="p10-masthead">
        <div class="p10-rule p10-rule--top" aria-hidden="true"></div>
        <div class="p10-masthead-row">
          <span class="p10-issue">ss edition · vol. 01</span>
          <div class="title">
            <div class="t1">my <span>top 12</span> ♡</div>
            <div class="t2">${TITLE_DATE}</div>
          </div>
          <span class="p10-tagline">editorial</span>
        </div>
        <div class="p10-rule p10-rule--bottom" aria-hidden="true"></div>
      </header>
      <div class="p10-spread">
        ${p10Hero(r1, 1, imgSrc)}
        <aside class="p10-sidebar">
          ${p10Feature(r2, 2, imgSrc)}
          <div class="p10-sidebar-divider" aria-hidden="true"></div>
          ${p10Feature(r3, 3, imgSrc)}
        </aside>
      </div>
      <div class="p10-strip-label">contact sheet · ranks 4–12</div>
      <div class="p10-mosaic">${mosaic}</div>
      <div class="footer">sssorter.pages.dev</div>
    </div>
  </div>`;
}