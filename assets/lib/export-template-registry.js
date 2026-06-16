/**
 * Central registry for share-image export templates (F1–F6).
 *
 * To add F7:
 * 1. Create assets/css/export-f7-<name>.css
 * 2. Create assets/lib/export-template-f7.js exporting renderF7(data)
 * 3. Append one entry to EXPORT_TEMPLATES below
 * 4. Add a card in index.html (data-layout="f7", id="export-preview-f7")
 */

import baseCss from "../css/export-template-base.css?inline";
import f1Css from "../css/export-f1-bubbles.css?inline";
import f2Css from "../css/export-f2-polaroid.css?inline";
import f3Css from "../css/export-f3-confetti.css?inline";
import f4Css from "../css/export-f4-chalkboard.css?inline";
import f5Css from "../css/export-f5-magazine.css?inline";
import f6Css from "../css/export-f6-stamp.css?inline";

import { renderF1 } from "./export-template-f1.js";
import { renderF2 } from "./export-template-f2.js";
import { renderF3 } from "./export-template-f3.js";
import { renderF4 } from "./export-template-f4.js";
import { renderF5 } from "./export-template-f5.js";
import { renderF6 } from "./export-template-f6.js";

const BASE_STYLE_ID = "export-template-base-css";

/** @typedef {{ id: string, name: string, tag: string, previewId: string, render: (data: { top12: string[], memberData: object }) => string, css: string, cssId: string }} ExportTemplate */

/** @type {ExportTemplate[]} */
export const EXPORT_TEMPLATES = [
  {
    id: "f1",
    name: "Bubbles",
    tag: "playful",
    previewId: "export-preview-f1",
    render: renderF1,
    css: f1Css,
    cssId: "export-f1-css",
  },
  {
    id: "f2",
    name: "Polaroid",
    tag: "elegant",
    previewId: "export-preview-f2",
    render: renderF2,
    css: f2Css,
    cssId: "export-f2-css",
  },
  {
    id: "f3",
    name: "Confetti",
    tag: "festive",
    previewId: "export-preview-f3",
    render: renderF3,
    css: f3Css,
    cssId: "export-f3-css",
  },
  {
    id: "f4",
    name: "Case Board",
    tag: "detective",
    previewId: "export-preview-f4",
    render: renderF4,
    css: f4Css,
    cssId: "export-f4-css",
  },
  {
    id: "f5",
    name: "Magazine",
    tag: "editorial",
    previewId: "export-preview-f5",
    render: renderF5,
    css: f5Css,
    cssId: "export-f5-css",
  },
  {
    id: "f6",
    name: "Stamp Album",
    tag: "vintage",
    previewId: "export-preview-f6",
    render: renderF6,
    css: f6Css,
    cssId: "export-f6-css",
  },
];

export function templateById(id) {
  return EXPORT_TEMPLATES.find((t) => t.id === id);
}

export function templateRenderers() {
  return Object.fromEntries(EXPORT_TEMPLATES.map((t) => [t.id, t.render]));
}

export function templatePreviewIds() {
  return Object.fromEntries(EXPORT_TEMPLATES.map((t) => [t.id, t.previewId]));
}

let injected = false;

function injectStyle(id, css) {
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}

export function injectTemplateCSS() {
  if (injected) return;
  injectStyle(BASE_STYLE_ID, baseCss);
  for (const template of EXPORT_TEMPLATES) {
    injectStyle(template.cssId, template.css);
  }
  injected = true;
}