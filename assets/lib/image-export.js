// Lazy entry point for the image-export feature.
// Imported dynamically from sorter.js:showResult() so it is code-split
// into its own chunk and only loaded when the user reaches the result screen.

import * as htmlToImage from "html-to-image";
import {
  injectTemplateCSS,
  templatePreviewIds,
  templateRenderers,
} from "./export-template-registry.js";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Caveat:wght@500;600;700&family=Fragment+Mono&family=Nunito:wght@400;600;700;800;900&display=swap";
const FONT_LINK_ID = "export-template-fonts";

/** Explicit loads so export capture never falls back to generic cursive/monospace. */
const EXPORT_FONT_LOADS = [
  '700 52px "Caveat"',
  '600 26px "Caveat"',
  '700 10px "Fragment Mono"',
  '400 12px "Fragment Mono"',
  '800 48px "Bricolage Grotesque"',
  '700 22px "Bricolage Grotesque"',
  '900 62px "Nunito"',
  '800 14px "Nunito"',
];

const GENERIC_FAMILIES = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
]);

let cachedExportFontEmbedCSS = null;

const RENDERERS = templateRenderers();
const PREVIEW_IDS = templatePreviewIds();

let modalEls = null;
let downloadHandlersWired = false;
let lastRenderKey = "";

function cacheModalEls() {
  return {
    modal: document.getElementById("image-export-modal"),
    backdrops: document.querySelectorAll("#image-export-modal [data-close]"),
    downloadButtons: document.querySelectorAll("#image-export-modal .template-download"),
  };
}

export async function openExportModal({ sortedMembers, memberData }) {
  injectTemplateCSS();
  await ensureFontStylesheet();

  if (!modalEls) modalEls = cacheModalEls();
  wireCloseHandlers();
  wireDownloadButtons();

  const data = { top12: sortedMembers.slice(0, 12), memberData };
  const renderKey = data.top12.join("|");

  if (renderKey !== lastRenderKey) {
    Object.entries(RENDERERS).forEach(([layout, render]) => {
      const preview = document.getElementById(PREVIEW_IDS[layout]);
      if (preview) preview.innerHTML = render(data);
    });
    lastRenderKey = renderKey;
    await waitForPreviewImages();
  }

  await ensureFontsLoaded(modalEls.modal);
  showModal();
  fitMockupScales();
}

export function closeExportModal() {
  if (!modalEls) {
    const modal = document.getElementById("image-export-modal");
    modal?.classList.add("is-hidden");
    modal?.classList.remove("is-visible");
    return;
  }
  modalEls.modal.classList.add("is-hidden");
  modalEls.modal.classList.remove("is-visible");
}

function showModal() {
  modalEls.modal.classList.remove("is-hidden");
  modalEls.modal.classList.add("is-visible");
  modalEls.modal.setAttribute("aria-hidden", "false");
}

function wireCloseHandlers() {
  modalEls.backdrops.forEach((el) => {
    if (el.dataset.wiredClose === "1") return;
    el.dataset.wiredClose = "1";
    el.addEventListener("click", closeExportModal);
  });
}

function wireDownloadButtons() {
  if (downloadHandlersWired) return;
  modalEls.downloadButtons.forEach((btn) => {
    btn.dataset.wiredDownload = "1";
    btn.addEventListener("click", async () => {
      const layout = btn.dataset.layout;
      const preview = document.getElementById(PREVIEW_IDS[layout]);
      if (!preview) return;
      await downloadTemplate(preview, btn);
    });
  });
  downloadHandlersWired = true;
}

function ensureFontLink() {
  let link = document.getElementById(FONT_LINK_ID);
  if (link) return link;
  link = document.createElement("link");
  link.id = FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href = FONT_HREF;
  document.head.appendChild(link);
  return link;
}

async function ensureFontStylesheet() {
  const link = ensureFontLink();
  if (link.sheet) return;
  await new Promise((resolve, reject) => {
    link.addEventListener("load", resolve, { once: true });
    link.addEventListener(
      "error",
      () => reject(new Error("export template fonts failed to load")),
      { once: true },
    );
  });
}

