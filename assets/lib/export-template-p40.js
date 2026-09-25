/** P40 — Broadsheet newsprint. Storybook-only. */
import { html } from "./html.js";
import { titleDate } from "./export-templates-shared.js";

function pad(rank) {
  return String(rank).padStart(2, "0");
}

function sizeClass(rank) {
  if (rank === 1) return "is-hero";
  if (rank <= 3) return "is-mid";
  return "is-mini";
}

function story(name, rank, memberData, imgSrc) {
  const empty = !name;
  const color = empty ? "#7a6a58" : memberData[name].color;
  const photo = empty
    ? html`<div class="p40-photo"></div>`
    : html`<div class="p40-photo"><img src="${imgSrc(name)}" alt="" /></div>`;
  const byline = empty
    ? html`<div class="p40-byline"><span class="p40-rank">${pad(rank)}</span></div>`
    : html`<div class="p40-byline">
        <span class="p40-rank">${pad(rank)}</span>
        <span class="p40-name">${name}</span>
      </div>`;

  return html`<article
    class="p40-story ${sizeClass(rank)}${empty ? " is-empty" : ""}"
    style="--member-color:${color}"
    ${empty ? `aria-hidden="true"` : ""}
  >
    ${photo}
    ${byline}
  </article>`;
}

export function renderP40({ top12, memberData }) {
  const imgSrc = (name) => `/members/${memberData[name].sNumber}.jpg`;
  const slot = (rank) => story(top12[rank - 1] ?? null, rank, memberData, imgSrc);
  const heroes = [2, 1, 3].map(slot).join("");
  const briefs = [4, 5, 6, 7, 8, 9, 10, 11, 12].map(slot).join("");

  return html`<div class="mockup-canvas layout-p40" data-export-canvas>
    <div class="p40-paper" aria-hidden="true"></div>
    <div class="p40-rules" aria-hidden="true"></div>
    <header class="p40-mast">
      <div class="p40-flag">
        <span>vol. xii</span>
        <span>late city</span>
        <span>${titleDate()}</span>
      </div>
      <div class="title">
        <div class="t1">the bias <span>times</span></div>
        <div class="t2">my top 12 · exclusive ranking</div>
      </div>
    </header>
    <section class="p40-heroes">${heroes}</section>
    <section class="p40-briefs">${briefs}</section>
    <div class="footer">sssorter.pages.dev</div>
  </div>`;
}
