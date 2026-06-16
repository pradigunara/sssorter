import { html } from "./html.js";
import { titleDate } from "./export-templates-shared.js";

export const imgSrc = (memberData, name) => `/members/${memberData[name].sNumber}.jpg`;
export const emo = (memberData, name) => memberData[name].emoji;
export const footer = () => html`<div class="footer">sssorter.pages.dev</div>`;
export const titleBlock = () =>
  html`<div class="title">
    <div class="t1">my <span>top 12</span> ♡</div>
    <div class="t2">${titleDate()}</div>
  </div>`;

export function gridRows({ top12, memberData, renderMini, startSlot = 3 }) {
  const rest = top12.slice(startSlot);
  const rows = [];
  for (let row = 0; row < 3; row++) {
    const cells = [];
    for (let col = 0; col < 3; col++) {
      const slot = row * 3 + col;
      const pos = slot + 1;
      const name = rest[slot];
      const rank = slot + startSlot + 1;
      cells.push(
        name
          ? renderMini(name, rank, pos, memberData)
          : html`<div class="mini r${pos} empty"></div>`,
      );
    }
    rows.push(html`<div class="row">${cells.join("")}</div>`);
  }
  return rows.join("");
}

export function stickerRound(name, rank, memberData) {
  return html`<div class="sticker s${rank === 1 ? 1 : rank}">
    <div class="img"><img src="${imgSrc(memberData, name)}" alt="" /></div>
    <div class="rank-tag">${rank}</div>
    <div class="name-tag">${name}</div>
    <div class="emoji">${emo(memberData, name)}</div>
  </div>`;
}

export function stickerPolaroid(name, rank, memberData) {
  const sizeClass = rank === 1 ? "s1" : rank === 2 ? "s2" : "s3";
  return html`<div class="sticker ${sizeClass}">
    <div class="tape"></div>
    <div class="img"><img src="${imgSrc(memberData, name)}" alt="" /></div>
    <div class="caption">${rank} · ${name} ${emo(memberData, name)}</div>
    <div class="rank-tag">${rank}</div>
  </div>`;
}

export function heroRoundCluster(top12, memberData) {
  const [r1, r2, r3] = top12;
  return html`${r2 ? stickerRound(r2, 2, memberData) : ""}
    ${r1 ? stickerRound(r1, 1, memberData) : ""}
    ${r3 ? stickerRound(r3, 3, memberData) : ""}`;
}

export function heroPolaroidCluster(top12, memberData) {
  const [r1, r2, r3] = top12;
  return html`${r2 ? stickerPolaroid(r2, 2, memberData) : ""}
    ${r1 ? stickerPolaroid(r1, 1, memberData) : ""}
    ${r3 ? stickerPolaroid(r3, 3, memberData) : ""}`;
}

export function roundGridMini(memberData) {
  return (n, rk, pos) =>
    html`<div class="mini r${pos}">
      <div class="img">
        <img src="${imgSrc(memberData, n)}" alt="" />
      </div>
      <div class="num">${rk}</div>
    </div>`;
}