function primaryFontFamily(fontFamily) {
  const families = fontFamily.split(",").map((face) => face.trim().replace(/^["']|["']$/g, ""));
  return families.find((face) => !GENERIC_FAMILIES.has(face.toLowerCase())) ?? families[0] ?? fontFamily;
}

function fontLoadDescriptor({ fontWeight, fontSize, fontFamily }) {
  return `${fontWeight} ${fontSize} "${primaryFontFamily(fontFamily)}"`;
}

function loadExplicitExportFonts() {
  return EXPORT_FONT_LOADS.map((desc) => document.fonts.load(desc).catch(() => {}));
}

function loadComputedFonts(root) {
  const seen = new Set();
  const loads = [];
  const walk = (el) => {
    if (!(el instanceof Element)) return;
    const style = getComputedStyle(el);
    const desc = fontLoadDescriptor(style);
    if (!seen.has(desc)) {
      seen.add(desc);
      loads.push(document.fonts.load(desc).catch(() => {}));
    }
    for (const child of el.children) walk(child);
  };
  walk(root);
  return loads;
}

async function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function inlineFontAssetUrls(cssText, baseUrl) {
  const urls = new Set();
  for (const match of cssText.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) {
    const url = match[2];
    if (!url.startsWith("data:")) urls.add(url);
  }

  for (const url of urls) {
    const absolute = url.startsWith("https://") ? url : new URL(url, baseUrl).href;
    try {
      const res = await fetch(absolute);
      if (!res.ok) continue;
      const dataUrl = await blobToDataURL(await res.blob());
      cssText = cssText.replaceAll(url, dataUrl);
    } catch {
      // Keep the remote URL if a single asset fails.
    }
  }

  return cssText;
}

/** Embed every export @font-face — avoids html-to-image missing Caveat on F4 titles. */
async function getExportFontEmbedCSS() {
  if (cachedExportFontEmbedCSS) return cachedExportFontEmbedCSS;
  const res = await fetch(FONT_HREF);
  if (!res.ok) throw new Error("export fonts css fetch failed");
  let cssText = await res.text();
  cssText = await inlineFontAssetUrls(cssText, FONT_HREF);
  cachedExportFontEmbedCSS = cssText;
  return cssText;
}

async function ensureFontsLoaded(root = document.getElementById("image-export-modal") || document.body) {
  await ensureFontStylesheet();
  await Promise.all([...loadComputedFonts(root), ...loadExplicitExportFonts(), document.fonts.ready]);
}

async function prepareExportFonts(canvas) {
  await ensureFontStylesheet();
  await Promise.all([...loadComputedFonts(canvas), ...loadExplicitExportFonts(), document.fonts.ready]);
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  return getExportFontEmbedCSS();
}

function fitMockupScales() {
  document.querySelectorAll("#image-export-modal .template-preview").forEach((preview) => {
    const w = preview.getBoundingClientRect().width;
    if (w === 0) return;
    const scale = w / 1080;
    const canvas = preview.querySelector(".mockup-canvas");
    if (canvas) canvas.style.setProperty("--mockup-scale", scale.toFixed(4));
  });
}

function waitForImages(root) {
  const imgs = Array.from(root.querySelectorAll("img"));
  return Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    }),
  );
}

function waitForPreviewImages() {
  return waitForImages(document.getElementById("image-export-modal") || document.body);
}

async function downloadTemplate(preview, button) {
  const originalLabel = button.textContent;
  button.disabled = true;
  button.classList.add("is-loading");
  button.textContent = "Generating…";

  const canvas = preview.querySelector(".mockup-canvas");
  if (!canvas) {
    setTimeout(() => restoreButton(button, originalLabel), 1500);
    button.textContent = "Error";
    return;
  }

  const prevScale = canvas.style.getPropertyValue("--mockup-scale");
  canvas.classList.add("is-export-capture");
  canvas.style.setProperty("--mockup-scale", "1");

  try {
    await waitForImages(canvas);
    const fontEmbedCSS = await prepareExportFonts(canvas);

    const blob = await htmlToImage.toBlob(canvas, {
      pixelRatio: 1,
      cacheBust: true,
      fontEmbedCSS,
    });
    if (!blob) throw new Error("toBlob returned null");
    triggerDownload(blob, makeFilename());
  } catch (err) {
    button.textContent = "Failed — try again";
    setTimeout(() => restoreButton(button, originalLabel), 2000);
    return;
  } finally {
    canvas.classList.remove("is-export-capture");
    if (prevScale) canvas.style.setProperty("--mockup-scale", prevScale);
    else canvas.style.removeProperty("--mockup-scale");
    fitMockupScales();
  }

  restoreButton(button, originalLabel);
}

function restoreButton(button, label) {
  button.disabled = false;
  button.classList.remove("is-loading");
  button.textContent = label;
}

function makeFilename() {
  const date = new Date().toISOString().slice(0, 10);
  return `tripleS-bias-ranking-${date}.png`;
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

window.addEventListener("resize", () => {
  if (modalEls && modalEls.modal.classList.contains("is-visible")) {
    fitMockupScales();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (modalEls && modalEls.modal.classList.contains("is-visible")) {
    closeExportModal();
  }
});
