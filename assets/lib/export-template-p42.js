/** P42 — School yearbook spread. Storybook-only. */
import { html } from "./html.js";
import { titleDate } from "./export-templates-shared.js";

function pad(rank) {
  return String(rank).padStart(2, "0");
}

function portrait(name, rank, memberData, imgSrc, extra = "") {
  const empty = !name;
  const color = empty ? "#8a7a6c" : memberData[name].color;
  const photo = empty
    ? html`<div class="p42-photo"></div>`
    : html`<div class="p42-photo"><img src="${imgSrc(name)}" alt="" /></div>`;
  const plate = empty
    ? html`<div class="p42-plate"><span class="p42-rank">${pad(rank)}</span></div>`
    : html`<div class="p42-plate">
        <span class="p42-rank">${pad(rank)}</span>
        <span class="p42-name">${name}</span>
      </div>`;

  return html`<article
    class="p42-port ${extra}${empty ? " is-empty" : ""}"
    style="--member-color:${color}"
    ${empty ? `aria-hidden="true"` : ""}
  >
    ${photo}
    ${plate}
  </article>`;
}

export function renderP42({ top12, memberData }) {
  const imgSrc = (name) => `/members/${memberData[name].sNumber}.jpg`;
  const heroes = [2, 1, 3]
    .map((rank) =>
      portrait(
        top12[rank - 1] ?? null,
        rank,
        memberData,
        imgSrc,
        rank === 1 ? "is-hero" : "is-mid",
      ),
    )
    .join("");
  const classRow = [4, 5, 6, 7, 8, 9, 10, 11, 12]
    .map((rank) => portrait(top12[rank - 1] ?? null, rank, memberData, imgSrc, "is-mini"))
    .join("");

  return html`<div class="mockup-canvas layout-p42" data-export-canvas>
    <div class="p42-page" aria-hidden="true"></div>
    <div class="p42-gutter" aria-hidden="true"></div>
    <header class="p42-mast">
      <span class="p42-crest">sss</span>
      <div class="title">
        <div class="t1">my <span>top 12</span></div>
        <div class="t2">${titleDate()}</div>
      </div>
      <span class="p42-year">class rank</span>
    </header>
    <section class="p42-heroes">${heroes}</section>
    <section class="p42-class">${classRow}</section>
    <div class="footer">sssorter.pages.dev</div>
  </div>`;
}
