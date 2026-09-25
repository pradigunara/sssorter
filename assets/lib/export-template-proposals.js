/**
 * Storybook-only share-image proposals.
 * Not wired into the live export modal until promoted.
 */

import p40Css from "../css/export-p40-newsprint.css?inline";
import p41Css from "../css/export-p41-vinyl.css?inline";
import p42Css from "../css/export-p42-yearbook.css?inline";
import { renderP40 } from "./export-template-p40.js";
import { renderP41 } from "./export-template-p41.js";
import { renderP42 } from "./export-template-p42.js";

/** @typedef {{ id: string, name: string, tag: string, desc: string, render: Function, css: string, cssId: string }} ExportProposal */

/** @type {ExportProposal[]} */
export const EXPORT_PROPOSALS = [
  {
    id: "p40",
    name: "Newsprint",
    tag: "press",
    desc: "Broadsheet front page — #1 lead photo, #2/#3 columns, ranks 4–12 as late-city briefs.",
    render: renderP40,
    css: p40Css,
    cssId: "export-p40-css",
  },
  {
    id: "p41",
    name: "Vinyl",
    tag: "shop",
    desc: "Record-shop wall — #1 sleeve with disc peeking, #2/#3 flanking, 4–12 as 7-inch labels.",
    render: renderP41,
    css: p41Css,
    cssId: "export-p41-css",
  },
  {
    id: "p42",
    name: "Yearbook",
    tag: "class",
    desc: "School annual spread — #1 center portrait, #2/#3 flanking, ranks 4–12 as signed class photos.",
    render: renderP42,
    css: p42Css,
    cssId: "export-p42-css",
  },
];

export function injectProposalCSS() {
  for (const proposal of EXPORT_PROPOSALS) {
    if (document.getElementById(proposal.cssId)) continue;
    const style = document.createElement("style");
    style.id = proposal.cssId;
    style.textContent = proposal.css;
    document.head.appendChild(style);
  }
}
