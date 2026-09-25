/** F9 — Arcade (from P31). */
import { html } from "./html.js";
import { titleDate } from "./export-templates-shared.js";

function pad(rank) {
  return String(rank).padStart(2, "0");
}

function scoreFor(rank) {
  const scores = [
    999999, 880000, 760000, 650000, 545000, 438000, 351000, 274000, 208000,
    152000, 106000, 72000,
  ];
  return String(scores[rank - 1]).padStart(6, "0");
}

function hero(name, memberData, imgSrc) {
  if (!name) {
    return html`<section class="p31-hero is-empty" aria-hidden="true">
      <div class="p31-hero-frame">
        <div class="p31-hero-photo"></div>
      </div>
      <div class="p31-plaque">
        <span class="p31-plaque-rank">01</span>
        <div class="p31-plaque-copy">
          <div class="p31-plaque-name">empty slot</div>
          <div class="p31-plaque-sub">1ST PLACE</div>
        </div>
        <span class="p31-plaque-score">000000</span>
      </div>
    </section>`;
  }
  return html`<section class="p31-hero" style="--member-color:${memberData[name].color}">
    <div class="p31-hero-frame">
      <div class="p31-hero-photo">
        <img src="${imgSrc(name)}" alt="" />
      </div>
      <div class="p31-hero-glow" aria-hidden="true"></div>
    </div>
    <div class="p31-plaque">
      <span class="p31-plaque-rank">01</span>
      <div class="p31-plaque-copy">
        <div class="p31-plaque-name">${name}</div>
        <div class="p31-plaque-sub">1ST PLACE</div>
      </div>
      <span class="p31-plaque-score">${scoreFor(1)}</span>
    </div>
  </section>`;
}

function tile(name, rank, memberData, imgSrc) {
  const num = pad(rank);
  const hi = rank <= 3 ? ` is-hi is-rank-${rank}` : "";
  if (!name) {
    return html`<article class="p31-tile is-empty${hi}" aria-hidden="true">
      <div class="p31-tile-photo"></div>
      <span class="p31-tile-rank">${num}</span>
      <div class="p31-tile-meta">
        <span class="p31-tile-name">--------</span>
        <span class="p31-tile-score">000000</span>
      </div>
    </article>`;
  }
  return html`<article class="p31-tile${hi}" style="--member-color:${memberData[name].color}">
    <div class="p31-tile-photo">
      <img src="${imgSrc(name)}" alt="" />
    </div>
    <span class="p31-tile-rank">${num}</span>
    <div class="p31-tile-meta">
      <span class="p31-tile-name">${name}</span>
      <span class="p31-tile-score">${scoreFor(rank)}</span>
    </div>
  </article>`;
}

export function renderF9({ top12, memberData }) {
  const imgSrc = (name) => `/members/${memberData[name].sNumber}.jpg`;
  const r1 = top12[0] ?? null;
  const accent = r1 ? memberData[r1].color : "#ff2ec8";

  const duo = [2, 3]
    .map((rank) => tile(top12[rank - 1] ?? null, rank, memberData, imgSrc))
    .join("");

  const tiles = Array.from({ length: 9 }, (_, i) =>
    tile(top12[i + 3] ?? null, i + 4, memberData, imgSrc),
  ).join("");

  return html`<div
    class="mockup-canvas layout-p31"
    data-export-canvas
    style="--p31-accent:${accent}"
  >
    <div class="p31-cabinet" aria-hidden="true"></div>
    <div class="p31-bezel" aria-hidden="true"></div>
    <header class="p31-marquee">
      <div class="p31-marquee-lip is-top" aria-hidden="true"></div>
      <div class="p31-grill is-l" aria-hidden="true"></div>
      <div class="title">
        <div class="t1">my <span>top 12</span></div>
        <div class="t2">${titleDate()}</div>
      </div>
      <div class="p31-grill is-r" aria-hidden="true"></div>
      <div class="p31-marquee-lip is-bot" aria-hidden="true"></div>
    </header>
    <span class="p31-screw is-a" aria-hidden="true"></span>
    <span class="p31-screw is-b" aria-hidden="true"></span>
    <span class="p31-screw is-c" aria-hidden="true"></span>
    <span class="p31-screw is-d" aria-hidden="true"></span>
    <span class="p31-screw is-e" aria-hidden="true"></span>
    <span class="p31-screw is-f" aria-hidden="true"></span>
    <div class="p31-crt">
      <div class="p31-crt-glass" aria-hidden="true"></div>
      <div class="p31-crt-scan" aria-hidden="true"></div>
      <div class="p31-left">
        ${hero(r1, memberData, imgSrc)}
        <div class="p31-duo">${duo}</div>
      </div>
      <aside class="p31-board">
        <div class="p31-board-head">
          <div class="p31-board-row">
            <span class="p31-board-lab">HIGH SCORE</span>
            <span class="p31-board-cols">FREE PLAY</span>
          </div>
          <div class="p31-board-row is-sub">
            <span class="p31-board-champ">${r1 ?? "--------"} · ${scoreFor(1)}</span>
            <span class="p31-board-cue">PUSH START</span>
          </div>
        </div>
        <div class="p31-grid">${tiles}</div>
        <div class="p31-hud" aria-hidden="true">
          <div class="p31-led-side">
            <span class="p31-lamp is-on">1P</span>
            <span class="p31-seg">${scoreFor(2)}</span>
            <span class="p31-lives">
              <i class="is-on"></i><i class="is-on"></i><i class="is-on"></i><i></i>
            </span>
          </div>
          <span class="p31-logo-word">tripleS</span>
          <div class="p31-led-side is-r">
            <span class="p31-lamp">2P</span>
            <span class="p31-cred">CREDIT <b>02</b></span>
            <span class="p31-lives">
              <i></i><i></i><i></i><i></i>
            </span>
          </div>
          <div class="p31-hud-scan"></div>
        </div>
      </aside>
    </div>
    <div class="footer">sssorter.pages.dev</div>
  </div>`;
}
