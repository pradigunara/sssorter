import { html } from "./html.js";
import {
  footer,
  gridRows,
  heroRoundCluster,
  roundGridMini,
  titleBlock,
} from "./export-template-helpers.js";

export function renderF3({ top12, memberData }) {
  return html`<div class="mockup-canvas layout-f3" data-export-canvas>
      <div class="confetti-piece k1"></div>
      <div class="confetti-piece k2"></div>
      <div class="confetti-piece k3"></div>
      <div class="confetti-piece k4"></div>
      <div class="confetti-piece k5"></div>
      <div class="confetti-piece k6"></div>
      <div class="confetti-piece k7"></div>
      <div class="confetti-piece k8"></div>
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