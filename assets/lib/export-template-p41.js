/** P41 — Record-shop vinyl wall. Storybook-only. */
import { html } from "./html.js";
import { titleDate } from "./export-templates-shared.js";

function pad(rank) {
  return String(rank).padStart(2, "0");
}

function sleeve(name, rank, memberData, imgSrc, extra = "") {
  const empty = !name;
  const color = empty ? "#8a7a68" : memberData[name].color;
  const photo = empty
    ? html`<div class="p41-art"></div>`
    : html`<div class="p41-art"><img src="${imgSrc(name)}" alt="" /></div>`;
  const meta = empty
    ? html`<div class="p41-meta"><span class="p41-rank">${pad(rank)}</span></div>`
    : html`<div class="p41-meta">
        <span class="p41-rank">${pad(rank)}</span>
        <span class="p41-name">${name}</span>
      </div>`;

  return html`<article
    class="p41-sleeve ${extra}${empty ? " is-empty" : ""}"
    style="--member-color:${color}"
    ${empty ? `aria-hidden="true"` : ""}
  >
    <div class="p41-disc" aria-hidden="true"></div>
    ${photo}
    ${meta}
  </article>`;
}

function disc(name, rank, memberData, imgSrc) {
  const empty = !name;
  const color = empty ? "#8a7a68" : memberData[name].color;
  const photo = empty
    ? html`<div class="p41-label"></div>`
    : html`<div class="p41-label"><img src="${imgSrc(name)}" alt="" /></div>`;
  const caption = empty
    ? html`<span class="p41-cap">${pad(rank)}</span>`
    : html`<span class="p41-cap"><b>${pad(rank)}</b> ${name}</span>`;

  return html`<article
    class="p41-seven${empty ? " is-empty" : ""}"
    style="--member-color:${color}"
    ${empty ? `aria-hidden="true"` : ""}
  >
    <div class="p41-platter">
      ${photo}
    </div>
    ${caption}
  </article>`;
}

export function renderP41({ top12, memberData }) {
  const imgSrc = (name) => `/members/${memberData[name].sNumber}.jpg`;
  const heroes = [2, 1, 3]
    .map((rank) =>
      sleeve(
        top12[rank - 1] ?? null,
        rank,
        memberData,
        imgSrc,
        rank === 1 ? "is-hero" : rank === 2 ? "is-r2" : "is-r3",
      ),
    )
    .join("");
  const crate = [4, 5, 6, 7, 8, 9, 10, 11, 12]
    .map((rank) => disc(top12[rank - 1] ?? null, rank, memberData, imgSrc))
    .join("");

  return html`<div class="mockup-canvas layout-p41" data-export-canvas>
    <div class="p41-shop" aria-hidden="true"></div>
    <div class="p41-grain" aria-hidden="true"></div>
    <header class="p41-mast">
      <div class="title">
        <div class="t1">my <span>top 12</span></div>
        <div class="t2">${titleDate()}</div>
      </div>
      <span class="p41-kicker">new arrivals · listening copy</span>
    </header>
    <section class="p41-heroes">${heroes}</section>
    <section class="p41-crate">${crate}</section>
    <div class="footer">sssorter.pages.dev</div>
  </div>`;
}
