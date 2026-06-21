/** Must match photocard layout (cards.css) and renderCard sizes attribute. */
export const PHOTO_SLOT_CAP_PX = 340;
export const PHOTO_SIZES_ATTR =
  "(max-width: 500px) 49vw, (max-width: 768px) 48vw, 340px";

/**
 * Which file srcset would pick: 340w (1x) vs 582w (2x).
 * Rule: use 2x when CSS slot × DPR needs more than 340px of image width.
 */
export function selectPhotoVariant(cssSlotPx = null, dpr = null) {
  const ratio =
    dpr ??
    (typeof devicePixelRatio === "number" ? devicePixelRatio : 1);
  let slot = cssSlotPx;
  if (slot == null && typeof window !== "undefined" && window.innerWidth) {
    const w = window.innerWidth;
    if (w <= 500) slot = w * 0.49;
    else if (w <= 768) slot = w * 0.48;
    else slot = PHOTO_SLOT_CAP_PX;
  }
  slot = slot ?? PHOTO_SLOT_CAP_PX;
  return slot * ratio >= 340 ? "2x" : "1x";
}

export function memberPhotoUrl(memberData, memberName, picSet, variant) {
  const set = memberData[memberName][picSet];
  return variant === "2x" ? set.local2x : set.local1x;
}