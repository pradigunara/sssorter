/** Must match photocard layout (cards.css) and renderCard sizes attribute. */
export const PHOTO_SLOT_CAP_PX = 340;
export const PHOTO_SIZES_ATTR =
  "(max-width: 500px) 49vw, (max-width: 768px) 48vw, 340px";

/** Bundled photocard widths (px); filenames: {picSet}-{width}.webp under public/members. */
export const PHOTO_WIDTHS = [400, 582];

export function picSetSources(picSetEntry) {
  if (!picSetEntry || typeof picSetEntry !== "object") return {};
  const { local400, local582 } = picSetEntry;
  if (!local400 || !local582) return {};
  return {
    400: String(local400),
    582: String(local582),
  };
}

export function photoSrcset(sources) {
  return PHOTO_WIDTHS.filter((w) => sources[w])
    .map((w) => `${sources[w]} ${w}w`)
    .join(", ");
}

/** Default src: smallest tier (400w). */
export function photoDefaultSrc(sources) {
  return sources[400] ?? sources[582] ?? "";
}

/** Smallest bundled width >= slot * DPR (for preload). */
export function selectPreloadWidth(cssSlotPx = null, dpr = null) {
  const ratio =
    dpr ?? (typeof devicePixelRatio === "number" ? devicePixelRatio : 1);
  let slot = cssSlotPx;
  if (slot == null && typeof window !== "undefined" && window.innerWidth) {
    const w = window.innerWidth;
    if (w <= 500) slot = w * 0.49;
    else if (w <= 768) slot = w * 0.48;
    else slot = PHOTO_SLOT_CAP_PX;
  }
  slot = slot ?? PHOTO_SLOT_CAP_PX;
  const need = slot * ratio;
  for (const width of PHOTO_WIDTHS) {
    if (width >= need) return width;
  }
  return PHOTO_WIDTHS[PHOTO_WIDTHS.length - 1];
}

export function memberPhotoUrl(memberData, memberName, picSet, widthPx) {
  const sources = picSetSources(memberData[memberName][picSet]);
  return sources[widthPx] ?? "";
}