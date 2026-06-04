// Lazy entry point for the image-export feature.
// Imported dynamically from sorter.js:showResult() so it is code-split
// into its own chunk and only loaded when the user reaches the result screen.

import * as htmlToImage from "html-to-image";
import { renderF1, renderF2, renderF3, injectTemplateCSS } from "./export-templates.js";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Fragment+Mono&family=Nunito:wght@400;600;700;800;900&display=swap";
const FONT_LINK_ID = "export-template-fonts";

const RENDERERS = { f1: renderF1, f2: renderF2, f3: renderF3 };
const PREVIEW_IDS = { f1: "export-preview-f1", f2: "export-preview-f2", f3: "export-preview-f3" };

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
  await ensureFontsLoaded();

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

async function ensureFontsLoaded() {
  if (!document.getElementById(FONT_LINK_ID)) {
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }
  await Promise.all([
    document.fonts.load('900 62px "Nunito"'),
    document.fonts.load('900 18px "Nunito"'),
    document.fonts.load('800 14px "Nunito"'),
    document.fonts.load('800 15px "Nunito"'),
    document.fonts.load('800 17px "Nunito"'),
    document.fonts.load('700 17px "Nunito"'),
    document.fonts.load('600 12px "Nunito"'),
    document.fonts.load('400 12px "Nunito"'),
    document.fonts.load('700 14px "Bricolage Grotesque"'),
    document.fonts.load('700 18px "Bricolage Grotesque"'),
    document.fonts.load('400 12px "Fragment Mono"'),
    document.fonts.ready,
  ]);
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

function waitForPreviewImages() {
  const imgs = Array.from(
    document.querySelectorAll("#image-export-modal .template-preview img")
  );
  return Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    })
  );
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
  canvas.style.setProperty("--mockup-scale", "1");

  try {
    const blob = await htmlToImage.toBlob(canvas, {
      pixelRatio: 1,
      cacheBust: true,
    });
    if (!blob) throw new Error("toBlob returned null");
    triggerDownload(blob, makeFilename());
  } catch (err) {
    console.error("Failed to generate image:", err);
    button.textContent = "Failed — try again";
    setTimeout(() => restoreButton(button, originalLabel), 2000);
    return;
  } finally {
    if (prevScale) canvas.style.setProperty("--mockup-scale", prevScale);
    else canvas.style.removeProperty("--mockup-scale");
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
