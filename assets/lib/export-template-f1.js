import { html } from "./html.js";
import {
  footer,
  gridRows,
  heroRoundCluster,
  roundGridMini,
  titleBlock,
} from "./export-template-helpers.js";

export function renderF1({ top12, memberData }) {
  return html`<div class="mockup-canvas layout-f1" data-export-canvas>
      <div class="sticker-deco s1">✦</div>
      <div class="sticker-deco s2">♡</div>
      <div class="sticker-deco s3">✿</div>
      <div class="sticker-deco s4">★</div>
      ${titleBlock()}
      <div class="hero-cluster">${heroRoundCluster(top12, memberData)}</div>
      <div class="sticker-grid">
        ${gridRows({
          top12,
          memberData,
          renderMini: roundGridMini(memberData),
          startSlot: 3,
        })}
      </div>
      ${footer()}
  </div>`;
}