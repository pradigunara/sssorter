import { html } from "./html.js";
import {
  footer,
  gridRows,
  heroPolaroidCluster,
  roundGridMini,
  titleBlock,
} from "./export-template-helpers.js";

export function renderF2({ top12, memberData }) {
  return html`<div class="mockup-canvas layout-f2" data-export-canvas>
      <div class="deco-note n1"></div>
      <div class="deco-note n2"></div>
      <div class="deco-note n3"></div>
      <div class="deco-note n4"></div>
      ${titleBlock()}
      <div class="hero-cluster">${heroPolaroidCluster(top12, memberData)}</div>
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